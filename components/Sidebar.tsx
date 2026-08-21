import React from "react";
import { DiscordIcon, InstagramIcon, LinkedinIcon } from "@/components/SocialIcons";
import { YoutubeIcon } from "lucide-react";

export default function Sidebar() {
  return (
    <>
      {/* Left Social Links Fixed Sidebar */}
      <aside className="fixed left-6 bottom-8 z-40 hidden xl:flex flex-col items-center gap-6 text-slate-400">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-slate-800 to-purple-500/40" />

        <a
          href="https://youtube.com/@acespvgcoet5962?si=M5KkrUZv2dNCc1No"
          className="hover:text-purple-400 transition-colors transform hover:scale-110"
          title="Discord"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YoutubeIcon className="w-4 h-4" />
        </a>
        <a
          href="https://www.instagram.com/acespvg?igsi=MWltbDhnODJ6N25hNg=="
          className="hover:text-purple-400 transition-colors transform hover:scale-110"
          title="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon className="w-4 h-4" />
        </a>
        <a
          href="https://in.linkedin.com/school/acespvg/"
          className="hover:text-purple-400 transition-colors transform hover:scale-110"
          title="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon className="w-4 h-4" />
        </a>

        <div className="w-[1px] h-16 bg-gradient-to-b from-purple-500/40 via-slate-800 to-transparent" />
      </aside>
    </>
  );
}
