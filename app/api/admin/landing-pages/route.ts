import { NextResponse } from 'next/server';
import { requireApiPermission } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { LandingPage } from '@/lib/models/LandingPage';

export async function GET() {
  const auth = await requireApiPermission('landing-pages', 'view');
  if ('error' in auth) return auth.error;

  await connectDB();
  const pages = await LandingPage.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(pages);
}

export async function POST(req: Request) {
  const data = await req.json();
  const action = data._id ? 'edit' : 'create';
  const auth = await requireApiPermission('landing-pages', action);
  if ('error' in auth) return auth.error;

  await connectDB();

  if (!data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  if (data._id) {
    const updated = await LandingPage.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } else {
    delete data._id;
    const created = await LandingPage.create(data);
    return NextResponse.json(created);
  }
}

export async function DELETE(req: Request) {
  const auth = await requireApiPermission('landing-pages', 'delete');
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  await LandingPage.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
