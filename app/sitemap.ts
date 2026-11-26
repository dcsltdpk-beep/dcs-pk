import { MetadataRoute } from 'next';
import { getServices, getCourses, getPosts, getTeam } from '@/lib/data';
import seedData from '@/database/seed-data.json';
import { SITE_URL, getCanonicalUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    url: getCanonicalUrl(route),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const [services, courses, posts, team] = await Promise.all([
      getServices(),
      getCourses(),
      getPosts(),
      getTeam(),
    ]);

    const serviceUrls = services.map((s: any) => ({
      url: getCanonicalUrl(`/services/${s.slug}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));

    const courseUrls = courses.map((c: any) => ({
      url: getCanonicalUrl(`/courses/${c.slug}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));

    const postUrls = posts.map((p: any) => ({
      url: p.canonical_url?.trim() || getCanonicalUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : p.published_at ? new Date(p.published_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

    const teamUrls = team.map((m: any) => ({
      url: getCanonicalUrl(`/team/${m.slug}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }));

    const landingUrls = seedData.landingPages.map((l: any) => ({
      url: getCanonicalUrl(`/landing/${l.slug}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...serviceUrls, ...courseUrls, ...postUrls, ...teamUrls, ...landingUrls];
  } catch {
    return staticPages;
  }
}
