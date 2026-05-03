import { stats } from "./data"

export function StatsSection() {
  return (
    <section className="border-y border-border/60 bg-background py-12">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm"
          >
            <div className="text-3xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}