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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-purple-950/20 border border-purple-900/40 p-4 px-6 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">
              {selectedCategory.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400">
              Filter by department to explore active committee members
            </p>
          </div>
        </div>

        {/* Info Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Filter className="w-3.5 h-3.5 text-purple-400" />
          <span>TOTAL:</span>
          <span className="px-2.5 py-1 rounded-md bg-purple-900/50 border border-purple-500/40 text-purple-200 font-bold">
            {totalMembersCount} {totalMembersCount === 1 ? "MEMBER" : "MEMBERS"}
          </span>
        </div>
      </div>

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
