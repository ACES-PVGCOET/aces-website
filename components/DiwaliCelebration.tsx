"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

// Elegant Color Palettes for Multi-colored Fireworks
const FIREWORK_PALETTES = [
  // 1. Royal Imperial Gold & Champagne
  ["#fde047", "#facc15", "#f59e0b", "#fffbeb", "#fbbf24"],
  // 2. Cyber Purple & Violet
  ["#c084fc", "#a855f7", "#9333ea", "#e9d5ff", "#7c3aed"],
  // 3. Emerald Jewel & Mint
  ["#34d399", "#10b981", "#059669", "#6ee7b7", "#a7f3d0"],
  // 4. Ruby Crimson & Rose
  ["#fb7185", "#f43f5e", "#e11d48", "#fda4af", "#ff2a5f"],
  // 5. Electric Cyan & Sky Aqua
  ["#38bdf8", "#06b6d4", "#0284c7", "#67e8f9", "#e0f2fe"],
  // 6. Vibrant Festive Saffron & Tangerine
  ["#fb923c", "#f97316", "#ea580c", "#fed7aa", "#ffedd5"],
  // 7. Multi-color Celebration Rainbow
  ["#fde047", "#a855f7", "#34d399", "#fb7185", "#38bdf8", "#fb923c"],
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  palette: string[];
  trailColor: string;
}

export default function DiwaliCelebration() {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [greetingStage, setGreetingStage] = useState<"happy" | "shubh">("happy");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number>(0);
  const rocketsRef = useRef<Rocket[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastLaunchTimeRef = useRef<number>(0);

  // Trigger celebration
  const startCelebration = () => {
    setIsOpen(true);
    setShowText(false);
    setGreetingStage("happy");

    // Text appears smoothly at 450ms while fireworks burst
    setTimeout(() => {
      setShowText(true);
    }, 450);
  };

  const closeCelebration = useCallback(() => {
    setIsOpen(false);
    setShowText(false);
    setGreetingStage("happy");
    if (animIdRef.current) {
      cancelAnimationFrame(animIdRef.current);
    }
    rocketsRef.current = [];
    particlesRef.current = [];
  }, []);

  // Smooth transition from "Happy Diwali" to "शुभ दीपावली" in Devnagari
  useEffect(() => {
    if (!isOpen) {
      setGreetingStage("happy");
      return;
    }

    // First show "Happy Diwali", then smoothly transition into "शुभ दीपावली" at 2.4s
    const timer = setTimeout(() => {
      setGreetingStage("shubh");
    }, 2400);

    // Alternate gracefully every 3.8s while modal remains active
    const interval = setInterval(() => {
      setGreetingStage((prev) => (prev === "happy" ? "shubh" : "happy"));
    }, 3800);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen]);

  // Keyboard accessibility: ESC closes celebration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCelebration();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCelebration]);

  // Smooth, Elegant Fireworks Animation Engine
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Smooth, blossoming particle explosion
    const createExplosion = (x: number, y: number, palette: string[]) => {
      const count = 60 + Math.floor(Math.random() * 30);
      const isRing = Math.random() > 0.7;

      for (let i = 0; i < count; i++) {
        let angle: number;
        let speed: number;

        if (isRing) {
          angle = (i / count) * Math.PI * 2;
          speed = 2.8 + Math.random() * 1.0;
        } else {
          angle = Math.random() * Math.PI * 2;
          speed = Math.random() * 3.8 + 1.2; // Smooth, graceful expansion speed
        }

        const color = palette[Math.floor(Math.random() * palette.length)];

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          decay: 0.010 + Math.random() * 0.008, // Luminous, graceful lingering fade
          gravity: 0.045, // Soft, gentle downward drift
          friction: 0.965, // Smooth, velvety deceleration
          size: 2.0 + Math.random() * 1.4,
        });
      }
    };

    // Smooth-ascending rocket
    const launchRocket = (forcedX?: number, forcedTargetY?: number) => {
      const startX = forcedX ?? width * 0.15 + Math.random() * (width * 0.7);
      const targetY = forcedTargetY ?? height * 0.12 + Math.random() * (height * 0.38);
      const targetX = startX + (Math.random() * 100 - 50);
      const palette = FIREWORK_PALETTES[Math.floor(Math.random() * FIREWORK_PALETTES.length)];

      const dx = targetX - startX;
      const dy = targetY - height;
      const distance = Math.hypot(dx, dy);
      const speed = 14 + Math.random() * 4; // Smooth, graceful speed

      rocketsRef.current.push({
        x: startX,
        y: height,
        targetY,
        vx: (dx / distance) * speed,
        vy: (dy / distance) * speed,
        palette,
        trailColor: palette[0],
      });
    };

    // ── Instant Opening Explosions ──
    createExplosion(width * 0.30, height * 0.28, FIREWORK_PALETTES[0]); // Gold burst
    createExplosion(width * 0.70, height * 0.24, FIREWORK_PALETTES[1]); // Purple burst
    createExplosion(width * 0.50, height * 0.36, FIREWORK_PALETTES[6]); // Rainbow burst

    // Smooth successive rockets
    setTimeout(() => launchRocket(width * 0.22, height * 0.22), 150);
    setTimeout(() => launchRocket(width * 0.78, height * 0.25), 350);

    const loop = (currentTime: number) => {
      // Fade old particle trails to transparent so the blurred underlying website stays visible
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
      ctx.fillRect(0, 0, width, height);

      // Additive blending for vivid, glowing sparks
      ctx.globalCompositeOperation = "lighter";

      // Periodically launch rockets at a smooth, relaxed tempo (every 450-800ms)
      if (currentTime - lastLaunchTimeRef.current > 450 + Math.random() * 350) {
        launchRocket();
        lastLaunchTimeRef.current = currentTime;
      }

      // ── Update & Render Rockets (Smooth & Graceful) ──
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        const prevX = r.x;
        const prevY = r.y;

        r.x += r.vx;
        r.y += r.vy;

        // Draw smooth rocket trail line
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(r.x, r.y);
        ctx.strokeStyle = r.trailColor;
        ctx.lineWidth = 2.6;
        ctx.stroke();

        // Rocket glowing tip
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Apex reached -> burst smoothly!
        if (r.y <= r.targetY || r.vy >= 0) {
          createExplosion(r.x, r.y, r.palette);
          rocketsRef.current.splice(i, 1);
        }
      }

      // ── Update & Render Particles (Smooth & Luminous) ──
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;

        const prevX = p.x;
        const prevY = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.alpha;

        // Spark trail line
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.stroke();

        // Spark head point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animIdRef.current = requestAnimationFrame(loop);
    };

    animIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [isOpen]);

  return (
    <>
      {/* ── Floating Celebrate Diwali Button with comfortable spacing above Announcements Widget ── */}
      <div className="fixed bottom-[114px] right-6 z-40 sm:bottom-[122px] sm:right-6 font-sans">
        {/* Tooltip on hover */}
        {isTooltipVisible && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-black/90 border border-amber-400/50 text-amber-200 text-xs font-medium tracking-wide shadow-[0_0_15px_rgba(250,204,21,0.35)] backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-none flex items-center gap-1.5">
            <span>🪔</span>
            <span>Celebrate Diwali ✨</span>
          </div>
        )}

        <button
          onClick={startCelebration}
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          aria-label="Celebrate Diwali with Fire-crackers"
          title="Diwali Celebration ✨"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full p-0.5 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.75)] hover:scale-110 active:scale-95 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 cursor-pointer"
        >
          {/* Subtle pulsating outer aura ring */}
          <span className="absolute -inset-1 rounded-full bg-yellow-400/30 blur-sm animate-pulse pointer-events-none" />

          {/* Inner dark core with glowing golden border */}
          <div className="relative flex items-center justify-center w-full h-full rounded-full bg-slate-950/90 border border-yellow-300/60 group-hover:bg-slate-900/80 transition-colors">
            {/* Festive Rocket / Firecracker Sparkle SVG Icon */}
            <svg
              className="w-5 h-5 text-amber-300 group-hover:text-yellow-200 group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Rocket body */}
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </div>
        </button>
      </div>

      {/* ── Translucent Blurred Fireworks Celebration Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-md flex items-center justify-center overflow-hidden animate-in fade-in duration-300 cursor-crosshair select-none"
          onClick={closeCelebration}
        >
          {/* Canvas for realistic multi-colored firecracker particle physics */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Top-right sleek close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeCelebration();
            }}
            className="fixed top-6 right-6 z-20 p-2.5 rounded-full bg-slate-900/80 border border-amber-400/40 text-amber-200 hover:text-white hover:bg-slate-800 hover:border-amber-300 transition-all duration-200 shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
            aria-label="Close celebration"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Centered Golden Diwali Typography with smooth transition to Devnagari (No Clipping) */}
          {showText && (
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-5xl mx-auto pointer-events-none animate-in fade-in zoom-in-95 duration-500 overflow-visible w-full">
              {/* CSS Grid Stack: Natural flexible height & width, zero clipping for ascenders/descenders */}
              <div className="grid grid-cols-1 grid-rows-1 place-items-center w-full py-4 overflow-visible">
                {/* 1. "Happy Diwali" - Luxury Serif Font */}
                <h1
                  className={`col-start-1 row-start-1 font-luxury font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider leading-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 uppercase transition-all duration-700 ease-in-out py-3 px-6 drop-shadow-[0_0_35px_rgba(250,204,21,0.7)] select-none text-center ${
                    greetingStage === "happy"
                      ? "opacity-100 scale-100 blur-0 translate-y-0"
                      : "opacity-0 scale-95 blur-sm -translate-y-2 pointer-events-none"
                  }`}
                >
                  Happy Diwali
                </h1>

                {/* 2. "शुभ दीपावली" - Traditional Devnagari Script */}
                <h1
                  className={`col-start-1 row-start-1 font-devnagari font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-normal leading-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 transition-all duration-700 ease-in-out py-3 px-6 drop-shadow-[0_0_35px_rgba(250,204,21,0.7)] select-none text-center ${
                    greetingStage === "shubh"
                      ? "opacity-100 scale-100 blur-0 translate-y-0"
                      : "opacity-0 scale-105 blur-sm translate-y-2 pointer-events-none"
                  }`}
                >
                  शुभ दीपावली
                </h1>
              </div>

              {/* "from ACES Family" - Smaller Cursive Font */}
              <p className="font-cursive text-2xl sm:text-3xl md:text-4xl text-amber-200/95 tracking-wider mt-1 sm:mt-2 drop-shadow-[0_0_20px_rgba(251,191,36,0.7)]">
                from ACES Family
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
