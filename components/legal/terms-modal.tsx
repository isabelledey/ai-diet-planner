'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/i18n/language-provider'

interface TermsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('terms_title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p><strong className="text-foreground">{t('terms_last_updated_label')}</strong> March 6, 2026</p>

          <section>
            <h3 className="font-semibold text-foreground">{t('terms_acceptance_title')}</h3>
            <p>
              {t('terms_acceptance_text')}
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground">{t('terms_service_title')}</h3>
            <p>
              {t('terms_service_text')}
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground">{t('terms_medical_title')}</h3>
            <p>
              {t('terms_medical_text')}
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground">{t('terms_data_title')}</h3>
            <p>
              {t('terms_data_text')}
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground">{t('terms_liability_title')}</h3>
            <p>
              {t('terms_liability_text')}
            </p>
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
