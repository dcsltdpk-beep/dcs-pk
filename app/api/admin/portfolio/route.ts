import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Portfolio } from '@/lib/models/Portfolio';

export async function GET() {
  await connectDB();
  const items = await Portfolio.find().sort({ order_num: 1 }).lean();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  await connectDB();

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
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  await Portfolio.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
