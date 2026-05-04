import { useParams, useNavigate } from "react-router-dom"
import { mockGigs } from "@/mocks/mocks"
import { Star, ArrowLeft, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"
import { OrderPopup } from "./OrderPopup"

export function GigDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const gig = mockGigs.find((g) => g.id === id)
    const [showOrderPopup, setShowOrderPopup] = useState(false)

    if (!gig) {
        return (
            <div className="min-h-screen bg-background px-4 py-10">
                <div className="mx-auto max-w-7xl rounded-2xl border border-dashed border-border/60 bg-card/70 p-10 text-center">
                    <p className="text-lg font-semibold text-foreground">Gig not found</p>
                    <p className="mt-2 text-sm text-muted-foreground">The gig you are looking for does not exist.</p>
                    <button
                        onClick={() => navigate("/home")}
                        className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background px-4 py-10">
            <div className="mx-auto max-w-7xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/home")}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back to gigs
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Thumbnail */}
                        <div className="mb-6 h-96 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted">
                            <img
                                src={gig.thumbnail}
                                alt={gig.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Title & Category */}
                        <div className="mb-6">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                {gig.category}
                            </span>
                            <h1 className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">{gig.title}</h1>

                            {/* Rating */}
                            <div className="mt-4 flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-lg font-semibold text-foreground">{gig.rating}</span>
                                </div>
                                <span className="text-muted-foreground">
                                    ({gig.totalReviews} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8 border-b border-border/50 pb-8">
                            <h2 className="text-xl font-bold text-foreground mb-3">About this gig</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">{gig.description}</p>
                        </div>

                        {/* Tags */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-3">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {gig.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-4">What's included</h2>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-muted-foreground">
                                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>Professional service delivery</span>
                                </li>
                                <li className="flex items-center gap-3 text-muted-foreground">
                                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>Unlimited revisions</span>
                                </li>
                                <li className="flex items-center gap-3 text-muted-foreground">
                                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>Fast delivery</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Pricing Card */}
                        <div className="sticky top-8 mb-6 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                            <div className="mb-6">
                                <p className="text-muted-foreground text-sm mb-2">Price</p>
                                <p className="text-4xl font-bold text-foreground">${gig.price}</p>
                            </div>

                            <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                                <Clock className="h-5 w-5" />
                                <span>{gig.deliveryDays} day delivery</span>
                            </div>

                            <button
                                onClick={() => setShowOrderPopup(true)}
                                className="mb-3 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Continue
                            </button>

                            <button className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                                Contact Seller
                            </button>
                        </div>

                        {/* Seller Card */}
                        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                            <h3 className="text-lg font-bold text-foreground mb-4">About the seller</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={gig.seller.avatar}
                                    alt={gig.seller.name}
                                    className="h-12 w-12 rounded-full border border-border"
                                />
                                <div>
                                    <p className="font-semibold text-foreground">{gig.seller.name}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{gig.seller.role}</p>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">{gig.seller.bio}</p>

                            <div className="space-y-2 text-sm mb-4">
                                <p>
                                    <span className="text-muted-foreground">Rating: </span>
                                    <span className="font-semibold text-foreground">{gig.seller.rating} ⭐</span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Member since: </span>
                                    <span className="font-semibold text-foreground">{gig.seller.joinedAt}</span>
                                </p>
                            </div>

                            <button className="w-full border border-border text-foreground font-medium py-2 rounded-lg hover:bg-background transition-colors">
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Popup */}
            {showOrderPopup && <OrderPopup gig={gig} onClose={() => setShowOrderPopup(false)} />}
        </div>
    )
}
