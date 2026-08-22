"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Bell,
  X,
  RefreshCw,
  Sparkles,
  ExternalLink,
  CheckCheck,
  AlertCircle,
  Clock,
  ChevronRight,
  Megaphone,
} from "lucide-react";
import { getAllAnnouncements } from "@/lib/api/announcementsApi";
import { ApiAnnouncement } from "@/lib/types/announcements";
import Link from "next/link";

const SEEN_STORAGE_KEY = "aces_seen_announcement_ids";

export default function AnnouncementWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<ApiAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const panelRef = useRef<HTMLDivElement>(null);

  // Load seen announcement IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEEN_STORAGE_KEY);
      if (stored) {
        setSeenIds(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      console.error("Error reading seen announcements from storage", e);
    }
  }, []);

  // Save seen IDs to localStorage
  const saveSeenIds = (newSeen: Set<string>) => {
    setSeenIds(newSeen);
    try {
      localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(Array.from(newSeen)));
    } catch (e) {
      console.error("Error saving seen announcements to storage", e);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      console.error("Failed to load announcements", err);
      setError(err?.message || "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Close when clicking outside panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = announcements.filter((item) => !seenIds.has(item.id)).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Mark currently visible announcements as seen when opening panel
    if (!isOpen && announcements.length > 0) {
      const updated = new Set(seenIds);
      announcements.forEach((a) => updated.add(a.id));
      saveSeenIds(updated);
    }
  };

  const handleMarkAllRead = () => {
    const updated = new Set(seenIds);
    announcements.forEach((a) => updated.add(a.id));
    saveSeenIds(updated);
  };

  const filteredAnnouncements = announcements.filter((item) => {
    if (filter === "unread") {
      return !seenIds.has(item.id);
    }
    return true;
  });

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Recently";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge?.toUpperCase()) {
      case "URGENT":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "NEW":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "FEATURED":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "OPPORTUNITY":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      default:
        return "bg-slate-700/50 text-slate-300 border-slate-600/40";
    }
  };

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button (FAB) */}
      <div className="relative">
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 pointer-events-none z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-600 border border-purple-300 text-[9px] font-bold text-white items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}

        <button
          onClick={handleToggle}
          aria-label="Toggle announcements panel"
          title="Announcements"
          className={`group relative flex items-center justify-center w-14 h-14 rounded-full p-0.5 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-2xl ${
            isOpen
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105 shadow-purple-500/30"
              : "bg-slate-900/90 text-slate-200 hover:text-white border border-purple-500/30 hover:border-purple-400 hover:shadow-purple-500/20 hover:scale-105 backdrop-blur-md"
          }`}
        >
          <div className="relative flex items-center justify-center w-full h-full rounded-full bg-slate-950/40 group-hover:bg-transparent transition-colors duration-300">
            {isOpen ? (
              <X className="w-6 h-6 transition-transform duration-300 rotate-0 group-hover:rotate-90" />
            ) : (
              <Megaphone className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </div>
        </button>
      </div>

      {/* Floating Announcement Panel Drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[calc(100vw-3rem)] sm:w-96 max-h-[80vh] flex flex-col bg-slate-950/95 border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Top Cyber Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-purple-500/20 bg-slate-900/60">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                  Announcements
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">Official updates & notices</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={fetchAnnouncements}
                disabled={loading}
                title="Refresh announcements"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-400" : ""}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-purple-500/10 text-xs">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-purple-600/30 text-purple-200 border border-purple-500/30 font-medium"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All ({announcements.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filter === "unread"
                    ? "bg-purple-600/30 text-purple-200 border border-purple-500/30 font-medium"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Announcements List Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[420px] scrollbar-thin scrollbar-thumb-purple-900/40">
            {loading && announcements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                <p className="text-xs">Fetching live announcements...</p>
              </div>
            ) : error && announcements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-2 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-rose-400" />
                <p className="text-xs text-rose-300">{error}</p>
                <button
                  onClick={fetchAnnouncements}
                  className="px-3 py-1.5 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg transition-colors border border-rose-500/30"
                >
                  Try Again
                </button>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-2 text-center">
                <Bell className="w-8 h-8 text-slate-600 mb-1" />
                <p className="text-xs font-medium text-slate-300">No announcements found</p>
                <p className="text-[11px] text-slate-500">
                  {filter === "unread"
                    ? "You are all caught up!"
                    : "Check back later for new notices."}
                </p>
              </div>
            ) : (
              filteredAnnouncements.map((item) => {
                const isSeen = seenIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`group relative p-3.5 rounded-xl border transition-all duration-200 ${
                      !isSeen
                        ? "bg-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-950/20"
                        : "bg-slate-900/40 border-slate-800/80 hover:border-purple-500/30 hover:bg-slate-900/60"
                    }`}
                  >
                    {!isSeen && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-400" />
                    )}

                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.badge && (
                          <span
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getBadgeStyle(
                              item.badge
                            )}`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {formatDate(item.auditing?.created_at)}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-100 group-hover:text-purple-300 transition-colors mb-1 pr-3 leading-snug">
                      {item.topic}
                    </h4>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal whitespace-pre-line mb-2">
                      {item.description}
                    </p>

                    {item.auditing?.created_by && (
                      <p className="text-[9px] text-slate-500 italic mb-2">
                        Posted by: {item.auditing.created_by}
                      </p>
                    )}

                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        View details
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="px-4 py-2.5 bg-slate-950 border-t border-purple-500/10 text-center text-[10px] text-slate-500">
            Association of Computer Engineering Students • ACES
          </div>
        </div>
      )}
    </div>
  );
}
