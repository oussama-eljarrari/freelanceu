import { Menu } from "lucide-react"
import { BrandMark } from "./brand-mark"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { SearchBar } from "../Home-page/SearchBar"
import { useState } from "react"

export function Navbar() {
  const links = ["Dashboard", "Messages", "Orders", "Profile"]
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    navigate(`/?search=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link, index) => (
            <a
              key={link}
              href="#"
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${index === 0
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Search Bar
        <div className="hidden lg:block flex-1 max-w-sm">
          <SearchBar onSearch={setSearchQuery} />

        </div> */}

        {/* <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" asChild onClick={() => navigate("/login")}>
            <a>Log in</a>
          </Button>
          <Button asChild>
            <Link to="/login">Sign up</Link>
          </Button>
        </div> */}

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  )

}