"use client";

import React from "react";

interface AcesNavratriLogoProps {
  /** Extra classes for positioning/sizing from the parent */
  className?: string;
}

/**
 * Navratri edition of the ACES wordmark (Durga face inside the "A").
 * The PNG has a real transparent background, so it sits directly on the
 * dark page with no visible box.
 */
export default function AcesNavratriLogo({ className = "" }: AcesNavratriLogoProps) {
  return (
    <div
      className={`select-none pointer-events-none ${className}`}
      role="img"
      aria-label="ACES - Navratri edition logo"
    >
      <img
        src="/images/aces_navratri_logo.png"
        alt=""
        draggable={false}
        className="w-full h-auto drop-shadow-[0_0_28px_rgba(139,92,246,0.55)]"
      />
    </div>
  );
}