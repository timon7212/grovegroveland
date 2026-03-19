"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { heroStagger, heroItem } from "@/lib/motion";
import { WaitlistForm } from "./waitlist-form";
import { useGrove } from "@/lib/grove-context";

const WAVE_W = 4000;
const WAVE_H = 500;

const wavesConfig = [
  { baseY: 55, amplitude: 25, wavelength: 400, opacity: 0.10, dur: 38 },
  { baseY: 120, amplitude: 18, wavelength: 500, opacity: 0.06, dur: 52 },
  { baseY: 195, amplitude: 32, wavelength: 1000, opacity: 0.08, dur: 34 },
  { baseY: 260, amplitude: 14, wavelength: 250, opacity: 0.05, dur: 48 },
  { baseY: 330, amplitude: 22, wavelength: 500, opacity: 0.09, dur: 44 },
  { baseY: 395, amplitude: 20, wavelength: 400, opacity: 0.06, dur: 56 },
  { baseY: 460, amplitude: 28, wavelength: 1000, opacity: 0.04, dur: 30 },
];

function makePath(baseY: number, amp: number, wl: number): string {
  let d = `M0 ${baseY}`;
  for (let x = 0; x <= WAVE_W; x += 8) {
    d += `L${x} ${(baseY + Math.sin((x / wl) * Math.PI * 2) * amp).toFixed(1)}`;
  }
  return d;
}

function HeroWaves() {
  const paths = useMemo(
    () => wavesConfig.map((w) => ({ ...w, d: makePath(w.baseY, w.amplitude, w.wavelength) })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {paths.map((w, i) => (
        <svg
          key={i}
          className="absolute top-0 left-0"
          style={{ width: WAVE_W, height: "100%", animation: `wave-drift ${w.dur}s linear infinite` }}
          viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <path d={w.d} stroke="#D1D5DB" strokeWidth="1.5" opacity={w.opacity} />
        </svg>
      ))}
    </div>
  );
}

const ang = (i: number, n: number) => (i / n) * Math.PI * 2 - Math.PI / 2;
const pos = (a: number, r: number) => ({ cx: 60 + Math.cos(a) * r, cy: 60 + Math.sin(a) * r });

const outerNodes = Array.from({ length: 8 }, (_, i) => pos(ang(i, 8), 48));
const midNodes = Array.from({ length: 3 }, (_, i) => pos(ang(i, 3), 28));

function GroveIcon() {
  return (
    <motion.div variants={heroItem} className="relative w-[140px] h-[140px] mx-auto mb-10">
      <div
        className="absolute inset-[-10%] rounded-full"
        style={{ backgroundColor: "rgba(22,163,74,0.04)", animation: "grove-glow 5s ease-in-out infinite" }}
      />

      <svg viewBox="0 0 120 120" className="relative w-full h-full">
        <g style={{ transformOrigin: "60px 60px", animation: "grove-spin 35s linear infinite" }}>
          {outerNodes.map((n, i) => (
            <motion.circle
              key={`o${i}`}
              cx={n.cx}
              cy={n.cy}
              fill="#BBF7D0"
              initial={{ r: 2.5, opacity: 0.4 }}
              animate={{ r: [2.5, 3.8, 2.5], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
            />
          ))}
        </g>

        <g style={{ transformOrigin: "60px 60px", animation: "grove-spin-reverse 25s linear infinite" }}>
          {midNodes.map((n, i) => (
            <g key={`m${i}`}>
              <line x1="60" y1="60" x2={n.cx} y2={n.cy} stroke="#16A34A" strokeWidth="0.8" opacity="0.15" />
              <motion.circle
                cx={n.cx}
                cy={n.cy}
                fill="#86EFAC"
                initial={{ r: 5, opacity: 0.5 }}
                animate={{ r: [5, 7, 5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
              />
            </g>
          ))}
        </g>

        <motion.circle
          cx="60"
          cy="60"
          fill="#16A34A"
          initial={{ r: 14, opacity: 0.1 }}
          animate={{ r: [14, 17, 14], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="60" cy="60" r="11" fill="#16A34A" />
        <circle cx="60" cy="60" r="4.5" fill="white" />
      </svg>
    </motion.div>
  );
}

export function HeroSection() {
  const { stats } = useGrove();

  return (
    <section id="hero" className="relative pt-40 pb-20 md:pt-48 md:pb-28 px-6 overflow-hidden">
      <HeroWaves />

      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <GroveIcon />

        <motion.h1
          variants={heroItem}
          className="text-[36px] sm:text-[48px] md:text-[56px] font-bold tracking-[-0.025em] leading-[1.1]"
        >
          Earn from your
          <br />
          unused internet.
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mt-5 text-[16px] sm:text-[18px] text-text-secondary max-w-lg mx-auto leading-relaxed"
        >
          A lightweight browser extension that turns idle bandwidth into
          passive rewards.
        </motion.p>

        <motion.div variants={heroItem} className="mt-10 flex justify-center">
          <WaitlistForm />
        </motion.div>

        <motion.p
          variants={heroItem}
          className="mt-4 text-[13px] text-text-tertiary"
        >
          Free to join · No wallet needed · {stats.applied.toLocaleString()} applied · {stats.remaining} spots left
        </motion.p>
      </motion.div>
    </section>
  );
}
