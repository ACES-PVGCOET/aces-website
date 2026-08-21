export interface MagazineItem {
  id: string;
  title: string; // Publication year e.g. "2026", "2025"
  publicationYear: number;
  caption?: string;
  description?: string;
  media_url: string; // PDF or file download link
  cover_image: string; // Cover photo URL
  collection_name: string;
  media_type?: string;
  downloadsCount?: number;
  created_at?: string;
}

export interface GalleryShowcaseCollection {
  collection_name: string;
  total_items: number;
  photos_count: number;
  videos_count: number;
  pdfs_count?: number;
  cover_image?: string;
  items: Array<{
    id?: string;
    _id?: string;
    title?: string;
    caption?: string;
    description?: string;
    media_url?: string;
    url?: string;
    cover_image?: string;
    coverImage?: string;
    media_type?: string;
    collection_name?: string;
    auditing?: {
      created_at?: string;
    };
  }>;
}

export interface GalleryShowcaseResponse {
  collections: GalleryShowcaseCollection[];
}
