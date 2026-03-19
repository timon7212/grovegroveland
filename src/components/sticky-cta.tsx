"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGrove } from "@/lib/grove-context";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const { stats } = useGrove();

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight;
      const finalCTA = document.getElementById("final-cta");
      const beforeFinal =
        (finalCTA?.getBoundingClientRect().top ?? Infinity) >
        window.innerHeight * 0.5;
      setVisible(pastHero && beforeFinal);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 inset-x-4 z-50 flex justify-center"
        >
          <div className="flex items-center gap-4 px-5 py-3 rounded-full bg-white/90 backdrop-blur-xl border border-border shadow-lg">
            <span className="text-[13px] text-text-secondary">
              <span className="font-mono text-text-primary font-medium">
                {stats.remaining}
              </span>
              /{stats.total_spots} spots · {stats.applied.toLocaleString()} applied
            </span>
            <motion.button
              onClick={() =>
                document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-4 py-2 rounded-full bg-accent text-white text-[13px] font-medium"
            >
              Apply Now
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
