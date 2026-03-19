"use client";

export function V3Footer() {
  return (
    <footer className="bg-black px-6 py-12 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#00E87B] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
            </div>
            <span className="text-[13px] font-medium text-white/40">grovegrove</span>
          </div>

          <div className="flex items-center gap-6">
            {["How it works", "Benefits", "FAQ"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="text-[12px] text-white/25 hover:text-white/50 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5">
            {["X", "Telegram", "Discord"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-[12px] text-white/25 hover:text-white/50 transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/15">
            &copy; {new Date().getFullYear()} grovegrove. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-[11px] text-white/15 hover:text-white/30 transition-colors">Privacy</a>
            <a href="#" className="text-[11px] text-white/15 hover:text-white/30 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
