import React from "react";
import { DiscordIcon, InstagramIcon, LinkedinIcon } from "@/components/SocialIcons";

export default function Sidebar() {
  return (
    <>
      {/* Left Social Links Fixed Sidebar */}
      <aside className="fixed left-6 bottom-8 z-40 hidden xl:flex flex-col items-center gap-6 text-slate-400">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-slate-800 to-purple-500/40" />

        <a
          href="#discord"
          className="hover:text-purple-400 transition-colors transform hover:scale-110"
          title="Discord"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DiscordIcon className="w-4 h-4" />
        </a>
        <a
          href="#instagram"
          className="hover:text-purple-400 transition-colors transform hover:scale-110"
          title="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon className="w-4 h-4" />
        </a>
        <a
          href="#linkedin"
          className="hover:text-purple-400 transition-colors transform hover:scale-110"
          title="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon className="w-4 h-4" />
        </a>

        <div className="w-[1px] h-16 bg-gradient-to-b from-purple-500/40 via-slate-800 to-transparent" />
      </aside>

      {/* Bottom Left Scroll Down Guidance Indicator */}
      <div className="fixed bottom-6 left-6 z-40 hidden xl:flex items-center gap-3 font-sans text-xs text-slate-400 pointer-events-none select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          <div className="w-12 h-[1px] bg-purple-500/40" />
        </div>
        <span>Scroll Down</span>
      </div>
    </>
  );
}
