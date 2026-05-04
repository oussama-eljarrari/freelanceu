// ============================================================
// FreelanceU — Shared Types
// src/types/index.ts
//
// This file is the single source of truth for all TypeScript
// types used across the app. Every member imports from here.
// Never define types inline in components — always add them here.
// ============================================================

// ------------------------------------------------------------
// USER
// ------------------------------------------------------------

/** The three roles a user can have on the platform */
export type UserRole = "client" | "freelancer" | "admin"

/** A registered user on FreelanceU */
export interface User {
  id: string
  name: string
  email: string
  password?: string   // mock-only for frontend testing
  avatar: string       // URL to profile picture
  role: UserRole
  bio: string
  joinedAt: string     // ISO date string e.g. "2024-01-10"
  rating: number       // 0–5, 0 means no reviews yet
  totalReviews: number
}

// ------------------------------------------------------------
// GIG
// ------------------------------------------------------------

/**
 * The 8 service categories available on FreelanceU.
 * Must match the categories array in data.ts exactly.
 */
export type GigCategory =
  | "Graphic Design"
  | "Translation"
  | "Development"
  | "Writing"
  | "Tutoring"
  | "Video Editing"
  | "Photo Editing"
  | "Audio & Voice"

/** A service listing created by a freelancer */
export interface Gig {
  id: string
  sellerId: string     // References User.id
  seller: User         // Full seller object (pre-joined for display)
  title: string
  description: string
  category: GigCategory
  price: number        // In USD
  deliveryDays: number // How many days to deliver
  rating: number       // Average rating 0–5
  totalReviews: number
  thumbnail: string    // URL to cover image
  tags: string[]       // e.g. ["logo", "branding"]
  createdAt: string    // ISO date string
}

// ------------------------------------------------------------
// ORDER
// ------------------------------------------------------------

/**
 * The lifecycle of an order:
 * pending → in_progress → delivered → completed
 *                       ↘ cancelled (at any point)
 */
export type OrderStatus =
  | "pending"
  | "in_progress"
  | "delivered"
  | "completed"
  | "cancelled"

/** A purchase made by a client for a specific gig */
export interface Order {
  id: string
  gigId: string
  gig: Gig             // Full gig object (pre-joined for display)
  clientId: string
  client: User
  freelancerId: string
  freelancer: User
  status: OrderStatus
  price: number        // Snapshot of price at time of order
  requirements: string // What the client sent to the freelancer
  createdAt: string
  deliveryDeadline: string // ISO date string
}

// ------------------------------------------------------------
// REVIEW
// ------------------------------------------------------------

/** A review left by a client after an order is completed */
export interface Review {
  id: string
  orderId: string
  gigId: string
  authorId: string
  author: User
  rating: number   // 1–5
  comment: string
  createdAt: string
}

// ------------------------------------------------------------
// DASHBOARD
// ------------------------------------------------------------

/** Summary numbers shown at the top of the freelancer dashboard */
export interface DashboardStats {
  totalEarnings: number
  activeOrders: number
  completedOrders: number
  averageRating: number
}

// ------------------------------------------------------------
// AUTH
// ------------------------------------------------------------

/**
 * The shape returned by useAuth() hook.
 * M1 owns this — M2/M3/M4 just consume it.
 * The shape NEVER changes even when real JWT logic is added.
 */
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}