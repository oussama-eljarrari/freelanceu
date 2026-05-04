// ============================================================
// FreelanceU — Auth Context
// src/context/AuthContext.tsx
//
// This is the brain of authentication.
// It uses:
//   - useState      → to hold user and token
//   - useEffect     → to read the token from localStorage on startup
//   - useNavigate   → to redirect after login/logout
//   - useContext    → consumed by useAuth() below
//   - createContext → creates the shared auth state
//
// PHASE 1: Uses initCurrentUser (no real API)
// PHASE 2 (M1 task): Replace login() body with real fetch() to NestJS
// ============================================================

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@/Types/typesindex"
import { initCurrentUser, initUsers } from "@/Mocks/initdata"

// ------------------------------------------------------------
// 1. CREATE THE CONTEXT
//    undefined as default — useAuth() will guard against this
// ------------------------------------------------------------

type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ------------------------------------------------------------
// 2. TOKEN HELPERS
//    Simple localStorage utilities for saving/reading the token.
// ------------------------------------------------------------

const TOKEN_KEY = "freelanceu_token"

function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// ------------------------------------------------------------
// 3. AUTH PROVIDER COMPONENT
//    Wrap your entire app with this in main.tsx:
//
//    <AuthProvider>
//      <App />
//    </AuthProvider>
// ------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const navigate = useNavigate()

  // ----------------------------------------------------------
  // STARTUP EFFECT
  // Runs once when the app loads.
  // Checks if there is a saved token → if yes, restores session.
  //
  // Phase 2 (M1): Replace the mock block with:
  //   const response = await fetch("/api/auth/me", {
  //     headers: { Authorization: `Bearer ${savedToken}` }
  //   })
  //   const realUser = await response.json()
  //   setUser(realUser)
  // ----------------------------------------------------------
  useEffect(() => {
    const savedToken = getToken()

    if (savedToken) {
      // PHASE 1: token found → restore mock user
      setToken(savedToken)
      setUser(initCurrentUser)
    }
  }, [])

  // ----------------------------------------------------------
  // LOGIN FUNCTION
  // Called by LoginForm on submit.
  //
  // Phase 2 (M1): Replace the mock block with:
  //   const response = await fetch("/api/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   })
  //   if (!response.ok) throw new Error("Invalid credentials")
  //   const { user: realUser, token: realToken } = await response.json()
  //   setUser(realUser)
  //   setToken(realToken)
  //   saveToken(realToken)
  // ----------------------------------------------------------
  async function login(email: string, password: string) {
    // PHASE 1: mock logic
    if (!email || !password) {
      throw new Error("Please enter both email and password")
    }

    const matchedUser = initUsers.find(
      (user) => user.email === email && user.password === password
    )

    if (!matchedUser) {
      throw new Error("Invalid credentials")
    }
    else{
    alert("Login successful! WELCOME TO FREELANCEU HOME PAGE")
    }

    const fakeToken = "mock-token-" + Date.now()
    setUser(matchedUser)
    setToken(fakeToken)
    saveToken(fakeToken)

    navigate("/home")
  }

  // ----------------------------------------------------------
  // LOGOUT FUNCTION
  // Clears everything and redirects to login.
  // No changes needed in Phase 2.
  // ----------------------------------------------------------
  function logout() {
    setUser(null)
    setToken(null)
    removeToken()
    navigate("/login")
  }

  // ----------------------------------------------------------
  // CONTEXT VALUE
  // Everything components get when they call useAuth()
  // ----------------------------------------------------------
  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: user !== null && token !== null,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ------------------------------------------------------------
// 4. useAuth HOOK
//    What M2/M3/M4 call in their components:
//
//    const { user, isAuthenticated, logout } = useAuth()
// ------------------------------------------------------------

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error(
      "useAuth() must be used inside <AuthProvider>. " +
      "Make sure AuthProvider wraps your app in main.tsx."
    )
  }

  return context
}