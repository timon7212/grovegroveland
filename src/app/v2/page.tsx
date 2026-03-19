"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { GroveProvider, useGrove } from "@/lib/grove-context";
import {
  heroStagger,
  heroItem,
  fadeUp,
  stagger,
  staggerSlow,
  vp,
} from "@/lib/motion";
import { ParticleNetwork } from "@/components/v2/particle-network";
import { DotWave } from "@/components/v2/dot-wave";
import { AuroraBlobs } from "@/components/v2/aurora-blobs";
import { GridPulse } from "@/components/v2/grid-pulse";
import { FlowingLines } from "@/components/v2/flowing-lines";

/* ── Design Tokens ─────────────────────────────────────── */

const T = {
  bg: "#000000",
  card: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.08)",
  cardHover: "rgba(255,255,255,0.15)",
  text: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.5)",
  textTertiary: "rgba(255,255,255,0.3)",
  accent: "#00E87B",
  accentGlow: "rgba(0,232,123,0.15)",
  radius: "16px",
} as const;

/* ── Shared animation variants ─────────────────────────── */

const sectionFade = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardHover = {
  rest: { borderColor: T.cardBorder },
  hover: { borderColor: T.cardHover, transition: { duration: 0.25 } },
};

/* ── V2Navbar ──────────────────────────────────────────── */

function V2Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
      style={{
        background: scrolled ? "rgba(0,0,0,0.6)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled
          ? `1px solid ${T.cardBorder}`
          : "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
      }}
    >
      <a href="/v2" className="flex items-center gap-2.5 select-none">
        <div
          className="w-7 h-7 rounded-full"
          style={{ background: T.accent }}
        />
        <span className="text-[15px] font-semibold tracking-tight text-white">
          grovegrove
        </span>
      </a>

      <div className="hidden md:flex items-center gap-8">
        {["Features", "Earn", "FAQ"].map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            className="text-[14px] transition-colors duration-200"
            style={{ color: T.textSecondary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = T.text)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = T.textSecondary)
            }
          >
            {l}
          </a>
        ))}
      </div>

      <a
        href="#waitlist"
        className="text-[13px] font-semibold px-5 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors duration-200"
      >
        Join Waitlist
      </a>
    </motion.nav>
  );
}

/* ── V2Hero ────────────────────────────────────────────── */

function HeroInner() {
  const { stats, signup, loading } = useGrove();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const ref = searchParams.get("ref") ?? undefined;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    const res = await signup({ email, source: "v2_hero", ref });
    if (!res.success) {
      setError(
        res.error === "already_applied"
          ? "You've already applied!"
          : "Something went wrong. Try again.",
      );
    } else {
      setSubmitted(true);
    }
  }

  return (
    <section
      id="waitlist"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: T.bg }}
    >
      {/* Particle Network Background */}
      <ParticleNetwork className="absolute inset-0 z-0" />

      {/* Light ray 1 */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[900px] pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,232,123,0.1) 0%, transparent 70%)",
          transform: "rotate(-15deg) skewX(-10deg)",
          transformOrigin: "top center",
          filter: "blur(60px)",
        }}
      />
      {/* Light ray 2 */}
      <div
        className="absolute top-0 right-1/3 w-[400px] h-[800px] pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,200,160,0.08) 0%, transparent 60%)",
          transform: "rotate(12deg) skewX(8deg)",
          transformOrigin: "top center",
          filter: "blur(80px)",
        }}
      />
      {/* Light ray 3 */}
      <div
        className="absolute top-[-100px] left-[55%] w-[300px] h-[700px] pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,232,123,0.06) 0%, transparent 50%)",
          transform: "rotate(25deg)",
          filter: "blur(50px)",
        }}
      />
      {/* Top center glow */}
      <div
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(circle, rgba(0,232,123,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Floor glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-[1]"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${T.accent}33 30%, ${T.accent}66 50%, ${T.accent}33 70%, transparent 95%)`,
          boxShadow: `0 0 80px 20px ${T.accentGlow}`,
        }}
      />

      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          variants={heroItem}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{
            background: T.accentGlow,
            border: `1px solid rgba(0,232,123,0.25)`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00E87B] animate-pulse" />
          <span className="text-[13px] font-medium" style={{ color: T.accent }}>
            Early access · {stats.remaining} spots left
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={heroItem}
          className="text-[48px] sm:text-[64px] md:text-[72px] font-bold leading-[1.05] tracking-tight text-white"
        >
          Earn from your
          <br />
          unused internet.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={heroItem}
          className="mt-6 text-[18px] leading-relaxed max-w-lg"
          style={{ color: T.textSecondary }}
        >
          A lightweight browser extension that shares your idle bandwidth and
          turns it into passive rewards. No hardware required.
        </motion.p>

        {/* Waitlist Form */}
        <motion.div variants={heroItem} className="mt-10 w-full max-w-md">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-2 p-1.5 rounded-full"
                style={{
                  background: T.card,
                  border: `1px solid ${T.cardBorder}`,
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 bg-transparent text-white text-[15px] px-5 py-3 outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 px-6 py-3 rounded-full text-[14px] font-semibold transition-opacity duration-200 disabled:opacity-50"
                  style={{ background: T.accent, color: "#000" }}
                >
                  {loading ? "Applying…" : "Join Waitlist"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-full"
                style={{
                  background: T.accentGlow,
                  border: `1px solid rgba(0,232,123,0.25)`,
                }}
              >
                <span className="text-[15px] font-medium" style={{ color: T.accent }}>
                  ✓ You&apos;re on the list!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="mt-3 text-[13px] text-red-400 text-center">{error}</p>
          )}
        </motion.div>

        {/* Stats line */}
        <motion.p
          variants={heroItem}
          className="mt-5 text-[13px]"
          style={{ color: T.textTertiary }}
        >
          {stats.applied.toLocaleString()} applied · {stats.total_spots} spots ·
          Free to join
        </motion.p>
      </motion.div>
    </section>
  );
}

function V2Hero() {
  return (
    <Suspense fallback={null}>
      <HeroInner />
    </Suspense>
  );
}

/* ── StatsStrip ────────────────────────────────────────── */

const statsData = [
  { value: "1,793+", label: "Applications" },
  { value: "500", label: "Total Spots" },
  { value: "Early", label: "Access Phase" },
  { value: "0%", label: "Fees" },
];

function StatsStrip() {
  return (
    <motion.section
      variants={sectionFade}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      className="relative z-10 py-16 px-6"
      style={{ background: T.bg }}
    >
      <div
        className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 rounded-2xl overflow-hidden"
        style={{
          background: T.card,
          border: `1px solid ${T.cardBorder}`,
        }}
      >
        {statsData.map((s, i) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center py-8 px-4"
            style={{
              borderRight:
                i < statsData.length - 1
                  ? `1px solid ${T.cardBorder}`
                  : "none",
            }}
          >
            <span className="text-[28px] md:text-[32px] font-bold text-white">
              {s.value}
            </span>
            <span
              className="text-[12px] mt-1 uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

/* ── HowItWorks ────────────────────────────────────────── */

const steps = [
  {
    num: "01",
    icon: "✉️",
    title: "Apply for access",
    desc: "Submit your email and get in the queue. No wallet needed—just your email to start.",
  },
  {
    num: "02",
    icon: "✅",
    title: "Get confirmed",
    desc: "We review and confirm applicants in batches. Early applicants get priority access.",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Install & earn",
    desc: "Install a lightweight browser extension and start earning passive rewards immediately.",
  },
];

function HowItWorks() {
  return (
    <motion.section
      variants={sectionFade}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      className="relative z-10 py-24 md:py-32 px-6"
      style={{ background: T.bg }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[36px] md:text-[44px] font-bold text-white tracking-tight">
            Get started in minutes
          </h2>
          <p
            className="mt-4 text-[16px] max-w-md mx-auto"
            style={{ color: T.textSecondary }}
          >
            Three simple steps from sign-up to earning. No technical knowledge
            required.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              initial="rest"
              whileHover="hover"
              className="relative p-8 rounded-2xl cursor-default"
              style={{
                background: T.card,
                border: `1px solid ${T.cardBorder}`,
                transition: "border-color 0.25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = T.cardHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = T.cardBorder)
              }
            >
              <span
                className="inline-block text-[12px] font-bold px-3 py-1 rounded-full mb-6"
                style={{ background: T.accentGlow, color: T.accent }}
              >
                Step {step.num}
              </span>
              <div className="text-[32px] mb-4">{step.icon}</div>
              <h3 className="text-[20px] font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: T.textSecondary }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ── FeaturesGrid ──────────────────────────────────────── */

const features = [
  {
    icon: "🖥️",
    title: "No extra hardware",
    desc: "Runs as a browser extension. No special equipment or setup needed.",
  },
  {
    icon: "⚡",
    title: "Zero impact on speed",
    desc: "Uses only idle bandwidth your connection isn't using. You won't feel a thing.",
  },
  {
    icon: "📧",
    title: "Wallet optional",
    desc: "Join with just your email. Connect a crypto wallet later when you're ready.",
  },
  {
    icon: "📊",
    title: "Transparent rewards",
    desc: "See exactly how much you've earned and how rewards are calculated.",
  },
  {
    icon: "🔒",
    title: "Privacy first",
    desc: "We can't access your browsing data, files, or personal information. Ever.",
  },
  {
    icon: "🚪",
    title: "Uninstall anytime",
    desc: "No lock-in, no commitment. Remove the extension whenever you like.",
  },
  {
    icon: "🌊",
    title: "Wave-based access",
    desc: "Controlled rollout in waves ensures quality and stability for everyone.",
  },
  {
    icon: "🔗",
    title: "Referral system",
    desc: "Invite friends with your unique link and climb higher in the queue.",
  },
  {
    icon: "🏆",
    title: "Season rewards",
    desc: "Early participants get the best positions and highest reward multipliers.",
  },
];

function FeaturesGrid() {
  return (
    <motion.section
      id="features"
      variants={sectionFade}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      className="relative z-10 py-24 md:py-32 px-6 overflow-hidden"
      style={{ background: T.bg }}
    >
      <GridPulse className="absolute inset-0 z-0 opacity-50" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[36px] md:text-[44px] font-bold text-white tracking-tight">
            Built for everyone.
            <br />
            Designed for trust.
          </h2>
          <p
            className="mt-4 text-[16px] max-w-lg mx-auto"
            style={{ color: T.textSecondary }}
          >
            Everything you need to earn passively, with nothing you need to
            worry about.
          </p>
        </div>

        <motion.div
          variants={staggerSlow}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="p-7 rounded-2xl cursor-default"
              style={{
                background: T.card,
                border: `1px solid ${T.cardBorder}`,
                transition: "border-color 0.25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = T.cardHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = T.cardBorder)
              }
            >
              <div className="text-[28px] mb-4">{f.icon}</div>
              <h3 className="text-[17px] font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: T.textSecondary }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ── Earn Section ─────────────────────────────────────── */

const earnCards = [
  { value: "Early Rank", desc: "Secure a stronger starting position the earlier you join.", accent: "#00E87B" },
  { value: "Grove Points", desc: "Accumulate points based on uptime, bandwidth shared, and network contribution.", accent: "#00D4FF" },
  { value: "Referral Boosts", desc: "Every quality referral accelerates your position and multiplies your rewards.", accent: "#A78BFA" },
  { value: "Season Drops", desc: "Early participants are eligible for exclusive seasonal reward distributions.", accent: "#F59E0B" },
];

function EarnSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={vp}
      variants={stagger}
      className="relative px-6 py-24 md:py-32 overflow-hidden"
    >
      <AuroraBlobs />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-[-0.03em] text-white leading-tight">
            What early participants{" "}
            <span style={{ color: T.accent }}>earn</span>
          </h2>
          <p className="mt-4 text-[16px] max-w-lg mx-auto leading-relaxed" style={{ color: T.textSecondary }}>
            Your position is shaped by when you join, how active you are, and how much quality growth you bring.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {earnCards.map((c, i) => (
            <motion.div
              key={c.value}
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: T.card,
                borderColor: T.cardBorder,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.cardHover)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.cardBorder)}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                style={{ background: c.accent }}
              />
              <div className="relative">
                <div
                  className="text-[24px] sm:text-[28px] font-bold mb-2"
                  style={{ color: c.accent }}
                >
                  {c.value}
                </div>
                <p className="text-[14px] leading-relaxed" style={{ color: T.textSecondary }}>
                  {c.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={fadeUp}
          className="mt-8 text-center text-[13px]"
          style={{ color: T.textTertiary }}
        >
          No fake promises. No instant riches. Just early access to a network that gets more valuable as it grows.
        </motion.p>
      </div>
    </motion.section>
  );
}

/* ── Scarcity Section ────────────────────────────────── */

function ScarcitySection() {
  const { stats } = useGrove();
  const pct = stats.total_spots > 0 ? Math.round((stats.confirmed / stats.total_spots) * 100) : 0;

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={vp}
      variants={stagger}
      className="relative px-6 py-24 md:py-32 overflow-hidden"
    >
      <FlowingLines
        className="absolute inset-0 z-0 opacity-60"
        lineColor="rgba(0,232,123,0.15)"
        lineCount={8}
        speed={0.004}
      />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.h2
          variants={fadeUp}
          className="text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-[-0.03em] text-white leading-tight"
        >
          Access is limited.
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-[16px] leading-relaxed max-w-md mx-auto"
          style={{ color: T.textSecondary }}
        >
          {stats.applied.toLocaleString()} people have applied for {stats.total_spots} spots. We confirm in small batches to maintain quality.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-12 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px]" style={{ color: T.textTertiary }}>
              {stats.confirmed} confirmed
            </span>
            <span className="text-[13px]" style={{ color: T.textTertiary }}>
              {stats.remaining} remaining
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${T.accent}, #00D4FF)` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max(pct, 2)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div>
              <div className="text-[36px] sm:text-[44px] font-bold text-white font-mono">
                {stats.applied.toLocaleString()}
              </div>
              <div className="text-[12px] mt-1" style={{ color: T.textTertiary }}>Applications</div>
            </div>
            <div className="w-px h-12" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div>
              <div className="text-[36px] sm:text-[44px] font-bold font-mono" style={{ color: T.accent }}>
                {stats.remaining}
              </div>
              <div className="text-[12px] mt-1" style={{ color: T.textTertiary }}>Spots left</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ── FAQ Section ──────────────────────────────────────── */

const faqs = [
  { q: "What is grovegrove?", a: "A user-owned network for live web access. It starts with a lightweight browser extension that shares your unused bandwidth in exchange for rewards." },
  { q: "Do I need special hardware?", a: "No. grovegrove runs as a simple browser extension. No extra hardware, no complex setup. Just install and it works in the background." },
  { q: "Is this mining?", a: "No. grovegrove doesn't mine cryptocurrency. It's a network participation product that rewards you for sharing idle bandwidth." },
  { q: "Do I need a wallet to join?", a: "No. You can apply with just your email. Wallet connection is optional and can come later." },
  { q: "How do rewards work?", a: "Your position improves through early participation, uptime, and quality referrals. The earlier you join and the more active you are, the better your position." },
  { q: "Will it slow down my internet?", a: "No. grovegrove only uses a tiny fraction of your unused bandwidth. You won't notice any difference in your browsing speed." },
  { q: "Why is there a waitlist?", a: "We're rolling out access in waves to maintain network quality. Early applicants get priority access and stronger positions." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b py-5 cursor-pointer select-none"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-white pr-8">{q}</h3>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[20px] flex-shrink-0"
          style={{ color: T.textTertiary }}
        >
          +
        </motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-[14px] leading-relaxed mt-3 overflow-hidden"
            style={{ color: T.textSecondary }}
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={vp}
      variants={stagger}
      id="faq"
      className="px-6 py-24 md:py-32"
    >
      <div className="max-w-2xl mx-auto">
        <motion.h2
          variants={fadeUp}
          className="text-[32px] sm:text-[40px] font-bold tracking-[-0.03em] text-white text-center mb-12"
        >
          Frequently asked questions
        </motion.h2>
        <motion.div variants={fadeUp}>
          {faqs.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ── Final CTA ────────────────────────────────────────── */

function FinalCTA() {
  const { stats } = useGrove();
  return (
    <section className="px-6 py-24 md:py-32" id="final-cta">
      <div className="max-w-3xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center"
          style={{
            background: `linear-gradient(135deg, rgba(0,232,123,0.08) 0%, rgba(0,212,255,0.05) 50%, rgba(0,0,0,0) 100%)`,
            border: `1px solid rgba(0,232,123,0.15)`,
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full blur-[100px]"
            style={{ background: "rgba(0,232,123,0.08)" }}
          />
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[28px] sm:text-[36px] md:text-[44px] font-bold tracking-[-0.03em] text-white leading-tight"
            >
              Don&apos;t miss your spot.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-[16px] leading-relaxed max-w-md mx-auto"
              style={{ color: T.textSecondary }}
            >
              {stats.applied.toLocaleString()} people applied. {stats.remaining} spots left. Apply now and start inviting.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <button
                onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-3.5 rounded-full text-[15px] font-semibold transition-all hover:scale-105"
                style={{ background: T.accent, color: "#000" }}
              >
                Apply for Early Access
              </button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-[13px]"
              style={{ color: T.textTertiary }}
            >
              Free · No wallet required · 10 seconds
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────── */

function V2Footer() {
  return (
    <footer className="px-6 py-12 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: T.accent }}>
            <div className="w-2 h-2 rounded-full bg-black" />
          </div>
          <span className="text-[14px] font-semibold text-white">grovegrove</span>
        </div>
        <div className="flex flex-wrap gap-6">
          {["Features", "Earn", "FAQ"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[13px] transition-colors hover:text-white"
              style={{ color: T.textTertiary }}
            >
              {l}
            </a>
          ))}
        </div>
        <div className="flex gap-5">
          {["X", "Telegram", "Discord"].map((s) => (
            <a key={s} href="#" className="text-[13px] transition-colors hover:text-white" style={{ color: T.textTertiary }}>
              {s}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-[12px]" style={{ color: T.textTertiary }}>
          © {new Date().getFullYear()} grovegrove
        </p>
        <div className="flex gap-5">
          <a href="#" className="text-[12px] transition-colors hover:text-white" style={{ color: T.textTertiary }}>Privacy</a>
          <a href="#" className="text-[12px] transition-colors hover:text-white" style={{ color: T.textTertiary }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}

/* ── Page Root ─────────────────────────────────────────── */

function DotWaveDivider() {
  return (
    <div className="relative w-full h-[280px] overflow-hidden" style={{ background: T.bg }}>
      <DotWave
        className="absolute inset-0"
        dotColor="rgba(0,232,123,0.3)"
        dotSize={1.5}
        gap={20}
        amplitude={20}
        speed={0.006}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${T.bg} 0%, transparent 20%, transparent 80%, ${T.bg} 100%)`,
        }}
      />
    </div>
  );
}

function OrbitalVisual() {
  return (
    <div className="relative w-full overflow-hidden" style={{ background: T.bg }}>
      <div className="max-w-5xl mx-auto py-24 px-6 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[36px] sm:text-[44px] font-bold text-center tracking-tight text-white mb-4"
        >
          A living network
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[16px] text-center max-w-md mb-16"
          style={{ color: T.textSecondary }}
        >
          Every node strengthens the Grove. Watch the network grow in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px]"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: `rgba(0,232,123,${0.06 + i * 0.04})`,
                transform: `rotateX(${60 + i * 10}deg) rotateZ(${i * 30}deg)`,
                animation: `v2-orbit ${18 + i * 6}s linear infinite${i % 2 === 1 ? " reverse" : ""}`,
              }}
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            const rx = 120 + (i % 3) * 20;
            const ry = 80 + (i % 2) * 30;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 6 + (i % 3) * 2,
                  height: 6 + (i % 3) * 2,
                  background: i < 3 ? T.accent : "rgba(0,212,255,0.6)",
                  boxShadow: `0 0 12px ${i < 3 ? T.accent : "rgba(0,212,255,0.4)"}`,
                  left: "50%",
                  top: "50%",
                  marginLeft: -(3 + (i % 3)),
                  marginTop: -(3 + (i % 3)),
                }}
                animate={{
                  x: [Math.cos(angle) * rx, Math.cos(angle + Math.PI) * rx, Math.cos(angle) * rx],
                  y: [Math.sin(angle) * ry, Math.sin(angle + Math.PI) * ry, Math.sin(angle) * ry],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            );
          })}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, ${T.accent}40 0%, transparent 70%)`,
              boxShadow: `0 0 60px ${T.accent}30`,
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
            style={{ background: T.accent, boxShadow: `0 0 20px ${T.accent}` }}
          />
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes v2-orbit {
          from { transform: rotateX(60deg) rotateZ(0deg); }
          to { transform: rotateX(60deg) rotateZ(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function V2Page() {
  return (
    <GroveProvider>
      <div className="min-h-screen" style={{ background: T.bg, color: T.text }}>
        <V2Navbar />
        <V2Hero />
        <StatsStrip />
        <DotWaveDivider />
        <HowItWorks />
        <OrbitalVisual />
        <FeaturesGrid />
        <DotWaveDivider />
        <EarnSection />
        <ScarcitySection />
        <FAQSection />
        <FinalCTA />
        <V2Footer />
      </div>
    </GroveProvider>
  );
}
