import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Meet the student council, faculty coordinators, technical heads, and creative leads driving the Association of Computer Engineering Students (ACES).",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
