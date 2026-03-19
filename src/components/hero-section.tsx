"use client";

import { useMemo, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { heroStagger, heroItem } from "@/lib/motion";
import { WaitlistForm } from "./waitlist-form";
import { useGrove } from "@/lib/grove-context";

/* ── Animated gradient orbs ── */
const orbConfig = [
  { size: 500, x: "15%", y: "20%", color: "rgba(22,163,74,0.07)", dur: 22, dx: 30, dy: 20 },
  { size: 400, x: "75%", y: "10%", color: "rgba(16,185,129,0.06)", dur: 28, dx: -25, dy: 30 },
  { size: 600, x: "50%", y: "60%", color: "rgba(22,163,74,0.05)", dur: 32, dx: 20, dy: -25 },
  { size: 350, x: "85%", y: "70%", color: "rgba(52,211,153,0.04)", dur: 20, dx: -35, dy: -15 },
  { size: 300, x: "10%", y: "80%", color: "rgba(16,185,129,0.05)", dur: 26, dx: 25, dy: -20 },
];

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {orbConfig.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{ x: [0, o.dx, -o.dx * 0.6, 0], y: [0, o.dy, -o.dy * 0.5, 0] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── Dot grid pattern ── */
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.35]"
      aria-hidden
      style={{
        backgroundImage: "radial-gradient(circle, #d1d5db 0.8px, transparent 0.8px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

/* ── Floating particles ── */
function Particles() {
  const ps = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.3 + 0.1,
        dur: Math.random() * 15 + 12,
        delay: Math.random() * -20,
        driftX: (Math.random() - 0.5) * 60,
        driftY: -(Math.random() * 40 + 20),
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ps.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, p.driftY, p.driftY * 0.3, 0],
            x: [0, p.driftX * 0.4, p.driftX, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity * 1.5, p.opacity],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}

/* ── Network visualization ── */
const NODE_COUNT = 28;
const CENTER = 200;
const VIEWBOX = 400;

interface NodeData {
  x: number;
  y: number;
  r: number;
  ring: number;
  delay: number;
  color: string;
}

function generateNodes(): NodeData[] {
  const nodes: NodeData[] = [];
  const rings = [
    { count: 1, radius: 0, size: 10, color: "#16A34A" },
    { count: 5, radius: 55, size: 5, color: "#34D399" },
    { count: 8, radius: 105, size: 3.5, color: "#86EFAC" },
    { count: 14, radius: 160, size: 2.5, color: "#BBF7D0" },
  ];

  for (const ring of rings) {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2 - Math.PI / 2 + (ring.radius > 0 ? Math.random() * 0.3 : 0);
      nodes.push({
        x: CENTER + Math.cos(angle) * ring.radius,
        y: CENTER + Math.sin(angle) * ring.radius,
        r: ring.size,
        ring: ring.radius,
        delay: Math.random() * 3,
        color: ring.color,
      });
    }
  }
  return nodes;
}

function NetworkVisualization() {
  const nodes = useMemo(generateNodes, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const rotateX = useTransform(springY, [-200, 200], [3, -3]);
  const rotateY = useTransform(springX, [-200, 200], [-3, 3]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };
    const handleLeave = () => { mouseX.set(0); mouseY.set(0); };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => { el.removeEventListener("mousemove", handleMove); el.removeEventListener("mouseleave", handleLeave); };
  }, [mouseX, mouseY]);

  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && Math.abs(nodes[i].ring - nodes[j].ring) <= 60) {
          lines.push({
            x1: nodes[i].x, y1: nodes[i].y,
            x2: nodes[j].x, y2: nodes[j].y,
            opacity: Math.max(0.03, 0.12 - dist / 1200),
          });
        }
      }
    }
    return lines;
  }, [nodes]);

  return (
    <motion.div
      ref={containerRef}
      variants={heroItem}
      className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] mx-auto mb-8"
      style={{ perspective: 800, rotateX, rotateY }}
    >
      {/* Glow backdrop */}
      <div className="absolute inset-[-20%] rounded-full bg-accent/[0.03] blur-3xl" />
      <motion.div
        className="absolute inset-[-10%] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className="relative w-full h-full">
        {/* Connection lines */}
        {connections.map((l, i) => (
          <motion.line
            key={`l${i}`}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#16A34A"
            strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, l.opacity, l.opacity * 0.5, l.opacity] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}

        {/* Outer ring rotation group */}
        <g style={{ transformOrigin: `${CENTER}px ${CENTER}px`, animation: "grove-spin 90s linear infinite" }}>
          {nodes.filter((n) => n.ring === 160).map((n, i) => (
            <motion.circle
              key={`r3-${i}`}
              cx={n.x} cy={n.y} fill={n.color}
              initial={{ r: n.r, opacity: 0.3 }}
              animate={{ r: [n.r, n.r * 1.6, n.r], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: n.delay, ease: "easeInOut" }}
            />
          ))}
        </g>

        {/* Middle ring rotation */}
        <g style={{ transformOrigin: `${CENTER}px ${CENTER}px`, animation: "grove-spin-reverse 60s linear infinite" }}>
          {nodes.filter((n) => n.ring === 105).map((n, i) => (
            <motion.circle
              key={`r2-${i}`}
              cx={n.x} cy={n.y} fill={n.color}
              initial={{ r: n.r, opacity: 0.4 }}
              animate={{ r: [n.r, n.r * 1.5, n.r], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: n.delay, ease: "easeInOut" }}
            />
          ))}
        </g>

        {/* Inner ring */}
        <g style={{ transformOrigin: `${CENTER}px ${CENTER}px`, animation: "grove-spin 40s linear infinite" }}>
          {nodes.filter((n) => n.ring === 55).map((n, i) => (
            <g key={`r1-${i}`}>
              <line x1={CENTER} y1={CENTER} x2={n.x} y2={n.y} stroke="#16A34A" strokeWidth="0.6" opacity="0.12" />
              <motion.circle
                cx={n.x} cy={n.y} fill={n.color}
                initial={{ r: n.r, opacity: 0.5 }}
                animate={{ r: [n.r, n.r * 1.4, n.r], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: n.delay, ease: "easeInOut" }}
              />
            </g>
          ))}
        </g>

        {/* Center node - the core */}
        <motion.circle
          cx={CENTER} cy={CENTER} fill="#16A34A"
          initial={{ r: 18, opacity: 0.08 }}
          animate={{ r: [18, 24, 18], opacity: [0.06, 0.15, 0.06] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx={CENTER} cy={CENTER} r={12} fill="#16A34A"
          animate={{ r: [12, 13, 12] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx={CENTER} cy={CENTER} r={5} fill="white" />

        {/* Pulse rings from center */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={CENTER}
            cy={CENTER}
            fill="none"
            stroke="#16A34A"
            strokeWidth="0.5"
            initial={{ r: 12, opacity: 0.3 }}
            animate={{ r: [12, 80], opacity: [0.25, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

/* ── Badge row ── */
function Badges() {
  const badges = [
    { label: "No hardware", icon: "⚡" },
    { label: "Passive income", icon: "💰" },
    { label: "Early access", icon: "🔑" },
  ];

  return (
    <motion.div variants={heroItem} className="flex flex-wrap justify-center gap-2 mt-6 mb-2">
      {badges.map((b) => (
        <span
          key={b.label}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-subtle border border-border text-[12px] text-text-secondary"
        >
          <span>{b.icon}</span>
          {b.label}
        </span>
      ))}
    </motion.div>
  );
}

/* ── Hero Section ── */
export function HeroSection() {
  const { stats } = useGrove();

  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden min-h-[100vh] flex items-center">
      <AuroraBackground />
      <DotGrid />
      <Particles />

      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-3xl text-center w-full"
      >
        <NetworkVisualization />

        <motion.h1
          variants={heroItem}
          className="text-[36px] sm:text-[48px] md:text-[60px] font-bold tracking-[-0.03em] leading-[1.05]"
        >
          Earn from your{" "}
          <span className="relative">
            <span className="relative z-10">unused internet</span>
            <motion.span
              className="absolute bottom-1 left-0 right-0 h-3 bg-accent/10 rounded-sm -z-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          </span>
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mt-5 text-[16px] sm:text-[18px] text-text-secondary max-w-lg mx-auto leading-relaxed"
        >
          A lightweight browser extension that turns idle bandwidth into
          passive rewards. No setup. No hardware. Just install and earn.
        </motion.p>

        <Badges />

        <motion.div variants={heroItem} className="mt-8 flex justify-center">
          <WaitlistForm />
        </motion.div>

        <motion.div
          variants={heroItem}
          className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-text-tertiary"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {stats.applied.toLocaleString()} applied
          </span>
          <span>·</span>
          <span className="font-medium text-text-secondary">{stats.remaining} spots left</span>
          <span>·</span>
          <span>Free to join</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
