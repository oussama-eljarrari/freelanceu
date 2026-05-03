import { HomePage } from "@/components/home-page"
import { Landing } from "@/components/landing-page/landing"
import { Routes, Route } from "react-router-dom"


export function App() {
  
  return (    
  <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/home" element={<HomePage/>} />
  </Routes>

)}

export default App
