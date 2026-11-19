import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Team } from '@/lib/models/Team';

function slugify(text: string): string {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  await connectDB();
  const team = await Team.find().sort({ order_num: 1 }).lean();
  // Ensure slug is always present in API response
  const teamWithSlugs = (team as any[]).map((m: any) => ({
    ...m,
    slug: m.slug || slugify(m.name),
  }));
  return NextResponse.json(teamWithSlugs);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  await connectDB();

  // Auto-generate slug from name if not provided
  if (!data.slug || data.slug.trim() === '') {
    data.slug = slugify(data.name);
  } else {
    data.slug = slugify(data.slug);
  }

  if (data._id) {
    const updated = await Team.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } else {
    delete data._id;
    // Ensure slug uniqueness by appending a suffix if needed
    let slug = data.slug;
    let attempt = 0;
    while (await Team.findOne({ slug })) {
      attempt++;
      slug = `${data.slug}-${attempt}`;
    }
    data.slug = slug;
    const created = await Team.create(data);
    return NextResponse.json(created);
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  await Team.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
