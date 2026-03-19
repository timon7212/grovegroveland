"use client";

import { useGrove } from "@/lib/grove-context";

export function ProofStrip() {
  const { stats } = useGrove();

  const items = [
    `${stats.applied.toLocaleString()} applied`,
    `${stats.total_spots} spots`,
    "47 countries",
    "Early Access Phase",
    "Free to join",
    "No wallet required",
    "Browser extension",
    "Passive rewards",
  ];

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="relative z-20 bg-[#00E87B] overflow-hidden select-none">
      <div className="v3-marquee flex whitespace-nowrap py-4">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-[13px] sm:text-[14px] font-semibold text-black uppercase tracking-[0.05em] mx-6 sm:mx-8 shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black/30 mr-4" />
            {item}
          </span>
        ))}
      </div>

      <style jsx>{`
        .v3-marquee {
          animation: v3-marquee-scroll 40s linear infinite;
        }
        .v3-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes v3-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
