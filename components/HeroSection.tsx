"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import CyberGlobeSkeleton from "@/components/CyberGlobeSkeleton";
import HeroKandil from "@/components/HeroKandil";
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
        <div className="lg:col-span-5 space-y-5 pt-4 lg:pt-0 z-20">
          
          {/* Goddess Laxmi resting on top of ACES title */}
          <div className="relative inline-flex flex-col items-start">
            {/* Giant Title — kandil hangs inside the curve of the "C" */}
            <h1 className="relative font-zen text-7xl sm:text-8xl lg:text-9xl tracking-tight leading-none text-transparent bg-gradient-to-r from-purple-100 via-purple-300 to-purple-500 bg-clip-text drop-shadow-[0_0_45px_rgba(168,85,247,0.65)]">
              A
              <span className="relative inline-block">
                C
                <HeroKandil className="absolute left-[68%] top-[0.19em] z-20 w-[0.42em] -translate-x-1/2 opacity-95" />
              </span>
              ES
            </h1>
          </div>

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
            <Link
              href="/about"
              className="px-7 py-3.5 rounded-full bg-purple-950/70 border border-purple-500/80 text-white font-medium text-sm hover:bg-purple-900 hover:border-purple-400 transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] flex items-center gap-2 group"
            >
              <span>Explore ACES</span>
              <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
            </Link>
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
