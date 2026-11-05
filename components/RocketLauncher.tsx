"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Vibrant palettes for fireworks bursts and rockets
const ROCKET_PALETTES = [
  // 1. Royal Gold & Champagne
  {
    name: "Imperial Gold",
    colors: ["#fffbeb", "#fef08a", "#fde047", "#facc15", "#f59e0b", "#fbbf24"],
    rocketBody: "#f59e0b",
    stripe: "#fde047",
    cone: "#dc2626",
  },
  // 2. Cyber Purple & Violet (ACES Signature)
  {
    name: "Cyber Purple",
    colors: ["#f3e8ff", "#e9d5ff", "#c084fc", "#a855f7", "#9333ea", "#7c3aed"],
    rocketBody: "#7c3aed",
    stripe: "#c084fc",
    cone: "#facc15",
  },
  // 3. Electric Cyan & Azure
  {
    name: "Electric Cyan",
    colors: ["#ecfeff", "#cffafe", "#67e8f9", "#38bdf8", "#0284c7", "#06b6d4"],
    rocketBody: "#0284c7",
    stripe: "#67e8f9",
    cone: "#f43f5e",
  },
  // 4. Emerald Jewel & Mint
  {
    name: "Emerald Glow",
    colors: ["#ecfdf5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669"],
    rocketBody: "#059669",
    stripe: "#6ee7b7",
    cone: "#f59e0b",
  },
  // 5. Ruby Crimson & Coral
  {
    name: "Ruby Flame",
    colors: ["#fff1f2", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48"],
    rocketBody: "#e11d48",
    stripe: "#fda4af",
    cone: "#fbbf24",
  },
  // 6. Festive Saffron & Tangerine
  {
    name: "Festive Saffron",
    colors: ["#fff7ed", "#ffedd5", "#fed7aa", "#fb923c", "#f97316", "#ea580c"],
    rocketBody: "#ea580c",
    stripe: "#fed7aa",
    cone: "#a855f7",
  },
  // 7. Multi-color Celebration Rainbow
  {
    name: "Rainbow Spark",
    colors: ["#fde047", "#a855f7", "#34d399", "#fb7185", "#38bdf8", "#fb923c"],
    rocketBody: "#8b5cf6",
    stripe: "#facc15",
    cone: "#ef4444",
  },
];

interface FlyingRocket {
  id: number;
  startTime: number;
  duration: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
  curlCycles: number;
  curlRadius: number;
  curlPhase: number;
  curlSign: number;
  palette: typeof ROCKET_PALETTES[0];
  lastX: number;
  lastY: number;
  heading: number;
  history: { x: number; y: number; alpha: number }[];
}

interface SparkParticle {
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
  twinkle: boolean;
  history?: { x: number; y: number }[];
}

interface SmokePuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  growth: number;
}

interface BurstFlash {
  x: number;
  y: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
}

export default function RocketLauncher() {
  const [isReady, setIsReady] = useState(true);
  const [isRefilling, setIsRefilling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [bottleRecoil, setBottleRecoil] = useState(false);
  const [muzzleSparks, setMuzzleSparks] = useState(false);

  const bottleRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Active animation collections
  const rocketsRef = useRef<FlyingRocket[]>([]);
  const sparksRef = useRef<SparkParticle[]>([]);
  const smokeRef = useRef<SmokePuff[]>([]);
  const flashesRef = useRef<BurstFlash[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Lazy Web Audio Synthesizer
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, []);

  // Synthesize realistic rocket whoosh & whistling launch sound
  const playLaunchSound = useCallback(
    (durationSec: number) => {
      if (isMuted) return;
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. White Noise Thrust / Hiss Buffer
      const bufferSize = ctx.sampleRate * Math.min(durationSec, 2.8);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + durationSec * 0.7);
      filter.Q.setValueAtTime(3.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.24, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + durationSec);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start(now);
      whiteNoise.stop(now + durationSec);

      // 2. Whistling Corkscrew Oscillator with Pitch Modulation
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + durationSec * 0.85);

      // Vibrato LFO for curly whistle warble
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(7.5, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(35, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + durationSec);

      const oscFilter = ctx.createBiquadFilter();
      oscFilter.type = "lowpass";
      oscFilter.frequency.setValueAtTime(1200, now);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.01, now);
      oscGain.gain.linearRampToValueAtTime(0.12, now + 0.12);
      oscGain.gain.exponentialRampToValueAtTime(0.005, now + durationSec);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec);
    },
    [initAudio, isMuted]
  );

  // Synthesize rich firework detonation boom & crackle pops
  const playBurstSound = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Sub-bass Detonation Thump
    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(135, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.55);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.38, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.6);

    // 2. Explosion Mid Crack / Noise Burst
    const burstLen = ctx.sampleRate * 0.45;
    const burstBuffer = ctx.createBuffer(1, burstLen, ctx.sampleRate);
    const data = burstBuffer.getChannelData(0);
    for (let i = 0; i < burstLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
    }

    const burstSource = ctx.createBufferSource();
    burstSource.buffer = burstBuffer;

    const burstFilter = ctx.createBiquadFilter();
    burstFilter.type = "lowpass";
    burstFilter.frequency.setValueAtTime(800, now);

    const burstGain = ctx.createGain();
    burstGain.gain.setValueAtTime(0.35, now);
    burstGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    burstSource.connect(burstFilter);
    burstFilter.connect(burstGain);
    burstGain.connect(ctx.destination);
    burstSource.start(now);

    // 3. Micro Crackles / Sizzle Echoes
    for (let k = 0; k < 5; k++) {
      const crackleDelay = 0.12 + Math.random() * 0.35;
      const crackleOsc = ctx.createOscillator();
      crackleOsc.type = "triangle";
      crackleOsc.frequency.setValueAtTime(400 + Math.random() * 800, now + crackleDelay);

      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.08, now + crackleDelay);
      crackleGain.gain.exponentialRampToValueAtTime(0.001, now + crackleDelay + 0.06);

      crackleOsc.connect(crackleGain);
      crackleGain.connect(ctx.destination);
      crackleOsc.start(now + crackleDelay);
      crackleOsc.stop(now + crackleDelay + 0.07);
    }
  }, [initAudio, isMuted]);

  // Create spectacular fireworks burst explosion
  const createExplosion = useCallback(
    (x: number, y: number, palette: typeof ROCKET_PALETTES[0]) => {
      playBurstSound();

      // Radial light flash
      flashesRef.current.push({
        x,
        y,
        color: palette.colors[0],
        radius: 65,
        alpha: 0.85,
        decay: 0.045,
      });

      const particleCount = 85 + Math.floor(Math.random() * 45);
      const isRing = Math.random() > 0.75;
      const isWillow = Math.random() > 0.7;

      for (let i = 0; i < particleCount; i++) {
        let angle: number;
        let speed: number;

        if (isRing) {
          angle = (i / particleCount) * Math.PI * 2;
          speed = 3.2 + Math.random() * 1.2;
        } else {
          angle = Math.random() * Math.PI * 2;
          const power = Math.pow(Math.random(), 0.65);
          speed = power * (isWillow ? 4.2 : 6.8) + 1.2;
        }

        const color = palette.colors[Math.floor(Math.random() * palette.colors.length)];

        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          decay: isWillow
            ? 0.009 + Math.random() * 0.006 // Lingering golden weeping willow
            : 0.013 + Math.random() * 0.011,
          gravity: isWillow ? 0.035 : 0.058,
          friction: isWillow ? 0.98 : 0.965,
          size: 2.0 + Math.random() * 1.6,
          twinkle: Math.random() > 0.4,
          history: [{ x, y }],
        });
      }

      // Secondary crackle micro-sparks
      for (let j = 0; j < 18; j++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 3.5 + 0.5;
        sparksRef.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          color: "#ffffff",
          alpha: 1,
          decay: 0.03 + Math.random() * 0.02,
          gravity: 0.04,
          friction: 0.94,
          size: 1.5,
          twinkle: true,
        });
      }
    },
    [playBurstSound]
  );

  // Resize canvas to full window
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Main high-performance Animation Loop
  const runAnimationLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const now = performance.now();

    // Semi-transparent clear to produce velvety trails while keeping underlying web elements visible
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";

    // ── 1. Render Radial Burst Flashes ──
    for (let i = flashesRef.current.length - 1; i >= 0; i--) {
      const f = flashesRef.current[i];
      f.alpha -= f.decay;
      if (f.alpha <= 0) {
        flashesRef.current.splice(i, 1);
        continue;
      }

      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
      grad.addColorStop(0, f.color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = f.alpha;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── 2. Render & Update Smoke Puffs ──
    ctx.globalCompositeOperation = "source-over";
    for (let i = smokeRef.current.length - 1; i >= 0; i--) {
      const s = smokeRef.current[i];
      s.x += s.vx;
      s.y += s.vy;
      s.size += s.growth;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        smokeRef.current.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = s.alpha * 0.35;
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "lighter";

    // ── 3. Render & Update Flying Rockets (Random Curly Trajectory Engine) ──
    for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
      const r = rocketsRef.current[i];
      const elapsed = now - r.startTime;
      const rawT = Math.min(1, elapsed / r.duration);

      // Ease-out trajectory progression mimicking ballistic rocket physics
      const t = 1 - Math.pow(1 - rawT, 1.25);

      // Base Cubic Bézier Path
      const u = 1 - t;
      const bx =
        u * u * u * r.startX +
        3 * u * u * t * r.cp1x +
        3 * u * t * t * r.cp2x +
        t * t * t * r.targetX;

      const by =
        u * u * u * r.startY +
        3 * u * u * t * r.cp1y +
        3 * u * t * t * r.cp2y +
        t * t * t * r.targetY;

      // Base curve tangent vector
      const dx =
        3 * u * u * (r.cp1x - r.startX) +
        6 * u * t * (r.cp2x - r.cp1x) +
        3 * t * t * (r.targetX - r.cp2x);

      const dy =
        3 * u * u * (r.cp1y - r.startY) +
        6 * u * t * (r.cp2y - r.cp1y) +
        3 * t * t * (r.targetY - r.cp2y);

      const tangent = Math.atan2(dy, dx);
      const normal = tangent + Math.PI / 2;

      // Corkscrew Envelope: starts smoothly at 0 (leaves bottle mouth), expands into wild curly loops
      const envelope = Math.sin(rawT * Math.PI) * (0.25 + 0.75 * Math.sin(rawT * Math.PI * 0.7));

      // Corkscrew phase angle
      const curlAngle = r.curlSign * (rawT * r.curlCycles * Math.PI * 2) + r.curlPhase;

      // 2D projection of 3D spiral loop
      const offsetNormal = Math.sin(curlAngle) * r.curlRadius * envelope;
      const offsetTangent = Math.cos(curlAngle) * (r.curlRadius * 0.55) * envelope;

      const currentX = bx + offsetNormal * Math.cos(normal) + offsetTangent * Math.cos(tangent);
      const currentY = by + offsetNormal * Math.sin(normal) + offsetTangent * Math.sin(tangent);

      // Heading direction computed from displacement
      const moveDx = currentX - r.lastX;
      const moveDy = currentY - r.lastY;
      const heading =
        Math.hypot(moveDx, moveDy) > 0.5 ? Math.atan2(moveDy, moveDx) : r.heading;

      r.heading = heading;

      // Store trajectory history for luminous trail
      r.history.push({ x: currentX, y: currentY, alpha: 1 });
      if (r.history.length > 25) r.history.shift();

      // ── Draw Luminous Glowing Ribbon Trail along curly path ──
      if (r.history.length > 2) {
        ctx.beginPath();
        ctx.moveTo(r.history[0].x, r.history[0].y);
        for (let h = 1; h < r.history.length; h++) {
          ctx.lineTo(r.history[h].x, r.history[h].y);
        }
        ctx.strokeStyle = r.palette.colors[2] || "#facc15";
        ctx.lineWidth = 2.4;
        ctx.stroke();
      }

      // ── Emit Exhaust Flame & Spark Particles from Rocket Tail ──
      const tailX = currentX - Math.cos(heading) * 14;
      const tailY = currentY - Math.sin(heading) * 14;

      // 3-5 exhaust spark particles per frame
      for (let s = 0; s < 4; s++) {
        const spread = (Math.random() - 0.5) * 1.2;
        const sparkSpeed = Math.random() * 3.5 + 2.0;
        const sparkAngle = heading + Math.PI + spread;

        sparksRef.current.push({
          x: tailX + (Math.random() - 0.5) * 3,
          y: tailY + (Math.random() - 0.5) * 3,
          vx: Math.cos(sparkAngle) * sparkSpeed,
          vy: Math.sin(sparkAngle) * sparkSpeed,
          color: Math.random() > 0.4 ? "#fef08a" : "#f59e0b",
          alpha: 1,
          decay: 0.038 + Math.random() * 0.03,
          gravity: 0.04,
          friction: 0.95,
          size: 1.8 + Math.random() * 1.4,
          twinkle: false,
        });
      }

      // Subtle smoke puff emission
      if (Math.random() > 0.6) {
        smokeRef.current.push({
          x: tailX,
          y: tailY,
          vx: -Math.cos(heading) * 0.8 + (Math.random() - 0.5) * 0.5,
          vy: -Math.sin(heading) * 0.8 + (Math.random() - 0.5) * 0.5,
          alpha: 0.4,
          decay: 0.015,
          size: 3.5,
          growth: 0.25,
        });
      }

      // ── Draw Rocket Sprite at Current Position ──
      ctx.save();
      ctx.translate(currentX, currentY);
      ctx.rotate(heading + Math.PI / 2); // Rotate sprite to face velocity vector

      // Bamboo guide stick trailing behind
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, 36);
      ctx.stroke();

      // Rocket cylinder body
      ctx.fillStyle = r.palette.rocketBody;
      ctx.fillRect(-3.5, -4, 7, 14);

      // Festive golden middle stripe
      ctx.fillStyle = r.palette.stripe;
      ctx.fillRect(-3.5, 0, 7, 3);

      // Conical nose cone
      ctx.fillStyle = r.palette.cone;
      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.lineTo(-4.5, -4);
      ctx.lineTo(4.5, -4);
      ctx.closePath();
      ctx.fill();

      // Exhaust Nozzle Core Glow
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 10, 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Exhaust Flame Plume
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(-2.5, 10);
      ctx.lineTo(0, 18 + Math.random() * 4);
      ctx.lineTo(2.5, 10);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      r.lastX = currentX;
      r.lastY = currentY;

      // ── Burst condition: Duration reached ──
      if (rawT >= 1) {
        createExplosion(currentX, currentY, r.palette);
        rocketsRef.current.splice(i, 1);
      }
    }

    // ── 4. Render & Update Firework Burst Particles ──
    for (let i = sparksRef.current.length - 1; i >= 0; i--) {
      const p = sparksRef.current[i];

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;

      const prevX = p.x;
      const prevY = p.y;
      p.x += p.vx;
      p.y += p.vy;

      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        sparksRef.current.splice(i, 1);
        continue;
      }

      // Spark trail
      if (p.history) {
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 3) p.history.shift();

        ctx.beginPath();
        ctx.moveTo(p.history[0].x, p.history[0].y);
        for (let h = 1; h < p.history.length; h++) {
          ctx.lineTo(p.history[h].x, p.history[h].y);
        }
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.globalAlpha = p.alpha;
        ctx.stroke();
      } else {
        // Simple spark line
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.globalAlpha = p.alpha;
        ctx.stroke();
      }

      // Spark head point with twinkle
      const currentAlpha = p.twinkle && Math.random() > 0.5 ? p.alpha * 0.4 : p.alpha;
      ctx.globalAlpha = currentAlpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Track active animations for cleanup / pause
    const totalActive =
      rocketsRef.current.length +
      sparksRef.current.length +
      smokeRef.current.length +
      flashesRef.current.length;

    setActiveCount(totalActive);

    if (totalActive > 0) {
      animFrameRef.current = requestAnimationFrame(runAnimationLoop);
    } else {
      // Clear canvas cleanly when everything finished
      ctx.clearRect(0, 0, width, height);
    }
  }, [createExplosion]);

  // Ensure loop runs whenever new rockets or particles are added
  const ensureAnimationRunning = useCallback(() => {
    if (!animFrameRef.current || activeCount === 0) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(runAnimationLoop);
    }
  }, [activeCount, runAnimationLoop]);

  // Trigger Rocket Launch Action
  const launchRocket = () => {
    if (!isReady || isRefilling) return;

    // Capture exact bottle mouth coordinates in window viewport
    let startX = 80;
    let startY = window.innerHeight - 100;

    if (bottleRef.current) {
      const rect = bottleRef.current.getBoundingClientRect();
      startX = rect.left + rect.width * 0.5;
      startY = rect.top + 20; // Bottle neck opening
    }

    // Pick random target in the sky
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    // Target between 20% and 85% width, and 12% to 38% height
    const targetX = canvasWidth * (0.2 + Math.random() * 0.65);
    const targetY = canvasHeight * (0.12 + Math.random() * 0.26);

    const duration = 2100 + Math.random() * 700; // 2.1s - 2.8s flight

    const dx = targetX - startX;
    const dy = targetY - startY;

    // Control points for organic initial trajectory
    const cp1x = startX + dx * (0.12 + Math.random() * 0.2) + (Math.random() - 0.5) * 80;
    const cp1y = startY + dy * (0.42 + Math.random() * 0.18);

    const cp2x = startX + dx * (0.62 + Math.random() * 0.2) + (Math.random() - 0.5) * 110;
    const cp2y = startY + dy * (0.78 + Math.random() * 0.14);

    // Random curly loop parameters: 3 to 5 full corkscrew loops!
    const curlCycles = 3.2 + Math.random() * 2.4;
    const curlRadius = 45 + Math.random() * 40;
    const curlPhase = Math.random() * Math.PI * 2;
    const curlSign = Math.random() > 0.5 ? 1 : -1;

    const palette = ROCKET_PALETTES[Math.floor(Math.random() * ROCKET_PALETTES.length)];

    // Add new rocket
    rocketsRef.current.push({
      id: Date.now() + Math.random(),
      startTime: performance.now(),
      duration,
      startX,
      startY,
      targetX,
      targetY,
      cp1x,
      cp1y,
      cp2x,
      cp2y,
      curlCycles,
      curlRadius,
      curlPhase,
      curlSign,
      palette,
      lastX: startX,
      lastY: startY,
      heading: -Math.PI / 2.5,
      history: [],
    });

    // Audio
    playLaunchSound(duration / 1000);

    // Visual launch effects at bottle mouth
    setBottleRecoil(true);
    setMuzzleSparks(true);
    setTimeout(() => setBottleRecoil(false), 240);
    setTimeout(() => setMuzzleSparks(false), 380);

    // Bottle is now empty
    setIsReady(false);
    ensureAnimationRunning();

    // Refill automatically after short launch delay (1.3s)
    setTimeout(() => {
      setIsRefilling(true);
      setTimeout(() => {
        setIsRefilling(false);
        setIsReady(true);
      }, 500); // 500ms slide-in settle animation
    }, 1300);
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* ── Fullscreen Overlay Canvas for Flying Rockets & Fireworks ── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
        aria-hidden="true"
      />

      {/* ── Glass Bottle & Rocket Interactive Unit at Bottom-Left Corner ── */}
      <div
        className="fixed bottom-6 left-6 z-40 select-none font-sans"
        style={{ touchAction: "manipulation" }}
      >
        {/* Playful Interactive Tooltip on Hover */}
        <div
          className={`absolute left-0 bottom-full mb-3 whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-slate-950/95 border border-purple-500/40 text-xs font-medium tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.35)] backdrop-blur-md transition-all duration-200 pointer-events-none flex items-center gap-2 ${
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <span className="text-sm">🍾</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200 font-semibold">
            {isReady ? "Click bottle to launch rocket!" : "Refilling bottle..."}
          </span>
          <span className="text-amber-400 text-xs animate-pulse">🚀</span>
        </div>

        {/* Floating Sound Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          title={isMuted ? "Unmute rocket sound" : "Mute rocket sound"}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          className="absolute -top-2 -right-2 z-10 p-1.5 rounded-full bg-slate-900/90 border border-purple-500/40 text-slate-300 hover:text-white hover:border-purple-300 transition-all duration-200 shadow-md hover:scale-110 cursor-pointer focus:outline-none"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-purple-300" />
          )}
        </button>

        {/* ── The Glass Bottle & Loaded Rocket Component ── */}
        <div
          ref={bottleRef}
          onClick={launchRocket}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              launchRocket();
            }
          }}
          aria-label="Firework Rocket in Bottle - Click to Launch"
          title="Click to launch rocket! 🚀"
          className={`group relative flex flex-col items-center cursor-pointer transition-transform duration-200 focus:outline-none ${
            isHovered ? "scale-105" : ""
          } ${bottleRecoil ? "-translate-y-1 rotate-1 scale-95" : ""}`}
        >
          {/* Ambient Ground Glow under the Bottle (Purple Tint) */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full bg-purple-600/35 blur-md pointer-events-none group-hover:bg-purple-500/50 transition-colors" />

          {/* Muzzle Blast Sparks on Launch */}
          {muzzleSparks && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-amber-400/80 blur-sm animate-ping" />
              <span className="absolute w-5 h-5 rounded-full bg-purple-200 blur-[1px]" />
            </div>
          )}

          {/* ── Handcrafted Glass Bottle SVG with Loaded Rocket (Increased Size & Purple Tint) ── */}
          <svg
            width="74"
            height="136"
            viewBox="0 0 62 115"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_4px_16px_rgba(112,0,255,0.25)]"
          >
            <defs>
              {/* Glass Bottle Wall Gradient with Elegant Purple Tint */}
              <linearGradient id="glassWall" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
                <stop offset="16%" stopColor="#ffffff" stopOpacity="0.32" />
                <stop offset="35%" stopColor="#2e1065" stopOpacity="0.22" />
                <stop offset="65%" stopColor="#9333ea" stopOpacity="0.2" />
                <stop offset="85%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.5" />
              </linearGradient>

              {/* Glass Specular Gloss Highlight */}
              <linearGradient id="specularGleam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#f3e8ff" stopOpacity="0.1" />
              </linearGradient>

              {/* Heavy Bottom Glass Base Gradient with Purple Depth */}
              <linearGradient id="thickGlassBase" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#7e22ce" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b0764" stopOpacity="0.9" />
              </linearGradient>

              {/* Rocket Body Festive Gradient */}
              <linearGradient id="rocketFestive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="40%" stopColor="#7c3aed" />
                <stop offset="70%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>

              {/* Wooden Stick Gradient */}
              <linearGradient id="woodenStick" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>

            {/* ── Floor Contact Shadow ── */}
            <ellipse cx="31" cy="110" rx="22" ry="4" fill="#000000" fillOpacity="0.7" />

            {/* ── The Loaded Rocket Inside the Bottle ── */}
            {(isReady || isRefilling) && (
              <g
                className={`transition-all duration-500 origin-bottom ${
                  isRefilling
                    ? "animate-in slide-in-from-top-12 fade-in duration-500"
                    : isHovered
                    ? "-rotate-2"
                    : ""
                }`}
                style={{ transformOrigin: "31px 105px" }}
              >
                {/* 1. Bamboo Stick (extending into bottle) */}
                <line
                  x1="29"
                  y1="22"
                  x2="28"
                  y2="104"
                  stroke="url(#woodenStick)"
                  strokeWidth="2.0"
                  strokeLinecap="round"
                />

                {/* 2. Rocket Cylindrical Body (resting tilted out of bottle mouth) */}
                <g transform="translate(30, 22) rotate(10) translate(-30, -22)">
                  {/* Fuse hanging with twinkling spark */}
                  <path
                    d="M 28 22 Q 25 28 23 32"
                    stroke="#fef08a"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Fuse ember tip */}
                  <circle
                    cx="23"
                    cy="32"
                    r="1.6"
                    fill="#facc15"
                    className="animate-pulse drop-shadow-[0_0_4px_rgba(250,204,21,0.9)]"
                  />

                  {/* Rocket Stick upper part */}
                  <line
                    x1="30"
                    y1="6"
                    x2="30"
                    y2="24"
                    stroke="url(#woodenStick)"
                    strokeWidth="2.0"
                  />

                  {/* Rocket Body Cylinder */}
                  <rect
                    x="25"
                    y="3"
                    width="10"
                    height="19"
                    rx="1.5"
                    fill="url(#rocketFestive)"
                    stroke="#facc15"
                    strokeWidth="0.8"
                  />

                  {/* Festive Diagonal Stripes */}
                  <line
                    x1="25"
                    y1="8"
                    x2="35"
                    y2="12"
                    stroke="#fde047"
                    strokeWidth="1.6"
                  />
                  <line
                    x1="25"
                    y1="13"
                    x2="35"
                    y2="17"
                    stroke="#38bdf8"
                    strokeWidth="1.6"
                  />

                  {/* Conical Red Nose Cone */}
                  <path
                    d="M 30 -8 L 24 3 L 36 3 Z"
                    fill="#ef4444"
                    stroke="#fbbf24"
                    strokeWidth="0.8"
                  />
                  {/* Nosecone highlight */}
                  <path d="M 30 -6 L 27 2 L 30 2 Z" fill="#fca5a5" fillOpacity="0.6" />

                  {/* Upper launch glow on rocket tip */}
                  <circle
                    cx="30"
                    cy="-8"
                    r="1.8"
                    fill="#ffffff"
                    className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                  />
                </g>
              </g>
            )}

            {/* ── Glass Bottle Body (Rendered over the stick with Purple Tint) ── */}

            {/* Bottle Inner Body Shade */}
            <path
              d="M 24 32 L 24 44 C 24 50, 16 56, 16 66 L 16 102 C 16 107, 20 109, 31 109 C 42 109, 46 107, 46 102 L 46 66 C 46 56, 38 50, 38 44 L 38 32 Z"
              fill="url(#glassWall)"
            />

            {/* Thick Heavy Glass Base with Purple Tint */}
            <path
              d="M 16 98 L 16 103 C 16 107.5, 20 109.5, 31 109.5 C 42 109.5, 46 107.5, 46 103 L 46 98 C 42 100, 20 100, 16 98 Z"
              fill="url(#thickGlassBase)"
            />
            <ellipse cx="31" cy="107.5" rx="13" ry="1.8" fill="#f3e8ff" fillOpacity="0.45" />

            {/* Left Glass Thickness / Specular Highlight */}
            <path
              d="M 18 68 L 18 100"
              stroke="url(#specularGleam)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Right Subtle Highlight */}
            <path
              d="M 44 68 L 44 100"
              stroke="#f3e8ff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.35"
            />

            {/* Curved Shoulder Highlights */}
            <path
              d="M 24 46 C 22 52, 18 56, 17 64"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeOpacity="0.5"
            />

            {/* Bottle Neck Cylinder */}
            <rect
              x="25"
              y="30"
              width="12"
              height="15"
              fill="url(#glassWall)"
              stroke="#c084fc"
              strokeWidth="0.8"
              strokeOpacity="0.45"
            />
            <line
              x1="26.5"
              y1="32"
              x2="26.5"
              y2="44"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />

            {/* Bottle Collar Lip Ring (Opening Rim) */}
            <ellipse
              cx="31"
              cy="30"
              rx="7.5"
              ry="2.4"
              fill="#9333ea"
              fillOpacity="0.35"
              stroke="#e9d5ff"
              strokeWidth="1.2"
            />
            <ellipse
              cx="31"
              cy="29.2"
              rx="5.5"
              ry="1.6"
              fill="#2e1065"
              fillOpacity="0.85"
            />

            {/* Glass Bottle Outer Perimeter Contour (Purple Tint) */}
            <path
              d="M 23.5 30 L 23.5 44 C 23.5 50.5, 15 56.5, 15 67 L 15 102 C 15 107.8, 19.5 110, 31 110 C 42.5 110, 47 107.8, 47 102 L 47 67 C 47 56.5, 38.5 50.5, 38.5 44 L 38.5 30"
              stroke="#c084fc"
              strokeWidth="1.2"
              strokeOpacity="0.55"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
