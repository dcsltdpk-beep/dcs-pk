import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import { getPostBySlug, getPosts } from '@/lib/data';
import { getCanonicalUrl } from '@/lib/seo';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found | Dream Cyber Security' };

  const postUrl = getCanonicalUrl(`/blog/${post.slug}`);
  const ogImages = post.featured_image
    ? [{ url: post.featured_image, width: 1200, height: 630, alt: post.title }]
    : undefined;

  const title = post.meta_title?.trim() || post.title;
  const description = post.meta_description?.trim() || post.excerpt;
  const keywords = post.meta_keywords?.trim() || post.tags || 'cybersecurity, threat intelligence, dcs pakistan';

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
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/blog" style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>
            &larr; Back to All Advisories
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.25rem' }}>
          <span className="badge badge-cyan">{post.category}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="calendar" size={14} />
            {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>{post.title}</h1>

        {post.featured_image && (
          <div
            style={{
              width: '100%',
              maxHeight: '450px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '2.5rem',
              border: '1px solid var(--border-color)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featured_image}
              alt={post.title}
              style={{ width: '100%', height: '100%', maxHeight: '450px', objectFit: 'cover' }}
            />
          </div>
        )}

        <div
          className="card"
          style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: 'var(--text-main)',
            padding: '2.5rem',
            marginBottom: '3rem',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Tags:</span>
            {post.tags.split(',').map((t: string, i: number) => (
              <span key={i} className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                #{t.trim()}
              </span>
            ))}
          </div>
        )}

        <div
          className="card"
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(251, 174, 68, 0.08), rgba(62, 56, 135, 0.15))',
            border: '1px solid var(--border-color)',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>Need Specialized Enterprise Cyber Defense?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
            Consult our certified security architects for penetration testing, zero-trust infrastructure, or SOC integration.
          </p>
          <Link href="/contact" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Speak with our Security Engineers
          </Link>
        </div>
      </div>
    </section>
  );
}
