import React from 'react';
import type { Metadata } from 'next';
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

  const categories = [
    'Company Videos',
    'Course Introduction Videos',
    'Student Projects and Work',
    'Tutorials and Educational Videos',
  ];

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

        {categories.map((cat) => {
          const categoryVideos = videos.filter((v) => v.category === cat);
          if (categoryVideos.length === 0) return null;

          return (
            <div key={cat} style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span className="badge badge-cyan">{cat}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  ({categoryVideos.length} {categoryVideos.length === 1 ? 'Video' : 'Videos'})
                </span>
              </div>

              <div className="grid grid-2">
                {categoryVideos.map((vid) => (
                  <div key={vid._id} className="card">
                    <div className="video-responsive" style={{ marginBottom: '1.25rem' }}>
                      {vid.video_type === 'upload' ? (
                        <video controls preload="metadata">
                          <source src={vid.video_source} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <iframe
                          src={vid.video_source}
                          title={vid.title}
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{vid.title}</h3>
                    {vid.description && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {vid.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
