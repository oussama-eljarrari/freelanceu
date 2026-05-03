import { CategoriesSection } from "./categories-section"
import { CallToActionSection } from "./cta-section"
import { Footer } from "./footer"
import { HeroSection } from "./hero-section"
import { HowItWorksSection } from "./how-it-works-section"
import { Navbar } from "./navbar"
import { StatsSection } from "./stats-section"

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <HowItWorksSection />
        <StatsSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  )
}