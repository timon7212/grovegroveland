"use client";

import { useEffect, useState } from "react";

export function V3Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > lastY);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
      style={{
        background: scrolled ? "rgba(0,0,0,0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "none",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/v3" className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#00E87B] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-black" />
          </div>
          <span className="text-[14px] font-semibold text-white tracking-tight">grovegrove</span>
        </a>

        <div className="hidden sm:flex items-center gap-8">
          {["How it works", "Benefits", "FAQ"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="text-[13px] text-white/35 transition-colors hover:text-white/70"
            >
              {l}
            </a>
          ))}
        </div>

        <button
          onClick={() => document.getElementById("v3-hero")?.scrollIntoView({ behavior: "smooth" })}
          className="text-[13px] font-semibold px-5 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
        >
          Join Waitlist
        </button>
      </div>
    </nav>
  );
}
