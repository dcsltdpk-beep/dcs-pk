import { MetadataRoute } from 'next';
import { getServices, getCourses, getPosts } from '@/lib/data';
import seedData from '@/database/seed-data.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamcyber.pk';

  const staticPages = [
    '',
    '/about',
    '/services',
    '/courses',
    '/portfolio',
    '/videos',
    '/team',
    '/blog',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const [services, courses, posts] = await Promise.all([
      getServices(),
      getCourses(),
      getPosts(),
    ]);

    const serviceUrls = services.map((s: any) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));

    const courseUrls = courses.map((c: any) => ({
      url: `${baseUrl}/courses/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));

    const postUrls = posts.map((p: any) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

    const landingUrls = seedData.landingPages.map((l: any) => ({
      url: `${baseUrl}/landing/${l.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...serviceUrls, ...courseUrls, ...postUrls, ...landingUrls];
  } catch {
    return staticPages;
  }
}
