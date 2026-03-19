"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { stagger, fadeUp, vp } from "@/lib/motion";

const faqs = [
  {
    q: "What is grovegrove?",
    a: "grovegrove is a decentralized network where you earn rewards by sharing unused internet bandwidth through a lightweight browser extension. The network collects publicly available web data for AI training \u2014 you share a resource you\u2019re not using, and get compensated for it.",
  },
  {
    q: "How does the extension work?",
    a: "After you receive your invite, you install a small browser extension. It runs in the background and routes a tiny fraction of your idle bandwidth to fetch public web content. It can\u2019t see your passwords, browsing history, or personal files. You won\u2019t notice any speed reduction.",
  },
  {
    q: "What can I earn?",
    a: "You accumulate Grove Points based on your uptime and network contribution. Earlier participants start with a stronger rank, which compounds over time. What you earn depends on your activity level and how the network grows.",
  },
  {
    q: "Is this safe to install?",
    a: "Yes. The extension only accesses publicly available web content. It has no ability to see your personal data. It uses a tiny fraction of idle bandwidth, so you won\u2019t experience any slowdown. You can pause or uninstall anytime with one click.",
  },
  {
    q: "Why only 500 spots?",
    a: "We cap early access to maintain quality and onboard participants gradually. Early participants get the strongest positions \u2014 better rank, priority access, and higher earning rates when the network fully launches.",
  },
  {
    q: "When will I get access after applying?",
    a: "We send invites with setup instructions via email. Earlier applicants get access first. Check your inbox (and spam folder) after applying.",
  },
  {
    q: "Do I need a crypto wallet?",
    a: "Not to apply. You only need an email. Wallet connection comes later when reward distribution begins.",
  },
];

export function TrustFaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[680px]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          className="text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] text-center mb-14"
        >
          FAQs
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="divide-y divide-border"
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span className="text-[15px] font-medium text-text-primary group-hover:text-accent transition-colors">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-text-tertiary" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-[14px] text-text-secondary leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
