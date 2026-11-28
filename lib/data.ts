import { connectDB } from './db';
import { Setting } from './models/Setting';
import { Service } from './models/Service';
import { Course } from './models/Course';
import { Team } from './models/Team';
import { Portfolio } from './models/Portfolio';
import { Video } from './models/Video';
import { Post } from './models/Post';
import { Faq } from './models/Faq';
import { LandingPage } from './models/LandingPage';
import seedData from '@/database/seed-data.json';

// Helper to guarantee plain objects are passed across Server/Client boundary
export function toPlain<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (key === '_id' && value) {
        return typeof value === 'object' && value.toString ? value.toString() : String(value);
      }
      if (value && typeof value === 'object') {
        if (
          value._bsontype === 'ObjectID' ||
          value._bsontype === 'ObjectId' ||
          (value.type === 'Buffer' && Array.isArray(value.data))
        ) {
          return value.toString ? value.toString() : String(value);
        }
      }
      return value;
    })
  );
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const conn = await connectDB();
    if (conn) {
      const dbSettings = await Setting.find({}).lean();
      if (dbSettings && dbSettings.length > 0) {
        const map: Record<string, string> = { ...seedData.settings };
        dbSettings.forEach((s) => {
          map[s.key_name] = s.key_value || '';
        });
        return toPlain(map);
      }
    }
  } catch (err) {
    console.warn('Using fallback settings:', err);
  }
  return toPlain(seedData.settings as Record<string, string>);
}

export async function getServices(): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const items = await Service.find({ status: 'active' }).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return toPlain(items);
    }
  } catch (err) {
    console.warn('Using fallback services');
  }
  return toPlain(seedData.services);
}

const SERVICE_ALIASES: Record<string, string> = {
  'cybersecurity': 'cybersecurity-services',
  'cyber-security': 'cybersecurity-services',
  'web-development': 'web-design-development',
  'software-development': 'software-application-development',
  'software': 'software-application-development',
  'cloud-devops': 'cloud-devops-solutions',
  'devops-solutions': 'cloud-devops-solutions',
  'cloud-hosting': 'domain-hosting-it-support',
  'it-support': 'domain-hosting-it-support',
  'ai-automation': 'ai-automation-chatbot-development',
  'ecommerce': 'ecommerce-development',
  'video-motion': 'video-editing-motion-graphics',
  'graphic-design': 'graphic-design-branding',
};

const COURSE_ALIASES: Record<string, string> = {
  'ai-automation-agents': 'ai-automation',
  'video-editing': 'video-editing-graphic-design',
  'video-design': 'video-editing-graphic-design',
  'graphic-design': 'graphic-designing-with-ai',
  'graphic-design-ai': 'graphic-designing-with-ai',
  'graphic-designing': 'graphic-designing-with-ai',
  'web-dev': 'web-development',
  'web': 'web-development',
  'enterprise-web-dev': 'web-development',
  'computer-basics-office': 'computer-basics',
};

export async function getServiceBySlug(slug: string): Promise<any | null> {
  const resolvedSlug = SERVICE_ALIASES[slug] || slug;
  try {
    const conn = await connectDB();
    if (conn) {
      const item = await Service.findOne({
        $or: [{ slug: resolvedSlug }, { slug }],
        status: 'active',
      }).lean();
      if (item) return toPlain(item);
    }
  } catch (err) {
    console.warn(`Using fallback service for slug: ${slug}`);
  }
  const fallback = seedData.services.find((s) => s.slug === resolvedSlug || s.slug === slug) || null;
  return toPlain(fallback);
}

export async function getCourses(): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const items = await Course.find({ status: 'active' }).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return toPlain(items);
    }
  } catch (err) {
    console.warn('Using fallback courses');
  }
  return toPlain(seedData.courses.filter((c: any) => c.status === 'active'));
}

export async function getCourseBySlug(slug: string): Promise<any | null> {
  const resolvedSlug = COURSE_ALIASES[slug] || slug;
  try {
    const conn = await connectDB();
    if (conn) {
      const item = await Course.findOne({
        $or: [{ slug: resolvedSlug }, { slug }],
      }).lean();
      if (item) {
        if (item.status === 'inactive') return null; // Explicitly unpublished
        return toPlain(item);
      }
    }
  } catch (err) {
    console.warn(`Using fallback course for slug: ${slug}`);
  }
  const fallback = seedData.courses.find(
    (c: any) => (c.slug === resolvedSlug || c.slug === slug) && c.status === 'active'
  ) || null;
  return toPlain(fallback);
}

export function slugifyName(text: string): string {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getTeam(): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const items = await Team.find({}).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) {
        return toPlain(
          items.map((m: any) => ({
            ...m,
            slug: m.slug || slugifyName(m.name),
          }))
        );
      }
    }
  } catch (err) {
    console.warn('Using fallback team');
  }
  return toPlain(
    (seedData.team as any[]).map((m: any) => ({
      ...m,
      slug: m.slug || slugifyName(m.name),
    }))
  );
}

export async function getTeamMemberBySlug(slug: string): Promise<any | null> {
  const normalizedSlug = (slug || '').toLowerCase().trim();
  try {
    const conn = await connectDB();
    if (conn) {
      let item = await Team.findOne({ slug: normalizedSlug }).lean() as any;
      if (!item) {
        // fallback: match by auto-generated slug from name
        const all = await Team.find({}).lean() as any[];
        item = all.find(
          (m: any) =>
            (m.slug && m.slug.toLowerCase() === normalizedSlug) ||
            slugifyName(m.name) === normalizedSlug
        ) || null;
      }
      if (item) {
        return toPlain({ ...item, slug: item.slug || slugifyName(item.name) });
      }
    }
  } catch (err) {
    console.warn(`Using fallback team member for slug: ${slug}`);
  }
  const fallback = (seedData.team as any[]).find(
    (m: any) =>
      (m.slug && m.slug.toLowerCase() === normalizedSlug) ||
      slugifyName(m.name) === normalizedSlug
  );
  return fallback ? toPlain({ ...fallback, slug: fallback.slug || slugifyName(fallback.name) }) : null;
}

export async function getPortfolio(category?: string): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const query = category && category !== 'All' ? { category } : {};
      const items = await Portfolio.find(query).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return toPlain(items);
    }
  } catch (err) {
    console.warn('Using fallback portfolio');
  }
  if (category && category !== 'All') {
    return toPlain(seedData.portfolio.filter((p) => p.category === category));
  }
  return toPlain(seedData.portfolio);
}

export async function getVideos(category?: string): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const query = category && category !== 'All' ? { category } : {};
      const items = await Video.find(query).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return toPlain(items);
    }
  } catch (err) {
    console.warn('Using fallback videos');
  }
  if (category && category !== 'All') {
    return toPlain(seedData.videos.filter((v) => v.category === category));
  }
  return toPlain(seedData.videos);
}

export async function getPosts(): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const now = new Date();
      const items = await Post.find({
        is_published: true,
        $or: [
          { status: 'published' },
          { status: { $exists: false } },
        ],
        $and: [
          {
            $or: [
              { published_at: { $lte: now } },
              { published_at: { $exists: false } },
            ],
          },
        ],
      })
        .sort({ is_featured: -1, published_at: -1 })
        .lean();
      if (items && items.length > 0) return toPlain(items);
    }
  } catch (err) {
    console.warn('Using fallback posts');
  }
  return toPlain(seedData.posts);
}

export async function getPostBySlug(slug: string, options?: { preview?: boolean }): Promise<any | null> {
  const normalizedSlug = (slug || '').toLowerCase().trim();
  try {
    const conn = await connectDB();
    if (conn) {
      const now = new Date();
      const query: any = { slug: normalizedSlug };

      // If not in preview mode, enforce that article must be published and not scheduled in the future
      if (!options?.preview) {
        query.is_published = true;
        query.$or = [{ status: 'published' }, { status: { $exists: false } }];
        query.$and = [
          {
            $or: [
              { published_at: { $lte: now } },
              { published_at: { $exists: false } },
            ],
          },
        ];
      }

      const item = await Post.findOne(query).lean();
      if (item) return toPlain(item);
    }
  } catch (err) {
    console.warn(`Using fallback post for slug: ${slug}`);
  }
  const fallback = (seedData.posts as any[]).find((p) => p.slug === normalizedSlug) || null;
  return toPlain(fallback);
}

export async function getRelatedPosts(currentSlug: string, category?: string, limit = 3): Promise<any[]> {
  const normalizedSlug = (currentSlug || '').toLowerCase().trim();
  try {
    const conn = await connectDB();
    if (conn) {
      const now = new Date();
      const baseFilter: any = {
        slug: { $ne: normalizedSlug },
        is_published: true,
        $or: [{ status: 'published' }, { status: { $exists: false } }],
        $and: [
          {
            $or: [
              { published_at: { $lte: now } },
              { published_at: { $exists: false } },
            ],
          },
        ],
      };

      if (category) {
        const sameCategory = await Post.find({ ...baseFilter, category })
          .sort({ published_at: -1 })
          .limit(limit)
          .lean();

        if (sameCategory && sameCategory.length >= limit) {
          return toPlain(sameCategory);
        }

        const existingIds = (sameCategory || []).map((p: any) => p._id);
        const remainingCount = limit - (sameCategory ? sameCategory.length : 0);

        const additional = await Post.find({
          ...baseFilter,
          _id: { $nin: existingIds },
        })
          .sort({ published_at: -1 })
          .limit(remainingCount)
          .lean();

        return toPlain([...(sameCategory || []), ...(additional || [])]);
      }

      const items = await Post.find(baseFilter).sort({ published_at: -1 }).limit(limit).lean();
      if (items && items.length > 0) return toPlain(items);
    }
  } catch (err) {
    console.warn('Using fallback related posts');
  }

  const fallbackAll = (seedData.posts as any[]).filter((p) => p.slug !== normalizedSlug);
  return toPlain(fallbackAll.slice(0, limit));
}

export async function getFaqs(category?: string): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const query = category && category !== 'All' ? { category } : {};
      const items = await Faq.find(query).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return toPlain(items);
    }
  } catch (err) {
    console.warn('Using fallback faqs');
  }
  if (category && category !== 'All') {
    return toPlain(seedData.faqs.filter((f) => f.category === category));
  }
  return toPlain(seedData.faqs);
}

export async function getLandingPageBySlug(slug: string): Promise<any | null> {
  try {
    const conn = await connectDB();
    if (conn) {
      const item = await LandingPage.findOne({ slug, is_active: true }).lean();
      if (item) return toPlain(item);
    }
  } catch (err) {
    console.warn(`Using fallback landing page for slug: ${slug}`);
  }
  const fallback = seedData.landingPages.find((l) => l.slug === slug) || null;
  return toPlain(fallback);
}
