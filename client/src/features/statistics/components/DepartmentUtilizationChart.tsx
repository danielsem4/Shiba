import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { DepartmentUtilization } from '../types/statistics.types'

interface DepartmentUtilizationChartProps {
  data: DepartmentUtilization[]
}

export function DepartmentUtilizationChart({ data }: DepartmentUtilizationChartProps) {
  const { t } = useTranslation('statistics')

  const chartData = data.map((dept) => ({
    departmentName: dept.departmentName,
    morningActual: dept.morningActual,
    morningRemaining: Math.max(0, dept.morningCapacity - dept.morningActual),
    eveningActual: dept.eveningActual,
    eveningRemaining: Math.max(0, dept.eveningCapacity - dept.eveningActual),
  }))

  const chartConfig: ChartConfig = {
    morningActual: {
      label: t('labels.morningActual'),
      color: '#3b82f6',
    },
    morningRemaining: {
      label: `${t('labels.morningCapacity')} (${t('labels.remaining')})`,
      color: '#bfdbfe',
    },
    eveningActual: {
      label: t('labels.eveningActual'),
      color: '#8b5cf6',
    },
    eveningRemaining: {
      label: `${t('labels.eveningCapacity')} (${t('labels.remaining')})`,
      color: '#ddd6fe',
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="departmentName"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="morningActual"
          stackId="morning"
          fill="var(--color-morningActual)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="morningRemaining"
          stackId="morning"
          fill="var(--color-morningRemaining)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="eveningActual"
          stackId="evening"
          fill="var(--color-eveningActual)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="eveningRemaining"
          stackId="evening"
          fill="var(--color-eveningRemaining)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
