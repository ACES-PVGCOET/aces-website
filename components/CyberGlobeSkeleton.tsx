"use client";

import React from "react";

export default function CyberGlobeSkeleton() {
  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px] flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-purple-900/30 backdrop-blur-md">
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[460px] md:h-[460px] flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-[ping_4s_linear_infinite]" />
        
        {/* Dashed Orbit */}
        <div className="absolute inset-4 rounded-full border border-dashed border-purple-400/30 animate-spin-slow" />
        
        {/* Glowing Core */}
        <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-88 md:h-88 rounded-full bg-gradient-to-br from-purple-900/40 via-purple-950/60 to-slate-950/80 border border-purple-500/40 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.25)] relative">
          <div className="flex flex-col items-center gap-3 z-10">
            <div className="w-9 h-9 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
            <span className="font-sans text-xs text-purple-200 tracking-widest uppercase animate-pulse font-medium">
              INITIALIZING GLOBE...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
