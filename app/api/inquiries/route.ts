import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Inquiry } from '@/lib/models/Inquiry';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { inquiry_type, target_name, name, email, phone, subject, message, website_hp } = body;

    // Honeypot spam filter
    if (website_hp && website_hp.trim().length > 0) {
      // Silently discard bot submission
      return NextResponse.json({ success: true, message: 'Inquiry received.' });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, valid email address, and message are required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    await connectDB();

    const newInquiry = await Inquiry.create({
      type: inquiry_type || 'contact',
      target_name: target_name || '',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      subject: (subject || '').trim(),
      message: message.trim(),
      status: 'unread',
    });

    return NextResponse.json({ success: true, id: newInquiry._id });
  } catch (error: any) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
  }
}
