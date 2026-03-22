import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { UniversityRow } from '../types/home.types'

interface UniversityTableProps {
  rows: UniversityRow[]
}

export function UniversityTable({ rows }: UniversityTableProps) {
  const { t } = useTranslation('home')

  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t('table.noData')}
      </p>
    )
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.institutionName')}</TableHead>
            <TableHead>{t('table.totalStudents')}</TableHead>
            <TableHead>{t('table.morningRotations')}</TableHead>
            <TableHead>{t('table.eveningRotations')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.totalStudents.toLocaleString()}</TableCell>
              <TableCell>{row.morningRotations}</TableCell>
              <TableCell>{row.eveningRotations}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
