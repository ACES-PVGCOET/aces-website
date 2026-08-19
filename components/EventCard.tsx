"use client";

import React, { useState } from "react";
import SpotlightCard from "./SpotlightCard";
import { ApiEvent } from "@/lib/types/events";
import { Sparkles, Calendar, ArrowRight, FileText, CheckCircle2 } from "lucide-react";

interface EventCardProps {
  event: ApiEvent;
  onSelect: (event: ApiEvent) => void;
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <SpotlightCard className="p-6 flex flex-col justify-between space-y-6 group hover:border-purple-500/60 transition-all duration-300">
      
      <div className="space-y-4">
        {/* Event Banner Container */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-purple-900/40 bg-purple-950/60 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
          {event.banner_url && !imageError ? (
            <img
              src={event.banner_url}
              alt={event.overview}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/60 via-slate-950 to-indigo-950/80 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <Calendar className="w-10 h-10 text-purple-400 opacity-60" />
              <span className="text-xs font-mono text-purple-300/80 uppercase tracking-widest">
                ACES EVENT
              </span>
            </div>
          )}

          {/* Highlight Badge */}
          {event.isHighlight && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-purple-600/90 backdrop-blur-md border border-purple-400 text-white text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.6)]">
              <Sparkles className="w-3 h-3 text-purple-200 animate-pulse" />
              <span>FEATURED</span>
            </div>
          )}
        </div>

        {/* Title & Short Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-2">
            {event.overview}
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-light">
            {event.description}
          </p>
        </div>

        {/* Terms Snippet */}
        {event.terms && (
          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{event.terms}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-purple-900/30 flex items-center gap-3">
        <button
          onClick={() => onSelect(event)}
          className="w-full py-2.5 rounded-xl border border-purple-500/40 bg-purple-900/30 hover:bg-purple-600 hover:border-purple-400 text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
        >
          <span>View Event Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </SpotlightCard>
  );
}
