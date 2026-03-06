'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/i18n/language-provider'

interface AccessibilityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccessibilityModal({ open, onOpenChange }: AccessibilityModalProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('accessibility_title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>{t('accessibility_intro')}</p>

          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">{t('accessibility_measures_title')}</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>{t('accessibility_measure_1')}</li>
              <li>{t('accessibility_measure_2')}</li>
              <li>{t('accessibility_measure_3')}</li>
              <li>{t('accessibility_measure_4')}</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">{t('accessibility_conformance_title')}</h3>
            <p>{t('accessibility_conformance_text')}</p>
          </section>

          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">{t('accessibility_feedback_title')}</h3>
            <p>{t('accessibility_feedback_text')}</p>
          </section>
        </div>

        <div className="mt-2 flex justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
