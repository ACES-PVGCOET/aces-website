import React from "react";

export interface LogoProps {
  showText?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  onClick?: () => void;
}

export function LogoIcon({ className = "w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M16 3L30 27H2L16 3Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 10L23 23H9L16 10Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export default function Logo({
  showText = true,
  className = "",
  iconClassName = "w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]",
  textClassName = "font-zen font-bold text-xl tracking-wider text-white",
  onClick,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 cursor-pointer select-none ${className}`} onClick={onClick}>
      <div className="w-8 h-8 flex items-center justify-center">
        <LogoIcon className={iconClassName} />
      </div>
      {showText && <span className={textClassName}>ACES</span>}
    </div>
  );
}
