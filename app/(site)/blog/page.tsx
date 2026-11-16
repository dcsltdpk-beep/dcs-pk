import React from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { getPosts } from '@/lib/data';

export const metadata = {
  title: 'Cyber Advisories & Updates | Dream Cyber Security Pakistan',
  description: 'Read the latest technical threat advisories, enterprise case studies, and corporate news from DCS researchers.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Threat Advisories & News</span>
          <h1 className="section-title">
            Latest <span className="text-gradient">Insights & Updates</span>
          </h1>
          <p className="section-desc">
            Stay informed with technical cybersecurity analysis, digital defense strategies, and corporate announcements.
          </p>
        </div>

        <div className="grid grid-2">
          {posts.map((post) => (
            <div key={post.slug} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-cyan">{post.category}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Icon name="calendar" size={13} />
                    {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{post.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  {post.excerpt}
                </p>
              </div>

              <div>
                <Link
                  href={`/blog/${post.slug}`}
                  style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Read Full Advisory &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No published posts found.
          </div>
        )}
      </div>
    </section>
  );
}
