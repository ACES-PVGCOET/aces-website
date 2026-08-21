import { MagazineItem, GalleryShowcaseResponse } from "../types/publications";

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL || "https://aces-api-gdd3.onrender.com/api/v1"
  );
};

export const STATIC_MAGAZINES: MagazineItem[] = [
  {
    id: "mag-2025",
    title: "2025",
    publicationYear: 2025,
    description:
      "From thoughts to vision to reality, this is where the imagination and innovation combine! ACES proudly presents their yearly magazine, ACE THE TECH!! It is not just a magazine - it is your window into the committee, the department and the college. Designed by the Design and Production Team, refined by the Editorial Team and combined by the ACES committee together, it is a culmination of the committee’s innovation, ideas, creativity and achievements.",
    media_url: "/magazines/ACES_Magazine_2k25.pdf",
    cover_image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    collection_name: "Magazines",
    media_type: "pdf",
    created_at: "2025-04-15",
  },
  {
    id: "mag-2024",
    title: "2024",
    publicationYear: 2024,
    description: "",
    media_url: "/magazines/ACES_Magazine_2024.pdf",
    cover_image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    collection_name: "Magazines",
    media_type: "pdf",
    created_at: "2024-04-12",
  },
  {
    id: "mag-2023",
    title: "2023",
    publicationYear: 2023,
    description: "",
    media_url: "/magazines/ACES_Magazine_2023.pdf",
    cover_image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    collection_name: "Magazines",
    media_type: "pdf",
    created_at: "2023-04-08",
  },
];

export const MOCK_MAGAZINES: MagazineItem[] = STATIC_MAGAZINES;

/**
 * Extract publication year integer from title string.
 * Assumes title is or contains publication year e.g. "2026" or "Edition 2025"
 */
export function extractPublicationYear(title?: string): number {
  if (!title) return 0;
  const match = title.match(/\b(19|20)\d{2}\b/);
  if (match) {
    return parseInt(match[0], 10);
  }
  const parsed = parseInt(title, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Returns local static magazines located in /public/magazines/ directly
 * instead of fetching from API due to upload limits.
 */
export async function getMagazinesFromShowcase(): Promise<MagazineItem[]> {
  return sortMagazinesNewestFirst(STATIC_MAGAZINES);
}

function processAndSortMagazines(rawItems: any[]): MagazineItem[] {
  const items: MagazineItem[] = rawItems.map((item, index) => {
    const rawTitle = item.title || `202${6 - index}`;
    const pubYear = extractPublicationYear(rawTitle);
    
    // Attempt to parse metadata JSON from caption if available
    let descriptionText = item.description || item.caption || "";
    let pdfLink = item.media_url || item.url || "";
    let coverImg = item.cover_image || item.coverImage || item.media_url || item.url || "";

    if (item.caption && item.caption.startsWith("{")) {
      try {
        const parsedMeta = JSON.parse(item.caption);
        if (parsedMeta.description) descriptionText = parsedMeta.description;
        if (parsedMeta.pdfUrl) pdfLink = parsedMeta.pdfUrl;
        if (parsedMeta.coverImage) coverImg = parsedMeta.coverImage;
      } catch (_e) {
        // ignore parse error
      }
    }

    return {
      id: item.id || item._id || `mag-item-${index}`,
      title: rawTitle,
      publicationYear: pubYear,
      description: descriptionText || `ACES Official Magazine Edition ${rawTitle}`,
      media_url: pdfLink || "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf",
      cover_image: coverImg || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      collection_name: item.collection_name || "Magazines",
      media_type: item.media_type || "pdf",
      downloadsCount: item.downloadsCount || 500 + index * 120,
      created_at: item.auditing?.created_at || new Date().toISOString(),
    };
  });

  return sortMagazinesNewestFirst(items);
}

export function sortMagazinesNewestFirst(items: MagazineItem[]): MagazineItem[] {
  return [...items].sort((a, b) => b.publicationYear - a.publicationYear);
}
