import { ApiEvent, MajorEvent } from "../types/events";

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL || "https://aces-api-gdd3.onrender.com/api/v1"
  );
};

export const MOCK_MAJOR_EVENTS: MajorEvent[] = [
  {
    id: "hackfest",
    title: "Hackfest",
    subtitle: "24-Hour Innovation Hackathon",
    tagline: "Build. Innovate. Deploy.",
    description:
      "A 24-hour intensive hackathon where 75 teams competed across multiple rounds, solving real-world problems with innovative technological solutions.",
    fullDescription:
      "Hackfest is ACES' pinnacle hackathon bringing together over 75+ multidisciplinary teams. Participants code nonstop through 24 intense hours with mentorship from senior industry engineers, competing for cash prizes and fast-track incubation.",
    image: "/major-events/hackfest.jpg",
    category: "Hackathon",
    highlighted: true,
    badgeText: "75 TEAMS • 24 HOURS",
    date: "Annual Flagship",
    location: "Main Auditorium & Labs",
    tags: ["Hackathon", "Problem Solving", "Prototyping", "Mentorship"],
    stats: [
      { label: "Teams", value: "75+" },
      { label: "Duration", value: "24 Hrs" },
      { label: "Rounds", value: "3" },
    ],
  },
  {
    id: "algorythm",
    title: "Algorythm",
    subtitle: "Competitive Programming & Gaming",
    tagline: "Code the Logic. Win the Game.",
    description:
      "A comprehensive competitive programming and algorithmic challenge event featuring multiple gaming and puzzle-solving competitions.",
    fullDescription:
      "Algorythm tests raw problem-solving speed, data structure proficiency, and strategic thinking through timed coding battles, algorithmic puzzles, and high-stakes LAN gaming rounds.",
    image: "/major-events/algorythm.jpg",
    category: "Coding & Gaming",
    highlighted: true,
    badgeText: "ALGORITHMIC BATTLES",
    date: "Technical Fest",
    location: "Computer Labs",
    tags: ["Data Structures", "Algorithms", "Gaming", "Speed Coding"],
    stats: [
      { label: "Competitors", value: "300+" },
      { label: "Challenges", value: "15+" },
      { label: "Prizes", value: "₹50k+" },
    ],
  },
  {
    id: "genesis",
    title: "Genesis",
    subtitle: "2-Day Tech Summit & Speaker Series",
    tagline: "Inspiring Tomorrow's Tech Leaders.",
    description:
      "Our flagship online event featuring industry experts sharing insights on emerging technologies, career guidance, and professional development across two comprehensive days.",
    fullDescription:
      "Genesis bridges academia and industry through keynote lectures, tech talks, panel discussions, and career guidance workshops led by senior architects and tech founders.",
    image: "/major-events/Genesis.png",
    category: "Tech Summit",
    highlighted: true,
    badgeText: "2-DAY ONLINE SUMMIT",
    date: "Virtual Event",
    location: "Live Stream / Virtual",
    tags: ["Industry Leaders", "AI & Cloud", "Career Guidance", "Tech Talks"],
    stats: [
      { label: "Duration", value: "2 Days" },
      { label: "Speakers", value: "12+" },
      { label: "Attendees", value: "1000+" },
    ],
  },
];

/**
 * Fetch all events list as per API_DOCS.md Section 5.1 (GET /api/v1/events)
 */
export async function getAllEvents(): Promise<ApiEvent[]> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/events`;

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
    if (json.success && json.data && Array.isArray(json.data.events)) {
      return json.data.events;
    }

    if (json.error?.message) {
      throw new Error(json.error.message);
    }

    return [];
  } catch (error) {
    console.error(`Failed to fetch events from API (${url}):`, error);
    throw error;
  }
}

/**
 * Fetch single event by ID as per API_DOCS.md Section 5.3 (GET /api/v1/events/:id)
 */
export async function getEventById(id: string): Promise<ApiEvent> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/events/${encodeURIComponent(id)}`;

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
      return json.data;
    }

    throw new Error(json.error?.message || "Failed to load event details");
  } catch (error) {
    console.error(`Failed to fetch event ID ${id} from API:`, error);
    throw error;
  }
}

/**
 * Backward compatible helper for homepage major events section
 */
export async function getMajorEvents(): Promise<MajorEvent[]> {
  return Promise.resolve(MOCK_MAJOR_EVENTS);
}
