"use client";

import React, { useState } from "react";
import SpotlightCard from "./SpotlightCard";
import { TeamMember } from "@/lib/types/member";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "./SocialIcons";
import { Mail } from "lucide-react";

interface MemberCardProps {
  member: TeamMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  const [imageError, setImageError] = useState(false);

  // Don't display member if photo is not available or fails to load
  if (
    !member.profile_photo_url ||
    !member.profile_photo_url.trim() ||
    imageError
  ) {
    return null;
  }

  return (
    <SpotlightCard className="p-0 flex flex-col h-full group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(168,85,247,0.4)] hover:border-purple-400/80 rounded-2xl overflow-hidden border border-purple-900/40 bg-purple-950/20 backdrop-blur-md">
      {/* Rectangular Big Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-purple-950/40">
        <img
          src={member.profile_photo_url}
          alt={member.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
          onError={() => setImageError(true)}
        />

        {/* Ambient Dark Gradient Bottom Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />

        {/* Dynamic Light Sweep Highlight Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      </div>

      {/* Member Details & Social Links */}
      <div className="p-5 flex flex-col flex-grow justify-between text-center space-y-4 relative z-10">
        {/* Name and Position */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors duration-300 line-clamp-1">
            {member.name}
          </h3>
          <p className="text-xs font-mono font-semibold tracking-wider text-purple-400 uppercase drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
            {member.position}
          </p>
        </div>

        {/* Social Icons */}
        <div className="pt-3 border-t border-purple-900/30 flex items-center justify-center gap-3">
          {member.social_links?.linkedin && (
            <a
              href={member.social_links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name}'s LinkedIn`}
              className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 text-slate-300 hover:text-white hover:border-[#0A66C2] hover:bg-[#0A66C2]/20 hover:shadow-[0_0_15px_rgba(10,102,194,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}

          {member.social_links?.github && (
            <a
              href={member.social_links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name}'s GitHub`}
              className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 text-slate-300 hover:text-white hover:border-slate-300 hover:bg-slate-800/80 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}

          {member.social_links?.instagram && (
            <a
              href={member.social_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name}'s Instagram`}
              className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 text-slate-300 hover:text-white hover:border-[#E4405F] hover:bg-[#E4405F]/20 hover:shadow-[0_0_15px_rgba(228,64,95,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}

          {member.email && (
            <a
              href={`mailto:${member.email}`}
              aria-label={`Email ${member.name}`}
              className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 text-slate-300 hover:text-white hover:border-purple-400 hover:bg-purple-900/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}

