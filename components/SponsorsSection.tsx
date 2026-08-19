"use client";

import React from "react";
import LogoLoop, { LogoItem } from "./LogoLoop";

const SPONSORS: LogoItem[] = [
  {
    name: "Innoplexus",
    src: "/sponsors/INNOPLEXUS.png",
    alt: "Innoplexus Logo",
    category: "AI & HealthTech Partner",
  },
  {
    name: "ITPreneur",
    src: "/sponsors/ITPRENEUR.png",
    alt: "ITPreneur Logo",
    category: "Skill & Learning Partner",
  },
  {
    name: "Budhani Bros",
    src: "/sponsors/Sponsor_Budhani.png",
    alt: "Budhani Bros Logo",
    category: "Official Food & Refreshment Partner",
  },
  {
    name: "Pictel AI",
    src: "/sponsors/Sponsor_Pictel_AI.png",
    alt: "Pictel AI Logo",
    category: "Computer Vision & AI Partner",
  },
  {
    name: "Star Copiers",
    src: "/sponsors/Sponsor_Star_Copiers.jpg",
    alt: "Star Copiers Logo",
    category: "Print & Infrastructure Partner",
  },
];

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="relative z-10 py-24 border-t border-purple-900/30 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        {/* Header Content */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            SPONSORS & PARTNERS
          </div>

          <h2 className="text-3xl sm:text-5xl font-zen text-white tracking-tight leading-tight">
            Backed by Visionary Industry Leaders
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            We are proud to collaborate with industry pioneers and organization partners who empower our students, sponsor flagship hackathons, and foster innovation across the ACES ecosystem.
          </p>
        </div>

        {/* Infinite Animated Logo Marquee */}
        <div className="my-8">
          <LogoLoop items={SPONSORS} speed="normal" direction="left" pauseOnHover={true} />
        </div>

        {/* Sub-banner Grid Highlighting Key Collaborations */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SPONSORS.map((sponsor) => (
            <div
              key={`grid-${sponsor.name}`}
              className="p-4 rounded-xl bg-purple-950/15 border border-purple-900/40 text-center backdrop-blur-xs hover:border-purple-500/40 transition-all duration-300 group"
            >
              <div className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                {sponsor.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono leading-tight">
                {sponsor.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
