"use client";

import React, { useEffect, useRef, useState } from "react";

type ParticleKind = "dot" | "streak";

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  drag: number;
  kind: ParticleKind;
  twinkle: number;
}

interface Shockwave {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  radius: number;
}

const GOLD = [
  "#fffbe6",
  "#fef3c7",
  "#fde68a",
  "#fbbf24",
  "#f59e0b",
  "#fb923c",
];

const TAU = Math.PI * 2;

function pickGold() {
  return GOLD[Math.floor(Math.random() * GOLD.length)];
}

export default function SparklerCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches);
    };

    updatePreference();
    finePointer.addEventListener("change", updatePreference);
    reducedMotion.addEventListener("change", updatePreference);

    return () => {
      finePointer.removeEventListener("change", updatePreference);
      reducedMotion.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const particles: SparkParticle[] = [];
    const waves: Shockwave[] = [];
    const pointer = { x: 0, y: 0, px: 0, py: 0, active: false };
    const size = { w: 0, h: 0 };

    let emission = 0;
    let lastTime = 0;
    let lastIdle = 0;
    let frame = 0;
    let running = false;
    let cursorHidden = false;

    const hideNativeCursor = () => {
      if (cursorHidden) return;
      root.classList.add("sparkler-cursor");
      cursorHidden = true;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      size.w = document.documentElement.clientWidth;
      size.h = document.documentElement.clientHeight;
      canvas.width = Math.max(1, Math.floor(size.w * dpr));
      canvas.height = Math.max(1, Math.floor(size.h * dpr));
      canvas.style.width = `${size.w}px`;
      canvas.style.height = `${size.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const addParticle = (
      options: Partial<SparkParticle> & { x: number; y: number }
    ) => {
      if (particles.length > 260) return;

      const maxLife = options.maxLife ?? 0.6;
      particles.push({
        vx: 0,
        vy: 0,
        life: maxLife,
        maxLife,
        size: 1.4,
        color: pickGold(),
        gravity: 280,
        drag: 0.97,
        kind: "dot",
        twinkle: Math.random() * TAU,
        ...options,
      });
    };

    const spawnTrail = (x: number, y: number, dx: number, dy: number) => {
      const speed = Math.hypot(dx, dy);
      const direction = speed > 0.001 ? Math.atan2(dy, dx) : -Math.PI / 2;
      const spray = Math.min(230, 56 + speed * 0.16);
      const angle = direction + Math.PI + (Math.random() - 0.5) * 1.5;
      const velocity = spray * (0.45 + Math.random() * 0.9);
      const streak = Math.random() < 0.24;
      const maxLife = 0.32 + Math.random() * 0.5;

      addParticle({
        x: x + (Math.random() - 0.5) * 3,
        y: y + (Math.random() - 0.5) * 3,
        vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 34,
        vy: Math.sin(angle) * velocity + (Math.random() - 0.5) * 34 - 26,
        maxLife,
        size: streak ? 1.5 + Math.random() * 1.3 : 0.8 + Math.random() * 1.6,
        color: pickGold(),
        gravity: streak ? 420 : 250 + Math.random() * 220,
        drag: 0.94 + Math.random() * 0.03,
        kind: streak ? "streak" : "dot",
      });
    };

    const createBurst = (x: number, y: number) => {
      const count = 30 + Math.floor(Math.random() * 10);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * TAU + (Math.random() - 0.5) * 0.32;
        const speed = 90 + Math.random() * 240;
        const streak = Math.random() < 0.34;

        addParticle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          maxLife: 0.45 + Math.random() * 0.55,
          size: streak ? 1.6 + Math.random() * 1.8 : 1.1 + Math.random() * 2,
          color: pickGold(),
          gravity: 260 + Math.random() * 170,
          drag: 0.955,
          kind: streak ? "streak" : "dot",
        });
      }

      for (let i = 0; i < 9; i++) {
        const angle = Math.random() * TAU;
        const speed = 30 + Math.random() * 100;

        addParticle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          maxLife: 0.18 + Math.random() * 0.25,
          size: 1.8 + Math.random() * 2.3,
          color: "#fffbe6",
          gravity: 80,
          drag: 0.9,
          kind: "dot",
        });
      }

      waves.push({ x, y, life: 0.42, maxLife: 0.42, radius: 0 });
      if (waves.length > 8) waves.shift();
    };

    const activate = (x: number, y: number) => {
      hideNativeCursor();
      if (!pointer.active) {
        pointer.active = true;
        pointer.x = x;
        pointer.y = y;
        pointer.px = x;
        pointer.py = y;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        pointer.active = false;
        return;
      }
      activate(event.clientX, event.clientY);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        pointer.active = false;
        return;
      }
      if (event.button !== 0) return;
      activate(event.clientX, event.clientY);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      createBurst(event.clientX, event.clientY);
    };

    const hidePointer = () => {
      pointer.active = false;
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) hidePointer();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("blur", hidePointer);
    root.addEventListener("pointerleave", hidePointer);

    const drawWaves = () => {
      ctx.globalCompositeOperation = "lighter";
      for (const wave of waves) {
        const alpha = Math.max(0, wave.life / wave.maxLife);
        ctx.globalAlpha = alpha * 0.45;
        ctx.strokeStyle = "#fde68a";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, TAU);
        ctx.stroke();

        ctx.globalAlpha = alpha * 0.18;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius + 7, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const drawParticles = (time: number) => {
      ctx.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        const alpha = Math.max(0, particle.life / particle.maxLife);
        const twinkle = 0.72 + 0.28 * Math.sin(particle.twinkle + time * 0.018);
        const visible = alpha * twinkle;

        if (particle.kind === "streak") {
          const tail = 0.018;
          const tailX = particle.x - particle.vx * tail;
          const tailY = particle.y - particle.vy * tail;

          ctx.globalAlpha = visible * 0.4;
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = particle.size * 1.8;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();

          ctx.globalAlpha = visible;
          ctx.lineWidth = particle.size * 0.8;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();

          ctx.fillStyle = "#fffbe6";
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.45, 0, TAU);
          ctx.fill();
        } else {
          ctx.globalAlpha = visible * 0.16;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2.8, 0, TAU);
          ctx.fill();

          ctx.globalAlpha = visible;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, TAU);
          ctx.fill();

          ctx.fillStyle = "#fffbe6";
          ctx.globalAlpha = visible * 0.7;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.42, 0, TAU);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const drawSparkler = (time: number) => {
      const x = pointer.x;
      const y = pointer.y;
      const flicker =
        0.82 + Math.sin(time * 0.031) * 0.1 + Math.random() * 0.08;
      const glowRadius = 15 + Math.sin(time * 0.017) * 1.8;

      // Tiny golden handle
      ctx.globalCompositeOperation = "source-over";
      const handle = ctx.createLinearGradient(x, y, x - 13, y + 13);
      handle.addColorStop(0, "rgba(255, 220, 130, 0.95)");
      handle.addColorStop(0.4, "rgba(166, 104, 44, 0.95)");
      handle.addColorStop(1, "rgba(92, 56, 26, 0.9)");
      ctx.strokeStyle = handle;
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 13, y + 13);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 236, 170, 0.35)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - 1, y + 1);
      ctx.lineTo(x - 12, y + 12);
      ctx.stroke();

      // Golden flame at the tip
      ctx.globalCompositeOperation = "lighter";
      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      glow.addColorStop(0, `rgba(255, 255, 240, ${0.95 * flicker})`);
      glow.addColorStop(0.16, `rgba(255, 236, 150, ${0.85 * flicker})`);
      glow.addColorStop(0.42, `rgba(255, 184, 58, ${0.3 * flicker})`);
      glow.addColorStop(1, "rgba(255, 140, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, TAU);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 235, ${0.95 * flicker})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, TAU);
      ctx.fill();

      // Flickering star rays
      for (let i = 0; i < 8; i++) {
        const angle = time * 0.0007 + (i * Math.PI) / 4 + (i % 2 ? 0.18 : 0);
        const length = i % 2 === 0 ? 6 + Math.random() * 8 : 3 + Math.random() * 5;
        ctx.strokeStyle = `rgba(255, 232, 150, ${
          (i % 2 === 0 ? 0.85 : 0.45) * flicker
        })`;
        ctx.lineWidth = i % 2 === 0 ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        ctx.stroke();
      }

      // Tiny sparks orbiting the tip
      for (let i = 0; i < 5; i++) {
        const angle = time * 0.004 + i * 1.7;
        const radius = 4 + (i % 3) * 2.5 + Math.sin(time * 0.012 + i) * 1.2;
        const sparkX = x + Math.cos(angle) * radius;
        const sparkY = y + Math.sin(angle) * radius;

        ctx.globalAlpha = 0.45 + 0.45 * Math.sin(time * 0.02 + i);
        ctx.fillStyle = GOLD[(i + 1) % GOLD.length];
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 0.7 + Math.random() * 0.8, 0, TAU);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const draw = (time: number) => {
      if (!running) return;

      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, size.w, size.h);

      if (pointer.active) {
        const dx = pointer.x - pointer.px;
        const dy = pointer.y - pointer.py;
        const distance = Math.hypot(dx, dy);

        if (distance > 0.15) {
          emission += distance;
          const spacing = 11;
          emission = Math.min(emission, spacing * 8);

          while (emission >= spacing) {
            emission -= spacing;
            spawnTrail(pointer.x, pointer.y, dx, dy);
          }

          pointer.px = pointer.x;
          pointer.py = pointer.y;
        } else if (time - lastIdle > 130) {
          lastIdle = time;
          addParticle({
            x: pointer.x + (Math.random() - 0.5) * 4,
            y: pointer.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 26,
            vy: -20 - Math.random() * 30,
            maxLife: 0.25 + Math.random() * 0.3,
            size: 0.7 + Math.random() * 1.2,
            color: pickGold(),
            gravity: 90,
            drag: 0.95,
            kind: "dot",
          });
        }
      } else {
        emission = 0;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.life -= dt;

        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        particle.vy += particle.gravity * dt;
        const damping = Math.pow(particle.drag, dt * 60);
        particle.vx *= damping;
        particle.vy *= damping;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
      }

      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.life -= dt;

        if (wave.life <= 0) {
          waves.splice(i, 1);
          continue;
        }

        wave.radius += dt * 120;
      }

      drawWaves();
      drawParticles(time);
      if (pointer.active) drawSparkler(time);

      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = 0;
      frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("blur", hidePointer);
      root.removeEventListener("pointerleave", hidePointer);
      root.classList.remove("sparkler-cursor");
      particles.length = 0;
      waves.length = 0;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-sparkler-cursor="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
