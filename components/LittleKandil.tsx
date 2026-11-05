"use client";

import React from "react";

interface LittleKandilProps {
  className?: string;
}

export default function LittleKandil({ className = "" }: LittleKandilProps) {
  return (
    <div
      className={`relative inline-flex flex-col items-center select-none pointer-events-none origin-top animate-kandil-sway ${className}`}
      aria-hidden="true"
    >
      {/* Traditional Indian Diwali Akash Kandil (Akashdeep / Paper Star Lantern) */}
      <svg
        width="22"
        height="35"
        viewBox="0 0 24 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_9px_rgba(250,204,21,0.9)]"
      >
        <defs>
          {/* Authentic Shiny Golden Foil / Gota Patti Gradient */}
          <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fde047" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Golden Thread Gradient */}
          <linearGradient id="kandilThread" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Traditional Festive Saffron / Kesari Paper */}
          <linearGradient id="saffronPaper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Traditional Marigold / Haldi Yellow Paper */}
          <linearGradient id="marigoldPaper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Auspicious Kumkum / Sindoor Festive Red Paper */}
          <linearGradient id="kumkumRedPaper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          {/* Festive Rani Pink / Gulabi Paper */}
          <linearGradient id="raniPinkPaper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="40%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          {/* Warm Amber Shade for Facet Depth */}
          <linearGradient id="deepAmberPaper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Glowing Diya / Bulb Core Glow inside the Lantern */}
          <radialGradient id="kandilInnerBulb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Top Golden Suspension Thread & Ring ── */}
        <line x1="12" y1="0" x2="12" y2="3" stroke="url(#kandilThread)" strokeWidth="1.3" />
        <circle cx="12" cy="3" r="1.1" fill="#fde047" stroke="#b45309" strokeWidth="0.4" />

        {/* ── 8 Traditional 3D Star Cones (Outer Points) ── */}

        {/* 1. Top Cone */}
        <path d="M 12 3 L 9.5 7.5 L 12 7.5 Z" fill="url(#saffronPaper)" />
        <path d="M 12 3 L 14.5 7.5 L 12 7.5 Z" fill="url(#marigoldPaper)" />
        <line x1="12" y1="3" x2="12" y2="7.5" stroke="url(#goldFoil)" strokeWidth="0.6" />

        {/* 2. Top-Left Diagonal Star Cone */}
        <path d="M 4 5 L 9.5 7.5 L 6.5 10.5 Z" fill="url(#deepAmberPaper)" stroke="url(#goldFoil)" strokeWidth="0.4" />

        {/* 3. Top-Right Diagonal Star Cone */}
        <path d="M 20 5 L 14.5 7.5 L 17.5 10.5 Z" fill="url(#marigoldPaper)" stroke="url(#goldFoil)" strokeWidth="0.4" />

        {/* 4. Left Star Cone */}
        <path d="M 1.5 13 L 6.5 10.5 L 6.5 13 Z" fill="url(#saffronPaper)" />
        <path d="M 1.5 13 L 6.5 15.5 L 6.5 13 Z" fill="url(#kumkumRedPaper)" />
        <line x1="1.5" y1="13" x2="6.5" y2="13" stroke="url(#goldFoil)" strokeWidth="0.6" />

        {/* 5. Right Star Cone */}
        <path d="M 22.5 13 L 17.5 10.5 L 17.5 13 Z" fill="url(#marigoldPaper)" />
        <path d="M 22.5 13 L 17.5 15.5 L 17.5 13 Z" fill="url(#raniPinkPaper)" />
        <line x1="22.5" y1="13" x2="17.5" y2="13" stroke="url(#goldFoil)" strokeWidth="0.6" />

        {/* 6. Bottom-Left Diagonal Star Cone */}
        <path d="M 4 21 L 6.5 15.5 L 9.5 18.5 Z" fill="url(#kumkumRedPaper)" stroke="url(#goldFoil)" strokeWidth="0.4" />

        {/* 7. Bottom-Right Diagonal Star Cone */}
        <path d="M 20 21 L 17.5 15.5 L 14.5 18.5 Z" fill="url(#raniPinkPaper)" stroke="url(#goldFoil)" strokeWidth="0.4" />

        {/* 8. Bottom Cone Base */}
        <path d="M 12 20.5 L 9.5 18.5 L 12 18.5 Z" fill="url(#kumkumRedPaper)" />
        <path d="M 12 20.5 L 14.5 18.5 L 12 18.5 Z" fill="url(#raniPinkPaper)" />
        <line x1="12" y1="18.5" x2="12" y2="20.5" stroke="url(#goldFoil)" strokeWidth="0.6" />

        {/* ── Central Traditional Diamond Lantern Body ── */}
        {/* Top-Left Facet (Kesari / Saffron) */}
        <path d="M 12 7.5 L 6.5 13 L 12 13 Z" fill="url(#saffronPaper)" />
        {/* Top-Right Facet (Marigold / Haldi) */}
        <path d="M 12 7.5 L 17.5 13 L 12 13 Z" fill="url(#marigoldPaper)" />
        {/* Bottom-Left Facet (Kumkum Red) */}
        <path d="M 6.5 13 L 12 18.5 L 12 13 Z" fill="url(#kumkumRedPaper)" />
        {/* Bottom-Right Facet (Rani Pink) */}
        <path d="M 17.5 13 L 12 18.5 L 12 13 Z" fill="url(#raniPinkPaper)" />

        {/* ── Traditional Gota-Patti Golden Seam Borders ── */}
        <path
          d="M 12 7.5 L 17.5 13 L 12 18.5 L 6.5 13 Z"
          stroke="url(#goldFoil)"
          strokeWidth="0.9"
          fill="none"
        />
        {/* Horizontal & Vertical Cross Beams */}
        <line x1="6.5" y1="13" x2="17.5" y2="13" stroke="url(#goldFoil)" strokeWidth="0.75" />
        <line x1="12" y1="7.5" x2="12" y2="18.5" stroke="url(#goldFoil)" strokeWidth="0.75" />

        {/* ── Glowing Diya Core (Warm Lamp shining through translucent paper) ── */}
        <circle cx="12" cy="13" r="3.8" fill="url(#kandilInnerBulb)" />
        {/* Center Sparkle Diya Motif */}
        <path d="M 12 11.2 L 13.3 13 L 12 14.8 L 10.7 13 Z" fill="#ffffff" />
        <circle cx="12" cy="13" r="0.8" fill="#fde047" />

        {/* ── Bottom Scalloped Golden Collar ── */}
        <path d="M 8.5 18.5 Q 12 19.8 15.5 18.5" stroke="url(#goldFoil)" strokeWidth="1.1" fill="none" />
        <circle cx="10" cy="19.1" r="0.6" fill="#fde047" />
        <circle cx="12" cy="19.5" r="0.75" fill="#ffffff" />
        <circle cx="14" cy="19.1" r="0.6" fill="#fde047" />

        {/* ── Traditional Cascading Crepe Paper Streamers / Jhalar (कागदी झालर) ── */}

        {/* 1. Outer Left Streamer (Kumkum Red) */}
        <path d="M 7.5 16.5 Q 6.8 21 7.2 25.5" stroke="url(#kumkumRedPaper)" strokeWidth="1.0" strokeLinecap="round" />
        <circle cx="7.2" cy="26" r="0.65" fill="#fde047" />

        {/* 2. Mid-Left Streamer (Saffron Kesari) */}
        <path d="M 9 17.5 Q 8.2 23 8.6 28.5" stroke="url(#saffronPaper)" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="8.6" cy="29" r="0.7" fill="#fef08a" />

        {/* 3. Inner Left Streamer (Marigold Yellow) */}
        <path d="M 10.5 18.5 Q 9.8 25 10.2 31.5" stroke="url(#marigoldPaper)" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="10.2" cy="32" r="0.75" fill="#fde047" />

        {/* 4. Center Main Longest Streamer (Golden Zari / Haldi) */}
        <path d="M 12 19.5 Q 11.4 27 12 34.5" stroke="url(#goldFoil)" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="12" cy="35.2" r="0.9" fill="#ffffff" stroke="#f59e0b" strokeWidth="0.4" />

        {/* 5. Inner Right Streamer (Marigold Yellow) */}
        <path d="M 13.5 18.5 Q 14.2 25 13.8 31.5" stroke="url(#marigoldPaper)" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="13.8" cy="32" r="0.75" fill="#fde047" />

        {/* 6. Mid-Right Streamer (Saffron Kesari) */}
        <path d="M 15 17.5 Q 15.8 23 15.4 28.5" stroke="url(#saffronPaper)" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="15.4" cy="29" r="0.7" fill="#fef08a" />

        {/* 7. Outer Right Streamer (Rani Pink) */}
        <path d="M 16.5 16.5 Q 17.2 21 16.8 25.5" stroke="url(#raniPinkPaper)" strokeWidth="1.0" strokeLinecap="round" />
        <circle cx="16.8" cy="26" r="0.65" fill="#fde047" />
      </svg>
    </div>
  );
}
