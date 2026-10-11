"use client";

import React from "react";

export default function NavratriOverlay() {
  return (
    <div
      className="fixed bottom-0 left-0 z-30 pointer-events-none select-none"
      aria-hidden="true"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-48 sm:w-60 md:w-72 lg:w-80 max-w-[50vw] h-auto object-contain drop-shadow-[0_4px_20px_rgba(234,88,12,0.25)]"
      >
        <source src="/videos/navratri_no_bg.webm" type="video/webm" />
      </video>
    </div>
  );
}
