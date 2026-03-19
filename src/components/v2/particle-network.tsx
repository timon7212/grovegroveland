"use client";

import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const options: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: { value: 80, density: { enable: true, width: 1200, height: 800 } },
    color: { value: ["#00E87B", "#00D4FF", "#A78BFA"] },
    shape: { type: "circle" },
    opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 0.8, startValue: "random" } },
    size: { value: { min: 1, max: 3 }, animation: { enable: true, speed: 1.5, startValue: "random" } },
    links: {
      enable: true,
      distance: 120,
      color: "#00E87B",
      opacity: 0.08,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
  },
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "push" },
    },
    modes: {
      grab: { distance: 160, links: { opacity: 0.25, color: "#00E87B" } },
      push: { quantity: 3 },
    },
  },
  detectRetina: true,
};

export function ParticleNetwork({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  if (!ready) return null;

  return (
    <Particles
      id="hero-particles"
      className={className}
      particlesLoaded={particlesLoaded}
      options={options}
    />
  );
}
