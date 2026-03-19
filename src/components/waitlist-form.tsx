"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGrove } from "@/lib/grove-context";

const sources = [
  { value: "twitter", label: "Twitter / X" },
  { value: "telegram", label: "Telegram" },
  { value: "friend", label: "A friend" },
  { value: "other", label: "Other" },
];

export function WaitlistForm({ className }: { className?: string }) {
  return (
    <Suspense>
      <WaitlistFormInner className={className} />
    </Suspense>
  );
}

function WaitlistFormInner({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [source, setSource] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const { signup, loading } = useGrove();
  const searchParams = useSearchParams();

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = validEmail && source && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validEmail) { setError("Enter a valid email"); return; }
    if (!source) { setError("Select how you found us"); return; }
    setError("");

    const ref = searchParams.get("ref") || undefined;
    const result = await signup({
      email,
      twitter: twitter || undefined,
      telegram: telegram || undefined,
      source,
      ref,
    });

    if (!result.success) {
      const messages: Record<string, string> = {
        already_applied: "This email has already been submitted. Check your inbox for your referral link.",
        rate_limited: "Too many attempts. Please try again later.",
        invalid_email: "Enter a valid email address",
      };
      setError(messages[result.error || ""] || "Something went wrong. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-md space-y-3", className)}>
      <div
        className={cn(
          "flex items-center rounded-full border transition-all duration-200 bg-white",
          focused ? "border-accent/40 shadow-[0_0_0_3px_rgba(22,163,74,0.06)]" : "border-border",
          error && "border-red-400",
        )}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter your email *"
          disabled={loading}
          className="flex-1 bg-transparent text-text-primary placeholder:text-text-tertiary outline-none text-[15px] pl-5 pr-2 py-3.5"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          placeholder="@twitter (optional)"
          disabled={loading}
          className="rounded-full border border-border bg-white text-text-primary placeholder:text-text-tertiary outline-none text-[14px] px-4 py-2.5 focus:border-accent/40 transition-colors"
        />
        <input
          type="text"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          placeholder="Telegram (optional)"
          disabled={loading}
          className="rounded-full border border-border bg-white text-text-primary placeholder:text-text-tertiary outline-none text-[14px] px-4 py-2.5 focus:border-accent/40 transition-colors"
        />
      </div>

      <select
        value={source}
        onChange={(e) => { setSource(e.target.value); setError(""); }}
        disabled={loading}
        className={cn(
          "w-full rounded-full border border-border bg-white outline-none text-[14px] px-4 py-2.5 focus:border-accent/40 transition-colors appearance-none",
          source ? "text-text-primary" : "text-text-tertiary",
        )}
      >
        <option value="" disabled>How did you find us? *</option>
        {sources.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <motion.button
        type="submit"
        disabled={!canSubmit}
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-full font-medium py-3 text-[14px] transition-colors",
          canSubmit ? "bg-accent text-white" : "bg-bg-elevated text-text-tertiary",
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
        {loading ? "Applying..." : "Apply for Early Access"}
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-[12px] text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
