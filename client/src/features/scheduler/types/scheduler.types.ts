export interface Assignment {
  id: number
  departmentId: number
  universityId: number
  academicYearId: number
  startDate: string
  endDate: string
  type: 'GROUP' | 'ELECTIVE'
  shiftType: 'MORNING' | 'EVENING'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  studentCount: number | null
  yearInProgram: number
  tutorName: string | null
  universityName: string
  departmentName: string
}

export interface Department {
  id: number
  name: string
  hasMorningShift: boolean
  hasEveningShift: boolean
}

export interface AcademicYear {
  id: number
  name: string
  startDate: string
  endDate: string
}

export interface WeekDefinition {
  weekNumber: number
  startDate: Date
  endDate: Date
}

export interface BlockReason {
  type: 'holiday' | 'dateBlock' | 'capacityFull'
  description: string
  constraintName?: string
}

export interface DepartmentConstraintData {
  id: number
  departmentId: number
  morningCapacity: number
  eveningCapacity: number
  electiveCapacity: number
  blockedStartDate?: string | null
  blockedEndDate?: string | null
}

export interface IronConstraintData {
  id: number
  name: string
  description: string
  isActive: boolean
}

export interface Holiday {
  id: number
  name: string
  date: string
  year: number
}

export interface Student {
  id: number
  firstName: string
  lastName: string
  nationalId: string
  phone: string | null
  email: string | null
}

export interface ConstraintsResponse {
  departmentConstraints: DepartmentConstraintData[]
  ironConstraints: IronConstraintData[]
  holidays: Holiday[]
}

export interface SchedulerFilters {
  selectedUniversities: number[]
  selectedShift: 'all' | 'morning' | 'evening'
  selectedYear: number | null
}

export interface University {
  id: number
  name: string
}

export interface CreateAssignmentDto {
  departmentId: number
  universityId: number
  academicYearId: number
  startDate: string
  endDate: string
  type: 'GROUP' | 'ELECTIVE'
  shiftType: 'MORNING' | 'EVENING'
  studentCount?: number | null
  yearInProgram: number
  tutorName?: string | null
}

export interface UpdateAssignmentDto {
  departmentId?: number
  universityId?: number
  startDate?: string
  endDate?: string
  type?: 'GROUP' | 'ELECTIVE'
  shiftType?: 'MORNING' | 'EVENING'
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  studentCount?: number | null
  yearInProgram?: number
  tutorName?: string | null
}

export interface MoveAssignmentDto {
  departmentId: number
  startDate: string
  endDate: string
  shiftType: 'MORNING' | 'EVENING'
}

export interface CreateStudentDto {
  firstName: string
  lastName: string
  nationalId: string
  phone?: string | null
  email?: string | null
}
