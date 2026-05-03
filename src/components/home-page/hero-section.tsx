import { ArrowUpRight, BadgeCheck, Search, Star } from "lucide-react"

import { Button } from "@/components/ui/button"

import { stats } from "./data"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(244,109,42,0.14),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(31,42,74,0.1),_transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Freelance marketplace for modern teams
          </div>

          <h1 className="max-w-xl text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Work on your <span className="text-primary">terms</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            From design to development, find the right freelancer or offer your
            skills with a clean, focused workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#categories">
                Browse services
                <Search className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#cta">Start selling</a>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.slice(0, 3).map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm"
              >
                <div className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-lg rounded-[2rem] border border-border bg-background p-6 shadow-[0_30px_80px_rgba(31,42,74,0.12)]">
            <div className="absolute -left-6 top-8 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -right-4 bottom-6 h-28 w-28 rounded-full bg-foreground/5 blur-3xl" />

            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>FreelanceU Studio</span>
                <Star className="h-4 w-4 fill-primary text-primary" />
              </div>

              <div className="mt-14 flex items-end justify-between gap-6">
                <div>
                  <p className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                    FU
                  </p>
                  <p className="mt-2 max-w-52 text-sm leading-6 text-white/70">
                    A simple marketplace interface designed to help people move
                    from browsing to booking faster.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Growth
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-primary">
                    +24%
                  </div>
                  <ArrowUpRight className="mt-3 h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Orders completed</p>
                <p className="mt-1 text-xl font-semibold text-foreground">5k+</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Average rating</p>
                <p className="mt-1 text-xl font-semibold text-foreground">4.9★</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}