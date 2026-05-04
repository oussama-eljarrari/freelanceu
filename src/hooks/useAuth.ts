// ============================================================
// FreelanceU — Auth Hook + Context
// src/hooks/useAuth.ts  ← the hook everyone imports
// src/context/AuthContext.tsx  ← you need to create this too (see below)
//
// HOW IT WORKS (Phase 1 — Mock):
//   - AuthProvider wraps the whole app in main.tsx
//   - It holds the auth state (user, token, isAuthenticated)
//   - useAuth() gives any component access to that state
//   - No real API call yet — uses initCurrentUser
//
// HOW TO UPGRADE (Phase 2 — Real JWT):
//   - Only edit AuthContext.tsx (the login/logout functions)
//   - useAuth.ts itself never changes
//   - M2/M3/M4 components never need to change either
// ============================================================

// ⚠️  THIS FILE (useAuth.ts) just re-exports from AuthContext.
//     The real logic lives in src/context/AuthContext.tsx
//     See that file for everything.

export { useAuth } from "@/Context/AuthContext"