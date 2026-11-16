import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import { getPostBySlug, getPosts } from '@/lib/data';

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
  return {
    title: `${post.title} | Dream Cyber Security Pakistan`,
    description: post.excerpt,
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
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(79, 172, 254, 0.03))',
          }}
        >
          <h3 style={{ marginBottom: '0.5rem' }}>Protect Your Infrastructure Against These Threats</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Schedule an expert zero-trust vulnerability assessment with our certified engineers in Pakistan.
          </p>
          <Link href="/contact" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Request Security Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
