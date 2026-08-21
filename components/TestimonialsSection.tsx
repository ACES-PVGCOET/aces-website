"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mail, Quote, ChevronLeft, ChevronRight, Star, MessageSquare } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "./SocialIcons";
import SpotlightCard from "./SpotlightCard";
import testimonialsData from "@/app/data/testimonialsData.js";

interface Testimonial {
  person_name: string;
  title: string;
  testimony: string;
  imagePath?: string;
  social: {
    instagram: string;
    linkedin: string;
    email: string;
  };
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials: Testimonial[] = testimonialsData;

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!isAutoplay) return;
    autoplayTimerRef.current = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [activeIndex, isAutoplay]);

  // Helper to extract initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Color theme generator based on index
  const getGradientTheme = (index: number) => {
    const themes = [
      "from-purple-600 via-indigo-600 to-violet-500",
      "from-violet-600 via-purple-600 to-fuchsia-500",
      "from-indigo-600 via-purple-600 to-pink-500",
      "from-fuchsia-600 via-purple-600 to-indigo-500",
      "from-purple-600 via-violet-600 to-cyan-500",
      "from-violet-600 via-indigo-600 to-purple-500",
    ];
    return themes[index % themes.length];
  };

  return (
    <section id="testimonials" className="relative z-10 py-24 border-t border-purple-900/30 overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-600/10 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-5xl font-zen text-white tracking-tight leading-tight">
            Inspired by Passion, Built for Impact
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Hear from our student leaders, alumni in top tech companies, and departmental mentors who share their journey with ACES PVGCOET.
          </p>
        </div>

        {/* Featured Hero Carousel Card */}
        <div 
          className="mb-16 relative"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          <SpotlightCard className="p-8 sm:p-12 relative overflow-hidden bg-purple-950/20 border-purple-800/40 hover:border-purple-500/60 shadow-[0_0_50px_rgba(112,22,198,0.15)]">
            {/* Background Decorative Quote Mark */}
            <Quote className="absolute -top-4 -right-4 w-44 h-44 text-purple-500/5 rotate-12 pointer-events-none select-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
              
              {/* Left Column: Author Bio & Avatar */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-purple-900/40 pb-6 lg:pb-0 lg:pr-8">
                
                {/* Glowing Avatar */}
                <div className="relative mb-4 group">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${getGradientTheme(activeIndex)} flex items-center justify-center text-white text-2xl sm:text-3xl font-bold tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.5)] border-2 border-purple-400/50 transition-transform duration-500 group-hover:scale-105 overflow-hidden`}>
                    {testimonials[activeIndex].imagePath ? (
                      <img
                        src={testimonials[activeIndex].imagePath}
                        alt={testimonials[activeIndex].person_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(testimonials[activeIndex].person_name)
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-950 border border-purple-400/60 flex items-center justify-center text-purple-300 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                  </div>
                </div>

                {/* Author Name */}
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {testimonials[activeIndex].person_name}
                </h3>

                {/* Role / Title */}
                <p className="text-xs sm:text-sm font-mono text-purple-400 mt-1 leading-snug">
                  {testimonials[activeIndex].title}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-3 mt-5">
                  <a
                    href={testimonials[activeIndex].social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram profile of ${testimonials[activeIndex].person_name}`}
                    className="p-2.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-slate-300 hover:text-white hover:bg-purple-900/80 hover:border-purple-400 transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={testimonials[activeIndex].social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn profile of ${testimonials[activeIndex].person_name}`}
                    className="p-2.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-slate-300 hover:text-white hover:bg-purple-900/80 hover:border-purple-400 transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    <LinkedinIcon className="w-4 h-4 fill-current" />
                  </a>
                  <a
                    href={`mailto:${testimonials[activeIndex].social.email}`}
                    aria-label={`Email ${testimonials[activeIndex].person_name}`}
                    className="p-2.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-slate-300 hover:text-white hover:bg-purple-900/80 hover:border-purple-400 transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Testimony Quote */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                <div className="relative">
                  <Quote className="w-10 h-10 text-purple-400/40 mb-3" />
                  <p className="text-slate-200 text-base sm:text-xl leading-relaxed font-light italic">
                    "{testimonials[activeIndex].testimony}"
                  </p>
                </div>

                {/* Carousel Controls & Indicators */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-900/30">
                  {/* Dot Indicators */}
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, idx) => (
                      <button
                        key={`dot-${idx}`}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Go to testimonial ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === activeIndex
                            ? "w-8 bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                            : "w-2 bg-purple-900/80 hover:bg-purple-700/60"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Prev / Next Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevTestimonial}
                      aria-label="Previous testimonial"
                      className="p-2.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-slate-200 hover:text-white hover:bg-purple-900/80 hover:border-purple-400 transition-all hover:scale-105"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      aria-label="Next testimonial"
                      className="p-2.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-slate-200 hover:text-white hover:bg-purple-900/80 hover:border-purple-400 transition-all hover:scale-105"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </SpotlightCard>
        </div>

        {/* Interactive Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <SpotlightCard
                key={`card-${item.person_name}`}
                className={`p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border-purple-500/80 bg-purple-950/40 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
                    : "border-purple-900/30 bg-purple-950/15 hover:border-purple-600/50 hover:bg-purple-950/30"
                }`}
                onClick={() => setActiveIndex(idx)}
              >
                <div>
                  {/* Card Header: Avatar + Social Links */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getGradientTheme(idx)} flex items-center justify-center text-white text-sm font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)] border border-purple-300/40 shrink-0 overflow-hidden`}>
                        {item.imagePath ? (
                          <img
                            src={item.imagePath}
                            alt={item.person_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(item.person_name)
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm sm:text-base group-hover:text-purple-300 transition-colors">
                          {item.person_name}
                        </h4>
                        <p className="text-[11px] font-mono text-purple-400/90 line-clamp-1">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testimony snippet */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic line-clamp-4 mb-6">
                    "{item.testimony}"
                  </p>
                </div>

                {/* Bottom Card Footer: Social Icons */}
                <div className="pt-4 border-t border-purple-900/30 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-purple-400" />
                    ACES Member
                  </span>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={item.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram"
                      className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-slate-400 hover:text-purple-300 hover:border-purple-500/60 transition-colors"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={item.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-slate-400 hover:text-purple-300 hover:border-purple-500/60 transition-colors"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5 fill-current" />
                    </a>
                    <a
                      href={`mailto:${item.social.email}`}
                      title="Email"
                      className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-slate-400 hover:text-purple-300 hover:border-purple-500/60 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}
