"use client";

import { GroveProvider } from "@/lib/grove-context";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { BenefitsSection } from "@/components/benefits-section";
import { HowItRunsSection } from "@/components/how-it-runs-section";
import { ScarcitySection } from "@/components/scarcity-section";
import { EarnSection } from "@/components/earn-section";
import { TrustFaqSection } from "@/components/trust-faq-section";
import { FinalCTASection } from "@/components/final-cta-section";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { SignupSuccessModal } from "@/components/signup-success-modal";

function Divider() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="border-t border-dashed border-border-strong" />
    </div>
  );
}

export default function Home() {
  return (
    <GroveProvider>
      <SmoothScroll>
        <Navbar />
        <main>
          <HeroSection />
          <Divider />
          <FeaturesSection />
          <Divider />
          <BenefitsSection />
          <Divider />
          <HowItRunsSection />
          <Divider />
          <ScarcitySection />
          <Divider />
          <EarnSection />
          <Divider />
          <TrustFaqSection />
          <Divider />
          <FinalCTASection />
        </main>
        <Footer />
        <StickyCTA />
        <SignupSuccessModal />
      </SmoothScroll>
    </GroveProvider>
  );
}
