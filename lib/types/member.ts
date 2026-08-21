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
  | "All Teams"
  | "Web Team"
  | "Technical Team"
  | "Event Team"
  | "Media Team"
  | "Marketing Team"
  | "Editorial Team"
  | "Treasury Team"
  | "Design Team"
  | "Production Team";
