"use client";

import { useRef, useEffect, useState, FormEvent, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useGrove } from "@/lib/grove-context";
import { useGsap } from "./gsap-provider";
import { ParticleNetwork } from "@/components/v2/particle-network";

gsap.registerPlugin(ScrollTrigger);

function HeroInner() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const microRef = useRef<HTMLParagraphElement>(null);
  const particleWrapRef = useRef<HTMLDivElement>(null);

  const { stats, signup, loading } = useGrove();
  const { isMobile, prefersReducedMotion } = useGsap();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ref = searchParams.get("ref") ?? undefined;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    const res = await signup({ email, source: "v3_hero", ref });
    if (!res.success) {
      setError(res.error === "already_applied" ? "You've already applied!" : "Something went wrong.");
    } else {
      setSubmitted(true);
    }
  }

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          pinSpacing: true,
        });

        gsap.to(particleWrapRef.current, {
          opacity: 0.9,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 1,
          },
        });
      }

      const headingLines = headingRef.current?.querySelectorAll(".hero-line");
      if (headingLines) {
        gsap.fromTo(
          headingLines,
          { opacity: 0, y: 60, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }

      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.6 }
      );

      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", delay: 0.8 }
      );

      gsap.fromTo(
        microRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 1.0 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="v3-hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      <div
        ref={particleWrapRef}
        className="absolute inset-0 z-0 opacity-30"
      >
        {!isMobile && !prefersReducedMotion && (
          <ParticleNetwork className="absolute inset-0" />
        )}
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none z-[1]"
        style={{ background: "radial-gradient(circle, rgba(0,232,123,0.06) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <div ref={badgeRef} className="opacity-0 inline-flex items-center gap-2 px-5 py-2 rounded-full mb-10"
          style={{ background: "rgba(0,232,123,0.08)", border: "1px solid rgba(0,232,123,0.2)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00E87B] animate-pulse" />
          <span className="text-[13px] font-medium text-[#00E87B]">
            Early Access — {stats.remaining} spots left
          </span>
        </div>

        <h1
          ref={headingRef}
          className="text-white font-bold tracking-[-0.03em] leading-[1.05]"
          style={{ perspective: "600px" }}
        >
          <span className="hero-line block text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] opacity-0">
            Earn from your
          </span>
          <span className="hero-line block text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] opacity-0">
            unused internet.
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="opacity-0 mt-6 text-[16px] sm:text-[18px] leading-relaxed max-w-lg text-white/50"
        >
          A lightweight browser extension that shares your idle bandwidth
          and turns it into passive rewards. No hardware required.
        </p>

        <div ref={formRef} className="opacity-0 mt-10 w-full max-w-md">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-2 p-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 bg-transparent text-white text-[15px] px-5 py-3 outline-none placeholder:text-white/25"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 px-7 py-3 rounded-full text-[14px] font-semibold bg-[#00E87B] text-black transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? "..." : "Join Waitlist"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-full"
                style={{ background: "rgba(0,232,123,0.1)", border: "1px solid rgba(0,232,123,0.2)" }}
              >
                <span className="text-[15px] font-medium text-[#00E87B]">
                  ✓ You&apos;re on the list
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {error && (
            <p className="mt-3 text-[13px] text-red-400 text-center">{error}</p>
          )}
        </div>

        <p
          ref={microRef}
          className="opacity-0 mt-5 text-[13px] text-white/25"
        >
          {stats.applied.toLocaleString()} applied · Free · No wallet required
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px z-[1]"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(0,232,123,0.3) 50%, transparent 95%)",
          boxShadow: "0 0 60px 15px rgba(0,232,123,0.08)",
        }}
      />
    </section>
  );
}

export function V3Hero() {
  return (
    <Suspense fallback={null}>
      <HeroInner />
    </Suspense>
  );
}
