import { Header } from "@/components/Header"
import { Categories} from "./Categories"
import { CallToActionSection } from "./cta-section"
import { Footer } from "@/components/Footer"
import { Rightcard } from "./Right-Card"
import { HowItWorksSection } from "./Steps"
import { Navbar } from "./Navbar"
import { StatsSection } from "./stats-section"

export function LandingPage() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Header />
      <Navbar />
      <main>
        <Rightcard />
        <Categories />
        <HowItWorksSection />
        <StatsSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  )
}