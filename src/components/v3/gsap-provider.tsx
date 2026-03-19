"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

interface GsapCtx {
  lenis: Lenis | null;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

const GsapContext = createContext<GsapCtx>({
  lenis: null,
  isMobile: false,
  prefersReducedMotion: false,
});

export const useGsap = () => useContext(GsapContext);

export function GsapProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mm = window.matchMedia("(max-width: 768px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsMobile(mm.matches);
    setPrefersReducedMotion(rm.matches);

    const onMm = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const onRm = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mm.addEventListener("change", onMm);
    rm.addEventListener("change", onRm);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      mm.removeEventListener("change", onMm);
      rm.removeEventListener("change", onRm);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <GsapContext.Provider
      value={{ lenis: lenisRef.current, isMobile, prefersReducedMotion }}
    >
      {children}
    </GsapContext.Provider>
  );
}
