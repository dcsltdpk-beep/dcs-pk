import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Team } from '@/lib/models/Team';

export async function GET() {
  await connectDB();
  const team = await Team.find().sort({ order_num: 1 }).lean();
  return NextResponse.json(team);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  await connectDB();

  if (data._id) {
    const updated = await Team.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } else {
    delete data._id;
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
