import React from 'react';
import type { Metadata } from 'next';
import CoursesPageClient from '@/components/CoursesPageClient';
import { getCourses, getSettings } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title =
    settings.courses_meta_title ||
    'DCS Academy — Professional IT & AI Courses | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.courses_meta_description ||
      'Practical, industry-led courses in AI automation, web engineering, design and computer fundamentals — taught by working professionals from Dream Cyber Security Pakistan.',
    keywords:
      settings.courses_meta_keywords ||
      'cybersecurity courses lahore, ethical hacking training pakistan, ai automation course, web development training, graphic design course lahore',
  };
}

export const revalidate = 60;

export default async function CoursesPage() {
  const [courses, settings] = await Promise.all([
    getCourses(),
    getSettings(),
  ]);

  return (
    <CoursesPageClient
      whatsappNumber={settings.whatsapp_number || '923165478855'}
      whatsappMessage={
        settings.whatsapp_message ||
        'Hello Dream Cyber Security Pakistan, I would like to inquire about your academy training courses.'
      }
      dbCourses={courses}
    />
  );
}
