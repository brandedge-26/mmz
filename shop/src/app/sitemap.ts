import { MetadataRoute } from "next";

const BASE = "https://shop.memonmobilezone122.pk";
const API  = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5510/api";

async function fetchAllProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/products?status=Active&limit=1000`, {
      next: { revalidate: 3600 }, // refresh every hour
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.products ?? []).map((p: { slug: string }) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now   = new Date();
  const slugs = await fetchAllProductSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                        lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/cases`,             lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/screen-protection`, lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/power-charging`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/audio`,             lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/accessories`,       lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/panels`,            lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/top-sellers`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/new-arrivals`,      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/trending`,          lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE}/products`,          lastModified: now, changeFrequency: "daily",   priority: 0.7 },
  ];

  const productPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url:             `${BASE}/products/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.8,
  }));

  return [...staticPages, ...productPages];
}
