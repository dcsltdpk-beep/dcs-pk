import { NextResponse } from 'next/server';
import { requireApiPermission } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Service } from '@/lib/models/Service';

export async function GET() {
  const auth = await requireApiPermission('services', 'view');
  if ('error' in auth) return auth.error;

  await connectDB();
  const services = await Service.find().sort({ order_num: 1 }).lean();
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const data = await req.json();
  const action = data._id ? 'edit' : 'create';
  const auth = await requireApiPermission('services', action);
  if ('error' in auth) return auth.error;

  await connectDB();

  if (!data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  if (data._id) {
    const updated = await Service.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } else {
    delete data._id;
    const created = await Service.create(data);
    return NextResponse.json(created);
  }
}

export async function DELETE(req: Request) {
  const auth = await requireApiPermission('services', 'delete');
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  await Service.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
