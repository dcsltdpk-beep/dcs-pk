import { NextResponse } from 'next/server';
import { requireApiPermission } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Portfolio } from '@/lib/models/Portfolio';

export async function GET() {
  const auth = await requireApiPermission('portfolio', 'view');
  if ('error' in auth) return auth.error;

  await connectDB();
  const items = await Portfolio.find().sort({ order_num: 1 }).lean();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const data = await req.json();
  const action = data._id ? 'edit' : 'create';
  const auth = await requireApiPermission('portfolio', action);
  if ('error' in auth) return auth.error;

  await connectDB();

  if (!data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  if (data._id) {
    const updated = await Portfolio.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } else {
    delete data._id;
    const created = await Portfolio.create(data);
    return NextResponse.json(created);
  }
}

export async function DELETE(req: Request) {
  const auth = await requireApiPermission('portfolio', 'delete');
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  await Portfolio.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
