import { useTranslation } from 'react-i18next'

export default function SchedulerPage() {
  const { t } = useTranslation('scheduler')

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
    </div>
  )
}
