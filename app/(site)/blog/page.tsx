import React from 'react';
import type { Metadata } from 'next';
import { getPosts, getSettings } from '@/lib/data';
import BlogPageClient from '@/components/BlogPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.blog_meta_title || 'Cyber Advisories, Threat Intelligence & News | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.blog_meta_description ||
      'Stay informed with technical threat advisories, vulnerability breakdowns, defense engineering playbooks, and corporate news from DCS researchers.',
    keywords:
      settings.blog_meta_keywords ||
      'cyber threat intelligence, pakistani cybersecurity advisories, zero-day alerts, security blog',
  };
}

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    getPosts(),
    getSettings(),
  ]);

  return (
    <BlogPageClient
      initialPosts={posts}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
