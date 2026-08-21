"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import EventCard from "@/components/EventCard";
import EventDetailModal from "@/components/EventDetailModal";
import { getAllEvents } from "@/lib/api/eventsApi";
import { ApiEvent } from "@/lib/types/events";
import { Calendar, RefreshCw, AlertCircle, Filter } from "lucide-react";

type CategoryFilter = "All Events" | "Featured Only";

export default function EventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All Events");
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err: any) {
      console.error("Failed to load events from API", err);
      setError(err?.message || "Failed to fetch event data from API server");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === "Featured Only") {
      return ev.isHighlight;
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-black text-slate-100 font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Interactive Neural Network Background Pattern */}
      <NeuralNetworkBackground />

      {/* Ambient Radial Glows (subtle) */}
      <div className="fixed top-1/4 right-1/4 w-[650px] h-[650px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-10 left-10 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-28 space-y-12">
        {/* Header Banner */}
        <section className="text-center pt-8 max-w-3xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            All Events &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              Hackathons
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            Discover upcoming hackathons, tech summits, coding battles, and workshops hosted by ACES at PVGCOET.
          </p>
        </section>

        {/* Category Filter Bar */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-purple-950/20 border border-purple-900/40 p-4 px-6 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                {(["All Events", "Featured Only"] as CategoryFilter[]).map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                        isActive
                          ? "bg-purple-600 text-white border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                          : "bg-purple-950/30 border border-purple-900/40 text-slate-300 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info Counter */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              <span>TOTAL EVENTS:</span>
              <span className="px-2.5 py-1 rounded-md bg-purple-900/50 border border-purple-500/40 text-purple-200 font-bold">
                {filteredEvents.length}
              </span>
            </div>
          </div>

          {/* Error State Banner */}
          {error && (
            <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-center space-y-3 max-w-lg mx-auto backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">API Connection Notice</h3>
                <p className="text-xs text-rose-300">{error}</p>
              </div>
              <button
                onClick={fetchEvents}
                className="px-4 py-2 rounded-full border border-rose-500/50 bg-rose-900/40 hover:bg-rose-900/60 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </button>
            </div>
          )}

          {/* Loading Skeletons Grid */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={`skel-ev-${idx}`}
                  className="h-96 rounded-3xl bg-purple-950/20 border border-purple-900/30 animate-pulse p-6 flex flex-col justify-between"
                >
                  <div className="w-full h-48 rounded-2xl bg-purple-900/40" />
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-purple-900/40 rounded-md" />
                    <div className="h-4 w-full bg-purple-900/20 rounded-md" />
                  </div>
                  <div className="h-10 w-full bg-purple-900/30 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Empty Events List */}
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-20 bg-purple-950/10 border border-purple-900/30 rounded-3xl space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">No Events Found</h3>
                <p className="text-sm text-slate-400">
                  No upcoming events are currently listed under &quot;{selectedCategory}&quot;.
                </p>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={(ev) => setSelectedEvent(ev)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Sidebars (Social Links & Scroll Guidance) */}
      <Sidebar />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
