import { NextResponse } from 'next/server';
import { requireApiPermission } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Course } from '@/lib/models/Course';

export async function GET() {
  const auth = await requireApiPermission('courses', 'view');
  if ('error' in auth) return auth.error;

  await connectDB();
  const courses = await Course.find().sort({ order_num: 1 }).lean();
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const data = await req.json();
  const action = data._id ? 'edit' : 'create';
  const auth = await requireApiPermission('courses', action);
  if ('error' in auth) return auth.error;

  await connectDB();

  if (!data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  if (data._id) {
    const updated = await Course.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } else {
    delete data._id;
    const created = await Course.create(data);
    return NextResponse.json(created);
  }
}

export async function DELETE(req: Request) {
  const auth = await requireApiPermission('courses', 'delete');
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  await Course.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
