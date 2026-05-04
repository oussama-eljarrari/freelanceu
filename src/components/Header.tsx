import { Code2 } from "lucide-react"
import { BrandMark } from "@/components/Landing-Page/BrandMark"

export function Header() {
  return (
    <div className="border-b border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <BrandMark />
        <a
          href="#"
          aria-label="Repository"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Code2 className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
