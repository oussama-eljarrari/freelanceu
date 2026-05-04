export type UserRole = "client" | "freelancer" | "admin"

export type OrderStatus = "pending" | "in_progress" | "delivered" | "completed" | "cancelled"

export type GigCategory =
  | "Graphic Design"
  | "Translation"
  | "Development"
  | "Writing"
  | "Tutoring"
  | "Video Editing"
  | "Photo Editing"
  | "Audio & Voice"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  bio: string
  joinedAt: string
  rating: number
  totalReviews: number
}

export interface Gig {
  id: string
  sellerId: string
  seller: User
  title: string
  description: string
  category: GigCategory
  price: number
  deliveryDays: number
  rating: number
  totalReviews: number
  thumbnail: string
  tags: string[]
  createdAt: string
}

export interface Order {
  id: string
  gigId: string
  gig: Gig
  clientId: string
  client: User
  freelancerId: string
  freelancer: User
  status: OrderStatus
  price: number
  requirements: string
  createdAt: string
  deliveryDeadline: string
}

export interface Review {
  id: string
  orderId: string
  gigId: string
  authorId: string
  author: User
  rating: number
  comment: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}

export interface DashboardStats {
  totalEarnings: number
  activeOrders: number
  completedOrders: number
  averageRating: number
}
