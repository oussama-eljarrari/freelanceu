import {Menu } from "lucide-react"

import { BrandMark } from "./brand-mark"

import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export function Navbar() {
  const links = ["Explore", "How it works", "Categories"]
    const navigate = useNavigate();
    

  




  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link, index) => (
            <a
              key={link}
              href="#"
              className={`text-sm font-medium transition-colors hover:text-foreground ${index === 0 ? "text-foreground" : "text-muted-foreground"}`}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" asChild onClick={() => navigate("/")}>
            <a>Log in</a>
          </Button>
          <Button asChild >
            <Link to="/">Sign up</Link>
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