"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  DiscordIcon,
  InstagramIcon,
  LinkedinIcon,
  GithubIcon,
  TwitterIcon,
} from "@/components/SocialIcons";
import { ArrowUp, Mail, Send, Sparkles } from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

const mainSectionLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Core Team", href: "/team" },
  { label: "Contact Us", href: "/#contact" },
];

const socialLinks = [
  { name: "YouTube", href: "https://youtube.com/@acespvgcoet5962", icon: DiscordIcon, hoverColor: "hover:text-red-400 hover:border-red-500/50 hover:bg-[#5865F2]/10" },
  { name: "Instagram", href: "https://www.instagram.com/acespvg", icon: InstagramIcon, hoverColor: "hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10" },
  { name: "LinkedIn", href: "https://in.linkedin.com/school/acespvg/", icon: LinkedinIcon, hoverColor: "hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-20 bg-[#040108]/90 border-t border-purple-900/40 backdrop-blur-md">
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-purple-950/80">
          
          {/* Brand Info & Motto */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <Link href="/" className="inline-block">
                <Logo
                  iconClassName="h-10 sm:h-12 w-auto object-contain"
                  textClassName="font-zen font-bold text-2xl tracking-wider text-white"
                />
              </Link>
              <p className="text-xs font-mono text-purple-300/90 font-medium tracking-wide uppercase">
                Association of Computer Engineering Students
              </p>
            </div>

            {/* Motto Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-200 text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>CONNECT • INNOVATE • INSPIRE</span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Empowering future computer engineers through collaboration, breakthrough technical projects, hackathons, and high-impact innovation.
            </p>

            {/* Social Media Links */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block font-mono">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className={`w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/40 text-slate-300 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${social.hoverColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section Links */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-purple-300">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
              {mainSectionLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-purple-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/40 group-hover:bg-purple-400 group-hover:shadow-[0_0_8px_rgba(168,85,247,1)] transition-all" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-900/60 border border-purple-500/40 text-purple-200">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected / Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-purple-300">
              Stay in the Loop
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Subscribe to the ACES newsletter to get early announcements on hackathons, tech talks, and open roles.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-3 pt-1"
            >
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                >
                  <span>Join</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[11px] text-slate-500 block font-mono">
                No spam ever. Unsubscribe anytime.
              </span>
            </form>
          </div>

        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 ACES. All rights reserved.</p>

          <p className="flex items-center gap-1.5 font-medium">
            <span>Designed & Built with</span>
            <span className="text-purple-400 inline-block animate-pulse">💜</span>
            <span>by ACES Tech Team</span>
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-800/40 bg-purple-950/30 hover:bg-purple-900/40 text-slate-300 hover:text-white transition-all duration-300 group shadow-[0_0_10px_rgba(168,85,247,0.1)]"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-purple-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
