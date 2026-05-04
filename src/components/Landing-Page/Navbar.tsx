import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const navLinks = [
  { label: "Explore", href: "#top" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
]

export function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${index === 0 ? "text-foreground" : "text-muted-foreground"}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-foreground md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}