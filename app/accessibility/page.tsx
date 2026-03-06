export default function AccessibilityPage() {
  return (
    <main className="mx-auto min-h-[100dvh] max-w-md bg-background px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Accessibility Statement</h1>

      <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          NutriSnap is committed to ensuring digital accessibility for people with disabilities.
          We are continually improving the user experience for everyone and applying the relevant
          accessibility standards.
        </p>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">Measures to support accessibility</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Integrating accessibility into our development practices.</li>
            <li>Ensuring all interface elements have appropriate ARIA labels for screen readers.</li>
            <li>Designing with high color contrast for readability.</li>
            <li>Allowing full keyboard navigation.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">Conformance status</h2>
          <p>
            NutriSnap is partially conformant with WCAG 2.1 level AA. Partially conformant means
            that some parts of the content may not yet fully conform to the accessibility standard.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of NutriSnap. Please let us know if you
            encounter accessibility barriers on the platform by emailing: [Your Email].
          </p>
        </section>
      </div>
    </main>
  )
}
