 'use client'

export default function AccessibilityPage() {
  return (
    <main className="mx-auto min-h-[100dvh] max-w-md bg-background px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Accessibility Statement</h1>

      <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>We are committed to making our website accessible to everyone, including people with disabilities. We are continuously improving the user experience for everyone and applying the relevant accessibility standards.</p>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">Measures to support accessibility</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Include accessibility as part of our mission statement.</li>
            <li>Include accessibility throughout our internal policies.</li>
            <li>Integrate accessibility into our procurement practices.</li>
            <li>Provide continual accessibility training for our staff.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">Conformance status</h2>
          <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We strive to conform to WCAG 2.1 level AA.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">Feedback</h2>
          <p>We welcome your feedback on the accessibility of our site. Please let us know if you encounter accessibility barriers.</p>
        </section>
      </div>
    </main>
  )
}
