import { TeamMember } from "../types/member";

/**
 * Calculate numerical rank for member positions for hierarchical ordering:
 * Head / General Secretary (1) > Joint Head / Joint General Secretary (2) > Faculty (3) > Member (4) > Others (5)
 */
export function getPositionRank(position?: string): number {
  if (!position) return 99;
  const normalized = position.trim().toLowerCase();

  if (normalized === "head" || normalized === "team head" || normalized === "general secretary" || normalized === "president") {
    return 1;
  }
  if (normalized.includes("head") && !normalized.includes("joint") && !normalized.includes("co-") && !normalized.includes("vice")) {
    return 1;
  }
  if (normalized.includes("joint head") || normalized.includes("co-head") || normalized.includes("vice head") || normalized === "joint general secretary") {
    return 2;
  }
  if (normalized.includes("joint") || normalized.includes("co-")) {
    return 2;
  }
  if (normalized.includes("faculty")) {
    return 3;
  }
  if (normalized.includes("member")) {
    return 4;
  }
  return 5;
}

export function sortMembersByHierarchy(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => {
    const rankA = getPositionRank(a.position);
    const rankB = getPositionRank(b.position);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return (a.name || "").localeCompare(b.name || "");
  });
}

/**
 * Fetch association members list from API as per API_DOCS.md Section 4.4 (GET /api/v1/iam/members)
 */
export async function getMembers(team?: string): Promise<TeamMember[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  let url = `${baseUrl}/iam/members`;
  if (team && team !== "All Teams") {
    let queryTeam = team;
    if (team === "Leaders Team") queryTeam = "Leaders";
    if (team === "Faculty Team") queryTeam = "Faculty";
    url += `?team=${encodeURIComponent(queryTeam)}`;
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
      return sortMembersByHierarchy(json.data.members);
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

