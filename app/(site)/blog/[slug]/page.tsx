import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts, getRelatedPosts, getSettings } from '@/lib/data';
import { getCanonicalUrl } from '@/lib/seo';
import BlogPostClient from '@/components/BlogPostClient';

export const revalidate = 60;

interface Props {
  params: { slug: string };
  searchParams?: { preview?: string };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const isPreview = searchParams?.preview === 'true';
  const post = await getPostBySlug(params.slug, { preview: isPreview });
  if (!post) {
    return { title: 'Advisory Not Found | Dream Cyber Security Pakistan' };
  }

  const postUrl = post.canonical_url?.trim() || getCanonicalUrl(`/blog/${post.slug}`);
  const ogImgUrl = post.og_image?.trim() || post.featured_image?.trim();
  const ogImages = ogImgUrl
    ? [{ url: ogImgUrl, width: 1200, height: 630, alt: post.title }]
    : [{ url: getCanonicalUrl('/logo.png'), width: 512, height: 512, alt: 'Dream Cyber Security' }];

  const title = post.meta_title?.trim() || post.title;
  const description = post.meta_description?.trim() || post.excerpt;
  const allKeywords = [
    post.focus_keyword?.trim(),
    post.secondary_keywords?.trim(),
    post.meta_keywords?.trim(),
    post.tags?.trim(),
  ].filter(Boolean).join(', ');
  const keywords = allKeywords || 'technology, cybersecurity, threat intelligence, dcs pakistan';
  const authorName = post.author_name?.trim() || 'DCS Cyber Threat Research Team';

  return {
    title: { absolute: title.includes('Dream Cyber Security') ? title : `${title} | Dream Cyber Security Pakistan` },
    description,
    keywords,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: postUrl,
      publishedTime: post.published_at ? new Date(post.published_at).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      authors: [authorName],
      section: post.category || 'Threat Intelligence',
      tags: post.tags ? post.tags.split(',').map((t: string) => t.trim()) : undefined,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  const isPreview = searchParams?.preview === 'true';
  const [post, settings] = await Promise.all([
    getPostBySlug(params.slug, { preview: isPreview }),
    getSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category, 3);

  // Article Schema.org Structured Data
  const postUrl = post.canonical_url?.trim() || getCanonicalUrl(`/blog/${post.slug}`);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description?.trim() || post.excerpt,
    image: post.featured_image ? [post.featured_image] : [getCanonicalUrl('/logo.png')],
    datePublished: post.published_at ? new Date(post.published_at).toISOString() : new Date().toISOString(),
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: post.author_name || 'DCS Cyber Threat Research Team',
      jobTitle: post.author_role || 'Principal Threat Intelligence Architect',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dream Cyber Security Pakistan',
      logo: {
        '@type': 'ImageObject',
        url: getCanonicalUrl('/logo.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.tags || post.meta_keywords || 'cybersecurity, threat intelligence',
    articleSection: post.category || 'Threat Intelligence',
  };

  return (
    <>
      {/* Schema.org Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <BlogPostClient
        post={post}
        relatedPosts={relatedPosts}
        whatsappNumber={settings.whatsapp_number}
        isPreview={isPreview}
      />
    </>
  );
}
