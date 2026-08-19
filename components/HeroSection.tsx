"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Play } from "lucide-react";
import CyberGlobeSkeleton from "@/components/CyberGlobeSkeleton";
import Particles from "./Particles";

// Dynamic import with ssr: false for WebGL 3D Globe
const CyberGlobe = dynamic(() => import("@/components/CyberGlobe"), {
  ssr: false,
  loading: () => <CyberGlobeSkeleton />,
});

export default function HeroSection() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-4 pb-20 lg:pt-8 min-h-[calc(100vh-96px)] flex items-center">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center w-full">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-5 space-y-6 pt-4 lg:pt-0 z-20">
          {/* Tagline */}
          <div className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-purple-300/90 font-mono uppercase">
            CONNECT . INNOVATE . INSPIRE
          </div>

          {/* Giant Title */}
          <h1 className="font-zen text-7xl sm:text-8xl lg:text-9xl tracking-tight leading-none text-transparent bg-gradient-to-r from-purple-100 via-purple-300 to-purple-500 bg-clip-text drop-shadow-[0_0_45px_rgba(168,85,247,0.65)]">
            ACES
          </h1>

          {/* Sub-headline */}
          <h2 className="text-xl sm:text-2xl font-light text-slate-200 tracking-wide">
            Association of Computer Engineering Students
          </h2>

          {/* Paragraph Description */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md font-normal">
            We bring together curious minds and creative ideas to build, collaborate and create impactful solutions.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-5">
            {/* Primary Pill Button */}
            <button className="px-7 py-3.5 rounded-full bg-purple-950/70 border border-purple-500/80 text-white font-medium text-sm hover:bg-purple-900 hover:border-purple-400 transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] flex items-center gap-2 group">
              Explore ACES
              <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary Watch Video Button */}
            <button className="flex items-center gap-3 text-slate-300 hover:text-white font-medium text-sm transition-colors group">
              <span>Watch Video</span>
              <div className="w-9 h-9 rounded-full border border-purple-500/60 flex items-center justify-center text-purple-300 group-hover:bg-purple-500/20 group-hover:border-purple-400 transition-all">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Purple Interactive Cyber Globe */}
        <div className="lg:col-span-7 relative w-full h-full flex items-center justify-center">
          <CyberGlobe />
        </div>

      </div>
    </section>
  );
}
