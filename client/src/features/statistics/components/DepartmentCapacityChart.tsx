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
import type { DepartmentCapacity } from '../types/statistics.types'

interface DepartmentCapacityChartProps {
  data: DepartmentCapacity[]
}

export function DepartmentCapacityChart({ data }: DepartmentCapacityChartProps) {
  const { t } = useTranslation('statistics')

  const chartConfig: ChartConfig = {
    morningCapacity: {
      label: t('labels.morningCapacity'),
      color: '#f59e0b',
    },
    eveningCapacity: {
      label: t('labels.eveningCapacity'),
      color: '#6366f1',
    },
    electiveCapacity: {
      label: t('labels.electiveCapacity'),
      color: '#10b981',
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data} accessibilityLayer>
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
          dataKey="morningCapacity"
          fill="var(--color-morningCapacity)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="eveningCapacity"
          fill="var(--color-eveningCapacity)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="electiveCapacity"
          fill="var(--color-electiveCapacity)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
