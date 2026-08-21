"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import SpotlightCard from "@/components/SpotlightCard";
import {
  Sparkles,
  Target,
  Eye,
  Users,
  Rocket,
  Zap,
  Globe,
  Calendar,
  Trophy,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import milestones from "@/data/milestones";

export default function AboutPage() {
  const stats = [
    {
      value: "1,200+",
      label: "Active Student Members",
      desc: "Engineers, coders & tech builders",
      icon: Users,
    },
    {
      value: "45+",
      label: "Events & Workshops / Yr",
      desc: "Hackathons, symposiums & webinars",
      icon: Calendar,
    },
    {
      value: "₹5,00,000+",
      label: "Prizes & Grants Pool",
      desc: "Awarded across flagship competitions",
      icon: Trophy,
    },
    {
      value: "3,500+",
      label: "Global Alumni Network",
      desc: "Leading top tech firms worldwide",
      icon: Globe,
    },
  ];

  const pillars = [
    {
      title: "Technical Mastery",
      description:
        "Cultivating deep expertise in software engineering, AI/ML, cloud architecture, system design, and emerging technology stacks.",
      icon: Users,
      badge: "SKILL BUILDING",
    },
    {
      title: "Innovation & Research",
      description:
        "Fostering breakthrough student-led research, open-source projects, and rapid prototyping of real-world software solutions.",
      icon: Rocket,
      badge: "CREATIVITY",
    },
    {
      title: "Leadership & Impact",
      description:
        "Empowering students to organize large-scale tech summits, lead engineering teams, and refine critical project management skills.",
      icon: ShieldCheck,
      badge: "EMPOWERMENT",
    },
    {
      title: "Industry & Career Synergy",
      description:
        "Connecting student talent directly with top global sponsors, tech recruiters, mentors, and executive industry leaders.",
      icon: Zap,
      badge: "NETWORKING",
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-slate-100 font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Interactive Neural Network Background Pattern */}
      <NeuralNetworkBackground />

      {/* Ambient Radial Background Glows (subtle) */}
      <div className="fixed top-1/4 right-1/4 w-[650px] h-[650px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-10 left-10 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-1/3 left-1/3 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-24 space-y-24">
        {/* Breadcrumb & Hero Banner */}
        <section className="text-center pt-8 max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Architecting the Future of{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              Engineering & Innovation
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            The Association of Computer Engineering Students (ACES) is the premier student-led organization at PVGCOET. We unite aspiring coders, system architects, and tech visionaries to push the boundaries of modern computing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#milestones"
              className="px-7 py-3.5 rounded-full border border-purple-500/60 bg-purple-600/20 hover:bg-purple-600/30 text-white font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
            >
              Our Journey <ArrowRight className="w-4 h-4 text-purple-300" />
            </a>
            <Link
              href="/#events"
              className="px-7 py-3.5 rounded-full border border-slate-700 hover:border-purple-500/40 bg-slate-900/50 hover:bg-purple-950/30 text-slate-200 hover:text-white font-medium text-sm transition-all duration-300 flex items-center gap-2"
            >
              Explore Events <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </section>

        {/* Vision & Mission Grid */}
        <section className="grid md:grid-cols-2 gap-8">
          <SpotlightCard className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl border border-purple-500/40 bg-purple-900/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                Our Mission
              </h2>
              <p className="text-slate-300 leading-relaxed">
                To empower students to become not just skilled engineers, but engaged leaders, community builders and lifelong learners with respect for the society and knowledge.
              </p>
            </div>
            <div className="pt-4 border-t border-purple-900/40 flex items-center gap-2 text-xs font-mono text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EMPOWERING BUILDERS SINCE 2018</span>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl border border-violet-500/40 bg-violet-900/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Eye className="w-6 h-6 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                Our Vision
              </h2>
              <p className="text-slate-300 leading-relaxed">
                To build an ecosystem where students learn, connect and grow socially, academically and culturally while bringing pride and recognition to the department.
              </p>
            </div>
            <div className="pt-4 border-t border-purple-900/40 flex items-center gap-2 text-xs font-mono text-violet-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GLOBAL IMPACT & TECHNICAL LEADER</span>
            </div>
          </SpotlightCard>
        </section>

        {/* Impact Statistics */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-mono tracking-widest text-purple-400 uppercase">
              IMPACT AT A GLANCE
            </h2>
            <p className="text-3xl font-extrabold text-white">
              Driven by Numbers, Powered by Passion
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <SpotlightCard
                  key={idx}
                  className="p-6 text-center flex flex-col items-center justify-center space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:border-purple-400 transition-all duration-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-white bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-200">
                      {stat.label}
                    </h3>
                    <p className="text-xs text-slate-400">{stat.desc}</p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* Core Pillars */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white">
              The Pillars of ACES Culture
            </h2>
            <p className="text-slate-400 text-sm">
              We operate across four foundational pillars designed to nurture well-rounded computer science leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <SpotlightCard
                  key={idx}
                  className="p-8 flex items-start gap-5 hover:border-purple-500/60 transition-all duration-300"
                >
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">
                        {pillar.title}
                      </h3>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-purple-500/30 bg-purple-950/50 text-purple-300">
                        {pillar.badge}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* Timeline / Milestones */}
        <section id="milestones" className="space-y-12 scroll-mt-28">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white">
              Key Historical Milestones
            </h2>
            <p className="text-slate-400 text-sm">
              Tracing our journey from a localized student club to a powerhouse technical student organization.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-purple-600/80 before:via-violet-500/40 before:to-transparent hidden sm:block">
            <div className="space-y-12">
              {milestones.map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={idx}
                    className={`relative flex items-center justify-between ${
                      isEven ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="w-5/12">
                      <SpotlightCard className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-extrabold text-purple-400 font-mono">
                            {item.year}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-200 leading-relaxed">
                          {item.milestone}
                        </p>
                      </SpotlightCard>
                    </div>

                    {/* Timeline Glowing Node */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-purple-400 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                    </div>

                    <div className="w-5/12" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Fallback Timeline */}
          <div className="sm:hidden space-y-6">
            {milestones.map((item, idx) => (
              <SpotlightCard key={idx} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-purple-400 font-mono">
                    {item.year}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  {item.milestone}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-purple-500/40 bg-gradient-to-r from-purple-950/60 via-slate-950 to-indigo-950/60 p-10 sm:p-16 text-center space-y-6 shadow-[0_0_50px_rgba(168,85,247,0.25)]">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Build the Next Big Thing With Us?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether you are a student looking to develop real-world engineering skills or an industry partner wanting to mentor the next generation of engineers, ACES welcomes you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button className="px-8 py-3.5 rounded-full border border-purple-500/50 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] flex items-center gap-2">
                Join ACES Committee <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/#contact"
                className="px-8 py-3.5 rounded-full border border-slate-700 hover:border-purple-500/40 bg-slate-900/60 text-slate-300 hover:text-white font-medium text-sm transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Sidebars (Social Links & Navigation Guidance) */}
      <Sidebar />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
