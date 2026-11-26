import { NextResponse } from 'next/server';
import { requireApiPermission } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Setting } from '@/lib/models/Setting';

export async function GET() {
  const auth = await requireApiPermission('home-content', 'view');
  if ('error' in auth) return auth.error;

  await connectDB();
  const settings = await Setting.find({}).lean();
  const map: Record<string, string> = {};
  settings.forEach((s) => {
    map[s.key_name] = s.key_value || '';
  });
  return NextResponse.json(map);
}

export async function POST(req: Request) {
  const auth = await requireApiPermission('home-content', 'edit');
  if ('error' in auth) return auth.error;

  const body = await req.json();
  await connectDB();

  for (const [key, value] of Object.entries(body)) {
    await Setting.findOneAndUpdate(
      { key_name: key },
      { key_name: key, key_value: String(value) },
      { upsert: true }
    );
  }

  return NextResponse.json({ success: true });
}
