"use client";

import { motion } from "framer-motion";

interface AuroraBlobsProps {
  className?: string;
}

export function AuroraBlobs({ className = "" }: AuroraBlobsProps) {
  const blobs = [
    { color: "rgba(0,232,123,0.15)", size: 500, x: "15%", y: "20%", dur: 22 },
    { color: "rgba(0,212,255,0.1)", size: 450, x: "70%", y: "30%", dur: 26 },
    { color: "rgba(167,139,250,0.08)", size: 400, x: "45%", y: "60%", dur: 20 },
    { color: "rgba(0,232,123,0.06)", size: 350, x: "80%", y: "70%", dur: 24 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            left: b.x,
            top: b.y,
            filter: "blur(80px)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: b.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
