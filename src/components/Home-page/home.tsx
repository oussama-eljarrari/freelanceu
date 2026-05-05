import { mockGigs } from "@/mocks"
import { GigCard } from "./GigCard"
import { SearchBar } from "./SearchBar"
import { CategoryFilter } from "./CategoryFilter"
import { useState, useMemo } from "react"


export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredGigs = useMemo(() => {
    return mockGigs.filter((gig) => {
      const matchesSearch =
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = !selectedCategory || gig.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="relative min-h-screen bg-background px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      

      <div className="mx-auto mt-8 max-w-7xl">
        <div className="mb-8 rounded-2xl border border-border/60 bg-card/70 p-6 text-center shadow-sm backdrop-blur sm:p-8">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Marketplace
            </p>
            <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
              Find modern talent for modern projects
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Search curated services, compare sellers, and hire with confidence.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-2xl">
              <SearchBar onSearch={setSearchQuery} />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border/60 bg-card/50 py-16 text-center">
              <p className="text-lg font-medium text-foreground">No gigs match this search.</p>
              <p className="mt-2 text-sm text-muted-foreground">Try a different keyword or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage