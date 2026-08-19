import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import ClickSpark from "@/components/ClickSpark";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#06020c] text-slate-100 font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Interactive Neural Network Background Pattern */}
      <NeuralNetworkBackground />

      {/* Ambient Radial Background Glows */}
      <div className="fixed top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-10 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Hero Section */}
            <ClickSpark
        sparkColor="#7016c6"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <HeroSection />
      </ClickSpark>

      {/* Additional Section to demonstrate scroll-enlightened violet network */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-32 border-t border-purple-900/30">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono tracking-widest uppercase">
            NETWORK ACTIVE
          </div>
          <h2 className="text-3xl sm:text-5xl font-zen text-white tracking-tight">
            Empowering Computer Engineers
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            As you scroll through our ecosystem, the underlying neural network enlightens with violet energy, connecting ideas, talent, and breakthrough innovations across our community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 text-left">
            <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-800/30 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <div className="text-3xl font-bold text-purple-300 font-mono mb-2">500+</div>
              <div className="text-sm font-semibold text-slate-200">Active Engineers</div>
              <div className="text-xs text-slate-400 mt-1">Collaborating on real-world projects and open source.</div>
            </div>
            <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-800/30 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <div className="text-3xl font-bold text-purple-300 font-mono mb-2">40+</div>
              <div className="text-sm font-semibold text-slate-200">Annual Events</div>
              <div className="text-xs text-slate-400 mt-1">Hackathons, workshops, guest lectures, and tech expos.</div>
            </div>
            <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-800/30 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <div className="text-3xl font-bold text-purple-300 font-mono mb-2">100%</div>
              <div className="text-sm font-semibold text-slate-200">Innovation Driven</div>
              <div className="text-xs text-slate-400 mt-1">Building high-impact solutions for tomorrow's challenges.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sidebars (Social Links & Scroll Guidance) */}
      <Sidebar />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}


