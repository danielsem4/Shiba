import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { exportToExcel } from '../utils/exportToExcel'

interface ChartExportButtonProps {
  data: object[]
  filename: string
}

export function ChartExportButton({ data, filename }: ChartExportButtonProps) {
  const { t } = useTranslation('statistics')

  const handleExport = () => {
    exportToExcel({ data, filename })
    toast.success(t('export.success'))
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="h-4 w-4" />
      {t('export.download')}
    </Button>
  )
}
