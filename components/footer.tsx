'use client'

import { useState } from 'react'
import { TermsModal } from '@/components/legal/terms-modal'
import { AccessibilityModal } from '@/components/legal/accessibility-modal'

export function Footer() {
  const [termsOpen, setTermsOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)

  return (
    <>
      <footer className="border-t border-border bg-background px-6 py-4">
        <div className="mx-auto flex w-full max-w-md items-center justify-center gap-6 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Terms of Use
          </button>
          <button
            type="button"
            onClick={() => setAccessibilityOpen(true)}
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Accessibility
          </button>
        </div>
      </footer>
      <TermsModal open={termsOpen} onOpenChange={setTermsOpen} />
      <AccessibilityModal open={accessibilityOpen} onOpenChange={setAccessibilityOpen} />
    </>
  )
}
