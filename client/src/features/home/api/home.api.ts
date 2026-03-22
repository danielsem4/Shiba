import type { HomeData, ViewMode } from '../types/home.types'

// Mock data — replace with real API calls when backend is ready
// e.g. const response = await apiClient.get<HomeData>('/home/stats', { params: { week, viewMode } })
export async function fetchHomeData(
  week: number,
  viewMode: ViewMode
): Promise<HomeData> {
  const isYearly = viewMode === 'yearly'

  return {
    stats: {
      activeStudents: isYearly ? 1430 : 230,
      morningRotations: isYearly ? 39 : 8,
      eveningRotations: isYearly ? 23 : 4,
      activeDepartments: isYearly ? 12 : 12,
    },
    universityRows: [
      {
        id: 1,
        name: 'אוניברסיטת תל אביב',
        totalStudents: isYearly ? 450 : 85,
        morningRotations: isYearly ? 12 : 3,
        eveningRotations: isYearly ? 8 : 2,
      },
      {
        id: 2,
        name: 'אוניברסיטת רייכמן',
        totalStudents: isYearly ? 300 : 60,
        morningRotations: isYearly ? 10 : 2,
        eveningRotations: isYearly ? 6 : 1,
      },
      {
        id: 3,
        name: 'אוניברסיטת בן גוריון',
        totalStudents: isYearly ? 350 : 50,
        morningRotations: isYearly ? 8 : 2,
        eveningRotations: isYearly ? 4 : 1,
      },
      {
        id: 4,
        name: 'הטכניון',
        totalStudents: isYearly ? 330 : 35,
        morningRotations: isYearly ? 9 : 1,
        eveningRotations: isYearly ? 5 : 0,
      },
    ],
    weeks: [
      { weekNumber: 1, startDate: '2026-03-01', endDate: '2026-03-05' },
      { weekNumber: 2, startDate: '2026-03-08', endDate: '2026-03-12' },
      { weekNumber: 3, startDate: '2026-03-15', endDate: '2026-03-19' },
      { weekNumber: 4, startDate: '2026-03-22', endDate: '2026-03-26' },
      { weekNumber: 5, startDate: '2026-03-29', endDate: '2026-04-02' },
    ],
  }
}
