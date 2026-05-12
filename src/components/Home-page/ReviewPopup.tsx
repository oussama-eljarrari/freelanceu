import { useState } from "react"
import { X, Star } from "lucide-react"
import { Review } from "@/types"
import { api } from "@/api/client"

interface ReviewPopupProps {
    gig: any
    onClose: () => void
    onSubmit?: (review: Review) => void
}

export function ReviewPopup({ gig, onClose, onSubmit }: ReviewPopupProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        if (rating === 0 || comment.trim() === "") {
            setError("Please provide a rating and comment")
            return
        }

        if (comment.trim().length < 10) {
            setError("Comment must be at least 10 characters")
            return
        }

        try {
            setLoading(true)
            setError("")

            const response = await api.post<{ data: Review }>("/reviews", {
                gigId: gig.id,
                rating,
                comment
            })

            if (response?.data) {
                if (onSubmit) {
                    onSubmit(response.data)
                }
                setSubmitted(true)
                setTimeout(() => {
                    onClose()
                }, 2000)
            }
        } catch (err: any) {
            console.error("Error submitting review:", err)
            setError(err.response?.data?.message || "Failed to submit review. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-xl max-w-md w-full mx-4 text-center">
                    <div className="mb-4 text-5xl">✅</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Thank you!</h3>
                    <p className="text-muted-foreground mb-6">Your review has been submitted successfully</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="rounded-2xl border border-border/60 bg-card shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/50 p-6">
                    <h2 className="text-2xl font-bold text-foreground">Leave a Review</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Gig Info */}
                    <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                        <img
                            src={gig.thumbnail}
                            alt={gig.title}
                            className="h-12 w-12 rounded object-cover"
                        />
                        <div>
                            <p className="text-xs text-muted-foreground">Reviewing</p>
                            <p className="font-semibold text-foreground text-sm">{gig.title}</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                            Your Rating
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= (hoverRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor="comment" className="block text-sm font-semibold text-foreground mb-2">
                            Your Review
                        </label>
                        <textarea
                            id="comment"
                            placeholder="Share your experience with this gig..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={loading}
                            className="w-full h-24 rounded-lg border border-border/60 bg-background p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {comment.length}/500 characters
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-border/50 p-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                                Submitting...
                            </>
                        ) : (
                            "Submit Review"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
