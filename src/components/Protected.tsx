
import { useAuth } from "@/Context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function Protected() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <div>
            {isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
        </div>
    )
}