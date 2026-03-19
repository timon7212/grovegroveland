"use client";

import { useRef, useEffect } from "react";

interface GridPulseProps {
  className?: string;
  lineColor?: string;
  pulseColor?: string;
  cellSize?: number;
}

export function GridPulse({
  className = "",
  lineColor = "rgba(255,255,255,0.03)",
  pulseColor = "rgba(0,232,123,0.12)",
  cellSize = 60,
}: GridPulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    interface Pulse {
      x: number;
      y: number;
      born: number;
      maxRadius: number;
      speed: number;
    }

    const pulses: Pulse[] = [];
    let lastPulse = 0;

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

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / cellSize) + 1;
      const rows = Math.ceil(h / cellSize) + 1;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      for (let c = 0; c <= cols; c++) {
        const x = c * cellSize;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * cellSize;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (now - lastPulse > 1800 && pulses.length < 5) {
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        pulses.push({
          x: col * cellSize,
          y: row * cellSize,
          born: now,
          maxRadius: 200 + Math.random() * 200,
          speed: 0.08 + Math.random() * 0.04,
        });
        lastPulse = now;
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const age = (now - p.born) * p.speed;
        if (age > p.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }
        const progress = age / p.maxRadius;
        const alpha = (1 - progress) * 0.3;
        ctx.strokeStyle = pulseColor.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, age, 0, Math.PI * 2);
        ctx.stroke();

        const innerAlpha = (1 - progress) * 0.08;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, age);
        grad.addColorStop(0, pulseColor.replace(/[\d.]+\)$/, `${innerAlpha})`));
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, age, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [lineColor, pulseColor, cellSize]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
