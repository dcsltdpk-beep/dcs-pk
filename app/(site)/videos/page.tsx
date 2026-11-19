import React from 'react';
import type { Metadata } from 'next';
import VideosClient from './VideosClient';
import { getVideos, getSettings } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.videos_meta_title || 'Video Showcase & Technical Demonstrations | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.videos_meta_description ||
      'Watch cybersecurity proof-of-concepts, technical workshops, company briefings, and engineering showreels.',
    keywords:
      settings.videos_meta_keywords ||
      'cybersecurity videos, ethical hacking demos, tech webinars pakistan',
  };
}

export const revalidate = 60;

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Visual Insights</span>
          <h1 className="section-title">
            Featured <span className="text-gradient">Video Gallery</span>
          </h1>
          <p className="section-desc">
            Explore executive introductions, training course previews, student engineering projects, and security education.
          </p>
        </div>

        <VideosClient initialVideos={JSON.parse(JSON.stringify(videos))} />
      </div>
    </section>
  );
}
