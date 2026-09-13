import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Explore upcoming and past tech events, coding competitions, hackathons, and hands-on workshops hosted by ACES.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
