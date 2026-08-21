export interface EventStat {
  label: string;
  value: string;
}

export interface MajorEvent {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  fullDescription?: string;
  image: string;
  category: string;
  highlighted?: boolean;
  date?: string;
  location?: string;
  badgeText?: string;
  stats?: EventStat[];
  tags?: string[];
  ctaUrl?: string;
}

export interface ApiEventAuditing {
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface ApiEvent {
  id: string;
  overview: string;
  description: string;
  terms: string;
  reg_form_id?: string;
  reg_st_dt?: string | Date;
  reg_end_dt?: string | Date;
  banner_url?: string;
  isHighlight?: boolean;
  auditing?: ApiEventAuditing;
}
