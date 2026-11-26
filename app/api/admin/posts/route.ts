import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireApiPermission } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Post } from '@/lib/models/Post';

export const revalidate = 0;

/**
 * Helper to calculate reading time based on 200 words/min average
 */
function calculateReadingTime(htmlContent: string, excerpt: string = ''): string {
  const plainText = (htmlContent + ' ' + excerpt)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

/**
 * GET /api/admin/posts
 * Fetch all posts for admin management with optional status, search, and category filters.
 */
export async function GET(req: Request) {
  try {
    const auth = await requireApiPermission('posts', 'view');
    if ('error' in auth) return auth.error;

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const query = searchParams.get('q');

    const filter: any = {};

    if (status && status !== 'all') {
      if (status === 'scheduled') {
        filter.$or = [{ status: 'scheduled' }, { published_at: { $gt: new Date() } }];
      } else if (status === 'draft') {
        filter.$or = [{ status: 'draft' }, { is_published: false }];
      } else if (status === 'published') {
        filter.status = 'published';
        filter.is_published = true;
        filter.published_at = { $lte: new Date() };
      }
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (query && query.trim()) {
      const regex = new RegExp(query.trim(), 'i');
      filter.$or = [
        { title: regex },
        { slug: regex },
        { excerpt: regex },
        { author_name: regex },
        { tags: regex },
      ];
    }

    const posts = await Post.find(filter).sort({ published_at: -1, createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (err: any) {
    console.error('Error in GET /api/admin/posts:', err);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

/**
 * POST /api/admin/posts
 * Create or update a blog article.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const action = data._id ? 'edit' : 'create';
    const auth = await requireApiPermission('posts', action);
    if ('error' in auth) return auth.error;

    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: 'Article title is required.' }, { status: 400 });
    }

    if (!data.content || !data.content.trim()) {
      return NextResponse.json({ error: 'Article body content is required.' }, { status: 400 });
    }

    await connectDB();

    // 1. Generate or Sanitize Slug
    let rawSlug = (data.slug || data.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!rawSlug) {
      rawSlug = `article-${Date.now()}`;
    }

    // Slug uniqueness check
    const slugCollisionQuery: any = { slug: rawSlug };
    if (data._id) {
      slugCollisionQuery._id = { $ne: data._id };
    }
    const existing = await Post.findOne(slugCollisionQuery);
    if (existing) {
      rawSlug = `${rawSlug}-${Date.now().toString().slice(-4)}`;
    }
    data.slug = rawSlug;

    // 2. Publication & Scheduling Status Resolution
    const status = data.status || (data.is_published === false ? 'draft' : 'published');
    const publishedAtDate = data.published_at ? new Date(data.published_at) : new Date();

    let isPublished = status === 'published';
    if (status === 'scheduled') {
      // If scheduled date is in the future, it is not yet publicly visible
      isPublished = publishedAtDate.getTime() <= Date.now();
    } else if (status === 'draft') {
      isPublished = false;
    }

    // 3. Reading time calculation if missing
    const readTime = data.read_time?.trim() || calculateReadingTime(data.content, data.excerpt);

    // 4. Default author details
    const authorName = data.author_name?.trim() || auth.admin.name || 'DCS Cyber Threat Research Team';
    const authorRole = data.author_role?.trim() || 'Principal Threat Intelligence Architect';
    const authorAvatar = data.author_avatar?.trim() || '/logo.png';

    // 5. Excerpt fallback from content if not provided
    let excerpt = data.excerpt?.trim();
    if (!excerpt) {
      const stripped = data.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      excerpt = stripped.slice(0, 160) + (stripped.length > 160 ? '...' : '');
    }

    const cleanPayload = {
      title: data.title.trim(),
      slug: data.slug,
      category: data.category?.trim() || 'Cybersecurity Tips',
      tags: data.tags?.trim() || '',
      featured_image: data.featured_image?.trim() || '',
      excerpt,
      content: data.content,
      author_name: authorName,
      author_role: authorRole,
      author_avatar: authorAvatar,
      read_time: readTime,
      is_featured: Boolean(data.is_featured),
      status,
      is_published: isPublished,
      published_at: publishedAtDate,
      meta_title: data.meta_title?.trim() || data.title.trim(),
      meta_description: data.meta_description?.trim() || excerpt,
      meta_keywords: data.meta_keywords?.trim() || data.tags?.trim() || '',
      focus_keyword: data.focus_keyword?.trim() || '',
      secondary_keywords: data.secondary_keywords?.trim() || '',
      canonical_url: data.canonical_url?.trim() || '',
      og_image: data.og_image?.trim() || data.featured_image?.trim() || '',
    };

    let resultPost;

    if (data._id) {
      resultPost = await Post.findByIdAndUpdate(data._id, cleanPayload, {
        new: true,
        runValidators: true,
      });
      if (!resultPost) {
        return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
      }
    } else {
      resultPost = await Post.create(cleanPayload);
    }

    // Immediate Cache Invalidation across all blog routes & sitemap
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${cleanPayload.slug}`);
      revalidatePath('/sitemap.xml');
    } catch (revalidateErr) {
      console.warn('Revalidation warning:', revalidateErr);
    }

    return NextResponse.json({
      success: true,
      message: `Article '${cleanPayload.title}' saved successfully.`,
      post: resultPost,
    });
  } catch (err: any) {
    console.error('Error in POST /api/admin/posts:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save article.' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/posts?id=...
 * Delete an article.
 */
export async function DELETE(req: Request) {
  try {
    const auth = await requireApiPermission('posts', 'delete');
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required.' }, { status: 400 });
    }

    await connectDB();
    const target = await Post.findById(id);
    if (!target) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    }

    const slug = target.slug;
    await Post.findByIdAndDelete(id);

    // Revalidate paths
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
      revalidatePath('/sitemap.xml');
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, message: 'Article permanently deleted.' });
  } catch (err: any) {
    console.error('Error in DELETE /api/admin/posts:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete article.' }, { status: 500 });
  }
}
