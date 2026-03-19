"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    q: "What is grovegrove?",
    a: "A user-owned network for live web access. You contribute idle bandwidth through a lightweight browser extension and earn rewards based on your participation and position.",
  },
  {
    q: "Why is there a waitlist?",
    a: "Access opens in small batches to keep the network high-quality. Early participants get stronger positions and help shape the first phase of the network.",
  },
  {
    q: "Do I need a crypto wallet?",
    a: "No. You join with email only. Wallet connection can come later — it's completely optional at signup.",
  },
  {
    q: "Is this mining?",
    a: "No. The extension shares small amounts of unused bandwidth. It doesn't mine cryptocurrency, use your GPU, or affect your computer's performance.",
  },
  {
    q: "How do rewards work?",
    a: "Your position improves through early participation, uptime, and quality referrals. Additional mechanics unlock as the network grows and new seasons begin.",
  },
  {
    q: "Will it slow down my internet?",
    a: "No. The extension only uses bandwidth you're not using. You won't notice any difference in your browsing speed or quality.",
  },
  {
    q: "What data can the extension see?",
    a: "None of your personal data. The extension fetches public web content only. It has no access to your browsing history, passwords, or files.",
  },
  {
    q: "Why should I join now?",
    a: "Early rank is permanent. Once the 500 genesis spots are filled, the waitlist closes. Later joiners will never match the position advantage of early participants.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-white/[0.04] cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between py-6 gap-4">
        <h3 className="text-[16px] sm:text-[17px] font-medium text-white/80">{q}</h3>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-[20px] text-white/25 flex-shrink-0 leading-none"
        >
          +
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[14px] sm:text-[15px] text-white/35 leading-relaxed max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQV3() {
  return (
    <section className="bg-black py-24 md:py-40 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-[32px] sm:text-[40px] font-bold text-white tracking-[-0.03em] leading-tight text-center mb-16">
          Questions
        </h2>
        <div className="border-t border-white/[0.04]">
          {questions.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
