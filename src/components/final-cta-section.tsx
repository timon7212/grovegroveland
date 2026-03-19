"use client";

import { motion } from "framer-motion";
import { heroStagger, heroItem, vp } from "@/lib/motion";
import { WaitlistForm } from "./waitlist-form";
import { useGrove } from "@/lib/grove-context";

export function FinalCTASection() {
  const { stats } = useGrove();

  return (
    <section id="final-cta" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div
          className="relative rounded-[24px] overflow-hidden"
          style={{
            background: [
              "radial-gradient(ellipse at 30% 80%, rgba(110, 231, 183, 0.25) 0%, transparent 50%)",
              "radial-gradient(ellipse at 70% 20%, rgba(167, 243, 208, 0.2) 0%, transparent 45%)",
              "radial-gradient(ellipse at 50% 50%, rgba(236, 253, 245, 0.4) 0%, transparent 65%)",
              "#FAFAFA",
            ].join(", "),
          }}
        >
          <motion.div
            variants={heroStagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="relative px-8 py-20 sm:px-12 sm:py-24 text-center"
          >
            <motion.h2
              variants={heroItem}
              className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-[-0.02em] mb-4 leading-tight"
            >
              Stay updated.{" "}
              <span className="text-text-secondary italic font-normal">
                Don&apos;t miss your spot.
              </span>
            </motion.h2>

            <motion.p
              variants={heroItem}
              className="text-[15px] text-text-secondary max-w-md mx-auto mb-10 leading-relaxed"
            >
              {stats.applied.toLocaleString()} people applied, only {stats.remaining} of {stats.total_spots} spots left.
              Apply now — we&apos;ll send your invite with everything you need.
            </motion.p>

            <motion.div variants={heroItem} className="flex justify-center">
              <WaitlistForm />
            </motion.div>

            <motion.p
              variants={heroItem}
              className="mt-4 text-[13px] text-text-tertiary"
            >
              Free · No wallet · 10 seconds
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
