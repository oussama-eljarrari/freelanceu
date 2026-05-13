import { Button } from "@/components/ui/button"

export function Appel() {
  return (
    <section id="cta" className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/90">
              Get started
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Ready to start your freelance journey?
            </h2>
            <p className="mt-4 text-pretty text-base leading-7 text-white/70 sm:text-lg">
              Join thousands of freelancers and clients on a clean platform that
              aims to keep the workflow obvious and calm.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href="#">Sign up for free</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-background text-foreground"
                asChild
              >
                <a href="#categories">Explore services</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}