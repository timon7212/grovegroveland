"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGrove } from "@/lib/grove-context";
import { useGsap } from "./gsap-provider";

gsap.registerPlugin(ScrollTrigger);

export function ScarcityV3() {
  const { stats } = useGrove();
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useGsap();

  const pct = stats.total_spots > 0
    ? Math.round((stats.confirmed / stats.total_spots) * 100)
    : 0;

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: stats.remaining,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        onUpdate: () => {
          if (numberRef.current)
            numberRef.current.textContent = String(Math.round(counter.val));
        },
      });

      gsap.fromTo(
        barRef.current,
        { width: "0%" },
        {
          width: `${Math.max(pct, 2)}%`,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.to(pulseRef.current, {
        scale: 1.3,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power1.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, stats.remaining, pct]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-32 md:py-44 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          ref={pulseRef}
          className="w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,232,123,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-[36px] sm:text-[48px] md:text-[64px] font-bold text-white tracking-[-0.03em] leading-tight">
          <span className="text-[#00E87B]">
            <span ref={numberRef}>{stats.remaining}</span>
          </span>{" "}
          spots left.
        </h2>
        <p className="text-[18px] sm:text-[20px] text-white/30 mt-2 font-medium">
          Out of {stats.total_spots}. That&apos;s it.
        </p>

        <p className="mt-8 text-[16px] text-white/45 leading-relaxed max-w-md mx-auto">
          {stats.applied.toLocaleString()} people have applied. We confirm in small batches to maintain quality. Once spots fill up, the waitlist closes.
        </p>

        <div className="mt-12 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-white/25 font-mono">
              {stats.confirmed} confirmed
            </span>
            <span className="text-[12px] text-white/25 font-mono">
              {stats.remaining} remaining
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div
              ref={barRef}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #00E87B, #00D4FF)",
                width: "0%",
              }}
            />
          </div>
        </div>

        <button
          onClick={() => document.getElementById("v3-hero")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-12 px-10 py-4 rounded-full text-[15px] font-semibold bg-[#00E87B] text-black transition-all hover:brightness-110 hover:scale-[1.03] active:scale-[0.98]"
        >
          Apply Now
        </button>
      </div>
    </section>
  );
}
