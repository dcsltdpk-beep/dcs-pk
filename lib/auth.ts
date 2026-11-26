import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import {
  AdminAction,
  AdminModule,
  AuthenticatedAdmin,
  isSuperAdmin,
  hasPermission,
  normalizePermissions,
  getSuperAdminPermissionsMap,
} from '@/lib/rbac';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dcs_super_secret_jwt_key_2026_international_cyber_pakistan'
);

export async function signAdminToken(payload: { username: string; role: string; userId?: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { username: string; role: string; userId?: string };
  } catch {
    return null;
  }
}

/**
 * Resolves the fully authenticated and authorized admin user from the active session.
 * Connects to the database to ensure user is active and has up-to-date permissions.
 */
export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;

  const payload = await verifyAdminToken(token);
  if (!payload || !payload.username) return null;

  try {
    await connectDB();
    const user = await User.findOne({ username: { $eq: payload.username } }).lean();

    // If user deleted or marked inactive, revoke access immediately
    if (!user || user.status === 'inactive') {
      return null;
    }

    const superAdmin = isSuperAdmin(user.role);
    const permissions = superAdmin
      ? getSuperAdminPermissionsMap()
      : normalizePermissions(user.permissions);

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      name: user.name || user.username,
      role: (user.role as any) || 'sub_admin',
      status: (user.status as any) || 'active',
      isSuperAdmin: superAdmin,
      permissions,
      lastLogin: user.lastLogin,
    };
  } catch (error) {
    console.error('getAuthenticatedAdmin DB error:', error);
    // Safe fallback if database temporary hiccup
    const superAdmin = isSuperAdmin(payload.role);
    return {
      id: payload.userId || '',
      username: payload.username,
      email: '',
      name: payload.username,
      role: (payload.role as any) || 'admin',
      status: 'active',
      isSuperAdmin: superAdmin,
      permissions: superAdmin ? getSuperAdminPermissionsMap() : {},
    };
  }
}

/**
 * Backwards-compatible session helper.
 */
export async function getAdminSession() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return null;
  return {
    id: admin.id,
    username: admin.username,
    role: admin.role,
    isSuperAdmin: admin.isSuperAdmin,
    name: admin.name,
    email: admin.email,
  };
}

/**
 * Server-side guard for API route handlers ensuring module-level and action-level authorization.
 */
export async function requireApiPermission(
  module: AdminModule,
  action: AdminAction
): Promise<{ admin: AuthenticatedAdmin } | { error: NextResponse }> {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized: Valid admin authentication required.' },
        { status: 401 }
      ),
    };
  }

  if (!hasPermission(admin, module, action)) {
    return {
      error: NextResponse.json(
        {
          error: `Forbidden: You do not have '${action}' permission for the '${module}' module.`,
          requiredPermission: { module, action },
        },
        { status: 403 }
      ),
    };
  }

  return { admin };
}
