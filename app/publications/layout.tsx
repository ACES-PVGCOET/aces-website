import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description: "Explore technical articles, blogs, research publications, and annual magazines curated by the Association of Computer Engineering Students (ACES).",
  alternates: {
    canonical: "/publications",
  },
  openGraph: {
    title: "Publications | ACES PVGCOET",
    description: "Explore technical articles, blogs, research publications, and annual magazines curated by the Association of Computer Engineering Students (ACES).",
    url: "/publications",
  },
  twitter: {
    card: "summary_large_image",
    title: "Publications | ACES PVGCOET",
    description: "Explore technical articles, blogs, research publications, and annual magazines curated by the Association of Computer Engineering Students (ACES).",
  },
};

export default function PublicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
