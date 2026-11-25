import React from 'react';
import type { Metadata } from 'next';
import VideosPageClient from '@/components/VideosPageClient';
import { getVideos, getSettings } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title =
    settings.videos_meta_title ||
    'Video Showcase & Technical Demonstrations | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.videos_meta_description ||
      'Company films, course introductions, student projects and security tutorials — see Dream Cyber Security in action.',
    keywords:
      settings.videos_meta_keywords ||
      'cybersecurity videos, tech showcase pakistan, ethical hacking demos, course introductions lahore',
  };
}

export const revalidate = 60;

export default async function VideosPage() {
  const [videos, settings] = await Promise.all([
    getVideos(),
    getSettings(),
  ]);

  return (
    <VideosPageClient
      initialVideos={JSON.parse(JSON.stringify(videos))}
      whatsappNumber={settings.whatsapp_number || '923165478855'}
    />
  );
}
