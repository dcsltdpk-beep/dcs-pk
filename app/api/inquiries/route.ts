import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Inquiry } from '@/lib/models/Inquiry';
import { checkRateLimit, getClientIp, sanitizeString } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Rate limit defense against lead spam flooding
    const rateCheck = checkRateLimit(`inquiry_${ip}`, 5, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many inquiries submitted. Please wait a moment before sending another message.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const website_hp = body?.website_hp;

    // 2. Honeypot anti-bot defense
    if (typeof website_hp === 'string' && website_hp.trim().length > 0) {
      // Silently discard bot submission without tipping off the bot
      return NextResponse.json({ success: true, message: 'Inquiry received.' });
    }

    // 3. Strict String Sanitization (Anti-XSS & Anti-Injection)
    const name = sanitizeString(body?.name);
    const email = sanitizeString(body?.email).toLowerCase();
    const phone = sanitizeString(body?.phone);
    const subject = sanitizeString(body?.subject);
    const message = sanitizeString(body?.message);
    const inquiry_type = sanitizeString(body?.inquiry_type) || 'contact';
    const target_name = sanitizeString(body?.target_name);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, valid email address, and message are required fields.' },
        { status: 400 }
      );
    }

    // 4. Strict email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 100) {
      return NextResponse.json({ error: 'Please provide a valid corporate or personal email address.' }, { status: 400 });
    }

    // Limit length to protect against buffer flooding
    if (name.length > 100 || message.length > 5000 || phone.length > 30) {
      return NextResponse.json({ error: 'Input exceeds maximum allowed length.' }, { status: 400 });
    }

    await connectDB();

    const newInquiry = await Inquiry.create({
      type: inquiry_type,
      target_name: target_name,
      name: name,
      email: email,
      phone: phone,
      subject: subject,
      message: message,
      status: 'unread',
    });

    return NextResponse.json({ success: true, id: newInquiry._id });
  } catch (error: any) {
    console.error('Inquiry processing error:', error?.message);
    return NextResponse.json({ error: 'Submission service temporarily unavailable.' }, { status: 500 });
  }
}
