import { MetadataRoute } from "next";

const BASE = "https://memonmobilezone122.pk";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE,                               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/appointment`,              lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/repairs/iphone`,           lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/repairs/samsung`,          lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/repairs/google-pixel`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/repairs/ipad`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/repairs/oppo`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/repairs/vivo`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/repairs/motorola`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/repairs/lg`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/repairs/tablet`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/repairs/something-else`,   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,                  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`,                    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
