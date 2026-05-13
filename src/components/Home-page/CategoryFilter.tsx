import { api } from "@/api/client"
// import { mockGigs } from "@/mocks"
import { useEffect, useState } from "react"

interface CategoryFilterProps {
    selectedCategory: string | null
    onCategoryChange: (category: string | null) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {

    const [categories, setCategories] = useState<string[]>([])


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/gigs/categories/list') as { data: string[] }
                if (response?.data) {
                    setCategories(response.data)
                }   
                
                // In a real app, you would fetch categories from the backend here
                // For this mock, we're just extracting unique categories from mockGigs
            } catch (error) {
                console.error('Error fetching categories', error)
            }
        }

        fetchCategories()
    }, [])


    return (
        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-card/70 p-3 shadow-sm backdrop-blur">
            <button
                onClick={() => onCategoryChange(null)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${selectedCategory === null
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
            >
                All Categories
            </button>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${selectedCategory === category
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}
