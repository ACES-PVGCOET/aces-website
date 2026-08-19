"use client";

import React from "react";
import Image from "next/image";

export interface LogoItem {
  name: string;
  src: string;
  alt: string;
  category?: string;
}

interface LogoLoopProps {
  items: LogoItem[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export default function LogoLoop({
  items,
  speed = "normal",
  direction = "left",
  pauseOnHover = true,
  className = "",
}: LogoLoopProps) {
  // Speed mapping in seconds
  const durationMap = {
    slow: "40s",
    normal: "25s",
    fast: "15s",
  };

  const animationDuration = durationMap[speed] || "25s";
  const animationName = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  // Duplicate items 4 times to guarantee unbroken infinite horizontal scroll on large/ultrawide displays
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden select-none py-6 ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        className={`flex w-max items-center gap-8 ${animationName} ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
        style={{ animationDuration }}
      >
        {duplicatedItems.map((logo, idx) => (
          <div
            key={`${logo.name}-${idx}`}
            className="group relative flex flex-col items-center justify-center min-w-[200px] sm:min-w-[240px] h-28 px-6 py-4 rounded-2xl bg-purple-950/20 border border-purple-800/30 backdrop-blur-md transition-all duration-300 hover:border-purple-500/60 hover:bg-purple-900/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:-translate-y-1"
          >
            {/* Ambient inner card glow on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative w-full h-14 flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={180}
                height={60}
                className="max-h-12 w-auto object-contain filter brightness-90 contrast-125 grayscale-[30%] group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
              />
            </div>

            {/* Optional Sponsor Name Tag */}
            <span className="mt-2 text-[11px] font-mono tracking-wider text-slate-400 group-hover:text-purple-300 transition-colors uppercase">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
