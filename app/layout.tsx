import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import AnnouncementWidget from "@/components/AnnouncementWidget";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://acespvgcoet.in"),
  title: {
    default: "ACES - Association of Computer Engineering Students | PVGCOET",
    template: "%s | ACES PVGCOET",
  },
  description: "Official portal of the Association of Computer Engineering Students (ACES) at PVG's COET & GKPIM, Pune. Discover tech events, hackathons, workshops, student council, and publications.",
  keywords: [
    "ACES",
    "ACES PVGCOET",
    "Association of Computer Engineering Students",
    "PVG COET Pune",
    "Computer Engineering",
    "Tech Events",
    "Hackathons",
    "Student Council",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ACES - Association of Computer Engineering Students | PVGCOET",
    description: "Official portal of the Association of Computer Engineering Students (ACES) at PVG's COET & GKPIM, Pune. Discover tech events, hackathons, workshops, student council, and publications.",
    url: "/",
    siteName: "ACES PVGCOET",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ACES PVGCOET Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACES - Association of Computer Engineering Students | PVGCOET",
    description: "Official portal of the Association of Computer Engineering Students (ACES) at PVG's COET & GKPIM, Pune. Discover tech events, hackathons, workshops, student council, and publications.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", inter.variable)}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-black text-slate-100">
        {children}
        <AnnouncementWidget />
      </body>
    </html>
  );
}
