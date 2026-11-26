import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    // Ensure admin has create/edit permission on at least one content module or is super admin
    const canUpload =
      admin.isSuperAdmin ||
      hasPermission(admin, 'posts', 'create') ||
      hasPermission(admin, 'posts', 'edit') ||
      hasPermission(admin, 'team', 'create') ||
      hasPermission(admin, 'team', 'edit') ||
      hasPermission(admin, 'courses', 'create') ||
      hasPermission(admin, 'courses', 'edit') ||
      hasPermission(admin, 'services', 'create') ||
      hasPermission(admin, 'services', 'edit') ||
      hasPermission(admin, 'settings', 'edit') ||
      hasPermission(admin, 'home-content', 'edit');

    if (!canUpload) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to upload assets.' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'dcs_pakistan';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream
    const result = await new Promise<{ secure_url: string; public_id: string; format: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
            });
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload media to Cloudinary' },
      { status: 500 }
    );
  }
}
