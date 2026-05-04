import { User, Gig, Order, Review, DashboardStats } from "@/types"

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Sara Malik",
    email: "sara@example.com",
    avatar: "https://i.pravatar.cc/150?img=47",
    role: "freelancer",
    bio: "Graphic designer with 5 years of experience in branding and UI.",
    joinedAt: "2024-01-10",
    rating: 4.9,
    totalReviews: 134,
  },
  {
    id: "u2",
    name: "Karim Benali",
    email: "karim@example.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    role: "freelancer",
    bio: "Full-stack developer specialized in React and NestJS.",
    joinedAt: "2024-03-05",
    rating: 4.7,
    totalReviews: 89,
  },
  {
    id: "u3",
    name: "Lina Ouhab",
    email: "lina@example.com",
    avatar: "https://i.pravatar.cc/150?img=23",
    role: "client",
    bio: "Startup founder looking for reliable freelancers.",
    joinedAt: "2024-06-01",
    rating: 0,
    totalReviews: 0,
  },
]

export const mockGigs: Gig[] = [
  {
    id: "g1",
    sellerId: "u1",
    seller: mockUsers[0],
    title: "I will design a professional logo for your brand",
    description:
      "High quality logo design with unlimited revisions. Delivered in PNG, SVG, and AI formats. Includes brand color palette.",
    category: "Graphic Design",
    price: 50,
    deliveryDays: 3,
    rating: 4.9,
    totalReviews: 134,
    thumbnail: "https://picsum.photos/seed/logo/400/300",
    tags: ["logo", "branding", "design"],
    createdAt: "2024-02-01",
  },
  {
    id: "g2",
    sellerId: "u2",
    seller: mockUsers[1],
    title: "I will build a React web app with NestJS backend",
    description:
      "Full-stack development with clean code, REST API, and deployment. Includes authentication and database setup.",
    category: "Development",
    price: 300,
    deliveryDays: 14,
    rating: 4.7,
    totalReviews: 89,
    thumbnail: "https://picsum.photos/seed/dev/400/300",
    tags: ["react", "nestjs", "fullstack"],
    createdAt: "2024-03-10",
  },
  {
    id: "g3",
    sellerId: "u1",
    seller: mockUsers[0],
    title: "I will create social media graphics for your business",
    description:
      "Eye-catching posts and stories for Instagram, Facebook, and LinkedIn. Delivered in all required sizes.",
    category: "Graphic Design",
    price: 30,
    deliveryDays: 2,
    rating: 4.8,
    totalReviews: 67,
    thumbnail: "https://picsum.photos/seed/social/400/300",
    tags: ["social media", "graphics", "instagram"],
    createdAt: "2024-04-15",
  },
  {
    id: "g4",
    sellerId: "u2",
    seller: mockUsers[1],
    title: "I will translate documents from English to French or Arabic",
    description:
      "Native-level translation for documents, websites, and marketing copy. Fast turnaround guaranteed.",
    category: "Translation",
    price: 20,
    deliveryDays: 1,
    rating: 4.6,
    totalReviews: 45,
    thumbnail: "https://picsum.photos/seed/translate/400/300",
    tags: ["translation", "french", "arabic"],
    createdAt: "2024-05-20",
  },
]

export const mockOrders: Order[] = [
  {
    id: "o1",
    gigId: "g1",
    gig: mockGigs[0],
    clientId: "u3",
    client: mockUsers[2],
    freelancerId: "u1",
    freelancer: mockUsers[0],
    status: "in_progress",
    price: 50,
    requirements: "I need a logo for my coffee shop called Brew & Co. Colors: brown and cream.",
    createdAt: "2025-04-20",
    deliveryDeadline: "2025-04-23",
  },
  {
    id: "o2",
    gigId: "g2",
    gig: mockGigs[1],
    clientId: "u3",
    client: mockUsers[2],
    freelancerId: "u2",
    freelancer: mockUsers[1],
    status: "completed",
    price: 300,
    requirements: "E-commerce app with Stripe payments and product catalog.",
    createdAt: "2025-03-01",
    deliveryDeadline: "2025-03-15",
  },
]

export const mockReviews: Review[] = [
  {
    id: "r1",
    orderId: "o2",
    gigId: "g2",
    authorId: "u3",
    author: mockUsers[2],
    rating: 5,
    comment: "Karim delivered exactly what I needed. Clean code and great communication throughout.",
    createdAt: "2025-03-16",
  },
]

export const mockDashboardStats: DashboardStats = {
  totalEarnings: 1240,
  activeOrders: 3,
  completedOrders: 47,
  averageRating: 4.8,
}

export const mockCurrentUser: User = mockUsers[0]
