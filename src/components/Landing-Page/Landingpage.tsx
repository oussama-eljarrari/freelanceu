import { Categories } from "./Categories"
import { CallToActionSection } from "./cta-section"

import { Rightcard } from "./Right-Card"
import { HowItWorksSection } from "./Steps"

import { StatsSection } from "./stats-section"

export function LandingPage() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <main>
        <Rightcard />
        <Categories />
        <HowItWorksSection />
        <StatsSection />
        <CallToActionSection />
      </main>
    </div>
  )
}