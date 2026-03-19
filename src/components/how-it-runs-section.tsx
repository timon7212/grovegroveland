"use client";

import { motion } from "framer-motion";
import { stagger, fadeUp, vp } from "@/lib/motion";
import { Wifi, Shield, Globe, Gauge, Moon, ToggleRight } from "lucide-react";

const items = [
  {
    icon: Wifi,
    title: "Idle bandwidth only.",
    desc: "Uses a tiny fraction of what you\u2019re not using.",
  },
  {
    icon: Shield,
    title: "Zero data access.",
    desc: "No passwords, no history, no personal files.",
  },
  {
    icon: Globe,
    title: "Public web content.",
    desc: "Collects publicly available data for AI training.",
  },
  {
    icon: Gauge,
    title: "No speed impact.",
    desc: "You won\u2019t notice it running. Zero lag.",
  },
  {
    icon: Moon,
    title: "Background process.",
    desc: "Earning while you browse, sleep, or do nothing.",
  },
  {
    icon: ToggleRight,
    title: "Uninstall anytime.",
    desc: "One click to pause or remove. No lock-in.",
    highlight: true,
  },
];

export function HowItRunsSection() {
  return (
    <section id="how-it-runs" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-[-0.02em] leading-tight">
            What runs on your device.{" "}
            <span className="text-text-secondary italic font-normal">
              Safe and invisible.
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid sm:grid-cols-2 gap-x-14 gap-y-9"
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className={`flex items-start gap-4 ${
                item.highlight
                  ? "rounded-2xl p-5 -m-5"
                  : ""
              }`}
              style={
                item.highlight
                  ? {
                      background:
                        "radial-gradient(ellipse at 50% 50%, rgba(253, 224, 71, 0.12) 0%, transparent 70%), #FAFAFA",
                    }
                  : undefined
              }
            >
              <item.icon className="w-[18px] h-[18px] text-text-tertiary flex-shrink-0 mt-0.5" />
              <p className="text-[15px] text-text-primary leading-relaxed">
                <span className="font-semibold">{item.title}</span>{" "}
                <span className="text-text-secondary">{item.desc}</span>
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
