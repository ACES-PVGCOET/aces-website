import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Core Team",
  description: "Meet the student council, faculty coordinators, technical heads, and creative leads driving the Association of Computer Engineering Students (ACES) at PVG's COET.",
  alternates: {
    canonical: "/team",
  },
  openGraph: {
    title: "Core Team | ACES PVGCOET",
    description: "Meet the student council, faculty coordinators, technical heads, and creative leads driving the Association of Computer Engineering Students (ACES) at PVG's COET.",
    url: "/team",
  },
  twitter: {
    card: "summary_large_image",
    title: "Core Team | ACES PVGCOET",
    description: "Meet the student council, faculty coordinators, technical heads, and creative leads driving the Association of Computer Engineering Students (ACES) at PVG's COET.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
