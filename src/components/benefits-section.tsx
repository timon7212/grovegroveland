"use client";

import { motion } from "framer-motion";
import { stagger, fadeUp, vp } from "@/lib/motion";
import { Feather, ShieldCheck, Moon, Scale } from "lucide-react";

const benefits = [
  {
    icon: Feather,
    title: "Lightweight.",
    desc: "Runs silently in your browser. No hardware, no noise, no setup.",
    iconBg: "rgba(5, 150, 105, 0.07)",
    iconColor: "#059669",
  },
  {
    icon: ShieldCheck,
    title: "Private.",
    desc: "Can\u2019t access your personal data, passwords, or browsing history.",
    iconBg: "rgba(225, 29, 72, 0.06)",
    iconColor: "#E11D48",
  },
  {
    icon: Moon,
    title: "Passive.",
    desc: "Earn while you sleep, work, or do nothing at all.",
    iconBg: "rgba(217, 119, 6, 0.06)",
    iconColor: "#D97706",
  },
  {
    icon: Scale,
    title: "Fair.",
    desc: "Earlier participants get stronger positions and better rates.",
    iconBg: "rgba(14, 165, 233, 0.06)",
    iconColor: "#0EA5E9",
  },
];

export function BenefitsSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-[-0.02em] leading-tight">
            Share bandwidth.{" "}
            <span className="text-text-secondary italic font-normal">
              Get rewarded.
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid sm:grid-cols-2 gap-5"
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={fadeUp}
              className="flex items-start gap-5 rounded-[20px] border border-border/50 p-6 hover:shadow-sm transition-all"
            >
              <div
                className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: b.iconBg }}
              >
                <b.icon className="w-6 h-6" style={{ color: b.iconColor }} />
              </div>
              <div className="pt-1">
                <p className="text-[15px] text-text-primary leading-relaxed">
                  <span className="font-semibold">{b.title}</span> {b.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
