import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { AdminAction, AdminModule, ALL_ACTIONS, isSuperAdmin, MODULE_DEFINITIONS } from '@/lib/rbac';

export const revalidate = 0;

/**
 * GET /api/admin/sub-admins
 * Returns all admin accounts (excluding hashed passwords). Strictly Super Admin only.
 */
export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (!admin.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Administrators can view sub-admin accounts.' },
        { status: 403 }
      );
    }

    await connectDB();
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = users.map((u: any) => ({
      _id: u._id.toString(),
      name: u.name || '',
      username: u.username,
      email: u.email,
      role: u.role || 'sub_admin',
      status: u.status || 'active',
      permissions: u.permissions || [],
      lastLogin: u.lastLogin || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      isSuperAdmin: isSuperAdmin(u.role),
    }));

    return NextResponse.json({ users: formatted });
  } catch (err: any) {
    console.error('Error in GET /api/admin/sub-admins:', err);
    return NextResponse.json({ error: 'Failed to retrieve sub-admins.' }, { status: 500 });
  }
}

/**
 * POST /api/admin/sub-admins
 * Create or update a sub-admin/admin account. Strictly Super Admin only.
 */
export async function POST(req: Request) {
  try {
    const currentAdmin = await getAuthenticatedAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (!currentAdmin.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Administrators can manage sub-admin accounts.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { _id, name, username, email, password, role, status, permissions } = body;

    // Validate inputs
    const cleanUsername = sanitizeString(username || '').toLowerCase().trim();
    const cleanEmail = sanitizeString(email || '').toLowerCase().trim();
    const cleanName = sanitizeString(name || '').trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      return NextResponse.json(
        { error: 'Username is required and must be at least 3 characters long.' },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_\-\.]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, underscores, dashes, and periods.' },
        { status: 400 }
      );
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const targetRole = role === 'super_admin' ? 'super_admin' : 'sub_admin';
    const targetStatus = status === 'inactive' ? 'inactive' : 'active';

    // Validate and clean permissions array
    const validModuleIds = new Set(MODULE_DEFINITIONS.map((m) => m.id));
    const validActionSet = new Set(ALL_ACTIONS);

    let cleanPermissions: Array<{ module: string; actions: string[] }> = [];

    if (targetRole === 'sub_admin' && Array.isArray(permissions)) {
      cleanPermissions = permissions
        .filter((p: any) => p && typeof p === 'object' && validModuleIds.has(p.module))
        .map((p: any) => {
          const rawActions: any[] = Array.isArray(p.actions) ? p.actions : [];
          const filteredActions: string[] = Array.from(
            new Set<string>(rawActions.filter((a: any): a is AdminAction => validActionSet.has(a)))
          );
          return {
            module: String(p.module),
            actions: filteredActions,
          };
        })
        .filter((p) => p.actions.length > 0);
    }

    await connectDB();

    // 1. Create New Sub-Admin
    if (!_id) {
      if (!password || typeof password !== 'string' || password.length < 6) {
        return NextResponse.json(
          { error: 'Password is required and must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      // Check unique username
      const existingUser = await User.findOne({ username: { $eq: cleanUsername } });
      if (existingUser) {
        return NextResponse.json(
          { error: `The username '${cleanUsername}' is already taken.` },
          { status: 400 }
        );
      }

      // Check unique email
      const existingEmail = await User.findOne({ email: { $eq: cleanEmail } });
      if (existingEmail) {
        return NextResponse.json(
          { error: `The email address '${cleanEmail}' is already registered.` },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const created = await User.create({
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        role: targetRole,
        status: targetStatus,
        permissions: cleanPermissions,
      });

      return NextResponse.json({
        success: true,
        message: `Account for '${cleanUsername}' successfully created.`,
        user: {
          _id: created._id.toString(),
          name: created.name,
          username: created.username,
          email: created.email,
          role: created.role,
          status: created.status,
          permissions: created.permissions,
          createdAt: created.createdAt,
          isSuperAdmin: isSuperAdmin(created.role),
        },
      });
    }

    // 2. Edit Existing Sub-Admin
    const targetUser = await User.findById(_id);
    if (!targetUser) {
      return NextResponse.json({ error: 'Target user account not found.' }, { status: 404 });
    }

    // Safety: Prevent self-lockout
    if (targetUser._id.toString() === currentAdmin.id) {
      if (targetRole !== 'super_admin' && isSuperAdmin(targetUser.role)) {
        return NextResponse.json(
          { error: 'Security constraint: You cannot demote your own Super Admin account.' },
          { status: 400 }
        );
      }
      if (targetStatus === 'inactive') {
        return NextResponse.json(
          { error: 'Security constraint: You cannot deactivate your own account.' },
          { status: 400 }
        );
      }
    }

    // Check unique username conflict
    const usernameConflict = await User.findOne({
      _id: { $ne: targetUser._id },
      username: { $eq: cleanUsername },
    });
    if (usernameConflict) {
      return NextResponse.json(
        { error: `Username '${cleanUsername}' is already in use by another account.` },
        { status: 400 }
      );
    }

    // Check unique email conflict
    const emailConflict = await User.findOne({
      _id: { $ne: targetUser._id },
      email: { $eq: cleanEmail },
    });
    if (emailConflict) {
      return NextResponse.json(
        { error: `Email '${cleanEmail}' is already registered to another account.` },
        { status: 400 }
      );
    }

    targetUser.name = cleanName;
    targetUser.username = cleanUsername;
    targetUser.email = cleanEmail;
    targetUser.role = targetRole;
    targetUser.status = targetStatus;
    targetUser.permissions = cleanPermissions as any;

    if (password && typeof password === 'string' && password.trim().length > 0) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long.' },
          { status: 400 }
        );
      }
      targetUser.password = await bcrypt.hash(password, 10);
    }

    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: `Account for '${cleanUsername}' successfully updated.`,
      user: {
        _id: targetUser._id.toString(),
        name: targetUser.name,
        username: targetUser.username,
        email: targetUser.email,
        role: targetUser.role,
        status: targetUser.status,
        permissions: targetUser.permissions,
        updatedAt: targetUser.updatedAt,
        isSuperAdmin: isSuperAdmin(targetUser.role),
      },
    });
  } catch (err: any) {
    console.error('Error in POST /api/admin/sub-admins:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process admin account.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/sub-admins?id=...
 * Delete a sub-admin account. Strictly Super Admin only.
 */
export async function DELETE(req: Request) {
  try {
    const currentAdmin = await getAuthenticatedAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (!currentAdmin.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Administrators can delete sub-admin accounts.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing account ID parameter.' }, { status: 400 });
    }

    // Safety: Prevent deleting self
    if (id === currentAdmin.id) {
      return NextResponse.json(
        { error: 'Security constraint: You cannot delete your own account.' },
        { status: 400 }
      );
    }

    await connectDB();
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: 'Target admin account not found.' }, { status: 404 });
    }

    // Safety: Prevent deleting the primary admin account
    if (targetUser.username === 'admin') {
      return NextResponse.json(
        { error: 'Security constraint: The primary root admin account cannot be deleted.' },
        { status: 400 }
      );
    }

    // Safety: Prevent deleting the last Super Admin
    if (isSuperAdmin(targetUser.role)) {
      const superAdminCount = await User.countDocuments({
        role: { $in: ['super_admin', 'admin'] },
        status: 'active',
      });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Security constraint: Cannot delete the only remaining active Super Administrator.' },
          { status: 400 }
        );
      }
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Account '${targetUser.username}' has been deleted.`,
    });
  } catch (err: any) {
    console.error('Error in DELETE /api/admin/sub-admins:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete admin account.' },
      { status: 500 }
    );
  }
}
