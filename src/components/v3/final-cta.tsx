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

function FinalCTAInner() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
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
    const res = await signup({ email, source: "v3_final", ref });
    if (!res.success) {
      setError(res.error === "already_applied" ? "You've already applied!" : "Something went wrong.");
    } else {
      setSubmitted(true);
    }
  }

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {!isMobile && !prefersReducedMotion && (
        <div className="absolute inset-0 z-0 opacity-20">
          <ParticleNetwork className="absolute inset-0" />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none z-[1] flex items-center justify-center">
        <div
          className="w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,232,123,0.08) 0%, transparent 60%)" }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2
          ref={headingRef}
          className="opacity-0 text-[36px] sm:text-[48px] md:text-[64px] font-bold text-white tracking-[-0.03em] leading-tight"
        >
          Don&apos;t miss your spot
          <br />
          <span className="text-[#00E87B]">in the Grove.</span>
        </h2>

        <p className="mt-6 text-[16px] text-white/40 leading-relaxed max-w-md mx-auto">
          {stats.remaining} spots remaining out of {stats.total_spots}. Apply now, get your referral link, and start inviting.
        </p>

        <div className="mt-10 w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-2 p-2 rounded-full"
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
                  className="flex-1 bg-transparent text-white text-[15px] px-5 py-3.5 outline-none placeholder:text-white/25"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 px-8 py-3.5 rounded-full text-[14px] font-semibold bg-[#00E87B] text-black transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? "..." : "Apply Now"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-full"
                style={{ background: "rgba(0,232,123,0.1)", border: "1px solid rgba(0,232,123,0.2)" }}
              >
                <span className="text-[15px] font-medium text-[#00E87B]">
                  ✓ You&apos;re on the list!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {error && (
            <p className="mt-3 text-[13px] text-red-400 text-center">{error}</p>
          )}
        </div>

        <p className="mt-5 text-[13px] text-white/20">
          Free · 10 seconds · No wallet required
        </p>
      </div>
    </section>
  );
}

export function FinalCTAV3() {
  return (
    <Suspense fallback={null}>
      <FinalCTAInner />
    </Suspense>
  );
}
