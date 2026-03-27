import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { StudentEnrollment } from '../types/statistics.types'

interface StudentEnrollmentChartProps {
  data: StudentEnrollment[]
}

export function StudentEnrollmentChart({ data }: StudentEnrollmentChartProps) {
  const { t } = useTranslation('statistics')

  const chartConfig: ChartConfig = {
    studentCount: {
      label: t('labels.students'),
      color: '#0ea5e9',
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data} layout="vertical" accessibilityLayer>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          dataKey="universityName"
          type="category"
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="studentCount"
          fill="var(--color-studentCount)"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
