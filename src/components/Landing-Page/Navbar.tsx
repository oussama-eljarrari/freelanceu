import { Menu, LogOut, User as UserIcon, LayoutDashboard, Shield } from "lucide-react"
import { BrandMark } from "./BrandMark"
import { Button } from "@/components/ui/button"
import { SearchBar } from "../Home-page/SearchBar"
import { useState } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/types"

export function Navbar() {

  const navLinks = [
  { label: "Explore", href: "#top" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
]


  const links = ["Dashboard", "Messages", "Orders", "Profile"]
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isAuthenticated } = useAuth()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    navigate(`/?search=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/">
          <BrandMark />
        </Link>

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
          {isAuthenticated ? (
            <ProfileCercle user={user!} />
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

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

function ProfileCercle({ user }: { user: User }) {

  const navigate = useNavigate()



  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
        <LayoutDashboard className="mr-2 h-4 w-4" />
        <span>Dashboard</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/profile")}>
        <UserIcon className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      {user.role === "admin" && (
        <DropdownMenuItem onClick={() => navigate("/admin")}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Admin Panel</span>
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => navigate("/login")}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}
