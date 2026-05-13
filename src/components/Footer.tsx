import { ArrowUpRight, Code2, Star } from "lucide-react"

import { Logo } from "@/components/Landing-Page/Logo"

export function Footer() {
  const links = ["About", "Categories", "How it works", "Contact"]

  return (
    <footer className="border-t border-border/60 bg-muted/20 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6  lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">
            Work on your terms. © 2026
          </p>
        </div>

        

      </div>
    </footer>
  )
}