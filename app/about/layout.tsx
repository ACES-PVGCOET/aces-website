import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Learn about ACES (Association of Computer Engineering Students), our mission, vision, history, and core pillars of technical excellence and student empowerment.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
