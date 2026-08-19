"use client";

import React, { useState } from "react";
import Image from "next/image";
import SpotlightCard from "./SpotlightCard";
import { TeamMember } from "@/lib/types/member";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "./SocialIcons";
import { Mail, ShieldCheck, User } from "lucide-react";

interface MemberCardProps {
  member: TeamMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  const [imageError, setImageError] = useState(false);

  const getPositionBadgeColor = (pos: string) => {
    const lower = pos.toLowerCase();
    if (lower.includes("head") || lower.includes("president") || lower.includes("secretary")) {
      return "border-purple-400/60 bg-purple-900/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]";
    }
    if (lower.includes("lead") || lower.includes("joint")) {
      return "border-violet-500/40 bg-violet-950/50 text-violet-300";
    }
    return "border-slate-700/60 bg-slate-900/60 text-slate-300";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SpotlightCard className="p-6 flex flex-col justify-between space-y-6 group hover:border-purple-500/60 transition-all duration-300">
      
      {/* Top Header & Avatar */}
      <div className="space-y-4 text-center flex flex-col items-center">
        
        {/* Avatar Image Container */}
        <div className="relative w-24 h-24 rounded-full p-1 border-2 border-purple-500/40 bg-purple-950/60 shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-105 group-hover:border-purple-400 transition-all duration-300">
          <div className="w-full h-full rounded-full overflow-hidden relative bg-purple-950 flex items-center justify-center">
            {member.profile_photo_url && !imageError ? (
              <img
                src={member.profile_photo_url}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white font-mono font-bold text-xl">
                {member.name ? getInitials(member.name) : <User className="w-8 h-8 text-purple-400" />}
              </div>
            )}
          </div>

          {/* Active Status Pulse Dot */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#06020c] shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        </div>

        {/* Member Name & Team */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
            {member.name}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {/* Position Badge */}
            <span
              className={`px-3 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${getPositionBadgeColor(
                member.position
              )}`}
            >
              {member.position}
            </span>

            {/* Team Badge */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-purple-900/40 bg-purple-950/40 text-purple-400">
              {member.team}
            </span>
          </div>
        </div>

      </div>

      {/* Social Links Footer */}
      <div className="pt-4 border-t border-purple-900/30 flex items-center justify-center gap-3">
        {member.social_links?.linkedin && (
          <a
            href={member.social_links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name}'s LinkedIn`}
            className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-800/40 text-slate-300 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
          </a>
        )}

        {member.social_links?.github && (
          <a
            href={member.social_links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name}'s GitHub`}
            className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-800/40 text-slate-300 hover:text-white hover:border-slate-400 hover:bg-slate-800/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>
        )}

        {member.social_links?.instagram && (
          <a
            href={member.social_links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name}'s Instagram`}
            className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-800/40 text-slate-300 hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
          </a>
        )}

        {member.email && (
          <a
            href={`mailto:${member.email}`}
            aria-label={`Email ${member.name}`}
            className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-800/40 text-slate-300 hover:text-purple-300 hover:border-purple-500/50 hover:bg-purple-900/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

    </SpotlightCard>
  );
}
