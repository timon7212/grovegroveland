"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export function V3Loader() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const skip = sessionStorage.getItem("v3_loaded");
    if (skip) {
      setDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("v3_loaded", "1");
          setDone(true);
        },
      });

      tl.fromTo(
        wordmarkRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );

      tl.fromTo(
        iconRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)" },
        0.3
      );

      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current)
              counterRef.current.textContent = Math.round(counter.val) + "%";
          },
        },
        0.4
      );

      tl.to(
        ".v3-loader-icon-ring",
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
        },
        0.4
      );

      tl.to(wrapRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.8,
        ease: "power3.inOut",
        delay: 0.3,
      });
    });

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      style={{ clipPath: "circle(150% at 50% 50%)" }}
    >
      <div ref={wordmarkRef} className="opacity-0 mb-8">
        <span className="text-[14px] font-medium tracking-[0.2em] uppercase text-white/40">
          grovegrove
        </span>
      </div>

      <svg
        ref={iconRef}
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        className="mb-8"
      >
        <circle
          className="v3-loader-icon-ring"
          cx="40"
          cy="40"
          r="36"
          stroke="#00E87B"
          strokeWidth="2"
          strokeDasharray="226"
          strokeDashoffset="226"
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
        <circle cx="40" cy="40" r="4" fill="#00E87B" />
        <circle cx="40" cy="24" r="2.5" fill="#00E87B" opacity="0.6" />
        <circle cx="54" cy="32" r="2" fill="#00E87B" opacity="0.4" />
        <circle cx="54" cy="48" r="2.5" fill="#00E87B" opacity="0.5" />
        <circle cx="40" cy="56" r="2" fill="#00E87B" opacity="0.3" />
        <circle cx="26" cy="48" r="2.5" fill="#00E87B" opacity="0.5" />
        <circle cx="26" cy="32" r="2" fill="#00E87B" opacity="0.4" />
        <line x1="40" y1="36" x2="40" y2="26.5" stroke="#00E87B" strokeWidth="1" opacity="0.3" />
        <line x1="43.5" y1="38" x2="52" y2="33" stroke="#00E87B" strokeWidth="1" opacity="0.3" />
        <line x1="43.5" y1="42" x2="52" y2="47" stroke="#00E87B" strokeWidth="1" opacity="0.3" />
        <line x1="40" y1="44" x2="40" y2="54" stroke="#00E87B" strokeWidth="1" opacity="0.3" />
        <line x1="36.5" y1="42" x2="28" y2="47" stroke="#00E87B" strokeWidth="1" opacity="0.3" />
        <line x1="36.5" y1="38" x2="28" y2="33" stroke="#00E87B" strokeWidth="1" opacity="0.3" />
      </svg>

      <span
        ref={counterRef}
        className="text-[48px] font-bold tracking-tight text-white tabular-nums"
      >
        0%
      </span>
    </div>
  );
}
