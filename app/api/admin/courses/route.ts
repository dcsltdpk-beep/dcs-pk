import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireApiPermission } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Course } from '@/lib/models/Course';

export async function GET() {
  const auth = await requireApiPermission('courses', 'view');
  if ('error' in auth) return auth.error;

  await connectDB();
  const courses = await Course.find().sort({ order_num: 1 }).lean();
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const data = await req.json();
  const action = data._id ? 'edit' : 'create';
  const auth = await requireApiPermission('courses', action);
  if ('error' in auth) return auth.error;

  await connectDB();

  if (!data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  let result;
  if (data._id) {
    result = await Course.findByIdAndUpdate(data._id, data, { new: true });
  } else {
    delete data._id;
    result = await Course.create(data);
  }

  // Automatically synchronize changes across desktop navbar, mobile navbar, and courses page
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/courses');
    if (data.slug) {
      revalidatePath(`/courses/${data.slug}`);
    }
  } catch (err) {
    console.warn('Revalidation error:', err);
  }

  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const auth = await requireApiPermission('courses', 'delete');
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  const course = await Course.findByIdAndDelete(id);

  // Automatically synchronize deletions across all menus and pages
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/courses');
    if (course?.slug) {
      revalidatePath(`/courses/${course.slug}`);
    }
  } catch (err) {
    console.warn('Revalidation error:', err);
  }

  return NextResponse.json({ success: true });
}
