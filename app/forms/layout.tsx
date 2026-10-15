import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forms & Registrations",
  description: "Official event registration, recruitment application, and feedback forms for the Association of Computer Engineering Students (ACES).",
  alternates: {
    canonical: "/forms",
  },
  openGraph: {
    title: "Forms & Registrations | ACES PVGCOET",
    description: "Official event registration, recruitment application, and feedback forms for the Association of Computer Engineering Students (ACES).",
    url: "/forms",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forms & Registrations | ACES PVGCOET",
    description: "Official event registration, recruitment application, and feedback forms for the Association of Computer Engineering Students (ACES).",
  },
};

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
