"use client";

import { motion } from "framer-motion";
import { staggerSlow, fadeUp, vp } from "@/lib/motion";
import { Zap, Globe, TrendingUp, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Passive Earning",
    desc: "Install the extension and earn in the background. No active work needed.",
    link: { label: "Learn more", href: "#how-it-runs" },
    iconColor: "#059669",
    iconBg: "rgba(5, 150, 105, 0.07)",
    bg: [
      "radial-gradient(ellipse at 20% 80%, rgba(110, 231, 183, 0.4) 0%, transparent 50%)",
      "radial-gradient(ellipse at 80% 20%, rgba(167, 243, 208, 0.3) 0%, transparent 45%)",
      "radial-gradient(ellipse at 50% 50%, rgba(236, 253, 245, 0.5) 0%, transparent 65%)",
      "#FAFAFA",
    ].join(", "),
  },
  {
    icon: Globe,
    title: "Bandwidth Sharing",
    desc: "Share a tiny fraction of your idle internet to power AI data collection.",
    link: { label: "How it works", href: "#how-it-runs" },
    iconColor: "#92400E",
    iconBg: "rgba(146, 64, 14, 0.06)",
    bg: [
      "radial-gradient(ellipse at 30% 70%, rgba(253, 224, 71, 0.22) 0%, transparent 50%)",
      "radial-gradient(ellipse at 70% 20%, rgba(254, 215, 170, 0.25) 0%, transparent 45%)",
      "radial-gradient(ellipse at 50% 50%, rgba(255, 251, 235, 0.5) 0%, transparent 65%)",
      "#FAFAFA",
    ].join(", "),
  },
  {
    icon: TrendingUp,
    title: "Early Advantage",
    desc: "First 500 participants get the strongest position and highest earning rates.",
    link: { label: "See rewards", href: "#earn" },
    iconColor: "#6D28D9",
    iconBg: "rgba(109, 40, 217, 0.06)",
    bg: [
      "radial-gradient(ellipse at 20% 30%, rgba(196, 181, 253, 0.3) 0%, transparent 50%)",
      "radial-gradient(ellipse at 75% 70%, rgba(249, 168, 212, 0.25) 0%, transparent 45%)",
      "radial-gradient(ellipse at 50% 50%, rgba(245, 243, 255, 0.5) 0%, transparent 65%)",
      "#FAFAFA",
    ].join(", "),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.5 }}
          className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-[-0.02em] text-center mb-16 leading-tight"
        >
          All-in-One grovegrove
        </motion.h2>

        <motion.div
          variants={staggerSlow}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid md:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="group rounded-[20px] p-8 pb-7 text-center transition-shadow hover:shadow-lg"
              style={{ background: f.bg }}
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: f.iconBg }}
              >
                <f.icon className="w-6 h-6" style={{ color: f.iconColor }} />
              </div>

              <h3 className="text-[17px] font-semibold text-text-primary mb-2 tracking-[-0.01em]">
                {f.title}
              </h3>

              <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
                {f.desc}
              </p>

              <a
                href={f.link.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 text-[13px] font-medium text-text-primary hover:border-border-strong hover:bg-white/80 transition-all"
              >
                <span>{f.link.label}</span>
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(44, 45, 48, 0.08)" }}
                >
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </span>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
