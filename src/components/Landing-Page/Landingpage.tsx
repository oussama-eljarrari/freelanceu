import { Categories} from "./Categories"
import { CallToActionSection } from "./cta-section"
import { Footer } from "./Footer"
import { Rightcard } from "./Right-Card"
import { HowItWorksSection } from "./Steps"
import { Navbar } from "./Navbar"
import { StatsSection } from "./stats-section"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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