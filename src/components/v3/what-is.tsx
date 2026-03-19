"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "./gsap-provider";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    num: "01",
    title: "A browser extension",
    desc: "Lightweight. Installs in seconds. Runs silently in the background while you browse normally.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="8" width="32" height="24" rx="4" stroke="#00E87B" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="4" stroke="#00E87B" strokeWidth="1.5" />
        <path d="M20 8V12" stroke="#00E87B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Shares unused bandwidth",
    desc: "Only uses the bandwidth you're not using. No impact on your speed, no access to your personal data.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M8 28C8 28 14 12 20 12C26 12 32 28 32 28" stroke="#00E87B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="12" r="3" stroke="#00E87B" strokeWidth="1.5" />
        <path d="M12 24L20 20L28 24" stroke="#00E87B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "You earn rewards",
    desc: "Points accumulate based on uptime and contribution. Early participants earn stronger positions and multipliers.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 8L24.5 16.5L34 18L27 24.5L28.5 34L20 29.5L11.5 34L13 24.5L6 18L15.5 16.5L20 8Z" stroke="#00E87B" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function WhatIs() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGsap();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cardEls = cardsRef.current?.querySelectorAll(".what-card");
      if (cardEls) {
        cardEls.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay: i * 0.05,
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-24 md:py-40 px-6"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
        <div className="lg:col-span-2 lg:sticky lg:top-32 lg:self-start">
          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-white tracking-[-0.03em] leading-tight">
            What is
            <br />
            <span className="text-[#00E87B]">grovegrove</span>?
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-white/50 max-w-sm">
            A user-owned network for live web access. You contribute idle bandwidth through a browser extension — and get rewarded for it.
          </p>
        </div>

        <div ref={cardsRef} className="lg:col-span-3 flex flex-col gap-6">
          {cards.map((c) => (
            <div
              key={c.num}
              className="what-card group relative rounded-2xl p-8 sm:p-10 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,232,123,0.2)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(0,232,123,0.08)" }}
                >
                  {c.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[12px] font-mono text-[#00E87B]/50">{c.num}</span>
                    <h3 className="text-[20px] sm:text-[22px] font-semibold text-white">{c.title}</h3>
                  </div>
                  <p className="text-[15px] leading-relaxed text-white/45">{c.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
