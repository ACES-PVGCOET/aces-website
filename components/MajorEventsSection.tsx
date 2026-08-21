"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin, Trophy, Users, X, CheckCircle2 } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { getMajorEvents } from "@/lib/api/eventsApi";
import { MajorEvent } from "@/lib/types/events";

export default function MajorEventsSection() {
  const [events, setEvents] = useState<MajorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<MajorEvent | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await getMajorEvents();
        if (isMounted) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Failed loading major events", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="events" className="relative z-10 py-28 border-t border-purple-900/30 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-5xl font-zen text-white tracking-tight leading-tight">
            Major Events & Hackathons
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Discover our high-impact annual hackathons, competitive programming battles, and online technology summits designed to propel computer engineering talent forward.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div
                key={`skel-${idx}`}
                className="h-[420px] rounded-3xl bg-purple-950/20 border border-purple-900/30 animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="w-full h-48 rounded-2xl bg-purple-900/30" />
                <div className="space-y-3">
                  <div className="h-6 w-2/3 bg-purple-900/40 rounded-md" />
                  <div className="h-4 w-full bg-purple-900/20 rounded-md" />
                  <div className="h-4 w-4/5 bg-purple-900/20 rounded-md" />
                </div>
                <div className="h-10 w-full bg-purple-900/40 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Major Events Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {events.map((event) => (
              <SpotlightCard
                key={event.id}
                className="group flex flex-col justify-between h-full p-6"
                spotlightColor="rgba(168, 85, 247, 0.3)"
              >
                <div className="space-y-5">
                  {/* Event Image Container with Gradient Overlay */}
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-purple-800/40 shadow-inner group-hover:border-purple-500/60 transition-colors">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                    {/* Badge Pill */}
                    {event.badgeText && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 backdrop-blur-md text-[10px] font-mono tracking-wider text-purple-300 uppercase shadow-lg">
                        {event.badgeText}
                      </div>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-purple-400 font-semibold tracking-wider uppercase">
                      {event.category}
                    </div>
                    <h3 className="text-2xl font-zen text-white tracking-tight group-hover:text-purple-200 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-purple-300/80 font-medium">
                      {event.subtitle}
                    </p>
                  </div>

                  {/* Short Description */}
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {event.description}
                  </p>

                  {/* Stats Pill List */}
                  {event.stats && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-900/30 text-center">
                      {event.stats.map((st, i) => (
                        <div key={i} className="p-2 rounded-xl bg-purple-950/30 border border-purple-900/40">
                          <div className="text-xs font-mono font-bold text-purple-300">{st.value}</div>
                          <div className="text-[10px] text-slate-400">{st.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card CTA Action */}
                <div className="pt-6 mt-4 border-t border-purple-900/30">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="w-full py-3 px-4 rounded-xl bg-purple-950/50 border border-purple-500/40 text-purple-200 font-medium text-xs hover:bg-purple-900 hover:text-white hover:border-purple-400 transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  >
                    <span>View Event Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}

        {/* Modal Dialog for Event Details */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div
              className="relative w-full max-w-2xl bg-[#0d061a] border border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.3)] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-purple-950/60 border border-purple-500/40 text-slate-300 hover:text-white hover:bg-purple-900/80 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-purple-800/40 mb-6">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d061a] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/50 text-[10px] font-mono text-purple-300 uppercase tracking-widest">
                    {selectedEvent.category}
                  </span>
                  <h3 className="text-3xl font-zen text-white tracking-tight mt-2">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="space-y-4">
                <p className="text-purple-200 font-medium text-sm">
                  {selectedEvent.tagline}
                </p>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedEvent.fullDescription || selectedEvent.description}
                </p>

                {/* Event Info Details */}
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-purple-900/40">
                  {selectedEvent.date && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{selectedEvent.date}</span>
                    </div>
                  )}
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {selectedEvent.tags && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedEvent.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-300 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="pt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-5 py-2.5 rounded-xl border border-purple-900/50 text-slate-300 text-xs hover:bg-purple-950/50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Explore Highlights</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
