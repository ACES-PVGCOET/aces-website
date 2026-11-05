"use client";

import React, { useState, useEffect } from "react";

interface DiyaProps {
  id: number;
  threadHeight: {
    base: number;
    sm: number;
    lg: number;
  };
  leftPos: {
    base: number;
    sm: number;
    lg: number;
  };
  scale: number;
  swayClass: string;
  flameClass: string;
  delay: string;
}

const DIYAS_DATA: DiyaProps[] = [
  {
    id: 1,
    threadHeight: { base: 95, sm: 115, lg: 135 },
    leftPos: { base: 8, sm: 18, lg: 28 },
    scale: 0.78,
    swayClass: "animate-diya-sway-1",
    flameClass: "animate-flame-1",
    delay: "0s",
  },
  {
    id: 2,
    threadHeight: { base: 145, sm: 175, lg: 210 },
    leftPos: { base: 46, sm: 68, lg: 94 },
    scale: 0.88,
    swayClass: "animate-diya-sway-2",
    flameClass: "animate-flame-2",
    delay: "0.8s",
  },
  {
    id: 3,
    threadHeight: { base: 75, sm: 90, lg: 108 },
    leftPos: { base: 84, sm: 118, lg: 156 },
    scale: 0.72,
    swayClass: "animate-diya-sway-3",
    flameClass: "animate-flame-3",
    delay: "1.5s",
  },
];

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function DiwaliHangingDiyas() {
  const [activeDiya, setActiveDiya] = useState<number | null>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate gentle ambient floating sparkles near the diyas
    const ambientSparkles: Sparkle[] = Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      x: 15 + Math.random() * 180,
      y: 50 + Math.random() * 180,
      size: 1.8 + Math.random() * 2.5,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 4,
    }));
    setSparkles(ambientSparkles);
  }, []);

  const handleDiyaClick = (id: number) => {
    setActiveDiya(id);
    setShowGreeting(true);

    // Auto dismiss greeting after 3.5 seconds
    const timer = setTimeout(() => {
      setShowGreeting(false);
      setActiveDiya(null);
    }, 3500);

    return () => clearTimeout(timer);
  };

  if (!mounted) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-0 pointer-events-none z-[5] overflow-visible select-none"
      aria-label="Diwali Hanging Diyas"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
        {/* Ambient Warm Golden Corner Illumination (Preserved) */}
        <div className="absolute -top-12 -left-8 w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-br from-amber-500/15 via-yellow-500/8 to-transparent rounded-full blur-[90px] pointer-events-none" />

        {/* Ambient Floating Sparkles (Preserved) */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute rounded-full bg-yellow-200/90 pointer-events-none animate-diya-sparkle-float"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              boxShadow: `0 0 ${sparkle.size * 2}px rgba(250, 204, 21, 0.9)`,
              animationDuration: `${sparkle.duration}s`,
              animationDelay: `${sparkle.delay}s`,
            }}
          />
        ))}

        {/* Interactive Easter Egg Greeting Tooltip */}
        {showGreeting && (
          <div
            className="absolute left-6 sm:left-20 top-24 sm:top-32 z-30 pointer-events-auto cursor-pointer animate-in fade-in zoom-in-95 duration-300"
            onClick={() => setShowGreeting(false)}
          >
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.4)] text-amber-200 text-xs sm:text-sm font-medium tracking-wide">
              <span className="text-base sm:text-lg animate-pulse">🪔</span>
              <span className="font-semibold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">
                Shubh Deepavali ✨
              </span>
              <span className="text-amber-400/80 text-xs hidden sm:inline font-mono">
                | Wishing you joy & light
              </span>
            </div>
          </div>
        )}

        {/* Three Hanging Diyas */}
        {DIYAS_DATA.map((diya) => {
          const isInteracted = activeDiya === diya.id;

          return (
            <div
              key={diya.id}
              className={`absolute top-0 flex flex-col items-center pointer-events-none origin-top ${diya.swayClass}`}
              style={{
                left: `clamp(${diya.leftPos.base}px, ${diya.leftPos.base}px + 4vw, ${diya.leftPos.lg}px)`,
                animationDelay: diya.delay,
              }}
            >
              {/* Golden Shiny Thread with Subtle Shimmer */}
              <div
                className="relative flex flex-col items-center"
                style={{
                  height: `clamp(${diya.threadHeight.base}px, ${diya.threadHeight.base}px + 5vw, ${diya.threadHeight.lg}px)`,
                }}
              >
                {/* Ceiling Mount Ring / Pin */}
                <div className="w-1.5 h-1 rounded-b-sm bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_4px_rgba(245,158,11,0.6)]" />

                {/* The Golden Thread Line */}
                <div className="relative w-[1.5px] h-full bg-gradient-to-b from-amber-400/70 via-yellow-300 to-amber-500 shadow-[0_0_4px_rgba(250,204,21,0.5)] overflow-hidden">
                  {/* Shimmer sweep effect */}
                  <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-white to-transparent opacity-85 animate-thread-shimmer" />
                </div>

                {/* Upper Ornamental Golden Bead */}
                <div
                  className="absolute top-[30%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-400 shadow-[0_0_5px_rgba(250,204,21,0.85)] border-[0.5px] border-amber-200/60"
                  title="Golden Bead"
                />

                {/* Lower Ornamental Golden Bead */}
                <div
                  className="absolute top-[70%] -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-400 shadow-[0_0_6px_rgba(250,204,21,0.9)] border-[0.5px] border-amber-200/60"
                  title="Golden Bead"
                />

                {/* Suspension Ring right above Diya */}
                <div className="w-2.5 h-2.5 rounded-full border-[1.2px] border-yellow-300 bg-amber-950/40 shadow-[0_0_5px_rgba(250,204,21,0.7)] -mb-1 z-10" />
              </div>

              {/* Traditional Diya Assembly (Interactive on click/hover) */}
              <div
                className={`relative cursor-pointer pointer-events-auto transition-transform duration-300 ${
                  isInteracted ? "scale-110" : "hover:scale-105"
                }`}
                style={{
                  transform: `scale(${diya.scale})`,
                }}
                onClick={() => handleDiyaClick(diya.id)}
                title="Happy Diwali! Click for blessing ✨"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleDiyaClick(diya.id);
                  }
                }}
              >
                {/* Traditional Earthen & Temple Brass Diya SVG Artwork */}
                <svg
                  width="64"
                  height="76"
                  viewBox="0 0 74 88"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-[0_3px_16px_rgba(245,158,11,0.55)]"
                >
                  <defs>
                    {/* Traditional Earthen Clay & Burnished Brass Diya Gradient */}
                    <linearGradient id={`tradDiyaBody-${diya.id}`} x1="0%" y1="0%" x2="100%" y2="85%">
                      <stop offset="0%" stopColor="#9a3412" />
                      <stop offset="16%" stopColor="#c2410c" />
                      <stop offset="36%" stopColor="#f59e0b" />
                      <stop offset="55%" stopColor="#fef08a" />
                      <stop offset="76%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>

                    {/* Suspension Chain Brass Gradient */}
                    <linearGradient id={`tradChainGold-${diya.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="35%" stopColor="#f59e0b" />
                      <stop offset="70%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#fde047" />
                    </linearGradient>

                    {/* Outer Sacred Flame Gradient */}
                    <linearGradient id={`tradFlameOuter-${diya.id}`} x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#ea580c" />
                      <stop offset="35%" stopColor="#f59e0b" />
                      <stop offset="75%" stopColor="#facc15" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>

                    {/* Middle Luminous Golden Flame Gradient */}
                    <linearGradient id={`tradFlameInner-${diya.id}`} x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#fffbeb" />
                      <stop offset="30%" stopColor="#fef08a" />
                      <stop offset="75%" stopColor="#fde047" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>

                    {/* Core Incandescent Pure Flame Core */}
                    <linearGradient id={`tradFlameCore-${diya.id}`} x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="60%" stopColor="#fffbeb" />
                      <stop offset="100%" stopColor="#fef08a" />
                    </linearGradient>

                    {/* Traditional Consecrated Ghee & Oil Reservoir Pool */}
                    <radialGradient id={`tradOilPool-${diya.id}`} cx="50%" cy="40%" r="50%">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                      <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.85" />
                      <stop offset="75%" stopColor="#d97706" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#78350f" stopOpacity="0.6" />
                    </radialGradient>

                    {/* Ambient Radiant Flame Glow */}
                    <radialGradient id={`tradFlameAura-${diya.id}`}>
                      <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
                      <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                    </radialGradient>

                    {/* Traditional Brass Pedestal & Bell Gradient */}
                    <linearGradient id={`tradBrassGrad-${diya.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="30%" stopColor="#fde047" />
                      <stop offset="65%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#92400e" />
                    </linearGradient>

                    {/* Upper Lip Golden Highlight */}
                    <linearGradient id={`tradLipHighlight-${diya.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="30%" stopColor="#fffbeb" />
                      <stop offset="50%" stopColor="#fef08a" />
                      <stop offset="70%" stopColor="#fffbeb" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>

                    {/* Soft Filter Glow */}
                    <filter id={`tradGlowFilter-${diya.id}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Ambient Radiant Flame Glow behind flame (Preserved) */}
                  <circle
                    cx="37"
                    cy="23"
                    r="24"
                    fill={`url(#tradFlameAura-${diya.id})`}
                    className="animate-diya-glow"
                  />

                  {/* 3 Traditional Brass Hanging Chains */}
                  <path
                    d="M 37 7 C 27 18, 18 30, 14 44"
                    stroke={`url(#tradChainGold-${diya.id})`}
                    strokeWidth="1.3"
                    strokeDasharray="2.5 1.5"
                    fill="none"
                  />
                  <path
                    d="M 37 7 L 37 36"
                    stroke={`url(#tradChainGold-${diya.id})`}
                    strokeWidth="1.2"
                    strokeDasharray="2.5 1.5"
                    fill="none"
                  />
                  <path
                    d="M 37 7 C 47 18, 56 30, 60 44"
                    stroke={`url(#tradChainGold-${diya.id})`}
                    strokeWidth="1.3"
                    strokeDasharray="2.5 1.5"
                    fill="none"
                  />

                  {/* Brass Attachment Loops on Diya Rim */}
                  <circle cx="14" cy="44" r="2" fill={`url(#tradBrassGrad-${diya.id})`} stroke="#fef08a" strokeWidth="0.6" />
                  <circle cx="60" cy="44" r="2" fill={`url(#tradBrassGrad-${diya.id})`} stroke="#fef08a" strokeWidth="0.6" />

                  {/* Top Suspension Hook & Loop */}
                  <circle
                    cx="37"
                    cy="4"
                    r="3"
                    fill={`url(#tradBrassGrad-${diya.id})`}
                    stroke="#fef08a"
                    strokeWidth="0.8"
                  />
                  <circle cx="37" cy="1.2" r="1.3" fill="#fef08a" />

                  {/* Flame Group with Organic Flickering Animation (Preserved) */}
                  <g className={diya.flameClass} style={{ transformOrigin: "37px 35px" }}>
                    {/* Outer Sacred Flame Teardrop */}
                    <path
                      d="M 37 5 C 32 14, 25 22, 25 28.5 C 25 34.5, 30 38, 37 38 C 44 38, 49 34.5, 49 28.5 C 49 22, 42 14, 37 5 Z"
                      fill={`url(#tradFlameOuter-${diya.id})`}
                      filter={`url(#tradGlowFilter-${diya.id})`}
                    />

                    {/* Middle Vivid Golden Flame Teardrop */}
                    <path
                      d="M 37 10 C 33 17, 28 23, 28 28 C 28 32.5, 32 35.5, 37 35.5 C 42 35.5, 46 32.5, 46 28 C 46 23, 41 17, 37 10 Z"
                      fill={`url(#tradFlameInner-${diya.id})`}
                    />

                    {/* Inner Intense Incandescent Flame Core */}
                    <path
                      d="M 37 16 C 34.5 21, 31.5 25, 31.5 28.5 C 31.5 31.2, 33.8 33.5, 37 33.5 C 40.2 33.5, 42.5 31.2, 42.5 28.5 C 42.5 25, 39.5 21, 37 16 Z"
                      fill={`url(#tradFlameCore-${diya.id})`}
                    />

                    {/* Traditional Cotton Baati (Twisted White Wick) */}
                    <path
                      d="M 37 44 C 37 39, 37 34, 37 30"
                      stroke="#fef9c3"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    {/* Charred Wick Ember Tip */}
                    <circle cx="37" cy="30" r="1.1" fill="#451a03" />
                  </g>

                  {/* Diya Oil Well / Rim Lip (Back Rim) */}
                  <ellipse
                    cx="37"
                    cy="44"
                    rx="24"
                    ry="5.5"
                    fill="#5c2606"
                    stroke={`url(#tradDiyaBody-${diya.id})`}
                    strokeWidth="1"
                  />

                  {/* Consecrated Glowing Liquid Ghee/Oil Pool */}
                  <ellipse
                    cx="37"
                    cy="44.2"
                    rx="22.5"
                    ry="4.5"
                    fill={`url(#tradOilPool-${diya.id})`}
                  />

                  {/* Traditional Earthen Terracotta & Brass Diya Bowl Body */}
                  <path
                    d="M 12 44 C 12 59, 22 67, 37 67 C 52 67, 62 59, 62 44 C 57 49.5, 17 49.5, 12 44 Z"
                    fill={`url(#tradDiyaBody-${diya.id})`}
                  />

                  {/* Traditional Embossed Lotus Petal Relief Grooves */}
                  <path
                    d="M 21 48 C 25 57, 31 62, 37 66"
                    stroke="#fde047"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.65"
                    fill="none"
                  />
                  <path
                    d="M 37 49.5 L 37 67"
                    stroke="#fef08a"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    opacity="0.75"
                    fill="none"
                  />
                  <path
                    d="M 53 48 C 49 57, 43 62, 37 66"
                    stroke="#fde047"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.65"
                    fill="none"
                  />

                  {/* Diya Rim Upper Bevel Highlight */}
                  <path
                    d="M 12.5 44.5 C 20.5 50, 53.5 50, 61.5 44.5"
                    stroke={`url(#tradLipHighlight-${diya.id})`}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Traditional Ornamental Golden Beading along the Diya Rim */}
                  <circle cx="18" cy="46" r="1.1" fill="#fffbeb" />
                  <circle cx="24" cy="48" r="1.1" fill="#fef08a" />
                  <circle cx="31" cy="49.2" r="1.1" fill="#fef08a" />
                  <circle cx="37" cy="49.8" r="1.2" fill="#ffffff" />
                  <circle cx="43" cy="49.2" r="1.1" fill="#fef08a" />
                  <circle cx="50" cy="48" r="1.1" fill="#fef08a" />
                  <circle cx="56" cy="46" r="1.1" fill="#fffbeb" />

                  {/* Traditional Stepped Brass Pedestal */}
                  <path
                    d="M 30 67 L 44 67 L 42 70.5 L 32 70.5 Z"
                    fill={`url(#tradBrassGrad-${diya.id})`}
                    stroke="#fef08a"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M 32.5 70.5 L 41.5 70.5 L 40 73.5 L 34 73.5 Z"
                    fill={`url(#tradBrassGrad-${diya.id})`}
                    stroke="#fef08a"
                    strokeWidth="0.5"
                  />

                  {/* Dangling Traditional Brass Bell (Ghungroo) */}
                  <line
                    x1="37"
                    y1="73.5"
                    x2="37"
                    y2="77"
                    stroke="#d97706"
                    strokeWidth="1.2"
                  />
                  {/* Bell Dome */}
                  <path
                    d="M 37 77 C 34 78.5, 33 81.5, 32 83.5 L 42 83.5 C 41 81.5, 40 78.5, 37 77 Z"
                    fill={`url(#tradBrassGrad-${diya.id})`}
                    stroke="#fef08a"
                    strokeWidth="0.6"
                  />
                  {/* Bell Bottom Lip */}
                  <rect x="31" y="83" width="12" height="1.6" rx="0.8" fill="#fde047" stroke="#b45309" strokeWidth="0.4" />
                  {/* Bell Clapper Pearl */}
                  <circle cx="37" cy="85.5" r="1.6" fill="#fffbeb" stroke="#d97706" strokeWidth="0.4" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
