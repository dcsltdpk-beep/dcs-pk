import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const baseUrl = (rawUrl && !rawUrl.includes('localhost') ? rawUrl : 'https://www.dreamcybersecurity.pk').replace(/\/+$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
