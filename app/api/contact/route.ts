import { NextRequest } from 'next/server';
import { sendContactNotification } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, projectType, budget, message } =
      await req.json();

    // Validation
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await sendContactNotification({
      name,
      email,
      company,
      projectType,
      budget,
      message,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Email error:', err);

    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
