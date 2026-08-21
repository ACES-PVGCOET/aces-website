"use client";

import React from "react";
import { Sparkles, Filter, Users } from "lucide-react";
import { TeamCategory } from "@/lib/types/member";

interface TeamFilterBarProps {
  categories: TeamCategory[];
  selectedCategory: TeamCategory;
  onSelectCategory: (category: TeamCategory) => void;
  totalMembersCount: number;
}

export default function TeamFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  totalMembersCount,
}: TeamFilterBarProps) {
  return (
    <div className="space-y-6">
      {/* Top Bar: Category Title & Member Count */}
      

      {/* Horizontal Scrollable Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-purple-600 text-white border border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-105"
                  : "bg-purple-950/30 border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-500/40 hover:bg-purple-900/30"
              }`}
            >
              {isActive && (
                <Sparkles className="w-3 h-3 text-purple-200 animate-pulse" />
              )}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
