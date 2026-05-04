import { Search, X } from "lucide-react"
import { useState } from "react"

interface SearchBarProps {
    onSearch?: (query: string) => void
    placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search gigs..." }: SearchBarProps) {
    const [query, setQuery] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSearch) {
            onSearch(query)
        }
    }

    const handleClear = () => {
        setQuery("")
        if (onSearch) {
            onSearch("")
        }
    }

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-full border border-border/60 bg-card/80 py-3 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </form>
    )
}
