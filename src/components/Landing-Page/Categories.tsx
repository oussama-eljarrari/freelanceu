import { categories } from "./data"
import { SectionHeading } from "./section-heading"

export function Categories() {
  return (
    <section
      id="categories"
      className="border-t border-border/60 bg-background py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Browse by service area"
          description="Eight straightforward categories cover the core work people usually need on a freelance platform."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon

            return (
              <div
                key={category.name}
                className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-lg font-semibold text-foreground">
                  {category.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Clear service paths for buyers and freelancers.
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}