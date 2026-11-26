import { NextResponse } from 'next/server';
import { requireApiPermission } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Video } from '@/lib/models/Video';

export async function GET() {
  const auth = await requireApiPermission('videos', 'view');
  if ('error' in auth) return auth.error;

  await connectDB();
  const videos = await Video.find().sort({ order_num: 1 }).lean();
  return NextResponse.json(videos);
}

export async function POST(req: Request) {
  const data = await req.json();
  const action = data._id ? 'edit' : 'create';
  const auth = await requireApiPermission('videos', action);
  if ('error' in auth) return auth.error;

  await connectDB();

  if (data._id) {
    const updated = await Video.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } else {
    delete data._id;
    const created = await Video.create(data);
    return NextResponse.json(created);
  }
}

export async function DELETE(req: Request) {
  const auth = await requireApiPermission('videos', 'delete');
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  await Video.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
