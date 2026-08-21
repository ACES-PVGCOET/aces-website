import React from "react";

export interface LogoProps {
  showText?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  onClick?: () => void;
}

export function LogoIcon({ className = "h-8 w-auto object-contain" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="ACES Logo"
      className={`object-contain ${className}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (!target.src.endsWith("/logo.jpeg")) {
          target.src = "/logo.jpeg";
        }
      }}
    />
  );
}

export default function Logo({
  showText = true,
  className = "",
  iconClassName = "h-9 w-auto object-contain",
  textClassName = "font-zen font-bold text-xl tracking-wider text-white",
  onClick,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 cursor-pointer select-none ${className}`} onClick={onClick}>
      <LogoIcon className={iconClassName} />
      {showText && <span className={textClassName}>ACES</span>}
    </div>
  );
}

