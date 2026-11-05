"use client";

import React from "react";

interface HeroKandilProps {
  className?: string;
}

/**
 * Authentic Traditional Akash Kandil (Diwali paper lantern) for the hero ACES title.
 * Features:
 * - Hexagonal multifaceted silhouette with scalloped orange paper trim
 * - Lime green top and bottom crowns with diamond lattice (jali) cutouts
 * - Radiant translucent yellow-gold panels with delicate floral filigree lace
 * - Deep magenta/ruby triangles with golden floral mandala paper-cut designs
 * - Cascading layered paper streamers (vibrant orange ribbons flanked by magenta)
 * - Warm internal core lighting and radiant Diwali ambient glow
 */
export default function HeroKandil({ className = "" }: HeroKandilProps) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <div className="origin-top animate-hero-kandil-sway drop-shadow-[0_0_6px_rgba(245,158,11,0.28)]">
        <svg
          viewBox="0 0 120 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
        >
          <defs>
            {/* Multi-layered Ambient Diwali Night Glow */}
            <radialGradient id="hk_AmbientHalo" cx="50%" cy="42%" r="58%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
              <stop offset="35%" stopColor="#ea580c" stopOpacity="0.12" />
              <stop offset="65%" stopColor="#d946ef" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>

            {/* Hanging suspension thread gradient */}
            <linearGradient id="hk_CordGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="40%" stopColor="#dc2626" />
              <stop offset="85%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Lime Green band gradient */}
            <linearGradient id="hk_GreenBand" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="25%" stopColor="#bef264" />
              <stop offset="75%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>

            {/* Dark Green backing for lattice cutouts */}
            <linearGradient id="hk_GreenBacking" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14532d" />
              <stop offset="50%" stopColor="#166534" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            {/* Magenta facet gradient */}
            <linearGradient id="hk_MagentaFacet" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#9d174d" />
              <stop offset="30%" stopColor="#be185d" />
              <stop offset="70%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#9d174d" />
            </linearGradient>

            {/* Yellow glowing translucent facet gradient */}
            <radialGradient id="hk_YellowFacet" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#fde047" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>

            {/* Central internal bulb radiance */}
            <radialGradient id="hk_BulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#fef08a" stopOpacity="0.6" />
              <stop offset="65%" stopColor="#fb923c" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>

            {/* Streamers Orange gradient (with upper glow) */}
            <linearGradient id="hk_StreamerOrange" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="12%" stopColor="#fed7aa" />
              <stop offset="28%" stopColor="#fb923c" />
              <stop offset="65%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            {/* Center Streamers Extra Bright gradient */}
            <linearGradient id="hk_StreamerCenter" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="8%" stopColor="#fef9c3" />
              <stop offset="25%" stopColor="#fde047" />
              <stop offset="55%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>

            {/* Streamers Magenta (flanking sides) */}
            <linearGradient id="hk_StreamerMagenta" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="20%" stopColor="#db2777" />
              <stop offset="70%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>

            {/* Top-of-streamers core radiance */}
            <radialGradient id="hk_StreamerCoreGlow" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#fde047" stopOpacity="0.75" />
              <stop offset="55%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>

            {/* Reusable Floral Filigree Mandala Pattern (Yellow for Magenta panels) */}
            <g id="hk_YellowMandala">
              <circle cx="0" cy="0" r="3.2" fill="#fde047" stroke="#f59e0b" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.3" fill="#fffbeb" />
              <path d="M0,-3.2 C-1.5,-6 1.5,-6 0,-3.2 Z" fill="#fef08a" stroke="#eab308" strokeWidth="0.35" />
              <path d="M0,3.2 C-1.5,6 1.5,6 0,3.2 Z" fill="#fef08a" stroke="#eab308" strokeWidth="0.35" />
              <path d="M-3.2,0 C-6,-1.5 -6,1.5 -3.2,0 Z" fill="#fef08a" stroke="#eab308" strokeWidth="0.35" />
              <path d="M3.2,0 C6,-1.5 6,1.5 3.2,0 Z" fill="#fef08a" stroke="#eab308" strokeWidth="0.35" />
              <path d="M-2.3,-2.3 C-4.2,-4.2 -2.8,-5.6 -1.6,-4.4 Z" fill="#fef08a" stroke="#eab308" strokeWidth="0.35" />
              <path d="M2.3,-2.3 C4.2,-4.2 2.8,-5.6 1.6,-4.4 Z" fill="#fef08a" stroke="#eab308" strokeWidth="0.35" />
              <path d="M-2.3,2.3 C-4.2,4.2 -2.8,5.6 -1.6,4.4 Z" fill="#fef08a" stroke="#eab308" strokeWidth="0.35" />
              <path d="M2.3,2.3 C4.2,4.2 2.8,5.6 1.6,4.4 Z" fill="#fef08a" stroke="#eab308" strokeWidth="0.35" />
              <path d="M0,-6.2 C-5,-9.5 -9,-5 -5.5,-1.2 C-3.2,1.2 -1,4.5 0,8 C1,4.5 3.2,1.2 5.5,-1.2 C9,-5 5,-9.5 0,-6.2 Z" fill="none" stroke="#fde047" strokeWidth="0.75" />
              <circle cx="0" cy="-9.5" r="1.3" fill="#fef08a" />
              <circle cx="-8.2" cy="-2.2" r="1.1" fill="#fef08a" />
              <circle cx="8.2" cy="-2.2" r="1.1" fill="#fef08a" />
              <circle cx="-5.5" cy="5.5" r="1" fill="#fef08a" />
              <circle cx="5.5" cy="5.5" r="1" fill="#fef08a" />
              <path d="M-10,-3 C-12,-8 -6,-12 0,-12 C6,-12 12,-8 10,-3" fill="none" stroke="#fef08a" strokeWidth="0.65" strokeDasharray="1.2 0.8" />
            </g>

            {/* Reusable Floral Filigree Mandala Pattern (Orange for Yellow panels) */}
            <g id="hk_OrangeMandala">
              <circle cx="0" cy="0" r="3.4" fill="#ea580c" />
              <circle cx="0" cy="0" r="1.6" fill="#fef08a" />
              <path d="M0,-3.4 C-2,-7 2,-7 0,-3.4 Z" fill="#f97316" stroke="#c2410c" strokeWidth="0.4" />
              <path d="M0,3.4 C-2,7 2,7 0,3.4 Z" fill="#f97316" stroke="#c2410c" strokeWidth="0.4" />
              <path d="M-3.4,0 C-7,-2 -7,2 -3.4,0 Z" fill="#f97316" stroke="#c2410c" strokeWidth="0.4" />
              <path d="M3.4,0 C7,-2 7,2 3.4,0 Z" fill="#f97316" stroke="#c2410c" strokeWidth="0.4" />
              <path d="M-2.4,-2.4 C-4.8,-4.8 -3.2,-6.4 -1.9,-5.1 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="0.35" />
              <path d="M2.4,-2.4 C4.8,-4.8 3.2,-6.4 1.9,-5.1 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="0.35" />
              <path d="M-2.4,2.4 C-4.8,4.8 -3.2,6.4 -1.9,5.1 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="0.35" />
              <path d="M2.4,2.4 C4.8,4.8 3.2,6.4 1.9,5.1 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="0.35" />
              <path d="M0,-7 C-5.5,-11 -11,-5.5 -6.5,-1.2 C-3.2,2.2 -1,6.5 0,11 C1,6.5 3.2,2.2 6.5,-1.2 C11,-5.5 5.5,-11 0,-7 Z" fill="none" stroke="#ea580c" strokeWidth="0.85" />
              <circle cx="0" cy="-11.2" r="1.4" fill="#ea580c" />
              <circle cx="-10" cy="-2.8" r="1.2" fill="#ea580c" />
              <circle cx="10" cy="-2.8" r="1.2" fill="#ea580c" />
              <circle cx="-7" cy="7" r="1.1" fill="#ea580c" />
              <circle cx="7" cy="7" r="1.1" fill="#ea580c" />
              <path d="M-12,-4 C-14.5,-10 -7.5,-15 0,-15 C7.5,-15 14.5,-10 12,-4 C14.5,1.5 10,8 0,14.5 C-10,8 -14.5,1.5 -12,-4 Z" fill="none" stroke="#c2410c" strokeWidth="0.75" strokeDasharray="1.6 1.1" />
            </g>
          </defs>

          {/* 1. Ambient Background Halo for Night Glow */}
          <circle cx="60" cy="85" r="54" fill="url(#hk_AmbientHalo)" />
          <circle cx="60" cy="71" r="34" fill="url(#hk_AmbientHalo)" opacity="0.55" />

          {/* 2. Hanging Thread & Loop */}
          <g>
            <line x1="60" y1="0" x2="60" y2="22" stroke="url(#hk_CordGrad)" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="60" cy="5" r="1.8" fill="#fde047" stroke="#b45309" strokeWidth="0.6" />
            <circle cx="60" cy="18" r="2.2" fill="#facc15" stroke="#dc2626" strokeWidth="0.6" />
            <path d="M57 22 L63 22 L60 17 Z" fill="#e11d48" stroke="#fde047" strokeWidth="0.5" />
          </g>

          {/* 3. Streamers / Jhalar (Bottom Fringe) */}
          {/* Layer A: Background Flanking Magenta Ribbons */}
          <g opacity="0.95">
            <rect x="34" y="120" width="4.5" height="96" rx="0.8" fill="url(#hk_StreamerMagenta)" />
            <rect x="37.5" y="120" width="4.5" height="106" rx="0.8" fill="url(#hk_StreamerMagenta)" />
            <rect x="78" y="120" width="4.5" height="106" rx="0.8" fill="url(#hk_StreamerMagenta)" />
            <rect x="81.5" y="120" width="4.5" height="96" rx="0.8" fill="url(#hk_StreamerMagenta)" />
          </g>

          {/* Layer B: Foreground Vibrant Orange Ribbons (Paper Strips) */}
          <g>
            <rect x="38" y="120" width="4.2" height="108" rx="0.7" fill="url(#hk_StreamerOrange)" />
            <line x1="40.1" y1="120" x2="40.1" y2="228" stroke="#fdba74" strokeWidth="0.4" opacity="0.6" />

            <rect x="43" y="120" width="4.2" height="116" rx="0.7" fill="url(#hk_StreamerOrange)" />
            <line x1="45.1" y1="120" x2="45.1" y2="236" stroke="#fed7aa" strokeWidth="0.4" opacity="0.7" />

            <rect x="48" y="120" width="4.2" height="121" rx="0.7" fill="url(#hk_StreamerOrange)" />
            <line x1="50.1" y1="120" x2="50.1" y2="241" stroke="#fef08a" strokeWidth="0.5" opacity="0.8" />

            <rect x="53" y="120" width="4.4" height="125" rx="0.7" fill="url(#hk_StreamerCenter)" />
            <line x1="55.2" y1="120" x2="55.2" y2="245" stroke="#ffffff" strokeWidth="0.5" opacity="0.85" />

            <rect x="58" y="120" width="4.6" height="126" rx="0.7" fill="url(#hk_StreamerCenter)" />
            <line x1="60.3" y1="120" x2="60.3" y2="246" stroke="#ffffff" strokeWidth="0.6" opacity="0.9" />

            <rect x="63.2" y="120" width="4.4" height="125" rx="0.7" fill="url(#hk_StreamerCenter)" />
            <line x1="65.4" y1="120" x2="65.4" y2="245" stroke="#ffffff" strokeWidth="0.5" opacity="0.85" />

            <rect x="68.2" y="120" width="4.2" height="121" rx="0.7" fill="url(#hk_StreamerOrange)" />
            <line x1="70.3" y1="120" x2="70.3" y2="241" stroke="#fef08a" strokeWidth="0.5" opacity="0.8" />

            <rect x="73.2" y="120" width="4.2" height="116" rx="0.7" fill="url(#hk_StreamerOrange)" />
            <line x1="75.3" y1="120" x2="75.3" y2="236" stroke="#fed7aa" strokeWidth="0.4" opacity="0.7" />

            <rect x="78.2" y="120" width="4.2" height="108" rx="0.7" fill="url(#hk_StreamerOrange)" />
            <line x1="80.3" y1="120" x2="80.3" y2="228" stroke="#fdba74" strokeWidth="0.4" opacity="0.6" />
          </g>

          {/* Layer C: Luminous Core Light spilling down from within the streamers */}
          <ellipse cx="60" cy="132" rx="22" ry="16" fill="url(#hk_StreamerCoreGlow)" />
          <ellipse cx="60" cy="148" rx="14" ry="24" fill="url(#hk_StreamerCoreGlow)" opacity="0.7" />

          {/* 4. Main Body: Outer Orange Scalloped Framework */}
          <g>
            <polygon points="37,36 83,36 102,71 83,106 37,106 18,71" fill="#ea580c" />

            {/* Outer Scallop Edges (Paper scallop trim) */}
            <path
              d="M 18.0 71.0 Q 17.4 66.9, 21.2 65.2 Q 20.6 61.1, 24.3 59.3 Q 23.7 55.2, 27.5 53.5 Q 26.9 49.4, 30.7 47.7 Q 30.1 43.6, 33.8 41.8 Q 33.2 37.7, 37.0 36.0"
              fill="none"
              stroke="#f97316"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M 83.0 36.0 Q 86.8 37.7, 86.2 41.8 Q 89.9 43.6, 89.3 47.7 Q 93.1 49.4, 92.5 53.5 Q 96.3 55.2, 95.7 59.3 Q 99.4 61.1, 98.8 65.2 Q 102.6 66.9, 102.0 71.0"
              fill="none"
              stroke="#f97316"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M 102.0 71.0 Q 102.6 75.1, 98.8 76.8 Q 99.4 80.9, 95.7 82.7 Q 96.3 86.8, 92.5 88.5 Q 93.1 92.6, 89.3 94.3 Q 89.9 98.4, 86.2 100.2 Q 86.8 104.3, 83.0 106.0"
              fill="none"
              stroke="#f97316"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M 37.0 106.0 Q 33.2 104.3, 33.8 100.2 Q 30.1 98.4, 30.7 94.3 Q 26.9 92.6, 27.5 88.5 Q 23.7 86.8, 24.3 82.7 Q 20.6 80.9, 21.2 76.8 Q 17.4 75.1, 18.0 71.0"
              fill="none"
              stroke="#f97316"
              strokeWidth="2.6"
              strokeLinecap="round"
            />

            <polygon points="37,36 83,36 102,71 83,106 37,106 18,71" fill="none" stroke="#fde047" strokeWidth="0.8" opacity="0.85" />
          </g>

          {/* 5. Internal Illuminated Facets */}
          {/* Facet Left: Glowing Yellow Diamond */}
          <g>
            <polygon points="37,36 18,71 37,106 60,71" fill="url(#hk_YellowFacet)" stroke="#ea580c" strokeWidth="1.2" strokeLinejoin="round" />
            <g transform="translate(38, 71) scale(1.15)">
              <use href="#hk_OrangeMandala" />
            </g>
          </g>

          {/* Facet Right: Glowing Yellow Diamond */}
          <g>
            <polygon points="83,36 60,71 83,106 102,71" fill="url(#hk_YellowFacet)" stroke="#ea580c" strokeWidth="1.2" strokeLinejoin="round" />
            <g transform="translate(82, 71) scale(1.15)">
              <use href="#hk_OrangeMandala" />
            </g>
          </g>

          {/* Facet Top: Rich Magenta Inverted Triangle (V shape) */}
          <g>
            <polygon points="37,36 83,36 60,71" fill="url(#hk_MagentaFacet)" stroke="#fbbf24" strokeWidth="1.2" strokeLinejoin="round" />
            <g transform="translate(60, 50) scale(1.05)">
              <use href="#hk_YellowMandala" />
            </g>
          </g>

          {/* Facet Bottom: Rich Magenta Upright Triangle (^ shape) */}
          <g>
            <polygon points="37,106 83,106 60,71" fill="url(#hk_MagentaFacet)" stroke="#fbbf24" strokeWidth="1.2" strokeLinejoin="round" />
            <g transform="translate(60, 92) scale(1.05) rotate(180)">
              <use href="#hk_YellowMandala" />
            </g>
          </g>

          {/* Core bulb radiance at the center */}
          <circle cx="60" cy="71" r="15" fill="url(#hk_BulbGlow)" pointerEvents="none" />
          <circle cx="60" cy="71" r="2.2" fill="#fffbeb" />

          {/* 6. Top Lime-Green Lattice Crown (Y: 22 to 36) */}
          <g>
            <rect x="34" y="22" width="52" height="14" rx="1.5" fill="url(#hk_GreenBacking)" stroke="#4d7c0f" strokeWidth="0.8" />
            
            {/* Top Crenellated / Scalloped Edge */}
            <path
              d="M 34 22 C 36 19.5, 38 19.5, 40 22 C 42 19.5, 44 19.5, 46 22 C 48 19.5, 50 19.5, 52 22 C 54 19.5, 56 19.5, 58 22 C 60 19.5, 62 19.5, 64 22 C 66 19.5, 68 19.5, 70 22 C 72 19.5, 74 19.5, 76 22 C 78 19.5, 80 19.5, 82 22 C 84 19.5, 86 19.5, 86 22"
              fill="none"
              stroke="#bef264"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Diamond Lattice Grid (Jali) in lime green */}
            <g stroke="#a3e635" strokeWidth="1.1" strokeLinecap="round" opacity="0.95">
              <line x1="36" y1="36" x2="50" y2="22" />
              <line x1="43" y1="36" x2="57" y2="22" />
              <line x1="50" y1="36" x2="64" y2="22" />
              <line x1="57" y1="36" x2="71" y2="22" />
              <line x1="64" y1="36" x2="78" y2="22" />
              <line x1="71" y1="36" x2="85" y2="22" />
              <line x1="36" y1="22" x2="50" y2="36" />
              <line x1="43" y1="22" x2="57" y2="36" />
              <line x1="50" y1="22" x2="64" y2="36" />
              <line x1="57" y1="22" x2="71" y2="36" />
              <line x1="64" y1="22" x2="78" y2="36" />
              <line x1="71" y1="22" x2="85" y2="36" />
            </g>

            {/* Lattice Diamond Center Dots */}
            <g fill="#bef264" opacity="0.85">
              <circle cx="43" cy="29" r="0.9" />
              <circle cx="50" cy="29" r="0.9" />
              <circle cx="57" cy="29" r="0.9" />
              <circle cx="64" cy="29" r="0.9" />
              <circle cx="71" cy="29" r="0.9" />
              <circle cx="78" cy="29" r="0.9" />
            </g>

            {/* Top & Bottom Golden Borders */}
            <line x1="34" y1="22" x2="86" y2="22" stroke="#bef264" strokeWidth="1.3" />
            <line x1="34" y1="36" x2="86" y2="36" stroke="#84cc16" strokeWidth="1.3" />

            {/* Bottom Scalloped edge of top crown */}
            <path
              d="M 34 36 C 36 38, 38 38, 40 36 C 42 38, 44 38, 46 36 C 48 38, 50 38, 52 36 C 54 38, 56 38, 58 36 C 60 38, 62 38, 64 36 C 66 38, 68 38, 70 36 C 72 38, 74 38, 76 36 C 78 38, 80 38, 82 36 C 84 38, 86 38, 86 36"
              fill="none"
              stroke="#a3e635"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </g>

          {/* 7. Bottom Lime-Green Lattice Crown (Y: 106 to 120) */}
          <g>
            <rect x="34" y="106" width="52" height="14" rx="1.5" fill="url(#hk_GreenBacking)" stroke="#4d7c0f" strokeWidth="0.8" />
            
            {/* Top Scalloped rim of bottom crown */}
            <path
              d="M 34 106 C 36 104, 38 104, 40 106 C 42 104, 44 104, 46 106 C 48 104, 50 104, 52 106 C 54 104, 56 104, 58 106 C 60 104, 62 104, 64 106 C 66 104, 68 104, 70 106 C 72 104, 74 104, 76 106 C 78 104, 80 104, 82 106 C 84 104, 86 104, 86 106"
              fill="none"
              stroke="#bef264"
              strokeWidth="1.3"
              strokeLinecap="round"
            />

            {/* Diamond Lattice Grid in lime green */}
            <g stroke="#a3e635" strokeWidth="1.1" strokeLinecap="round" opacity="0.95">
              <line x1="36" y1="120" x2="50" y2="106" />
              <line x1="43" y1="120" x2="57" y2="106" />
              <line x1="50" y1="120" x2="64" y2="106" />
              <line x1="57" y1="120" x2="71" y2="106" />
              <line x1="64" y1="120" x2="78" y2="106" />
              <line x1="71" y1="120" x2="85" y2="106" />
              <line x1="36" y1="106" x2="50" y2="120" />
              <line x1="43" y1="106" x2="57" y2="120" />
              <line x1="50" y1="106" x2="64" y2="120" />
              <line x1="57" y1="106" x2="71" y2="120" />
              <line x1="64" y1="106" x2="78" y2="120" />
              <line x1="71" y1="106" x2="85" y2="120" />
            </g>

            <g fill="#bef264" opacity="0.85">
              <circle cx="43" cy="113" r="0.9" />
              <circle cx="50" cy="113" r="0.9" />
              <circle cx="57" cy="113" r="0.9" />
              <circle cx="64" cy="113" r="0.9" />
              <circle cx="71" cy="113" r="0.9" />
              <circle cx="78" cy="113" r="0.9" />
            </g>

            <line x1="34" y1="106" x2="86" y2="106" stroke="#84cc16" strokeWidth="1.3" />
            <line x1="34" y1="120" x2="86" y2="120" stroke="#bef264" strokeWidth="1.3" />

            {/* Bottom Scalloped edge of bottom crown */}
            <path
              d="M 34 120 C 36 122.5, 38 122.5, 40 120 C 42 122.5, 44 122.5, 46 120 C 48 122.5, 50 122.5, 52 120 C 54 122.5, 56 122.5, 58 120 C 60 122.5, 62 122.5, 64 120 C 66 122.5, 68 122.5, 70 120 C 72 122.5, 74 122.5, 76 120 C 78 122.5, 80 122.5, 82 120 C 84 122.5, 86 122.5, 86 120"
              fill="none"
              stroke="#bef264"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
