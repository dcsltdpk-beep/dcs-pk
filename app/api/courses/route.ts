import { NextResponse } from 'next/server';
import { getCourses } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const courses = await getCourses();
    return NextResponse.json(courses);
  } catch (err) {
    console.error('Error fetching public courses:', err);
    return NextResponse.json([], { status: 500 });
  }
}
