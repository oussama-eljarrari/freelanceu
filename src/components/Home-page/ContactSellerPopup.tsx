import { X, Send } from "lucide-react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { api } from "@/api/client"
import { useAuth } from "@/hooks/useAuth"
import { Gig } from "@/types"

interface ContactSellerPopupProps {
    gig: Gig
    onClose: () => void
}

export function ContactSellerPopup({ gig, onClose }: ContactSellerPopupProps) {
    const { user } = useAuth()
    const [form, setForm] = useState({
        email: user?.email ?? "",
        subject: `Question about ${gig.title}`,
        message: "",
    })
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)

    const handleChange =
        (field: "email" | "subject" | "message") =>
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm((prev) => ({ ...prev, [field]: event.target.value }))
            }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        if (!form.email.trim() || !form.subject.trim() || !form.message.trim()) {
            setError("Please fill out all fields.")
            return
        }

        setIsSending(true)
        try {
            await api.post("/messages", {
                gigId: gig.id,
                sellerId: gig.sellerId,
                sellerEmail: gig.seller.email,
                clientId: user?.id ?? null,
                clientEmail: form.email.trim(),
                senderId: user?.id ?? null,
                senderEmail: form.email.trim(),
                subject: form.subject.trim(),
                message: form.message.trim(),
            })
            setSent(true)
            setTimeout(() => {
                onClose()
            }, 800)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message.")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-lg overflow-y-auto rounded-2xl border border-border/60 bg-card/90 shadow-xl">
                <div className="flex items-center justify-between border-b border-border/50 p-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Contact seller</h2>
                        <p className="text-sm text-muted-foreground">Send a message about this gig.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 transition-colors hover:bg-muted"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <div className="rounded-2xl border border-border/60 bg-muted p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">To</p>
                        <p className="text-sm font-semibold text-foreground">
                            {gig.seller.name} • {gig.seller.email}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Gig: {gig.title}</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-foreground">
                            Your email
                            <input
                                type="email"
                                value={form.email}
                                onChange={handleChange("email")}
                                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                placeholder="you@example.com"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-foreground">
                            Subject
                            <input
                                type="text"
                                value={form.subject}
                                onChange={handleChange("subject")}
                                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                placeholder="How can I help?"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-foreground">
                            Message
                            <textarea
                                value={form.message}
                                onChange={handleChange("message")}
                                className="mt-2 min-h-[140px] w-full resize-none rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                placeholder="Describe what you need..."
                                required
                            />
                        </label>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {sent && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            Message sent successfully.
                        </div>
                    )}

                    <div className="flex gap-3 border-t border-border/50 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSending || sent}
                            className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center gap-2"
                        >
                            {isSending ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send message
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
