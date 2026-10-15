import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about ACES (Association of Computer Engineering Students) at PVG's COET, our mission, vision, history, and core pillars of technical excellence and student empowerment.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | ACES PVGCOET",
    description: "Learn about ACES (Association of Computer Engineering Students) at PVG's COET, our mission, vision, history, and core pillars of technical excellence and student empowerment.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | ACES PVGCOET",
    description: "Learn about ACES (Association of Computer Engineering Students) at PVG's COET, our mission, vision, history, and core pillars of technical excellence and student empowerment.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
