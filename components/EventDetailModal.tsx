"use client";

import React, { useState } from "react";
import { ApiEvent } from "@/lib/types/events";
import FormModal from "@/components/FormModal";
import {
  X,
  Sparkles,
  Calendar,
  ShieldCheck,
  FileText,
  Clock,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

interface EventDetailModalProps {
  event: ApiEvent | null;
  onClose: () => void;
}

export default function EventDetailModal({
  event,
  onClose,
}: EventDetailModalProps) {
  const [imageError, setImageError] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  if (!event) return null;

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Upcoming Event";
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
        
        {/* Modal Container */}
        <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0418] border border-purple-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3)] flex flex-col">
          
          {/* Modal Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 border border-purple-500/40 text-slate-300 hover:text-white hover:bg-purple-900/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Banner */}
          <div className="relative w-full h-56 sm:h-72 shrink-0 overflow-hidden bg-purple-950/60">
            {event.banner_url && !imageError ? (
              <img
                src={event.banner_url}
                alt={event.overview}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <Calendar className="w-12 h-12 text-purple-400 opacity-60" />
                <span className="text-sm font-mono text-purple-300 tracking-widest uppercase">
                  ACES EVENT SPECIFICATION
                </span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418] via-[#0c0418]/40 to-transparent" />

            {/* Badge */}
            {event.isHighlight && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-purple-600 border border-purple-400 text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.6)] z-10">
                <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
                <span>FEATURED EVENT</span>
              </div>
            )}
          </div>

          {/* Modal Content Scroll Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-200">
            
            {/* Event Title & Metadata */}
            <div className="space-y-3 border-b border-purple-900/40 pb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {event.overview}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                {event.auditing?.created_at && (
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Posted: {formatDate(event.auditing.created_at)}</span>
                  </div>
                )}

                {event.reg_form_id && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>REGISTRATION OPEN</span>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Event Description & Overview
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                {event.description}
              </p>
            </div>

            {/* Terms & Rules */}
            {event.terms && (
              <div className="space-y-2 p-4 rounded-2xl bg-purple-950/30 border border-purple-900/40">
                <h3 className="text-xs font-mono uppercase tracking-wider text-violet-300 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  Terms & Eligibility Requirements
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {event.terms}
                </p>
              </div>
            )}

          </div>

          {/* Modal Sticky Footer Action Bar */}
          <div className="p-4 sm:p-6 border-t border-purple-900/40 bg-purple-950/40 flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-700 hover:border-purple-500/40 bg-slate-900/60 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Close
            </button>

            {event.reg_form_id ? (
              <button
                onClick={() => setIsFormModalOpen(true)}
                className="px-6 py-2.5 rounded-xl border border-purple-500/50 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all cursor-pointer"
              >
                <span>Register Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs font-mono text-slate-400">
                Registration Info Available Soon
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Dynamic Form Engine Modal */}
      {event.reg_form_id && (
        <FormModal
          formId={event.reg_form_id}
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
        />
      )}
    </>
  );
}
