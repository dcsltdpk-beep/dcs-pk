import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Post } from '@/lib/models/Post';

export async function GET() {
  await connectDB();
  const posts = await Post.find().sort({ published_at: -1 }).lean();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    await connectDB();

    // Sanitize slug
    let rawSlug = (data.slug || data.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!rawSlug) {
      rawSlug = `post-${Date.now()}`;
    }

    if (data._id) {
      // Check for collision with another post
      const existing = await Post.findOne({ slug: rawSlug, _id: { $ne: data._id } });
      if (existing) {
        rawSlug = `${rawSlug}-${Date.now().toString().slice(-4)}`;
      }
      data.slug = rawSlug;

      const updated = await Post.findByIdAndUpdate(data._id, data, { new: true });
      return NextResponse.json(updated);
    } else {
      // Check for collision with any post
      const existing = await Post.findOne({ slug: rawSlug });
      if (existing) {
        rawSlug = `${rawSlug}-${Date.now().toString().slice(-4)}`;
      }
      data.slug = rawSlug;

      delete data._id;
      const created = await Post.create(data);
      return NextResponse.json(created);
    }
  } catch (err: any) {
    console.error('Error in /api/admin/posts:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save post' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await connectDB();
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error in /api/admin/posts DELETE:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete post' }, { status: 500 });
  }
}
