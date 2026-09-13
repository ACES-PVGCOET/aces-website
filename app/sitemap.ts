import { MetadataRoute } from "next";

interface ActiveFormSummary {
  form_id: string;
  created_at?: string;
  is_active?: boolean;
}

async function getActiveForms(): Promise<ActiveFormSummary[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const res = await fetch(`${apiUrl}/forms`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const forms: any[] = json?.data?.forms || json?.data || [];

    if (Array.isArray(forms)) {
      return forms.filter((form) => form && form.form_id && form.is_active !== false);
    }
    return [];
  } catch {
    // Graceful fallback if backend is offline during build
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://acespvg.in").replace(/\/$/, "");
  const currentDate = new Date();

  // Core static routes for ACES web portal
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/publications`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forms`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic routes for active forms
  const activeForms = await getActiveForms();
  const dynamicFormRoutes: MetadataRoute.Sitemap = activeForms.map((form) => ({
    url: `${baseUrl}/forms/${encodeURIComponent(form.form_id)}`,
    lastModified: form.created_at ? new Date(form.created_at) : currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicFormRoutes];
}
