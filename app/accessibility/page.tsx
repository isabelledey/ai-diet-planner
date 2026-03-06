 'use client'

import { useTranslation } from '@/components/i18n/language-provider'

export default function AccessibilityPage() {
  const { t } = useTranslation()
  return (
    <main className="mx-auto min-h-[100dvh] max-w-md bg-background px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t('accessibility_title')}</h1>

      <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>{t('accessibility_intro')}</p>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">{t('accessibility_measures_title')}</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>{t('accessibility_measure_1')}</li>
            <li>{t('accessibility_measure_2')}</li>
            <li>{t('accessibility_measure_3')}</li>
            <li>{t('accessibility_measure_4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">{t('accessibility_conformance_title')}</h2>
          <p>{t('accessibility_conformance_text')}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">{t('accessibility_feedback_title')}</h2>
          <p>{t('accessibility_feedback_text')}</p>
        </section>
      </div>
    </main>
  )
}
