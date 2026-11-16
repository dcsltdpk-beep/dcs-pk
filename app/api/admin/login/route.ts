import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { signAdminToken } from '@/lib/auth';
import { checkRateLimit, getClientIp, sanitizeString } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Rate Limiting Defense (Max 5 login attempts per 5 minutes per IP)
    const rateCheck = checkRateLimit(`login_${ip}`, 5, 300);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. IP temporarily locked. Please retry in ${rateCheck.retryAfter} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawUsername = body?.username;
    const rawPassword = body?.password;
    const rememberMe = Boolean(body?.rememberMe);

    // 2. Strict Input Type & Anti-Injection Sanitization
    if (typeof rawUsername !== 'string' || typeof rawPassword !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input format. Strings required.' },
        { status: 400 }
      );
    }

    const username = sanitizeString(rawUsername);
    const password = rawPassword; // Password tested via bcrypt, not parsed into query

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    // 3. Constant-time safe query (avoiding injection)
    const user = await User.findOne({ username: { $eq: username } });

    if (!user) {
      // Generic error response to prevent account enumeration
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // 4. Token generation & Remember Me configuration
    const token = await signAdminToken({ username: user.username, role: user.role });

    // Remember Me: 30 days if checked, otherwise 24 hours
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const response = NextResponse.json({
      success: true,
      username: user.username,
      rememberMe,
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (error: any) {
    // Zero sensitive stack trace leaks in production
    console.error('Secure login exception:', error?.message);
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable.' },
      { status: 500 }
    );
  }
}
