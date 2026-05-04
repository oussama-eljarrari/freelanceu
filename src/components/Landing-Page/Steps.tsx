import { steps } from "./data"
import { SectionHeading } from "./section-heading"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Three simple steps to get started"
          description="The page keeps the process lightweight: join, discover, and complete the work without extra friction."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="rounded-3xl border border-border bg-background p-8 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}