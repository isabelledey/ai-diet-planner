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
            We are committed to making our website accessible to everyone, including people with disabilities. We are continuously improving the user experience for everyone and applying the relevant accessibility standards.
          </p>

          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">Measures to support accessibility</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>Include accessibility as part of our mission statement.</li>
              <li>Include accessibility throughout our internal policies.</li>
              <li>Integrate accessibility into our procurement practices.</li>
              <li>Provide continual accessibility training for our staff.</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">Conformance status</h3>
            <p>
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We strive to conform to WCAG 2.1 level AA.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">Feedback</h3>
            <p>
              We welcome your feedback on the accessibility of our site. Please let us know if you encounter accessibility barriers.
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
