import { X, Wallet, CreditCard, DollarSign } from "lucide-react"
import { Gig } from "@/types"
import { useState } from "react"
import { api } from "@/api/client"
import { useAuth } from "@/hooks/useAuth"

interface OrderPopupProps {
    gig: Gig
    onClose: () => void
}

export function OrderPopup({ gig, onClose }: OrderPopupProps) {
    const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card" | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const { user, isAuthenticated } = useAuth()

    const handleConfirmOrder = async () => {
        if (!paymentMethod || !isAuthenticated || !user) return
        setIsProcessing(true)
        try {
            await api.post("/orders", {
                gigId: gig.id,
                gigTitle: gig.title,
                gigDescription: gig.description,
                gigThumbnail: gig.thumbnail,
                deliveryDays: gig.deliveryDays,
                freelancerId: gig.sellerId,
                freelancerName: gig.seller.name,
                freelancerAvatar: gig.seller.avatar,
                price: gig.price,
                requirements: `Payment method: ${paymentMethod}`,
            })

            alert("Order placed successfully!")
            onClose()
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to place order")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md overflow-y-auto rounded-2xl border border-border/60 bg-card/90 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/50 p-6">
                    <h2 className="text-2xl font-bold text-foreground">Order Details</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 transition-colors hover:bg-muted"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6 p-6">
                    {/* Order Summary */}
                    <div className="rounded-2xl border border-border/60 bg-muted p-4">
                        <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Service</span>
                                <span className="text-foreground font-medium">{gig.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery</span>
                                <span className="text-foreground font-medium">{gig.deliveryDays} days</span>
                            </div>
                            <div className="border-t border-border/50 pt-2 mt-2">
                                <div className="flex justify-between text-base">
                                    <span className="text-muted-foreground">Total Price</span>
                                    <span className="text-2xl font-bold text-primary">${gig.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted p-3">
                        <img
                            src={gig.seller.avatar}
                            alt={gig.seller.name}
                            className="h-10 w-10 rounded-full border border-border"
                        />
                        <div>
                            <p className="font-semibold text-foreground text-sm">{gig.seller.name}</p>
                            <p className="text-xs text-muted-foreground">Seller</p>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-3">Select Payment Method</h3>
                        <div className="space-y-2">
                            {/* E-Wallet Option */}
                            <button
                                onClick={() => setPaymentMethod("wallet")}
                                className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 transition-all ${paymentMethod === "wallet"
                                    ? "border-primary bg-primary/10"
                                    : "border-border/50 bg-muted hover:border-border"
                                    }`}
                            >
                                <Wallet className={`h-5 w-5 ${paymentMethod === "wallet" ? "text-primary" : "text-muted-foreground"}`} />
                                <div className="text-left flex-1">
                                    <p className={`font-semibold ${paymentMethod === "wallet" ? "text-primary" : "text-foreground"}`}>
                                        E-Wallet
                                    </p>
                                    <p className="text-xs text-muted-foreground">Balance: $1,234.50</p>
                                </div>
                                {paymentMethod === "wallet" && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-background" />
                                    </div>
                                )}
                            </button>

                            {/* Credit Card Option */}
                            <button
                                onClick={() => setPaymentMethod("card")}
                                className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 transition-all ${paymentMethod === "card"
                                    ? "border-primary bg-primary/10"
                                    : "border-border/50 bg-muted hover:border-border"
                                    }`}
                            >
                                <CreditCard className={`h-5 w-5 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`} />
                                <div className="text-left flex-1">
                                    <p className={`font-semibold ${paymentMethod === "card" ? "text-primary" : "text-foreground"}`}>
                                        Credit/Debit Card
                                    </p>
                                    <p className="text-xs text-muted-foreground">•••• •••• •••• 4242</p>
                                </div>
                                {paymentMethod === "card" && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-background" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="text-xs text-muted-foreground">
                        <p>By placing this order, you agree to our Terms of Service and will be charged ${gig.price}.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-border/50 p-6">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmOrder}
                        disabled={!paymentMethod || isProcessing || !isAuthenticated}
                        className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <DollarSign className="h-5 w-5" />
                                Continue
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
