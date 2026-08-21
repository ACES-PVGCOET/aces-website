"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import FormModal from "@/components/FormModal";

export interface NavItem {
  label: string;
  href: string;
}

const JOIN_FORM_ID = "6a8875e5b3701104fe3b9965";

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Team", href: "/team" },
  { label: "Publications", href: "/publications" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/")) {
      const route = href.split("#")[0];
      if (route.length > 1 && pathname.startsWith(route)) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <header className="relative z-50 max-w-7xl mx-auto px-6 sm:px-10 h-24 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/">
          <Logo showText={false} iconClassName="h-8 sm:h-8 w-auto object-contain hover:scale-105 transition-transform" />
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={
                  active
                    ? "relative text-white font-semibold flex flex-col items-center"
                    : "hover:text-purple-300 transition-colors"
                }
              >
                {item.label}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1 shadow-[0_0_8px_rgba(168,85,247,1)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="px-6 py-2.5 rounded-full border border-purple-500/50 bg-purple-950/20 hover:bg-purple-900/40 text-purple-200 hover:text-white font-medium text-sm transition-all duration-300 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] cursor-pointer"
          >
            <span>Join Us</span>
            <ArrowUpRight className="w-4 h-4 text-purple-400" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-purple-900/30 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer / Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-24 z-40 bg-black/95 backdrop-blur-xl md:hidden flex flex-col p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-6 text-lg font-medium text-slate-200">
              {navItems.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={
                      active
                        ? "text-purple-400 font-semibold flex items-center justify-between"
                        : "hover:text-purple-300 transition-colors"
                    }
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,1)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsFormModalOpen(true);
              }}
              className="w-full py-3 rounded-full border border-purple-500/50 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer"
            >
              <span>Join Us</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Dynamic Registration Form Modal */}
      <FormModal
        formId={JOIN_FORM_ID}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />
    </>
  );
}

