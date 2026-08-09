import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/game`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/top-up/mobile-legends`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/top-up/free-fire`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/top-up/pubg-mobile`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/top-up/call-of-duty-mobile`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/top-up/magic-chess-go-go`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
}
