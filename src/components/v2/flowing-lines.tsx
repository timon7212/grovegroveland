"use client";

import { useRef, useEffect } from "react";

interface FlowingLinesProps {
  className?: string;
  lineColor?: string;
  lineCount?: number;
  speed?: number;
}

export function FlowingLines({
  className = "",
  lineColor = "rgba(0,232,123,0.12)",
  lineCount = 12,
  speed = 0.003,
}: FlowingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const lines = Array.from({ length: lineCount }, (_, i) => ({
      baseY: (h / (lineCount + 1)) * (i + 1),
      amplitude: 15 + Math.random() * 25,
      frequency: 0.002 + Math.random() * 0.003,
      phase: Math.random() * Math.PI * 2,
      speed: speed * (0.7 + Math.random() * 0.6),
      opacity: 0.04 + (i / lineCount) * 0.08,
      width: 1 + Math.random() * 0.5,
    }));

    const draw = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, w, h);

      for (const line of lines) {
        line.baseY = (h / (lineCount + 1)) * (lines.indexOf(line) + 1);
        const t = timeRef.current * line.speed;
        ctx.beginPath();
        ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${line.opacity})`);
        ctx.lineWidth = line.width;

        for (let x = 0; x <= w; x += 2) {
          const wave1 = Math.sin(x * line.frequency + t + line.phase) * line.amplitude;
          const wave2 = Math.sin(x * line.frequency * 1.5 + t * 0.7 + line.phase * 2) * line.amplitude * 0.4;
          const wave3 = Math.cos(x * line.frequency * 0.5 + t * 1.3) * line.amplitude * 0.2;
          const y = line.baseY + wave1 + wave2 + wave3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [lineColor, lineCount, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
