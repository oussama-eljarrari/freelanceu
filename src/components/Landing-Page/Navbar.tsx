import { Menu, LogOut, User as UserIcon, LayoutDashboard, Shield, PlusIcon, Plus } from "lucide-react"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"
import { SearchBar } from "../Home-page/SearchBar"
import { useEffect, useState } from "react";
import { Link, NavigateFunction, useLocation, useNavigate } from "react-router-dom"
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
import { api } from "@/api/client"
import { User, type Message } from "@/types"

export function Navbar() {

  const navLinks = [
    { label: "Explore", href: "#top" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Categories", href: "#categories" },
  ]


  const links = ["Dashboard", "Messages", "Orders", "Profile"]
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isAuthenticated } = useAuth()
  const [messageCount, setMessageCount] = useState(0)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    navigate(`/?search=${encodeURIComponent(query)}`)
  }

  const getLastSeenKey = () => {
    if (user?.id) {
      return `messages:lastSeen:${user.id}`
    }
    if (user?.email) {
      return `messages:lastSeen:${user.email}`
    }
    return "messages:lastSeen:anonymous"
  }

  const markMessagesAsSeen = () => {
    if (!user) {
      return
    }
    localStorage.setItem(getLastSeenKey(), new Date().toISOString())
    setMessageCount(0)
  }

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setMessageCount(0)
      return
    }

    const fetchMessages = async () => {
      try {
        if (location.pathname === "/messages") {
          markMessagesAsSeen()
          return
        }
        const params = new URLSearchParams()
        params.set("userId", user.id)
        if (user.email) {
          params.set("email", user.email)
        }
        const res = await api.get<{ data: Message[] }>(`/messages?${params.toString()}`)
        const lastSeenRaw = localStorage.getItem(getLastSeenKey())
        const lastSeen = lastSeenRaw ? new Date(lastSeenRaw).getTime() : 0
        const incoming = (res.data ?? [])
          .filter((message) => message.senderId !== user.id && message.senderEmail !== user.email)
          .filter((message) => new Date(message.createdAt).getTime() > lastSeen)
          .length
        setMessageCount(incoming)
      } catch {
        // Keep last count if fetch fails.
      }
    }

    fetchMessages()
    const intervalId = window.setInterval(fetchMessages, 15000)
    return () => window.clearInterval(intervalId)
  }, [isAuthenticated, user, location.pathname])

  useEffect(() => {
    if (location.pathname === "/messages") {
      markMessagesAsSeen()
    }
  }, [location.pathname, user])

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/home" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {!isAuthenticated && navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${index === 0 ? "text-foreground" : "text-muted-foreground"}`}
            >
              {link.label}
            </a>
          ))}
          {isAuthenticated && links.map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase()}`}
              className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground"
            >
              <span className="relative inline-flex items-center">
                {link}
                {link === "Messages" && messageCount > 0 && (
                  <span className="ml-2 inline-flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {messageCount > 99 ? "99+" : messageCount}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <div>
                <Button variant="default" asChild>
                  <Link to="/gig/create">
                  
                  <PlusIcon />
                  Create Gig</Link>
                </Button>
              </div>
              <ProfileCercle />
            </>
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

function ProfileCercle() {
  const { logout, user } = useAuth()

  const navigate = useNavigate()

  if (!user) {
    return null
  }

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
      <DropdownMenuItem onClick={() => navigate("/gig/create")}>
        <Plus className="mr-2 h-4 w-4" />
        <span>Create your own Gig</span>
      </DropdownMenuItem>
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
      <DropdownMenuItem onClick={() => logout()}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}
