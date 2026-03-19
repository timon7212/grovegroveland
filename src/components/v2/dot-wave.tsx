"use client";

import { useRef, useEffect } from "react";

interface DotWaveProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
  amplitude?: number;
  speed?: number;
  perspective?: boolean;
}

export function DotWave({
  className = "",
  dotColor = "rgba(0,232,123,0.35)",
  dotSize = 2,
  gap = 18,
  amplitude = 25,
  speed = 0.008,
  perspective = true,
}: DotWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

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

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);

    const draw = () => {
      timeRef.current += speed;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / gap) + 4;
      const rows = Math.ceil(h / gap) + 4;
      const offsetX = (w - cols * gap) / 2;
      const offsetY = (h - rows * gap) / 2;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const t = timeRef.current;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = offsetX + col * gap;
          const baseY = offsetY + row * gap;

          const wave1 = Math.sin(col * 0.12 + t * 1.2) * amplitude;
          const wave2 = Math.cos(row * 0.08 + t * 0.9) * amplitude * 0.6;
          const wave3 = Math.sin((col + row) * 0.06 + t * 0.7) * amplitude * 0.4;

          const displace = wave1 + wave2 + wave3;
          const x = baseX;
          const y = baseY + displace;

          const distToMouse = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
          const mouseInfluence = Math.max(0, 1 - distToMouse / 120);
          const mouseRepelX = mouseInfluence * (x - mx) * 0.15;
          const mouseRepelY = mouseInfluence * (y - my) * 0.15;

          const fx = x + mouseRepelX;
          const fy = y + mouseRepelY;

          let size = dotSize;
          let opacity = 1;

          if (perspective) {
            const normalizedDisplace = (displace + amplitude * 2) / (amplitude * 4);
            size = dotSize * (0.5 + normalizedDisplace * 1.2);
            opacity = 0.2 + normalizedDisplace * 0.8;
          }

          opacity = Math.min(1, opacity + mouseInfluence * 0.5);
          size = size + mouseInfluence * 2;

          ctx.globalAlpha = opacity;
          ctx.fillStyle = mouseInfluence > 0.3 ? "rgba(0,232,123,0.9)" : dotColor;
          ctx.beginPath();
          ctx.arc(fx, fy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, [dotColor, dotSize, gap, amplitude, speed, perspective]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
