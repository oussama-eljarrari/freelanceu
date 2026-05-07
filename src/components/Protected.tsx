
import { useAuth } from "@/Context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function Protected() {
    const { isAuthenticated } = useAuth()

    return (
        <div>
            {isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
        </div>
    )
}