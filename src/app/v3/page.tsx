"use client";

import { GroveProvider } from "@/lib/grove-context";
import { GsapProvider } from "@/components/v3/gsap-provider";
import { V3Loader } from "@/components/v3/loader";
import { V3Navbar } from "@/components/v3/v3-navbar";
import { V3Hero } from "@/components/v3/hero";
import { ProofStrip } from "@/components/v3/proof-strip";
import { WhatIs } from "@/components/v3/what-is";
import { HowItWorksV3 } from "@/components/v3/how-it-works";
import { BenefitsV3 } from "@/components/v3/benefits";
import { ScarcityV3 } from "@/components/v3/scarcity";
import { TrustSection } from "@/components/v3/trust-section";
import { FAQV3 } from "@/components/v3/faq";
import { FinalCTAV3 } from "@/components/v3/final-cta";
import { V3Footer } from "@/components/v3/footer";

export default function V3Page() {
  return (
    <GroveProvider>
      <GsapProvider>
        <V3Loader />
        <div id="v3-smooth-wrapper">
          <V3Navbar />
          <main>
            <V3Hero />
            <ProofStrip />
            <WhatIs />
            <HowItWorksV3 />
            <BenefitsV3 />
            <ScarcityV3 />
            <TrustSection />
            <FAQV3 />
            <FinalCTAV3 />
          </main>
          <V3Footer />
        </div>
      </GsapProvider>
    </GroveProvider>
  );
}
