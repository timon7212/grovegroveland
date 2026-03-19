"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "./gsap-provider";

gsap.registerPlugin(ScrollTrigger);

const benefitCards = [
  {
    title: "Early Rank",
    desc: "The earlier you join, the stronger your starting position in the network. Early rank is permanent — latecomers can never overtake your genesis advantage.",
    accent: "#00E87B",
    large: true,
  },
  {
    title: "Grove Points",
    desc: "Accumulate points based on uptime, bandwidth shared, and network contribution. More uptime = more points.",
    accent: "#00D4FF",
    large: false,
  },
  {
    title: "Referral Multipliers",
    desc: "Every quality referral multiplies your earning rate. Build a squad and climb the leaderboard together.",
    accent: "#A78BFA",
    large: false,
  },
  {
    title: "Season Eligibility",
    desc: "Early participants are eligible for exclusive seasonal reward distributions. Genesis season is the most generous.",
    accent: "#F59E0B",
    large: false,
  },
];

export function BenefitsV3() {
  const sectionRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useGsap();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cardEls = sectionRef.current?.querySelectorAll(".benefit-card");
      if (cardEls) {
        cardEls.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
              },
              delay: i * 0.1,
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="bg-black py-24 md:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] sm:text-[40px] md:text-[52px] font-bold text-white tracking-[-0.03em] leading-tight">
            What early participants{" "}
            <span className="text-[#00E87B]">earn</span>
          </h2>
          <p className="mt-4 text-[16px] text-white/40 max-w-lg mx-auto leading-relaxed">
            Your position is shaped by when you join, how active you are, and how much quality growth you bring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefitCards.map((c) => (
            <div
              key={c.title}
              className={`benefit-card group relative overflow-hidden rounded-2xl p-8 sm:p-10 transition-all duration-300 ${
                c.large ? "md:col-span-2" : ""
              }`}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${c.accent}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: c.accent }}
              />
              <div className="relative">
                <div
                  className="text-[28px] sm:text-[32px] font-bold mb-3"
                  style={{ color: c.accent }}
                >
                  {c.title}
                </div>
                <p className={`text-[15px] leading-relaxed text-white/45 ${c.large ? "max-w-xl" : ""}`}>
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[13px] text-white/20">
          No fake promises. No instant riches. Just early access to a network that gets more valuable as it grows.
        </p>
      </div>
    </section>
  );
}
