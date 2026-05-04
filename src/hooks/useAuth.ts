import { AuthState } from "@/types"
import { mockCurrentUser } from "@/mocks"

// Mocked useAuth hook as requested, to be replaced by Auth lead later.
export function useAuth(): AuthState {
  return {
    user: mockCurrentUser,
    isAuthenticated: true ,
    token: "mock-jwt-token-12345",
  }
}
