Frontend Architecture & Guidelines
1. Tech Stack & Core Rules
Category	Technology
Framework	React 19 + Vite + TypeScript
Styling	Tailwind CSS v4 + Shadcn/UI
Routing	React Router v7 (Data API: loaders/actions)
Server State	TanStack Query v5
Client State	Zustand v5 (Slice Pattern)
Validation	Zod + React Hook Form
HTTP	Axios (centralized instance only)
Notifications	Sonner
i18n	i18next + react-i18next (EN + HE)
Icons	lucide-react (No other icon libraries allowed)
Rule: No alternative libraries may be introduced without explicit instruction.

2. Directory Structure
Plaintext
src/
├── app/                          # Global setup only (App.tsx, router.tsx, providers/)
├── components/                   # Reusable UI ONLY — no business logic
│   ├── ui/                       # Shadcn primitives only
│   ├── shared/                   # Global composite components
│   └── layout/                   # Layout shells (AppLayout, etc.)
├── features/                     # ALL business logic lives here
│   └── [feature-name]/
│       ├── api/                  # API functions for this feature
│       ├── components/           # Feature-scoped components
│       ├── hooks/                # Feature-scoped hooks
│       ├── pages/                # Route-level components
│       ├── schemas/              # Zod schemas + derived types
│       ├── types/                # Feature-only types
│       └── stores/               # (Optional) Client UI state only
├── hooks/                        # Truly global hooks — no feature coupling
├── lib/                          # Pure utilities — no React (apiClient.ts, utils.ts, i18n.ts)
├── locales/                      # Translation files
│   ├── en/                       # English translations (common.json, [feature].json)
│   └── he/                       # Hebrew translations
└── types/                        # Global shared types only
3. Screen Building & UI Component Rules
When approaching the design and implementation of a new screen, developers MUST follow this exact breakdown process:

Component Breakdown: Before writing code, break the screen down to identify the required UI components.

Determine Reusability (Placement):

Global Components: If a component can be reused across different parts of the overall project (now or in the future), place it in the high-level src/components/shared/ folder.

Feature Components: If a component is highly reusable but strictly tied to a single feature's domain, place it in src/features/[feature]/components/.

Enforce "Dumb" Presentational Components: * Components MUST be strictly UI-focused ("dumb").

They must accept all data and callbacks as parameters (props).

They must contain zero business logic, data fetching, or internal function implementations. Make them as generic and predictable as possible.

Orchestrator Pages: Screen/Page files (features/[feature]/pages/) MUST act ONLY as orchestrators. They handle routing, call custom hooks for logic/state, and pass that data down to the generic "dumb" components. No complex logic should live directly inside the Page return statement.

4. Reusable Logic & Hooks
To keep UI components pure and orchestrator pages clean, all screen implementation logic must be extracted:

Extract Generic Screen Logic: Any functional implementation that can be reused (e.g., a boolean true/false toggle state, modal visibility, multi-step counters) must be made generic and placed in a hook file.

Global vs. Feature Hooks: * If the logic is universally applicable (e.g., useToggle, useDebounce), place it in src/hooks/.

If the logic handles specific feature behavior, place it in src/features/[feature]/hooks/.

5. API Flow & Execution Rules
The flow of data and API calls MUST adhere to a strict unidirectional layering system:

The Flow: Component (UI) → Custom Hook (TanStack Query / Logic) → API Function ([feature].api.ts) → Centralized apiClient.

Direct Calls are Forbidden: Components must never initiate direct Axios calls or house API logic. Always route through a dedicated hook.

Centralization: All API functions MUST live in features/[feature]/api/[feature].api.ts and use the centralized apiClient (import { apiClient } from "@/lib/apiClient";).

6. React Router v7 Rules
Define route loaders and actions directly inside the feature's pages/ components, or export them from a dedicated [feature].routes.ts file.

Loaders should prefetch data using the TanStack Query queryClient.

All global route definitions must live in src/app/router.tsx.

7. Data Fetching & State
Server data comes from the API and lives only in TanStack Query.

MUST NOT be stored in Zustand or manually cached.

Absolute Rules:

Never fetch inside useEffect. Always use useQuery or Router loaders.

Never run queries without required deps. Guard with enabled.

Query Keys: MUST follow [featureName, operation, ...params].

Mutations: Always invalidate related queries in onSuccess. Never update Zustand with the response.

8. React 19 Rules
Forms: MUST use React Hook Form and Zod validation. Do NOT use raw useState for field management.

Refs: Pass ref as a normal prop. Do NOT use forwardRef in custom components. Shadcn/UI primitives are exempt.

9. TypeScript Rules
No any (use unknown + type guards).

Derive types from Zod (z.infer<typeof schema>).

Strict API response typing (no implicit any from Axios).

10. Import Rules
Use path aliases (e.g., @/lib/apiClient).

Features expose public API via index.ts only. Cross-feature imports must go through index.ts. No deep imports into another feature's internals.

11. Internationalization (i18n) Rules
STRICT ZERO-HARDCODED-TEXT POLICY: No plain text may ever appear directly in code. Every single user-facing string — including labels, titles, placeholders, error messages, table headers, button text, toast messages, and mock/seed data that renders in the UI — MUST come from translation files via `useTranslation` or the `t()` function. This applies to components, pages, hooks, and mock API data alike. There are NO exceptions.

Translations live in src/locales/{lng}/{namespace}.json. Use `common` namespace for shared text and feature-specific namespaces (e.g., `auth`) for feature text.

Access translations via the `useTranslation` hook: `const { t } = useTranslation('namespace')`.

For Zod schemas that need translated messages, use a factory function that accepts `t` (see `createLoginSchema` pattern).

For mock/seed data that contains user-facing text (e.g., entity names), use translation keys so the data renders correctly in both languages.

RTL: Hebrew is RTL. Use logical CSS properties (`start`/`end` instead of `left`/`right`). The `dir` attribute on `<html>` is set automatically by `src/lib/i18n.ts` on language change.

When adding a new feature, create translation files for both `en` and `he` locales.

12. Styling Rules
Use Tailwind only — no inline styles, no CSS modules.

Use cn() utility from lib/utils.ts for conditional classes.

No business logic inside UI primitives (components/ui/).

Use logical CSS properties for RTL support (e.g., `ps-3`/`pe-3` instead of `pl-3`/`pr-3`, `start-3`/`end-3` instead of `left-3`/`right-3`).

13. Error Handling
Every route MUST define an errorElement.

Surface user-facing errors via Sonner (toast.error(...)).

401 handling MUST be centralized in apiClient interceptors. Do not silently swallow errors.

14. Naming Conventions
Components/Pages: PascalCase (UserCard.tsx, UsersPage.tsx)

Hooks: camelCase with use prefix (useUsers.ts, useToggle.ts)

Feature Files: [feature].api.ts, [feature].schema.ts, [feature].types.ts, [feature]UiSlice.ts

Utilities: camelCase (formatDate.ts)

15. Configuration & Env
Access environment variables ONLY through a typed config file or import.meta.env.

Do not hardcode API URLs. Ensure VITE_API_URL is defined.

16. Decision Priority
Apply rules in this exact order:

Feature architecture rules (highest)

Screen building & UI flow rules

Data ownership & API layer rules

React 19 rules

Type safety rules

Styling rules (lowest)