# Statistics Dashboard Design

## Context

The Shiba Hospital scheduling platform needs a Statistics screen to visualize key organizational data — department capacities, utilization, student enrollment, and utilization percentages. Currently no aggregation endpoints exist (home page data is hardcoded), and no chart library is installed.

## Requirements

- 4 chart types on a single scrollable page
- shadcn/ui chart components (wraps Recharts)
- Role-based timeframe: Admins toggle Weekly/Yearly; Coordinators see Weekly only
- Per-chart Excel export button using the already-installed `xlsx` library
- New backend `/api/statistics` endpoint with Prisma aggregation queries
- Full i18n (EN/HE) with RTL support

## Architecture

### Backend: `server/src/modules/statistics/`

New module following the Repository → Service → Controller pattern.

**Files:**
- `statistics.repository.ts` — Prisma queries
- `statistics.service.ts` — Aggregation logic
- `statistics.controller.ts` — Request handling with inline query validation
- `statistics.routes.ts` — Route registration with `authenticate` middleware
- `statistics.schema.ts` — Zod schemas for type inference

**API:** `GET /api/statistics?academicYearId=1&timeframe=weekly&weekStart=2026-03-22&weekEnd=2026-03-26`

**Query parameters:**
| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `academicYearId` | number | yes | |
| `timeframe` | `weekly` \| `yearly` | yes | |
| `weekStart` | ISO date string | when weekly | Sunday of the week |
| `weekEnd` | ISO date string | when weekly | Thursday of the week |

**Response shape:**
```typescript
interface StatisticsResponse {
  departmentCapacities: {
    departmentId: number;
    departmentName: string;
    morningCapacity: number;
    eveningCapacity: number;
    electiveCapacity: number;
    totalCapacity: number;
  }[];
  departmentUtilization: {
    departmentId: number;
    departmentName: string;
    morningActual: number;
    eveningActual: number;
    morningCapacity: number;
    eveningCapacity: number;
  }[];
  studentEnrollment: {
    universityId: number;
    universityName: string;
    studentCount: number;
  }[];
  utilizationGauges: {
    departmentId: number;
    departmentName: string;
    percentage: number; // 0-100
    actual: number;
    capacity: number;
  }[];
}
```

**Query validation:** Inline Zod parse of `req.query` in the controller, following the pattern in `assignment.controller.ts` where `academicYearId` is validated manually via `Number(req.query.academicYearId)`. The `validateRequest` middleware only handles `req.body` and cannot be used for query params.

**Repository queries:**

1. **Department capacities** — `prisma.department.findMany` with `departmentConstraints` include (active departments only). Select only constraint rows where `blockedStartDate IS NULL` (i.e., the base capacity row, not blocked-date overrides). If a department has multiple non-blocked constraint rows, use the one with the highest `id` (most recent). Timeframe-independent since capacities are static.

2. **Assignment counts by department** — `prisma.assignment.findMany` filtered by `academicYearId`, `status: APPROVED`, and optional date range. Grouped by `departmentId` + `shiftType` in the service layer. Note: `academicYearId` is nullable on the Assignment model (`Int?`), so assignments with `null` academicYearId will be excluded.

3. **Student enrollment** — `prisma.assignment.findMany` with same filters, including `_count: { select: { students: true } }` in the query. For each assignment, the authoritative count is `_count.students` (from the AssignmentStudent join table). Fall back to `studentCount` only when `_count.students === 0` (for assignments where students haven't been individually linked yet). Grouped by university.

4. **Utilization percentages** — Computed in service from queries 1 and 2: `(actual / capacity) * 100`.

**Date range logic:**
- `weekly`: overlap filter — `startDate <= weekEnd AND endDate >= weekStart`. This correctly captures multi-week assignments that overlap with the selected week.
- `yearly`: no date filter (academicYearId already scopes to the year)

**Registration:** Add `app.use('/api/statistics', statisticsRouter)` to `server/src/index.ts`.

### Frontend: `client/src/features/statistics/`

**Feature structure:**
```
statistics/
  index.ts
  api/statistics.api.ts
  hooks/useStatistics.ts
  components/
    DepartmentCapacityChart.tsx    — Grouped bar chart (morning/evening/elective)
    DepartmentUtilizationChart.tsx — Stacked bar chart (actual vs remaining)
    StudentEnrollmentChart.tsx     — Horizontal bar chart (students per university)
    UtilizationGaugeChart.tsx      — Radial chart grid (percentage per department)
    TimeframeToggle.tsx            — ToggleGroup (weekly/yearly), hidden for coordinators
    ChartExportButton.tsx          — Download icon button, calls exportToExcel
    StatisticsWeekSelector.tsx     — Week dropdown accepting WeekDefinition[], statistics namespace
    StatisticsPageSkeleton.tsx     — Skeleton loading state
  pages/StatisticsPage.tsx
  types/statistics.types.ts
  utils/exportToExcel.ts
```

**Data flow:**
1. `StatisticsPage` manages state: `academicYearId`, `timeframe`, `selectedWeek`
2. `useStatistics()` hook (React Query) fetches from `/api/statistics` with these params
3. Each chart component receives its slice of data as props
4. `ChartExportButton` receives the same data array + filename, calls `exportToExcel`

**Chart library setup:**
- Install `recharts` via npm
- Add `chart` component via `npx shadcn@latest add chart`
- All charts use shadcn's `<ChartContainer>`, `<ChartTooltip>`, `<ChartTooltipContent>`, `<ChartLegend>` wrappers

**Reused from existing code:**
- `useIsAdmin()` from `client/src/hooks/useIsAdmin.ts` — role check
- `useAcademicYears()` from `client/src/features/scheduler/hooks/useAcademicYears.ts` — year list
- `useAcademicYearWeeks()` from `client/src/features/scheduler/hooks/useAcademicYearWeeks.ts` — week computation (returns `WeekDefinition[]` with `Date` startDate/endDate)
- `ToggleGroup` pattern from `HomePage.tsx` lines 86-99
- Excel export pattern from `xlsx` usage in `ExcelImportDialog.tsx`

**Not reusable as-is:**
- `WeekSelector` from `client/src/features/home/components/WeekSelector.tsx` — hardcoded to `home` i18n namespace and accepts `Week[]` (string dates) from `home.types.ts`, incompatible with `WeekDefinition[]` (Date objects) from the scheduler. Create a new `StatisticsWeekSelector` component in the statistics feature that accepts `WeekDefinition[]` and uses the `statistics` i18n namespace.

**Page layout:**
- Header row: title + academic year selector + timeframe toggle (admin only)
- Week selector (weekly mode only)
- 2-column responsive grid with 4 chart cards (stacks to 1 column on mobile)
- Each card: header (title + export button) + chart content

**Role-based behavior:**
- Admins/Super Admins: see TimeframeToggle, can switch between weekly/yearly
- Academic Coordinators: no toggle rendered, locked to weekly

**Route registration:** Add `/statistics` route to `client/src/app/router.tsx` with a static import (not lazy-loaded). The statistics page is lightweight compared to the scheduler — no drag-and-drop, no complex dialogs — so Suspense is unnecessary. Nav item already exists in AppLayout.

**Loading state:** The `useStatistics()` React Query hook uses `enabled: !!academicYearId` to prevent fetching before an academic year is selected. The page shows `StatisticsPageSkeleton` while loading and a `noData` message when the query returns empty results.

### i18n

New namespace: `statistics`

**Files:** `client/src/locales/en/statistics.json` and `client/src/locales/he/statistics.json`

**Registration:** Import and add to `client/src/lib/i18n.ts` resources and `ns` array.

**Key groups:** `pageTitle`, `timeframe.*`, `charts.*`, `labels.*`, `export.*`, `academicYear`, `noData`

### Excel Export

**Utility:** `exportToExcel({ data, filename, sheetName })` in `utils/exportToExcel.ts`
- Uses `XLSX.utils.json_to_sheet` + `XLSX.writeFile`
- Each chart's export button passes its dataset with a descriptive filename

### RTL Considerations

- Recharts renders LTR regardless of locale — acceptable for data visualization
- Chart labels/tooltips display Hebrew text correctly via i18n
- Page layout (flex, grid) handles RTL via Tailwind's built-in dir support

## Implementation Sequence

1. **Infrastructure** — Install recharts, add shadcn chart component, create i18n files, register namespace
2. **Backend** — Create statistics module (schema, repository, service, controller, routes), register in server
3. **Frontend data layer** — Types, API function, React Query hook, export utility
4. **Frontend components** — Chart components, TimeframeToggle, ChartExportButton, skeleton
5. **Frontend page** — StatisticsPage assembly, route registration
6. **Testing** — End-to-end verification with real data

## Verification

1. Start the server and client dev servers
2. Log in as admin — verify Weekly/Yearly toggle is visible and functional
3. Log in as coordinator — verify toggle is hidden, data shows weekly
4. Switch academic years — verify charts update
5. Switch weeks in weekly mode — verify charts reflect the selected week
6. Click each chart's export button — verify .xlsx files download with correct data
7. Test with Hebrew locale — verify all labels are translated, RTL layout works
8. Test empty state — verify "no data" message when no assignments exist
