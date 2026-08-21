"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import { getMagazinesFromShowcase } from "@/lib/api/publicationsApi";
import { MagazineItem } from "@/lib/types/publications";
import {
  BookOpen,
  Download,
  Sparkles,
  Search,
  RefreshCw,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
} from "lucide-react";

export default function PublicationsPage() {
  const [magazines, setMagazines] = useState<MagazineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMagazines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMagazinesFromShowcase();
      setMagazines(data);
    } catch (err: any) {
      console.error("Failed to load magazines from showcase API", err);
      setError(err?.message || "Failed to fetch magazine publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  // Filter magazines based on search query (matches year title or description)
  const filteredMagazines = magazines.filter((mag) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      mag.title.toLowerCase().includes(q) ||
      mag.publicationYear.toString().includes(q) ||
      (mag.description && mag.description.toLowerCase().includes(q))
    );
  });

  const newestMagazine = filteredMagazines.length > 0 ? filteredMagazines[0] : null;
  const olderMagazines = filteredMagazines.length > 1 ? filteredMagazines.slice(1) : [];

  const handleDownload = (e: React.MouseEvent, mag: MagazineItem) => {
    e.stopPropagation();
    if (!mag.media_url) return;

    // Trigger download or open direct file URL
    const link = document.createElement("a");
    link.href = mag.media_url;
    link.target = "_blank";
    link.download = `ACES_Magazine_${mag.title || mag.publicationYear}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen bg-black text-slate-100 font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Background Neural Network canvas */}
      <NeuralNetworkBackground />

      {/* Ambient Radial Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-28 space-y-12">
        {/* Header Section */}
        <section className="text-center pt-8 max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.2)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>OFFICIAL ACES PUBLICATIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Magazines &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              Annual Editions
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            Explore the flagship technical publications, student breakthroughs, and annual editions produced by the Association of Computer Engineering Students.
          </p>
        </section>

        {/* Controls & Search Bar */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-purple-950/20 border border-purple-900/40 p-4 px-6 rounded-2xl backdrop-blur-md">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search by publication year or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-purple-950/40 border border-purple-800/40 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredMagazines.length} Edition{filteredMagazines.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={fetchMagazines}
              disabled={loading}
              className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 hover:text-white hover:bg-purple-900/40 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Publications"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </section>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-10">
            {/* Featured Skeleton */}
            <div className="w-full h-[420px] rounded-3xl bg-purple-950/20 border border-purple-900/30 animate-pulse p-8 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 h-full bg-purple-900/30 rounded-2xl" />
              <div className="flex-1 space-y-4 py-4">
                <div className="w-32 h-6 bg-purple-900/40 rounded-full" />
                <div className="w-3/4 h-10 bg-purple-900/40 rounded-lg" />
                <div className="w-full h-20 bg-purple-900/30 rounded-lg" />
                <div className="w-48 h-12 bg-purple-900/40 rounded-xl" />
              </div>
            </div>
            {/* Grid Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-purple-950/20 border border-purple-900/30 animate-pulse p-4 space-y-4">
                  <div className="w-full h-48 bg-purple-900/30 rounded-xl" />
                  <div className="w-1/2 h-6 bg-purple-900/40 rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-red-300 font-medium text-sm">{error}</p>
            <button
              onClick={fetchMagazines}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content Display */}
        {!loading && !error && filteredMagazines.length === 0 && (
          <div className="text-center py-16 space-y-4 bg-purple-950/10 border border-purple-900/30 rounded-3xl">
            <BookOpen className="w-12 h-12 text-purple-400/60 mx-auto" />
            <h3 className="text-xl font-bold text-slate-200">No Publications Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              No magazine editions matched your query. Try clearing your search filter.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-full bg-purple-950/60 border border-purple-700/50 text-purple-300 text-xs font-medium hover:text-white"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredMagazines.length > 0 && (
          <div className="space-y-16">
            {/* NEWEST MAGAZINE HIGHLIGHT (Featured Larger Hero Card) */}
            {newestMagazine && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-purple-400 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Featured Latest Issue</span>
                </div>

                <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-950/90 to-purple-950/50 border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 shadow-[0_0_50px_rgba(168,85,247,0.25)] hover:shadow-[0_0_70px_rgba(168,85,247,0.4)]">
                  {/* Glowing background ambient gradient inside card */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/30 transition-all duration-500" />

                  <div className="relative z-10 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Cover Photo - Larger Size with Glow */}
                    <div className="lg:col-span-5 relative flex justify-center">
                      <div className="relative w-full max-w-xs sm:max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-purple-400/40 group-hover:scale-[1.02] transition-transform duration-500">
                        {/* Glowing corner badge */}
                        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-purple-600 text-white font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(168,85,247,0.9)]">
                          NEWEST • {newestMagazine.title}
                        </div>

                        <img
                          src={newestMagazine.cover_image}
                          alt={`ACES Magazine Cover ${newestMagazine.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                    </div>

                    {/* Information & Action Details */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-900/40 border border-purple-500/40 text-purple-300 text-xs font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Publication Year: {newestMagazine.title}</span>
                        </div>

                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                          ACES Magazine Edition{" "}
                          <span className="bg-gradient-to-r from-purple-300 via-violet-200 to-indigo-300 bg-clip-text text-transparent">
                            {newestMagazine.title}
                          </span>
                        </h2>

                        {newestMagazine.description && (
                          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                            {newestMagazine.description}
                          </p>
                        )}
                      </div>

                      {/* Metadata badge */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-2 border-t border-purple-900/40">
                        <div className="flex items-center gap-1.5 bg-purple-950/50 px-3 py-1.5 rounded-lg border border-purple-800/40">
                          <FileText className="w-3.5 h-3.5 text-purple-400" />
                          <span>Official Technical Edition</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-4 pt-4">
                        <button
                          onClick={(e) => handleDownload(e, newestMagazine)}
                          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] transition-all duration-300 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Magazine PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* OLDER MAGAZINES GRID */}
            {olderMagazines.length > 0 && (
              <section className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
                  <div className="flex items-center gap-2 text-sm font-mono font-semibold text-purple-300 uppercase tracking-widest">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Previous Editions ({olderMagazines.length})</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Sorted Newest First</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {olderMagazines.map((mag) => (
                    <div
                      key={mag.id}
                      className="group relative flex flex-col justify-between rounded-2xl bg-purple-950/20 border border-purple-900/40 hover:border-purple-500/50 p-5 backdrop-blur-sm hover:bg-purple-950/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                    >
                      <div className="space-y-4">
                        {/* Cover Image */}
                        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-black/60 border border-purple-900/50">
                          <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                            {mag.title}
                          </div>

                          <img
                            src={mag.cover_image}
                            alt={`ACES Magazine ${mag.title}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                            Edition {mag.title}
                          </h3>
                          {mag.description && (
                            <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                              {mag.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Download Action */}
                      <div className="pt-5 mt-4 border-t border-purple-900/30 flex items-center justify-between gap-3">
                        <button
                          onClick={(e) => handleDownload(e, mag)}
                          className="w-full py-2.5 px-4 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Magazine PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
