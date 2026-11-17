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
        return map;
      }
    }
  } catch (err) {
    console.warn('Using fallback settings:', err);
  }
  return seedData.settings as Record<string, string>;
}

export async function getServices(): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const items = await Service.find({ status: 'active' }).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Using fallback services');
  }
  return seedData.services;
}

const SERVICE_ALIASES: Record<string, string> = {
  'cloud-devops': 'cloud-devops-solutions',
  'devops-solutions': 'cloud-devops-solutions',
  'cloud-hosting': 'domain-hosting-it-support',
  'it-support': 'domain-hosting-it-support',
};

const COURSE_ALIASES: Record<string, string> = {
  'ai-automation-agents': 'ai-automation',
  'video-editing': 'video-editing-graphic-design',
  'graphic-design': 'video-editing-graphic-design',
  'web-dev': 'web-development',
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
      if (item) return item;
    }
  } catch (err) {
    console.warn(`Using fallback service for slug: ${slug}`);
  }
  return seedData.services.find((s) => s.slug === resolvedSlug || s.slug === slug) || null;
}

export async function getCourses(): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const items = await Course.find({ status: 'active' }).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Using fallback courses');
  }
  return seedData.courses;
}

export async function getCourseBySlug(slug: string): Promise<any | null> {
  const resolvedSlug = COURSE_ALIASES[slug] || slug;
  try {
    const conn = await connectDB();
    if (conn) {
      const item = await Course.findOne({
        $or: [{ slug: resolvedSlug }, { slug }],
        status: 'active',
      }).lean();
      if (item) return item;
    }
  } catch (err) {
    console.warn(`Using fallback course for slug: ${slug}`);
  }
  return seedData.courses.find((c) => c.slug === resolvedSlug || c.slug === slug) || null;
}

export async function getTeam(): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const items = await Team.find({}).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Using fallback team');
  }
  return seedData.team;
}

export async function getPortfolio(category?: string): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const query = category && category !== 'All' ? { category } : {};
      const items = await Portfolio.find(query).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Using fallback portfolio');
  }
  if (category && category !== 'All') {
    return seedData.portfolio.filter((p) => p.category === category);
  }
  return seedData.portfolio;
}

export async function getVideos(category?: string): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const query = category && category !== 'All' ? { category } : {};
      const items = await Video.find(query).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Using fallback videos');
  }
  if (category && category !== 'All') {
    return seedData.videos.filter((v) => v.category === category);
  }
  return seedData.videos;
}

export async function getPosts(): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const items = await Post.find({ is_published: true }).sort({ published_at: -1 }).lean();
      if (items && items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Using fallback posts');
  }
  return seedData.posts;
}

export async function getPostBySlug(slug: string): Promise<any | null> {
  try {
    const conn = await connectDB();
    if (conn) {
      const item = await Post.findOne({ slug, is_published: true }).lean();
      if (item) return item;
    }
  } catch (err) {
    console.warn(`Using fallback post for slug: ${slug}`);
  }
  return seedData.posts.find((p) => p.slug === slug) || null;
}

export async function getFaqs(category?: string): Promise<any[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const query = category && category !== 'All' ? { category } : {};
      const items = await Faq.find(query).sort({ order_num: 1 }).lean();
      if (items && items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Using fallback faqs');
  }
  if (category && category !== 'All') {
    return seedData.faqs.filter((f) => f.category === category);
  }
  return seedData.faqs;
}

export async function getLandingPageBySlug(slug: string): Promise<any | null> {
  try {
    const conn = await connectDB();
    if (conn) {
      const item = await LandingPage.findOne({ slug, is_active: true }).lean();
      if (item) return item;
    }
  } catch (err) {
    console.warn(`Using fallback landing page for slug: ${slug}`);
  }
  return seedData.landingPages.find((l) => l.slug === slug) || null;
}
