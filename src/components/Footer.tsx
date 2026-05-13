import { ArrowUpRight, Code2, Star } from "lucide-react"

import { Logo } from "@/components/Landing-Page/Logo"

export function Footer() {
  const links = ["About", "Categories", "How it works", "Contact"]

  return (
    <footer className="border-t border-border/60 bg-muted/20 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">
            Work on your terms. © 2026
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
          {links.map((link) => (
            <a key={link} href="#" className="transition-colors hover:text-foreground">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <a
            href="#"
            aria-label="Twitter"
            className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary"
          >
            <Star className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="GitHub"
            className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary"
          >
            <Code2 className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}