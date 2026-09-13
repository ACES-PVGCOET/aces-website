import React from "react";
import Image from "next/image";

interface CrescentCProps {
  className?: string;
}

export default function CrescentC({ className = "" }: CrescentCProps) {
  return (
    /*
     * The root <span> is the single positioning context for both the crescent SVG
     * and the Ganesha illustration. All child positions are relative to it.
     */
    <span
      className={`inline-flex items-center justify-center relative select-none leading-none ${className}`}
      aria-label="C"
      role="img"
    >
      {/* ─── Crescent Moon SVG ─── */}
      <svg
        viewBox="0 0 170 165"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible relative z-10"
      >
        <defs>
          {/* Main Lunar Gradient matching ACES visual language */}
          <linearGradient id="lunarBody" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#f3e8ff" />
            <stop offset="55%" stopColor="#c084fc" />
            <stop offset="85%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>

          {/* Outer Rim Luminous Highlight */}
          <linearGradient id="rimGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#f5d0fe" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.2" />
          </linearGradient>

          {/* Inner Rim Accent Highlight */}
          <linearGradient id="innerRim" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#e9d5ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
          </linearGradient>

          {/* Soft Atmospheric Glow Filter */}
          <filter id="crescentSoftGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#crescentSoftGlow)">
          {/* Main Crescent Body */}
          <path
            d="M 132 14
               C 74 10, 14 44, 14 85
               C 14 130, 68 158, 140 144
               C 92 152, 48 120, 48 85
               C 48 48, 86 24, 132 14 Z"
            fill="url(#lunarBody)"
          />

          {/* Delicate Outer Rim Stroke */}
          <path
            d="M 132 14
               C 74 10, 14 44, 14 85
               C 14 130, 68 158, 140 144"
            fill="none"
            stroke="url(#rimGlow)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Delicate Inner Rim Stroke */}
          <path
            d="M 140 144
               C 92 152, 48 120, 48 85
               C 48 48, 86 24, 132 14"
            fill="none"
            stroke="url(#innerRim)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/*
       * ─── Ganesha Illustration ───
       *
       * Positioned absolutely within the crescent's concave interior.
       *
       * The concave hollow of the crescent (interior right-side pocket) occupies
       * approximately x: 29%..82% and y: 30%..93% of the component bounding box.
       *
       * Ganesha sits in the LOWER portion of this hollow:
       *   - bottom anchored ~8% above the crescent's lower tip
       *   - horizontally centered in the concave pocket (~left: 24%)
       *   - height ~60% of the component (≈ 60% of crescent height per spec)
       *
       * The PNG is 500×500 with ~274×310px of actual content.
       * Aspect ratio of content: 274/310 ≈ 0.884.
       * At h=60%, w = 60% × 0.884 ≈ 53% of component width.
       *
       * A very subtle drop-shadow blends Ganesha into the purple scene
       * without adding orange/gold coloring to the hero.
       */}
      <span
        className="absolute z-20 pointer-events-none"
        style={{
          /*
           * Crescent viewBox is 170×165. The concave interior hollow spans:
           *   x: 48..140 (left 28%..right 82%), horizontal centre ≈ 55%
           *   y: 14..144 (top 8%..bottom 87%)
           *
           * Ganesha PNG content is 274×310 (ratio 0.884).
           * Target height: 90% of component  →  width = 90% × 0.884 ≈ 80%.
           * Center-left: 55% − (80%/2) ≈ 15%.
           * Feet rest ~2% from bottom; head is allowed to peek above crescent top arc.
           */
          bottom: "1%",
          left: "14%",
          width: "78%",
          height: "90%",
          filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.45)) drop-shadow(0 4px 14px rgba(88, 28, 135, 0.55))",
        }}
      >
        <Image
          src="/ganesha_only.png"
          alt="Ganesha sitting inside the crescent"
          fill
          sizes="(max-width: 640px) 55px, (max-width: 1024px) 80px, 110px"
          style={{ objectFit: "contain", objectPosition: "center bottom" }}
          priority
          draggable={false}
        />
      </span>
    </span>
  );
}
