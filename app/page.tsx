import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import ClickSpark from "@/components/ClickSpark";
import SponsorsSection from "@/components/SponsorsSection";
import MajorEventsSection from "@/components/MajorEventsSection";
import TestimonialsSection from "@/components/TestimonialsSection";

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

      <SponsorsSection />

      {/* Major Events Section with API Integration Provision */}
      <MajorEventsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Sidebars (Social Links & Scroll Guidance) */}
      <Sidebar />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}


