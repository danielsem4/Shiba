import { useTranslation } from 'react-i18next'

export function ForgotPasswordPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500 text-sm">
        {t('comingSoon', { feature: t('forgotPassword') })}
      </p>
    </div>
  )
}
