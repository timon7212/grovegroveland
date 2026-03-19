"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", href: "#features" },
  { label: "Earn", href: "#earn" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleCTA = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 h-[72px]">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <span className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">
              grovegrove
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[14px] text-text-secondary hover:text-text-primary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <motion.button
              onClick={handleCTA}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-full bg-accent text-white text-[14px] font-medium"
            >
              Get Early Access
            </motion.button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-border md:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[15px] text-text-secondary hover:text-text-primary py-1"
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={handleCTA}
                className="mt-2 w-full py-3 rounded-full bg-accent text-white text-[15px] font-medium"
              >
                Get Early Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
