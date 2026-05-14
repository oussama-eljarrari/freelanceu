
import { useAuth } from "@/Context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function Protected({ adminOnly = false }: { adminOnly?: boolean }) {
    const { isAuthenticated, isLoading, user } = useAuth()

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (adminOnly && (!user || user.role !== 'admin')) {
        return <Navigate to="/login" />
    }

    return (
        <div>
            {isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
        </div>
    )
}