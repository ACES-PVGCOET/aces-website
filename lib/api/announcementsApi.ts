import { ApiAnnouncement } from "../types/announcements";

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
  );
};

export const MOCK_ANNOUNCEMENTS: ApiAnnouncement[] = [
  {
    id: "ann-1",
    topic: "Registration Open for Hackfest 2026",
    description:
      "Prepare your teams! The annual 24-hour innovation hackathon Hackfest 2026 registrations are now live. Submit your team details before August 25th to secure your spot.",
    badge: "URGENT",
    link: "/events",
    auditing: {
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      created_by: "ACES Marketing Team",
    },
  },
  {
    id: "ann-2",
    topic: "ACE THE TECH Magazine 2025 Edition Published",
    description:
      "The latest edition of ACES official flagship magazine 'ACE THE TECH 2025' is now available for reading and download. Check out student achievements, department highlights, and tech articles!",
    badge: "NEW",
    link: "/publications",
    auditing: {
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      created_by: "Editorial Team",
    },
  },
  {
    id: "ann-3",
    topic: "Genesis Tech Summit Speaker Lineup Revealed",
    description:
      "Join us for a 2-day virtual summit featuring senior architects and AI engineers from top tech organizations. Pre-registration for workshop slots is now open on the events page.",
    badge: "FEATURED",
    link: "/events",
    auditing: {
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      created_by: "ACES Executive Committee",
    },
  },
  {
    id: "ann-4",
    topic: "Call for Design & Web Dev Team Recruitment 2026",
    description:
      "Interested in creating next-generation web applications, cyber UI, and event media? Fill out the recruitment form to join ACES Web & Media domain for the upcoming term.",
    badge: "OPPORTUNITY",
    link: "/forms",
    auditing: {
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 days ago
      created_by: "Web Operations Team",
    },
  },
];

/**
 * Fetch all announcements from backend API (/api/v1/announcements)
 * Falls back to mock data if the API is unreachable or fails.
 */
export async function getAllAnnouncements(): Promise<ApiAnnouncement[]> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/announcements`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API returned HTTP status ${response.status}`);
    }

    const json = await response.json();

    if (json.success && json.data) {
      if (Array.isArray(json.data)) {
        return json.data;
      } else if (Array.isArray(json.data.announcements)) {
        return json.data.announcements;
      }
    }

    // Fallback if data array is empty or malformed
    return MOCK_ANNOUNCEMENTS;
  } catch (error) {
    console.warn("Failed to fetch announcements from API, using fallback data:", error);
    return MOCK_ANNOUNCEMENTS;
  }
}
