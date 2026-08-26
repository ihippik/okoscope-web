import { useEffect } from 'react'
import { credentialSession } from '../../shared/auth/session'
import { useT } from '../../shared/i18n'
import { LanguageSelector } from '../../shared/i18n/language-selector'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'

export function Profile() {
  const t = useT()

  useEffect(() => {
    document.title = `${t('profileTitle')} · Okoscope`
  }, [t])

  return (
    <section aria-labelledby="profile-heading">
      <p className="eyebrow">Okoscope</p>
      <h1 id="profile-heading" className="mt-2 text-4xl font-semibold">
        {t('profileTitle')}
      </h1>
      <Card className="mt-6">
        <p className="text-slate-400">{t('profileHelp')}</p>
        <div className="mt-5">
          <LanguageSelector />
        </div>
        <Button className="mt-5" variant="outline" onClick={() => credentialSession.clear()}>
          {t('endSession')}
        </Button>
      </Card>
    </section>
  )
}
