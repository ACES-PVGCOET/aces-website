import { TeamMember } from "../types/member";

/**
 * Fetch association members list from API as per API_DOCS.md Section 4.4 (GET /api/v1/iam/members)
 */
export async function getMembers(team?: string): Promise<TeamMember[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://aces-api-gdd3.onrender.com/api/v1";

  let url = `${baseUrl}/iam/members`;
  if (team && team !== "All Teams") {
    url += `?team=${encodeURIComponent(team)}`;
  }

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
    if (json.success && json.data && Array.isArray(json.data.members)) {
      return json.data.members;
    }

    if (json.error?.message) {
      throw new Error(json.error.message);
    }

    return [];
  } catch (error) {
    console.error(`Failed to fetch team members from API (${url}):`, error);
    throw error;
  }
}
