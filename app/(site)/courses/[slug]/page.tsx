import React from 'react';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getCourses, getSettings } from '@/lib/data';
import CourseDetailPageClient, { CourseData } from '@/components/CourseDetailPageClient';
import { getCanonicalUrl } from '@/lib/seo';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

const KNOWN_ACADEMY_SLUGS: Record<string, string> = {
  'ai-automation': 'AI Automation & Agents',
  'ai-automation-agents': 'AI Automation & Agents',
  'web': 'Enterprise Web Dev',
  'web-dev': 'Enterprise Web Dev',
  'web-development': 'Enterprise Web Dev',
  'enterprise-web-dev': 'Enterprise Web Dev',
  'video-design': 'Video Editing & Graphic Design',
  'video-editing': 'Video Editing & Graphic Design',
  'video-editing-graphic-design': 'Video Editing & Graphic Design',
  'graphic-designing-with-ai': 'Graphic Designing with AI',
  'computer-basics': 'Computer Basics & Office',
  'computer-basics-office': 'Computer Basics & Office',
};

export async function generateStaticParams() {
  const courses = await getCourses();
  const dbSlugs = courses.map((c) => ({ slug: c.slug }));
  const knownSlugs = Object.keys(KNOWN_ACADEMY_SLUGS).map((slug) => ({ slug }));
  return [...dbSlugs, ...knownSlugs];
}

export async function generateMetadata({ params }: Props) {
  const course = await getCourseBySlug(params.slug);
  const fallbackTitle = KNOWN_ACADEMY_SLUGS[params.slug];
  const title = course?.title || fallbackTitle;

  if (!title) {
    return { title: 'Course Not Found | Dream Cyber Security' };
  }

  return {
    title: `${title} - Academy Training | Dream Cyber Security Pakistan`,
    description:
      course?.overview ||
      `Professional certification and live project curriculum for ${title} at Dream Cyber Security Skill Academy Pakistan.`,
    alternates: {
      canonical: getCanonicalUrl(`/courses/${params.slug}`),
    },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const [course, settings] = await Promise.all([
    getCourseBySlug(params.slug),
    getSettings(),
  ]);

  if (!course) {
    notFound();
  }

  const effectiveTitle = course.title || KNOWN_ACADEMY_SLUGS[params.slug] || 'Academy Course';
  const whatsappNum = settings.whatsapp_number || '923165478855';

  const learningOutcomes = course?.what_you_will_learn
    ? course.what_you_will_learn.split('\n').map((p: string) => p.trim()).filter((p: string) => p.length > 0)
    : undefined;

  const syllabusModules = course?.syllabus
    ? course.syllabus.split('\n').map((m: string) => m.trim()).filter((m: string) => m.length > 0).map((title: string, idx: number) => ({
        week: `${idx + 1}`,
        title: title,
        subtitle: 'Comprehensive practical coverage',
        topics: [title, 'Hands-on lab exercises', 'Live project implementation'],
        project: `Practical Module ${idx + 1} Exercise`,
      }))
    : undefined;

  const courseData: CourseData = {
    slug: params.slug,
    title: effectiveTitle,
    overview: course?.overview,
    duration: course?.duration,
    intro_video_url: course?.intro_video_url,
    learning_outcomes: learningOutcomes,
    modules: syllabusModules,
    mentor: course?.instructor_name
      ? {
          name: course.instructor_name,
          designation: course.instructor_designation || 'Senior Faculty Mentor',
          bio: course.instructor_bio || 'Experienced practitioner leading hands-on training labs at DCS Academy.',
        }
      : undefined,
  };

  return (
    <CourseDetailPageClient
      course={courseData}
      whatsappNumber={whatsappNum}
    />
  );
}
