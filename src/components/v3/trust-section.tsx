"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "./gsap-provider";

gsap.registerPlugin(ScrollTrigger);

const facts = [
  {
    title: "Lightweight extension",
    desc: "Installs in one click. Runs in the background of your browser. Uses less than 0.1% CPU.",
  },
  {
    title: "Only uses idle bandwidth",
    desc: "Fetches public web data using bandwidth you're not using. No impact on your browsing speed or quality.",
  },
  {
    title: "Can't see your personal data",
    desc: "The extension has no access to your browsing history, passwords, files, or any private information.",
  },
];

const notItems = [
  "Not cryptocurrency mining",
  "Not a hardware device",
  "Not a VPN or proxy",
  "Not a scam funnel",
];

export function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useGsap();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const rows = sectionRef.current?.querySelectorAll(".trust-row");
      rows?.forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
            },
            delay: i * 0.08,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="bg-black py-24 md:py-40 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-white tracking-[-0.03em] leading-tight text-center mb-16">
          How it actually runs
        </h2>

        <div className="flex flex-col">
          {facts.map((f, i) => (
            <div
              key={f.title}
              className="trust-row py-8 border-b border-white/[0.04]"
              style={i === 0 ? { borderTop: "1px solid rgba(255,255,255,0.04)" } : {}}
            >
              <h3 className="text-[20px] sm:text-[22px] font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-[15px] text-white/40 leading-relaxed max-w-lg">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="trust-row mt-16 rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <h3 className="text-[16px] font-semibold text-white/60 mb-5 uppercase tracking-[0.1em]">
            What this isn&apos;t
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {notItems.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] border border-white/10 text-white/30">✕</span>
                <span className="text-[14px] text-white/35">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
