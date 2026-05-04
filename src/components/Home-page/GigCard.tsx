import { Gig } from "@/types/types"
import { Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface GigCardProps {
    gig: Gig
}

export function GigCard({ gig }: GigCardProps) {
    const navigate = useNavigate()

    const handleViewGig = () => {
        navigate(`/gig/${gig.id}`)
    }

    return (
        <div className="group cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
            {/* Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                    src={gig.thumbnail}
                    alt={gig.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={handleViewGig}
                />
                <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-sm">
                    ${gig.price}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Category Badge */}
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {gig.category}
                </span>

                {/* Title */}
                <h3
                    className="mt-3 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary"
                    onClick={handleViewGig}
                >
                    {gig.title}
                </h3>

                {/* Description */}
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {gig.description}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {gig.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                            {tag}
                        </span>
                    ))}
                    {gig.tags.length > 2 && (
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            +{gig.tags.length - 2}
                        </span>
                    )}
                </div>

                {/* Rating & Reviews */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-foreground">
                            {gig.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            ({gig.totalReviews} reviews)
                        </span>
                    </div>
                </div>

                {/* Delivery Time */}
                <div className="mt-3 border-b border-border/50 pb-3 text-xs text-muted-foreground">
                    📅 Delivery in {gig.deliveryDays} day{gig.deliveryDays > 1 ? "s" : ""}
                </div>

                {/* Seller Info */}
                <div className="mt-4 flex items-center gap-3">
                    <img
                        src={gig.seller.avatar}
                        alt={gig.seller.name}
                        className="h-9 w-9 rounded-full border border-border/60"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                            {gig.seller.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{gig.seller.role}</p>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleViewGig}
                    className="mt-4 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    View Gig
                </button>
            </div>
        </div>
    )
}
