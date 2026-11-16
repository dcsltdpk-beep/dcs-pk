import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Inquiry } from '@/lib/models/Inquiry';

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  await connectDB();

  if (action === 'export') {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    const headers = ['ID', 'Date', 'Type', 'Target', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status'];
    const rows = inquiries.map((i: any) => [
      i._id,
      new Date(i.createdAt).toISOString(),
      `"${(i.type || '').replace(/"/g, '""')}"`,
      `"${(i.target_name || '').replace(/"/g, '""')}"`,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.subject || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      i.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=inquiries_${new Date().toISOString().slice(0, 10)}.csv`,
      },
    });
  }

  const list = await Inquiry.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(list);
}

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await req.json();
  await connectDB();
  const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await connectDB();
  await Inquiry.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
