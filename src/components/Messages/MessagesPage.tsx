import { useEffect, useMemo, useState } from "react"
import { api } from "@/api/client"
import { useAuth } from "@/hooks/useAuth"
import type { Message } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Inbox, Mail, User } from "lucide-react"

type MessagesResponse = {
    data: Message[]
}

export function MessagesPage() {
    const { user, isAuthenticated, isLoading } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isFetching, setIsFetching] = useState(false)
    const [replyingId, setReplyingId] = useState<string | null>(null)
    const [replyBody, setReplyBody] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [sendError, setSendError] = useState<string | null>(null)

    const queryString = useMemo(() => {
        if (!user) {
            return ""
        }
        const params = new URLSearchParams()
        params.set("userId", user.id)
        if (user.email) {
            params.set("email", user.email)
        }
        return params.toString()
    }, [user])

    useEffect(() => {
        if (!isAuthenticated || !user || !queryString) {
            return
        }

        const loadMessages = async (showLoader = true) => {
            if (showLoader) {
                setIsFetching(true)
            }
            setError(null)
            try {
                const res = await api.get<MessagesResponse>(`/messages?${queryString}`)
                setMessages(res.data ?? [])
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load messages.")
            } finally {
                if (showLoader) {
                    setIsFetching(false)
                }
            }
        }

        loadMessages()
        const intervalId = window.setInterval(() => loadMessages(false), 15000)
        return () => window.clearInterval(intervalId)
    }, [isAuthenticated, user, queryString])

    const getReplySubject = (subject: string) => {
        if (subject.toLowerCase().startsWith("re:")) {
            return subject
        }
        return `Re: ${subject}`
    }

    const handleSendReply = async (message: Message) => {
        if (!user) {
            return
        }
        const trimmedBody = replyBody.trim()
        if (!trimmedBody) {
            setSendError("Please write a reply message.")
            return
        }

        setIsSending(true)
        setSendError(null)

        const senderEmail =
            user.email ||
            (user.id === message.sellerId ? message.sellerEmail : message.senderEmail)
        const clientId =
            message.clientId ??
            (user.id === message.sellerId ? message.senderId ?? null : user.id)
        const clientEmail =
            message.clientEmail ??
            (user.id === message.sellerId
                ? message.senderEmail
                : user.email ?? message.senderEmail)

        try {
            const res = await api.post<{ data: Message }>("/messages", {
                gigId: message.gigId,
                sellerId: message.sellerId,
                sellerEmail: message.sellerEmail,
                clientId,
                clientEmail,
                senderId: user.id,
                senderEmail,
                subject: getReplySubject(message.subject),
                message: trimmedBody,
            })
            if (res.data) {
                setMessages((prev) => [res.data, ...prev])
            }
            setReplyBody("")
            setReplyingId(null)
        } catch (err) {
            setSendError(err instanceof Error ? err.message : "Failed to send reply.")
        } finally {
            setIsSending(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h2 className="text-2xl font-semibold">Access denied</h2>
                <p className="mt-2 text-muted-foreground">Please log in to view your messages.</p>
            </div>
        )
    }

    if (isLoading || isFetching) {
        return (
            <div className="container mx-auto py-20 text-center">
                <p className="text-muted-foreground">Loading messages...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
            <div className="container mx-auto max-w-6xl px-4 py-12 md:px-8">
                <div className="mb-10">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                            <Inbox className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Messages</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Inbox</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Review the conversations with sellers and clients.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {messages.length === 0 ? (
                    <Card className="border border-border/60 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Inbox className="mb-4 h-16 w-16 text-muted-foreground/30" />
                            <h3 className="mb-2 text-lg font-semibold text-foreground">No messages yet</h3>
                            <p className="max-w-sm text-center text-muted-foreground">
                                Start a conversation from a gig page to see messages here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => {
                            const isSender =
                                message.senderId === user?.id ||
                                message.senderEmail === user?.email
                            const isSeller =
                                user?.id === message.sellerId ||
                                user?.email === message.sellerEmail
                            const counterpart = isSeller
                                ? message.clientEmail || message.senderEmail
                                : message.sellerEmail || message.senderEmail
                            const isReplyOpen = replyingId === message.id
                            return (
                                <Card key={message.id} className="border border-border/60">
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <CardTitle className="text-base">
                                                {message.subject}
                                            </CardTitle>
                                            <Badge variant="outline">
                                                {isSender ? "Sent" : "Received"}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3.5 w-3.5" />
                                                {counterpart}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3.5 w-3.5" />
                                                Gig {message.gigId}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(message.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="whitespace-pre-line text-sm text-foreground">
                                            {message.body}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReplyingId(message.id)
                                                    setReplyBody("")
                                                    setSendError(null)
                                                }}
                                                className="text-xs font-semibold text-primary hover:text-primary/80"
                                            >
                                                Reply
                                            </button>
                                            <span className="text-xs text-muted-foreground">
                                                Reply to {counterpart}
                                            </span>
                                        </div>

                                        {isReplyOpen && (
                                            <div className="rounded-xl border border-border/60 bg-muted p-4">
                                                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                                                    Your reply
                                                    <textarea
                                                        value={replyBody}
                                                        onChange={(event) => setReplyBody(event.target.value)}
                                                        className="mt-2 min-h-[120px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                        placeholder="Write your reply..."
                                                    />
                                                </label>
                                                {sendError && (
                                                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                                        {sendError}
                                                    </div>
                                                )}
                                                <div className="mt-4 flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReplyingId(null)
                                                            setReplyBody("")
                                                            setSendError(null)
                                                        }}
                                                        className="flex-1 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-background"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSendReply(message)}
                                                        disabled={isSending}
                                                        className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
                                                    >
                                                        {isSending ? "Sending..." : "Send reply"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        }
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
