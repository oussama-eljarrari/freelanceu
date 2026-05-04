import { HomePage } from "@/components/Home-page/home"
import { LandingPage } from "@/components/Landing-Page/Landingpage"
import { Routes, Route } from "react-router-dom"
import { LoginPage } from "./components/Login-Page/Login"
import { GigDetailPage } from "./components/Home-page/GigDetailPage"

export function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      
    </Routes>

  )
}

export default App
