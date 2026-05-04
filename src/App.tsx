import { HomePage } from "@/components/Home-page/home"
import { LandingPage } from "@/components/Landing-Page/Landingpage"
import { Routes, Route } from "react-router-dom"
import { LoginPage } from "./components/Login-Page/Login"
import { DashboardPage } from "./components/Dashboard-Page/Dashboard"
import { ProfilePage } from "./components/Profile-Page/Profile"
import { AdminDashboard } from "./components/Admin-Page/AdminDashboard"
import { GigDetailPage } from "./components/Home-page/GigDetailPage"

export function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/gig/:id" element={<GigDetailPage />} />
      <Route path="/dashboard" element={<DashboardPage/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/admin" element={<AdminDashboard/>} />
    </Routes>

  )
}

export default App
