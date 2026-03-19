"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "./gsap-provider";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Apply for early access",
    desc: "Enter your email. Takes 10 seconds. No wallet, no KYC, no complicated setup.",
    detail: "You'll get a confirmation email with your position in the queue and a personal referral link.",
  },
  {
    num: "02",
    title: "Get confirmed via email",
    desc: "We review applications and send access in small batches to keep the network high-quality.",
    detail: "Referrals move you up the queue. The more friends join through your link, the faster you get in.",
  },
  {
    num: "03",
    title: "Install extension & earn",
    desc: "One click install. Runs silently in the background. No hardware, no noise, no speed impact.",
    detail: "Points accumulate based on uptime and bandwidth contributed. Early joiners earn the strongest multipliers.",
  },
];

export function HowItWorksV3() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { isMobile, prefersReducedMotion } = useGsap();

  useEffect(() => {
    if (prefersReducedMotion || isMobile || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const stepEls = stepsContainerRef.current?.querySelectorAll(".hiw-step");
      if (!stepEls || stepEls.length === 0) return;

      const totalSteps = stepEls.length;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalSteps * 100}%`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(Math.floor(p * totalSteps), totalSteps - 1);

          stepEls.forEach((el, i) => {
            const step = el as HTMLElement;
            if (i === idx) {
              gsap.to(step, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
            } else if (i < idx) {
              gsap.to(step, { opacity: 0, y: -40, duration: 0.3, ease: "power2.in" });
            } else {
              gsap.to(step, { opacity: 0, y: 40, duration: 0.3, ease: "power2.in" });
            }
          });

          if (progressRef.current) {
            progressRef.current.style.width = `${((idx + 1) / totalSteps) * 100}%`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  if (isMobile) {
    return (
      <section className="bg-black py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[32px] sm:text-[40px] font-bold text-white tracking-[-0.03em] leading-tight text-center mb-16">
            How it works
          </h2>
          <div className="flex flex-col gap-8">
            {steps.map((s) => (
              <div key={s.num} className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[48px] font-bold text-[#00E87B]/15">{s.num}</span>
                <h3 className="text-[22px] font-semibold text-white mt-2 mb-3">{s.title}</h3>
                <p className="text-[15px] text-white/50 leading-relaxed">{s.desc}</p>
                <p className="text-[14px] text-white/30 leading-relaxed mt-3">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-black min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-bold text-white tracking-[-0.03em]">
          How it works
        </h2>
        <p className="mt-4 text-[16px] text-white/40">Three steps. Zero complexity.</p>
      </div>

      <div ref={stepsContainerRef} className="relative w-full max-w-2xl mx-auto px-6 min-h-[280px]">
        {steps.map((s, i) => (
          <div
            key={s.num}
            className="hiw-step absolute inset-0 flex flex-col items-center text-center px-4"
            style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? "none" : "translateY(40px)" }}
          >
            <span className="text-[96px] sm:text-[120px] font-bold text-[#00E87B]/10 leading-none">{s.num}</span>
            <h3 className="text-[28px] sm:text-[32px] font-bold text-white mt-[-10px] mb-4">{s.title}</h3>
            <p className="text-[16px] text-white/50 leading-relaxed max-w-md">{s.desc}</p>
            <p className="text-[14px] text-white/30 leading-relaxed mt-4 max-w-sm">{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-16 w-full max-w-xs mx-auto">
        <div className="h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            ref={progressRef}
            className="h-full rounded-full transition-all duration-300"
            style={{ background: "#00E87B", width: "33.3%" }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {steps.map((s) => (
            <span key={s.num} className="text-[11px] text-white/25 font-mono">{s.num}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
