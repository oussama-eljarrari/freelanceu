
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@/types"
import { api } from "@/api/client"

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)


  const navigate = useNavigate()

  useEffect(() => {
    async function checkAuth() {
     
      const user = await api.get<User>("/auth/me")

      setUser(user)

    }
    checkAuth()
  }, [])


  async function login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Please enter both email and password")
    }

    try {
      const res = await api.post<{ user: User }>("/auth/login", { username: email, password })
      const user = res.user

      if (!user) {
        throw new Error("Invalid credentials")
      }

      setUser(user)
      navigate("/home")
    } catch (err: any) {
      throw new Error(err.message || "Failed to login")
    }
  }


  async function logout() {

    setUser(null)
    await api.post("/auth/logout")
    navigate("/login")
  }


  const value: AuthContextValue = {
    user, isAuthenticated: user !== null,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


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