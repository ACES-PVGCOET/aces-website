export interface AnnouncementAuditing {
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface ApiAnnouncement {
  id: string;
  topic: string;
  description: string;
  badge?: string;
  link?: string;
  auditing?: AnnouncementAuditing;
}

export interface AnnouncementsApiResponse {
  success: boolean;
  data: ApiAnnouncement[] | { announcements: ApiAnnouncement[] };
  error?: string | null;
}
