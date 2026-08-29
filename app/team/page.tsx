"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import TeamFilterBar from "@/components/TeamFilterBar";
import MemberCard from "@/components/MemberCard";
import { getMembers } from "@/lib/api/membersApi";
import { TeamCategory, TeamMember } from "@/lib/types/member";
import { Users, RefreshCw, AlertCircle } from "lucide-react";

const TEAM_CATEGORIES: TeamCategory[] = [
  "Faculty",
  "Leaders",
  "Web Team",
  "Technical Team",
  "Event Team",
  "Media and Marketing Team",
  "Editorial Team",
  "Treasury and Sponsorship Team",
  "Design Team",
  "Production Team",
];

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<TeamCategory>("Leaders");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMembers(selectedCategory);
      // Filter out members without a profile photo URL
      const membersWithPhotos = data.filter(
        (member) =>
          Boolean(member.profile_photo_url && member.profile_photo_url.trim() !== "")
      );
      setMembers(membersWithPhotos);
    } catch (err: any) {
      console.error("Failed loading team members from API", err);
      setError(err?.message || "Failed to fetch member data from API server");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [selectedCategory]);

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
            Meet Our Innovators &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              Core Team
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            Explore the dedicated minds driving computer engineering excellence, technical hackathons, design, media, and executive operations at ACES.
          </p>
        </section>

        {/* Team Filter Section */}
        <section className="space-y-8">
          <TeamFilterBar
            categories={TEAM_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            totalMembersCount={members.length}
          />

          {/* Error Banner State */}
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
                onClick={fetchTeamMembers}
                className="px-4 py-2 rounded-full border border-rose-500/50 bg-rose-900/40 hover:bg-rose-900/60 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </button>
            </div>
          )}

          {/* Loading Skeletons Grid */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <div
                  key={`skel-mem-${idx}`}
                  className="rounded-2xl bg-purple-950/20 border border-purple-900/30 animate-pulse overflow-hidden flex flex-col justify-between"
                >
                  <div className="w-full aspect-[4/5] bg-purple-900/30" />
                  <div className="p-5 space-y-4 text-center">
                    <div className="space-y-2">
                      <div className="h-5 w-3/4 mx-auto bg-purple-900/40 rounded-md" />
                      <div className="h-3 w-1/2 mx-auto bg-purple-900/20 rounded-md" />
                    </div>
                    <div className="h-8 w-2/3 mx-auto bg-purple-900/30 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty Member List State */}
          {!loading && !error && members.length === 0 && (
            <div className="text-center py-16 bg-purple-950/10 border border-purple-900/30 rounded-3xl space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">No Members Available</h3>
                <p className="text-sm text-slate-400">
                  No active committee members found for &quot;{selectedCategory}&quot;.
                </p>
              </div>
            </div>
          )}

          {/* Members Card Grid */}
          {!loading && !error && members.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Sidebars (Social Links & Scroll Guidance) */}
      <Sidebar />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
