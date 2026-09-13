import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Explore upcoming and past tech events, coding competitions, hackathons, and hands-on workshops hosted by ACES PVGCOET.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Events | ACES PVGCOET",
    description: "Explore upcoming and past tech events, coding competitions, hackathons, and hands-on workshops hosted by ACES PVGCOET.",
    url: "/events",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | ACES PVGCOET",
    description: "Explore upcoming and past tech events, coding competitions, hackathons, and hands-on workshops hosted by ACES PVGCOET.",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
