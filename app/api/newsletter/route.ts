import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Inquiry } from '@/lib/models/Inquiry';
import { checkRateLimit, getClientIp, sanitizeString } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Rate limit: 5 newsletter subscriptions per minute per IP
    const rateCheck = checkRateLimit(`newsletter_${ip}`, 5, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = sanitizeString(body?.email).toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 100) {
      return NextResponse.json(
        { error: 'Please enter a valid corporate or personal email address.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if already subscribed to prevent duplicate records
    const existing = await Inquiry.findOne({
      email,
      subject: 'Newsletter Subscription',
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our intelligence briefings!',
      });
    }

    await Inquiry.create({
      type: 'contact',
      target_name: 'Website Newsletter',
      name: 'Newsletter Subscriber',
      email,
      phone: '',
      subject: 'Newsletter Subscription',
      message: 'User subscribed to weekly cyber defense, AI, and enterprise tech intelligence briefings.',
      status: 'unread',
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to Dream Cyber Security intelligence briefings!',
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Subscription failed. Please try again later.' },
      { status: 500 }
    );
  }
}
