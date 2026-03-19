"use client";

import { motion } from "framer-motion";
import { stagger, fadeUp, vp } from "@/lib/motion";

const rewards = [
  {
    label: "Priority Rank",
    value: "#1\u2014",
    desc: "Earlier position means stronger access when the network fully launches.",
    bg: [
      "radial-gradient(ellipse at 25% 75%, rgba(110, 231, 183, 0.35) 0%, transparent 50%)",
      "radial-gradient(ellipse at 75% 25%, rgba(167, 243, 208, 0.2) 0%, transparent 45%)",
      "#FAFAFA",
    ].join(", "),
  },
  {
    label: "Grove Points",
    value: "+2,400",
    unit: "pts",
    desc: "Accumulate points through uptime and network contribution.",
    bg: [
      "radial-gradient(ellipse at 30% 70%, rgba(147, 197, 253, 0.3) 0%, transparent 50%)",
      "radial-gradient(ellipse at 70% 20%, rgba(191, 219, 254, 0.2) 0%, transparent 45%)",
      "#FAFAFA",
    ].join(", "),
  },
  {
    label: "Referral Boost",
    value: "3x",
    desc: "Each quality invite multiplies your earning rate.",
    bg: [
      "radial-gradient(ellipse at 25% 75%, rgba(253, 224, 71, 0.25) 0%, transparent 50%)",
      "radial-gradient(ellipse at 75% 20%, rgba(254, 215, 170, 0.2) 0%, transparent 45%)",
      "#FAFAFA",
    ].join(", "),
  },
  {
    label: "Genesis Badge",
    value: "\uD83C\uDF3F",
    desc: "Permanent recognition as an early participant. Carries forward into future seasons.",
    bg: [
      "radial-gradient(ellipse at 20% 30%, rgba(196, 181, 253, 0.25) 0%, transparent 50%)",
      "radial-gradient(ellipse at 75% 70%, rgba(252, 231, 243, 0.2) 0%, transparent 45%)",
      "#FAFAFA",
    ].join(", "),
  },
];

export function EarnSection() {
  return (
    <section id="earn" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-[-0.02em] leading-tight">
            What early participants earn.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid sm:grid-cols-2 gap-5"
        >
          {rewards.map((r) => (
            <motion.div
              key={r.label}
              variants={fadeUp}
              className="rounded-[20px] p-7"
              style={{ background: r.bg }}
            >
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-tertiary font-mono">
                {r.label}
              </span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[36px] font-bold font-mono text-text-primary leading-none">
                  {r.value}
                </span>
                {r.unit && (
                  <span className="text-sm text-text-tertiary font-mono">
                    {r.unit}
                  </span>
                )}
              </div>
              <p className="mt-3 text-[14px] text-text-secondary leading-relaxed">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-[13px] text-text-tertiary mt-8 text-center"
        >
          No fake promises. Just real position in a real network.
        </motion.p>
      </div>
    </section>
  );
}
