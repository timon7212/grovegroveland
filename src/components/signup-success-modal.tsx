"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, CheckCheck } from "lucide-react";
import { useGrove } from "@/lib/grove-context";

function Confetti() {
  const ps = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 280,
        y: (Math.random() - 0.5) * 220 - 80,
        r: Math.random() * 360,
        s: Math.random() * 0.5 + 0.5,
        c: ["#16A34A", "#059669", "#D97706", "#6366F1"][i % 4],
        d: Math.random() * 0.3,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {ps.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: p.s, opacity: 0, rotate: p.r }}
          transition={{ duration: 1, delay: p.d, ease: "easeOut" }}
          className="absolute left-1/2 top-1/3 w-2 h-2 rounded-full"
          style={{ backgroundColor: p.c }}
        />
      ))}
    </div>
  );
}

export function SignupSuccessModal() {
  const { showSuccess, closeSuccess, position, referralCode } = useGrove();
  const [animPos, setAnimPos] = useState(0);
  const [ready, setReady] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = referralCode ? `${siteUrl}/?ref=${referralCode}` : "";

  const copyLink = useCallback(async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [referralLink]);

  useEffect(() => {
    if (!showSuccess) { setReady(false); setConfetti(false); setCopied(false); return; }
    const t1 = setTimeout(() => { setReady(true); setConfetti(true); }, 300);
    const t2 = setTimeout(() => setConfetti(false), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [showSuccess]);

  useEffect(() => {
    if (!ready || !position) return;
    const start = Date.now();
    const run = () => {
      const p = Math.min((Date.now() - start) / 900, 1);
      setAnimPos(Math.floor((1 - Math.pow(1 - p, 3)) * position));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [ready, position]);

  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={closeSuccess}
        >
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[20px] bg-white border border-border shadow-xl overflow-hidden"
          >
            {confetti && <Confetti />}

            <button
              onClick={closeSuccess}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl hover:bg-bg-elevated transition-colors"
            >
              <X className="w-4 h-4 text-text-tertiary" />
            </button>

            <div className="relative p-8">
              <AnimatePresence mode="wait">
                {!ready ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-14"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(22,163,74,0.08)" }}
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(22,163,74,0.15)" }}>
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                    </motion.div>
                    <p className="mt-4 text-[14px] text-text-secondary">
                      Submitting your application...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 250, damping: 15 }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 mx-auto"
                      style={{ backgroundColor: "rgba(22,163,74,0.08)" }}
                    >
                      <Check className="w-5 h-5 text-accent" />
                    </motion.div>

                    <h2 className="text-[20px] font-bold text-center mb-1.5 tracking-[-0.01em]">
                      Application received!
                    </h2>
                    <p className="text-[14px] text-text-secondary text-center mb-5 leading-relaxed">
                      You&apos;re <strong className="text-text-primary">#{animPos}</strong> in the queue.
                      We&apos;ll review and notify you by email.
                    </p>

                    {referralLink && (
                      <div className="mb-5">
                        <p className="text-[12px] text-text-secondary mb-2 text-center font-medium">
                          Start inviting now to move up the queue:
                        </p>
                        <div
                          className="flex items-center gap-2 rounded-xl p-3"
                          style={{ backgroundColor: "rgba(22,163,74,0.04)", border: "1px solid rgba(22,163,74,0.12)" }}
                        >
                          <span className="flex-1 text-[12px] text-accent font-medium truncate">
                            {referralLink}
                          </span>
                          <button
                            onClick={copyLink}
                            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
                          >
                            {copied ? (
                              <CheckCheck className="w-4 h-4 text-accent" />
                            ) : (
                              <Copy className="w-4 h-4 text-accent/60" />
                            )}
                          </button>
                        </div>
                        {copied && (
                          <p className="text-[11px] text-accent text-center mt-1.5">Copied!</p>
                        )}
                      </div>
                    )}

                    <div
                      className="rounded-xl p-4 mb-4"
                      style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
                    >
                      <p className="text-[12px] text-amber-800 leading-relaxed text-center">
                        <strong>Pro tip:</strong> The more people join through your link, the higher your priority for early access. We also sent your referral link to your email.
                      </p>
                    </div>

                    <p className="text-[11px] text-text-tertiary text-center">
                      Check your inbox for full details and next steps.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
