'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface AccessibilityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccessibilityModal({ open, onOpenChange }: AccessibilityModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Accessibility Statement</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            NutriSnap is committed to ensuring digital accessibility for people with disabilities.
            We are continually improving the user experience for everyone and applying the relevant
            accessibility standards.
          </p>

          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">Measures to support accessibility</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>Integrating accessibility into our development practices.</li>
              <li>Ensuring all interface elements have appropriate ARIA labels for screen readers.</li>
              <li>Designing with high color contrast for readability.</li>
              <li>Allowing full keyboard navigation.</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">Conformance status</h3>
            <p>
              NutriSnap is partially conformant with WCAG 2.1 level AA. Partially conformant means
              that some parts of the content may not yet fully conform to the accessibility standard.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">Feedback</h3>
            <p>
              We welcome your feedback on the accessibility of NutriSnap. Please let us know if you
              encounter accessibility barriers on the platform by emailing: [Your Email].
            </p>
          </section>
        </div>

        <div className="mt-2 flex justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
