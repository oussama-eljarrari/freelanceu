# FreelanceU Architecture Overview

## Big Picture

This project is a small freelance marketplace app, similar to Fiverr.

It has two main parts:

```text
freelanceu/
├── src/              # Frontend: React + Vite + Tailwind
├── backend/          # Backend: NestJS API
├── public/           # Static assets
├── package.json      # Root frontend/dev scripts
├── vite.config.ts    # Vite config + API proxy
└── components.json   # shadcn/ui config
```

The frontend runs on `http://localhost:5173`.

The backend runs on `http://localhost:3000`.

The frontend calls backend routes through `/api`, and Vite proxies `/api/*` to the backend.

Example:

```ts
api.get("/gigs")
```

Actually becomes:

```text
GET http://localhost:3000/gigs
```

because of `vite.config.ts`.

## Tech Stack

Frontend:

```text
React 19
Vite
TypeScript
React Router
Tailwind CSS v4
shadcn/ui-style components
Lucide icons
```

Backend:

```text
NestJS
TypeScript
Express session
In-memory data storage
```

Important: this project currently does not use a real database. Users, gigs, orders, and messages are stored in arrays inside backend services.

## How To Run It

From the root:

```bash
pnpm dev
```

This runs both:

```bash
pnpm dev:client
pnpm dev:server
```

Frontend only:

```bash
pnpm dev:client
```

Backend only:

```bash
pnpm dev:server
```

Build frontend:

```bash
pnpm build
```

Typecheck:

```bash
pnpm typecheck
```

## Frontend Architecture

The frontend starts here:

```text
src/main.tsx
```

It wraps the app with:

```tsx
<BrowserRouter>
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
</BrowserRouter>
```

So every page has access to:

```text
routing
```

The main routes are defined in:

```text
src/App.tsx
```

Main routes:

```text
/              Landing page
/login         Login page
/signup        Signup page
/home          Marketplace homepage
/gig/:id       Gig details page
/dashboard     User dashboard
/profile       Profile page
/admin         Admin dashboard
/orders        Orders page
/messages      Messages page
/gig/create    Create gig page
```

Most authenticated pages are inside:

```tsx
<Route element={<Protected />}>
```

`Protected` checks auth state. If the user is not logged in, it redirects to `/login`.

## Layout System

Shared page layout is here:

```text
src/components/Layout.tsx
```

It renders:

```tsx
<Navbar />
<main>
  <Outlet />
</main>
<Footer />
```

So pages inside this layout automatically get the navbar and footer.

## Authentication Flow

Frontend auth logic lives in:

```text
src/Context/AuthContext.tsx
```

There is also this helper:

```text
src/hooks/useAuth.ts
```

That file just re-exports `useAuth` from the context.

Auth state includes:

```ts
user
isAuthenticated
isLoading
login()
signup()
logout()
updateUser()
```

When the app loads, `AuthProvider` calls:

```ts
api.get("/auth/me")
```

That asks the backend if a session user exists.

Login flow:

```text
Login form
→ AuthContext.login()
→ POST /api/auth/login
→ backend checks user/password
→ backend stores user in session
→ frontend saves user in React state
→ navigate("/home")
```

Signup flow:

```text
Signup form
→ AuthContext.signup()
→ POST /api/auth/signup
→ backend creates user in memory
→ backend stores user in session
→ frontend saves user
→ navigate("/home")
```

Logout flow:

```text
logout()
→ POST /api/auth/logout
→ session.user = null
→ frontend clears user
→ navigate("/login")
```

The backend uses cookie-based sessions through `express-session`.

Backend session setup is in:

```text
backend/src/main.ts
```

```ts
app.enableCors({
  origin: "http://localhost:5173",
  credentials: true,
})

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
  })
)
```

Frontend requests include cookies because `src/api/client.ts` uses:

```ts
credentials: "include"
```

## API Client

All frontend backend calls go through:

```text
src/api/client.ts
```

It defines a small wrapper:

```ts
api.get()
api.post()
api.patch()
api.delete()
```

Base URL:

```ts
const BASE_URL = "/api"
```

That keeps frontend code clean:

```ts
api.get("/gigs")
api.post("/auth/login", data)
api.patch("/users/profile", data)
```

## Backend Architecture

Backend starts here:

```text
backend/src/main.ts
```

Main NestJS module:

```text
backend/src/app.module.ts
```

It imports feature modules:

```ts
UsersModule
AuthModule
MessagesModule
OrdersModule
GigsModule
```

The backend follows standard NestJS structure:

```text
module     # groups feature files
controller # receives HTTP requests
service    # business/data logic
dto        # request body shape
entity     # data model shape
```

Example for gigs:

```text
backend/src/gigs/
├── gigs.module.ts
├── gigs.controller.ts
├── gigs.service.ts
├── dto/
│   ├── create-gig.dto.ts
│   └── update-gig.dto.ts
└── entities/
    └── gig.entity.ts
```

## Main Backend Modules

### AuthModule

Handles:

```text
POST /auth/login
POST /auth/signup
POST /auth/logout
GET  /auth/me
```

Files:

```text
backend/src/auth/auth.controller.ts
backend/src/auth/auth.service.ts
```

### UsersModule

Handles users and profile updates:

```text
GET   /users/:id
PATCH /users/profile
```

Files:

```text
backend/src/users/users.controller.ts
backend/src/users/users.service.ts
```

### GigsModule

Handles marketplace gigs:

```text
GET    /gigs
GET    /gigs/:id
GET    /gigs/categories/list
GET    /gigs/seller/my-gigs
POST   /gigs
PATCH  /gigs/:id
DELETE /gigs/:id
```

Files:

```text
backend/src/gigs/gigs.controller.ts
backend/src/gigs/gigs.service.ts
```

### OrdersModule

Handles buying/hiring flow:

```text
GET   /orders
GET   /orders/:id
POST  /orders
PATCH /orders/:id
```

Files:

```text
backend/src/orders/orders.controller.ts
backend/src/orders/orders.service.ts
```

### MessagesModule

Handles contact messages:

```text
GET  /messages
POST /messages
```

Files:

```text
backend/src/messages/messages.controller.ts
backend/src/messages/messages.service.ts
```

## Data Storage

This project currently stores data in memory.

Example:

```text
backend/src/users/users.service.ts
```

has:

```ts
private users: User[] = [...]
```

`gigs.service.ts` has:

```ts
private readonly gigs: GigEntity[] = [...]
```

`orders.service.ts` has:

```ts
private readonly orders: OrderEntity[] = [...]
```

`messages.service.ts` has:

```ts
private readonly messages: MessageRecord[] = []
```

This means:

```text
Data exists only while the backend process is running.
Restarting the backend resets created users, gigs, orders, and messages.
```

There is no PostgreSQL, MongoDB, Prisma, TypeORM, or real persistence yet.

## Marketplace Flow

The homepage is:

```text
src/components/Home-page/home.tsx
```

It uses two data sources:

```text
mockGigs from src/mocks/index.ts
backend gigs from GET /api/gigs
```

Then combines them:

```ts
const allGigs = [...mockGigs, ...backendGigs]
```

Important detail: it only adds backend-created gigs whose IDs start with `g_`.

```ts
const newBackendGigs = response.data.filter(gig => gig.id.startsWith("g_"))
```

So the app uses frontend mock gigs for the original marketplace items, and backend-created gigs for new ones.

## Gig Detail Flow

The gig detail page is:

```text
src/components/Home-page/GigDetailPage.tsx
```

It first checks frontend mock data:

```ts
mockGigs.find((g) => g.id === id)
```

If not found and the ID starts with `g_`, it fetches from backend:

```ts
GET /api/gigs/:id
```

So:

```text
g1, g2, g3, etc. usually come from frontend mocks
g_xxxxx IDs come from backend-created gigs
```

## Create Gig Flow

Create gig page:

```text
src/components/Gig/CreateGig.tsx
```

Flow:

```text
User fills form
→ frontend validates title, price, delivery days, etc.
→ POST /api/gigs
→ backend validates again
→ backend stores gig in memory
→ frontend navigates to /home
```

Backend creates gigs in:

```text
backend/src/gigs/gigs.service.ts
```

Generated IDs look like:

```text
g_xxxxxxxx
```

## Orders Flow

Orders are handled by:

```text
src/components/Orders/OrdersPage.tsx
backend/src/orders/
```

Order creation requires a logged-in user.

Backend stores orders in memory and filters orders by current session user:

```ts
order.clientId === user.id || order.freelancerId === user.id
```

Admins can see all orders.

Order statuses:

```text
pending
in_progress
delivered
completed
cancelled
```

## Messages Flow

Messages are handled by:

```text
src/components/Messages/MessagesPage.tsx
src/components/Home-page/ContactSellerPopup.tsx
backend/src/messages/
```

Contacting a seller sends:

```text
POST /api/messages
```

Messages can be fetched by:

```text
GET /api/messages?userId=...&email=...
```

Unlike orders and gigs, messages controller does not currently enforce session authentication.

## Types

Shared frontend types live in:

```text
src/types/index.ts
```

Main types:

```ts
User
Gig
Order
Review
Message
DashboardStats
```

Backend has separate entity classes under each module, for example:

```text
backend/src/gigs/entities/gig.entity.ts
backend/src/orders/entities/order.entity.ts
backend/src/users/entities/user.entity.ts
```

There is no shared package between frontend and backend, so frontend and backend types can drift apart.

## Styling Architecture

Global styling is in:

```text
src/index.css
```

It imports:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

It defines theme tokens like:

```css
--background
--foreground
--primary
--card
--border
--muted
```

Dark mode variables are defined under:

```css
.dark { ... }
```

Reusable UI primitives are in:

```text
src/components/ui/
```

Examples:

```text
button.tsx
card.tsx
input.tsx
dialog.tsx
table.tsx
badge.tsx
```

These are shadcn-style building blocks.

## Important Limitations

The most important thing to understand: this is not production-ready yet.

Current limitations:

```text
No real database
No password hashing
Session secret is hardcoded
Session storage is memory-based
Backend data resets on restart
Some pages still mix frontend mock data with backend API data
Frontend and backend types are duplicated
No real authorization guard/middleware
Some endpoints manually check session.user
Messages endpoint does not require authentication
```

For learning or demo purposes, this is fine. For production, the next big architectural step would be adding a real database and proper auth/security.

## Mental Model

Think of the app like this:

```text
React pages/components
→ api client: src/api/client.ts
→ Vite proxy: /api to localhost:3000
→ NestJS controllers
→ NestJS services
→ in-memory arrays
```

Example for creating a gig:

```text
CreateGig.tsx
→ api.post("/gigs")
→ Vite rewrites /api/gigs to backend /gigs
→ GigsController.create()
→ GigsService.create()
→ pushes new gig into private gigs[]
```

Example for login:

```text
login-form
→ AuthContext.login()
→ api.post("/auth/login")
→ AuthController.login()
→ AuthService.login()
→ UsersService.findOne()
→ session.user = user
→ frontend user state updates
```

That is the essential architecture of the project.
