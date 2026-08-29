export interface MemberSocialLinks {
  linkedin?: string;
  instagram?: string;
  github?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  team: string;
  position: string;
  status?: "ACTIVE" | "NOT_ACTIVE";
  roles?: string[];
  profile_photo_url?: string;
  social_links?: MemberSocialLinks;
}

export type TeamCategory =
  | "Leaders"
  | "Leaders Team"
  | "Faculty"
  | "Faculty Team"
  | "Web Team"
  | "Technical Team"
  | "Event Team"
  | "Media and Marketing Team"
  | "Editorial Team"
  | "Treasury and Sponsorship Team"
  | "Design Team"
  | "Production Team";

