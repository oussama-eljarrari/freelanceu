import { HomePage } from "@/components/Home-page/home"
import { LandingPage } from "@/components/Landing-Page/Landingpage"
import { Routes, Route } from "react-router-dom"
import { LoginPage } from "./components/Login-Page/Login"
import { DashboardPage } from "./components/Dashboard-Page/Dashboard"
import { ProfilePage } from "./components/Profile-Page/Profile"
import { AdminDashboard } from "./components/Admin-Page/AdminDashboard"
import { GigDetailPage } from "./components/Home-page/GigDetailPage"
import { SignupPage } from "./components/Signup-page/Signup"
import OrdersPage from "./components/Orders/OrdersPage"
import CreateGigPage from "./components/Gig/CreateGig"
import { MessagesPage } from "./components/Messages/MessagesPage"
import { Layout } from "./components/Layout"
import { NotFound } from "./components/NotFound"
import { Protected } from "./components/Protected"

export function App() {

  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path="/" element={<LandingPage />} />

        <Route element={<Protected />} >
          <Route path="/home" element={<HomePage />} />
          <Route path="/gig/:id" element={<GigDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/gig/create" element={<CreateGigPage />} />
          
          <Route element={<Protected adminOnly />} >
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        
        </Route>

      </Route>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>

  )
}

export default App
