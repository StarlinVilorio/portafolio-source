import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: 'https://starlinit.com/', lastModified: '2026-09-09', changeFrequency: 'monthly', priority: 1 }]; }
