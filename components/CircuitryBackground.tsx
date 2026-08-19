"use client";

import React, { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface CircuitTrace {
  path: Point[];
  width: number;
  isBus: boolean;
  busLines?: number;
}

interface Via {
  x: number;
  y: number;
  r: number;
}

interface ICChip {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  pins: { x: number; y: number; side: "left" | "right" | "top" | "bottom" }[];
}

interface SignalPulse {
  traceIndex: number;
  progress: number;
  speed: number;
  length: number;
}

interface BinaryStream {
  x: number;
  y: number;
  dx: number;
  dy: number;
  text: string;
  speed: number;
  opacity: number;
}

export default function CircuitryBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let scrollY = window.scrollY;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let smoothGlow = 0;

    // Track scrolling and calculate scroll velocity
    const handleScroll = () => {
      scrollY = window.scrollY;
      const diff = Math.abs(scrollY - lastScrollY);
      scrollVelocity = Math.min(30, scrollVelocity + diff * 0.15);
      lastScrollY = scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    let traces: CircuitTrace[] = [];
    let vias: Via[] = [];
    let chips: ICChip[] = [];
    let pulses: SignalPulse[] = [];
    let binaryStreams: BinaryStream[] = [];

    // Generator function for circuit traces with 90 deg and 45 deg angles
    const generateCircuit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      traces = [];
      vias = [];
      chips = [];
      pulses = [];
      binaryStreams = [];

      // 1. Generate IC Chips (Placed strategically across the page)
      const chipDefs = [
        { label: "ACES-CORE 01", xRatio: 0.15, yRatio: 0.25, w: 130, h: 80 },
        { label: "NEURAL-BUS", xRatio: 0.82, yRatio: 0.4, w: 140, h: 90 },
        { label: "GATE-ARRAY", xRatio: 0.2, yRatio: 0.72, w: 120, h: 75 },
        { label: "CYBER-MCU", xRatio: 0.78, yRatio: 0.85, w: 150, h: 100 },
      ];

      chipDefs.forEach((def) => {
        const cx = width * def.xRatio;
        const cy = height * def.yRatio;
        const pins: ICChip["pins"] = [];
        const pinSpacing = 14;

        // Top & Bottom pins
        const numPinsHoriz = Math.floor((def.w - 20) / pinSpacing);
        for (let i = 0; i < numPinsHoriz; i++) {
          const px = cx - def.w / 2 + 15 + i * pinSpacing;
          pins.push({ x: px, y: cy - def.h / 2, side: "top" });
          pins.push({ x: px, y: cy + def.h / 2, side: "bottom" });
        }

        // Left & Right pins
        const numPinsVert = Math.floor((def.h - 20) / pinSpacing);
        for (let i = 0; i < numPinsVert; i++) {
          const py = cy - def.h / 2 + 15 + i * pinSpacing;
          pins.push({ x: cx - def.w / 2, y: py, side: "left" });
          pins.push({ x: cx + def.w / 2, y: py, side: "right" });
        }

        chips.push({
          x: cx,
          y: cy,
          w: def.w,
          h: def.h,
          label: def.label,
          pins,
        });
      });

      // 2. Generate Traces connecting pins to canvas grid
      const gridStep = 30;
      chips.forEach((chip) => {
        chip.pins.forEach((pin, pinIdx) => {
          // Filter to limit total lines for performance & crisp look
          if (pinIdx % 2 !== 0) return;

          const path: Point[] = [{ x: pin.x, y: pin.y }];
          let curX = pin.x;
          let curY = pin.y;

          // Extend outwards from pin
          let extension = Math.random() * 40 + 20;
          if (pin.side === "top") curY -= extension;
          if (pin.side === "bottom") curY += extension;
          if (pin.side === "left") curX -= extension;
          if (pin.side === "right") curX += extension;

          path.push({ x: curX, y: curY });

          // Add 90 or 45 degree bends
          const steps = Math.floor(Math.random() * 3) + 2;
          for (let s = 0; s < steps; s++) {
            const dir = Math.random();
            const distance = (Math.floor(Math.random() * 4) + 2) * gridStep;

            if (dir < 0.4) {
              // Horizontal segment
              curX += (Math.random() < 0.5 ? 1 : -1) * distance;
            } else if (dir < 0.8) {
              // Vertical segment
              curY += (Math.random() < 0.5 ? 1 : -1) * distance;
            } else {
              // 45-degree diagonal segment
              const diag = distance * 0.7;
              const signX = Math.random() < 0.5 ? 1 : -1;
              const signY = Math.random() < 0.5 ? 1 : -1;
              curX += signX * diag;
              curY += signY * diag;
            }

            // Keep within bounds
            curX = Math.max(20, Math.min(width - 20, curX));
            curY = Math.max(20, Math.min(height * 2.2 - 20, curY));

            path.push({ x: curX, y: curY });
          }

          const traceIndex = traces.length;
          traces.push({
            path,
            width: Math.random() > 0.8 ? 2.2 : 1.2,
            isBus: Math.random() > 0.85,
          });

          // Add Via at endpoint
          vias.push({
            x: curX,
            y: curY,
            r: Math.random() * 1.5 + 2.5,
          });

          // Add occasional signal pulse
          if (Math.random() < 0.6) {
            pulses.push({
              traceIndex,
              progress: Math.random(),
              speed: Math.random() * 0.005 + 0.003,
              length: Math.random() * 0.2 + 0.1,
            });
          }
        });
      });

      // 3. Add standalone global PCB Bus Traces across screen
      const numBusLines = 8;
      for (let b = 0; b < numBusLines; b++) {
        const startY = (height / numBusLines) * b + Math.random() * 60;
        const path: Point[] = [{ x: 0, y: startY }];
        let cx = 0;
        let cy = startY;

        while (cx < width) {
          const stepX = Math.random() * 180 + 80;
          cx += stepX;

          // Corner bend
          if (Math.random() < 0.5) {
            const bendY = cy + (Math.random() < 0.5 ? 40 : -40);
            path.push({ x: cx - 40, y: cy });
            path.push({ x: cx, y: bendY });
            cy = bendY;
          } else {
            path.push({ x: cx, y: cy });
          }

          // Add vias at junctions
          if (Math.random() < 0.4) {
            vias.push({ x: cx, y: cy, r: 3 });
          }
        }

        const traceIndex = traces.length;
        traces.push({
          path,
          width: 2,
          isBus: true,
        });

        pulses.push({
          traceIndex,
          progress: Math.random(),
          speed: Math.random() * 0.006 + 0.004,
          length: 0.15,
        });
      }

      // 4. Binary Data Streams (010101)
      for (let i = 0; i < 12; i++) {
        binaryStreams.push({
          x: Math.random() * width,
          y: Math.random() * height * 1.8,
          dx: (Math.random() - 0.5) * 0.5,
          dy: Math.random() * 0.8 + 0.3,
          text: Array.from({ length: 6 }, () => (Math.random() > 0.5 ? "1" : "0")).join(" "),
          speed: Math.random() * 0.02 + 0.01,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    generateCircuit();
    window.addEventListener("resize", generateCircuit);

    // Animation & Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Decaying scroll velocity
      scrollVelocity *= 0.92;

      // Scroll glow factor: starts near 0 at top, ramps up as user scrolls + scroll velocity boost
      const targetGlow = Math.min(1.0, scrollY / 300 + scrollVelocity / 15);
      smoothGlow += (targetGlow - smoothGlow) * 0.08;

      // Dynamic colors based on glow state
      // Unscrolled: barely visible dark purple/gray trace lines
      // Scrolled: electric neon purple glow
      const baseAlpha = 0.06;
      const currentAlpha = baseAlpha + smoothGlow * 0.65;

      const r = Math.round(90 + smoothGlow * (168 - 90));
      const g = Math.round(50 + smoothGlow * (85 - 50));
      const b = Math.round(140 + smoothGlow * (247 - 140));

      const traceColor = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
      const glowColor = `rgba(168, 85, 247, ${Math.min(0.9, smoothGlow * 0.9)})`;

      // --------------------------------------------------
      // LAYER 1: DRAW PCB TRACES & BUS LINES
      // --------------------------------------------------
      traces.forEach((trace) => {
        if (trace.path.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(trace.path[0].x, trace.path[0].y);
        for (let i = 1; i < trace.path.length; i++) {
          ctx.lineTo(trace.path[i].x, trace.path[i].y);
        }

        ctx.strokeStyle = traceColor;
        ctx.lineWidth = trace.width + smoothGlow * 0.8;

        if (smoothGlow > 0.1) {
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = smoothGlow * 12;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw inner bright core when glowing
        if (smoothGlow > 0.25) {
          ctx.beginPath();
          ctx.moveTo(trace.path[0].x, trace.path[0].y);
          for (let i = 1; i < trace.path.length; i++) {
            ctx.lineTo(trace.path[i].x, trace.path[i].y);
          }
          ctx.strokeStyle = `rgba(243, 232, 255, ${smoothGlow * 0.5})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });

      // --------------------------------------------------
      // LAYER 2: DRAW SOLDER VIAS & PADS
      // --------------------------------------------------
      vias.forEach((via) => {
        const viaAlpha = 0.1 + smoothGlow * 0.75;
        ctx.beginPath();
        ctx.arc(via.x, via.y, via.r + smoothGlow * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${viaAlpha})`;

        if (smoothGlow > 0.15) {
          ctx.shadowColor = "#c084fc";
          ctx.shadowBlur = smoothGlow * 10;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner hole center of via pad
        ctx.beginPath();
        ctx.arc(via.x, via.y, via.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "#06020c";
        ctx.fill();
      });

      // --------------------------------------------------
      // LAYER 3: DRAW IC CHIPS & PACKAGES
      // --------------------------------------------------
      chips.forEach((chip) => {
        const chipAlpha = 0.08 + smoothGlow * 0.4;
        const borderAlpha = 0.12 + smoothGlow * 0.7;

        // Chip main body
        ctx.fillStyle = `rgba(20, 10, 35, ${chipAlpha})`;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${borderAlpha})`;
        ctx.lineWidth = 1.5;

        if (smoothGlow > 0.2) {
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = smoothGlow * 14;
        }

        ctx.fillRect(chip.x - chip.w / 2, chip.y - chip.h / 2, chip.w, chip.h);
        ctx.strokeRect(chip.x - chip.w / 2, chip.y - chip.h / 2, chip.w, chip.h);
        ctx.shadowBlur = 0;

        // Chip Pin Leads
        chip.pins.forEach((pin) => {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${borderAlpha})`;
          ctx.fillRect(pin.x - 2, pin.y - 2, 4, 4);
        });

        // Chip Label Text
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(233, 213, 255, ${0.2 + smoothGlow * 0.75})`;
        ctx.fillText(chip.label, chip.x, chip.y);

        // Notch indicator on top left corner
        ctx.beginPath();
        ctx.arc(chip.x - chip.w / 2 + 10, chip.y - chip.h / 2 + 10, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${borderAlpha})`;
        ctx.fill();
      });

      // --------------------------------------------------
      // LAYER 4: TRAVELING ELECTRIC SIGNAL PULSES
      // --------------------------------------------------
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed * (1 + smoothGlow * 1.5);
        if (pulse.progress > 1) {
          pulse.progress = 0;
        }

        const trace = traces[pulse.traceIndex];
        if (!trace || trace.path.length < 2) return;

        // Calculate position along multi-segment path
        const path = trace.path;
        let totalLen = 0;
        const segLens: number[] = [];

        for (let i = 0; i < path.length - 1; i++) {
          const len = Math.hypot(path[i + 1].x - path[i].x, path[i + 1].y - path[i].y);
          segLens.push(len);
          totalLen += len;
        }

        const targetDist = pulse.progress * totalLen;
        let currentDist = 0;
        let px = path[0].x;
        let py = path[0].y;

        for (let i = 0; i < segLens.length; i++) {
          if (currentDist + segLens[i] >= targetDist) {
            const segProgress = (targetDist - currentDist) / segLens[i];
            px = path[i].x + (path[i + 1].x - path[i].x) * segProgress;
            py = path[i].y + (path[i + 1].y - path[i].y) * segProgress;
            break;
          }
          currentDist += segLens[i];
        }

        // Draw glowing signal pulse dot
        const pulseAlpha = (0.2 + smoothGlow * 0.8) * Math.sin(pulse.progress * Math.PI);
        ctx.beginPath();
        ctx.arc(px, py, 2.5 + smoothGlow * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        ctx.shadowColor = "#e9d5ff";
        ctx.shadowBlur = 12 * (0.5 + smoothGlow);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // --------------------------------------------------
      // LAYER 5: BINARY DATA STREAMS (010101)
      // --------------------------------------------------
      if (smoothGlow > 0.15) {
        ctx.font = "9px monospace";
        binaryStreams.forEach((stream) => {
          stream.y += stream.speed * (1 + smoothGlow);
          if (stream.y > height * 2.2) stream.y = 0;

          ctx.fillStyle = `rgba(192, 132, 252, ${stream.opacity * smoothGlow * 0.7})`;
          ctx.fillText(stream.text, stream.x, stream.y);
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", generateCircuit);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.95 }}
    />
  );
}
