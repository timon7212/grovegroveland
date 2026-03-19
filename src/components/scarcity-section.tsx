"use client";

import { motion } from "framer-motion";
import { fadeUp, vp } from "@/lib/motion";
import { useGrove } from "@/lib/grove-context";
import { AnimatedCounter } from "./animated-counter";

export function ScarcitySection() {
  const { stats } = useGrove();
  const pct = stats.total_spots > 0 ? Math.round((stats.confirmed / stats.total_spots) * 100) : 0;

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-[-0.02em] leading-tight">
            Early access is limited.
          </h2>
          <p className="mt-4 text-[16px] text-text-secondary max-w-lg mx-auto leading-relaxed">
            Only {stats.total_spots} spots available. {stats.applied.toLocaleString()} people have already applied —
            we confirm in small batches to keep the network high-quality.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid grid-cols-3 max-w-2xl mx-auto"
        >
          <div className="py-8">
            <div className="text-[40px] sm:text-[48px] font-bold font-mono text-text-primary leading-none">
              <AnimatedCounter target={stats.applied} duration={1.5} />
            </div>
            <p className="mt-3 text-[13px] text-text-secondary">
              Applications
            </p>
          </div>
          <div className="py-8 border-x border-border">
            <div className="text-[40px] sm:text-[48px] font-bold font-mono text-accent leading-none">
              <AnimatedCounter target={stats.remaining} duration={1.5} />
            </div>
            <p className="mt-3 text-[13px] text-text-secondary">Spots left</p>
          </div>
          <div className="py-8">
            <div className="text-[40px] sm:text-[48px] font-bold font-mono text-text-primary leading-none">
              {stats.total_spots}
            </div>
            <p className="mt-3 text-[13px] text-text-secondary">Total spots</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mt-8"
        >
          <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
            />
          </div>
          <p className="mt-2 text-[12px] text-text-tertiary">
            {stats.confirmed} of {stats.total_spots} confirmed
          </p>
        </motion.div>
      </div>
    </section>
  );
}
