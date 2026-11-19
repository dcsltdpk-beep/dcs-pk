'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Play, Search, X, Film, Sparkles } from 'lucide-react';

interface VideoItem {
  _id?: string;
  title: string;
  category: string;
  video_type: 'embed' | 'upload';
  video_source: string;
  description?: string;
  order_num?: number;
}

interface VideosClientProps {
  initialVideos: VideoItem[];
}

// Helper: Extract YouTube ID from various YouTube URL formats
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

// Helper: Get best embed URL for autoplay inside modal
function getEmbedUrl(url: string): string {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
  }
  return url;
}

export default function VideosClient({ initialVideos }: VideosClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(null);

  // Compute unique categories from data
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialVideos.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return ['All', ...Array.from(set)];
  }, [initialVideos]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialVideos.length };
    initialVideos.forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, [initialVideos]);

  // Filter videos based on category and search query
  const filteredVideos = useMemo(() => {
    return initialVideos.filter((video) => {
      const matchesCategory =
        selectedCategory === 'All' || video.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        video.title.toLowerCase().includes(q) ||
        (video.description && video.description.toLowerCase().includes(q)) ||
        video.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [initialVideos, selectedCategory, searchQuery]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalVideo(null);
      }
    };
    if (activeModalVideo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalVideo]);

  return (
    <>
      {/* Search & Filter Bar Controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Top Control Bar: Search & Video Count */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Search Input */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 300px',
              maxWidth: '460px',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search videos by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{
                paddingLeft: '42px',
                paddingRight: searchQuery ? '38px' : '14px',
                height: '44px',
                borderRadius: '50px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: searchQuery ? 'var(--accent-cyan)' : 'var(--border-color)',
                fontSize: '0.9rem',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Counter */}
          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Film size={15} style={{ color: 'var(--accent-cyan)' }} />
            <span>
              Showing <strong style={{ color: 'var(--text-main)' }}>{filteredVideos.length}</strong> of {initialVideos.length} videos
            </span>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '7px 16px',
                  fontSize: '0.84rem',
                  borderRadius: '50px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  borderColor: isActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.12)',
                }}
              >
                <span>{cat === 'All' ? 'All Showcase' : cat}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(10, 14, 26, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#0a0e1a' : 'var(--text-muted)',
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Videos Grid — Compact 3-Column Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-3" style={{ gap: '1.5rem', alignItems: 'stretch' }}>
          {filteredVideos.map((vid, idx) => {
            const ytId = getYouTubeId(vid.video_source);
            const thumbUrl = ytId
              ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
              : null;

            return (
              <div
                key={vid._id || `${vid.title}-${idx}`}
                className="card video-card-compact"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0',
                  overflow: 'hidden',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveModalVideo(vid)}
              >
                {/* 16:9 Thumbnail Poster with Interactive Play Overlay */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '56.25%',
                    background: '#070a14',
                    overflow: 'hidden',
                  }}
                >
                  {thumbUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbUrl}
                      alt={vid.title}
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      className="video-thumb-img"
                    />
                  ) : (
                    // Fallback sleek cyber gradient if not YouTube
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, #0b1226 0%, #171f3d 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-cyan)',
                      }}
                    >
                      <Film size={44} strokeWidth={1.5} style={{ opacity: 0.5 }} />
                    </div>
                  )}

                  {/* Dark Vignette Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(7,10,20,0.85) 0%, rgba(7,10,20,0.2) 60%, rgba(7,10,20,0.4) 100%)',
                    }}
                  />

                  {/* Category Badge - Top Left */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: '6px',
                        background: 'rgba(5, 8, 20, 0.75)',
                        backdropFilter: 'blur(6px)',
                        color: 'var(--accent-cyan)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                      }}
                    >
                      {vid.category}
                    </span>
                  </div>

                  {/* HD Tag - Top Right */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(0, 240, 255, 0.18)',
                        color: '#fff',
                        letterSpacing: '0.5px',
                        border: '1px solid rgba(0, 240, 255, 0.35)',
                      }}
                    >
                      ▶ HD
                    </span>
                  </div>

                  {/* Central Glowing Cyber Play Button */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                    }}
                  >
                    <div
                      className="video-play-btn"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(0, 240, 255, 0.95)',
                        color: '#070a14',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.6), 0 4px 12px rgba(0,0,0,0.5)',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
                      }}
                    >
                      <Play size={22} fill="#070a14" strokeWidth={0} style={{ marginLeft: '3px' }} />
                    </div>
                  </div>
                </div>

                {/* Card Content Information */}
                <div
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Video Title - Clamped to 2 lines */}
                    <h3
                      style={{
                        fontSize: '1.08rem',
                        fontWeight: 600,
                        lineHeight: '1.4',
                        marginBottom: '0.5rem',
                        color: 'var(--text-main)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.8em',
                      }}
                      title={vid.title}
                    >
                      {vid.title}
                    </h3>

                    {/* Video Description - Clamped to 2 lines */}
                    {vid.description && (
                      <p
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.86rem',
                          lineHeight: '1.5',
                          marginBottom: '1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {vid.description}
                      </p>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      marginTop: 'auto',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--accent-cyan)',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Play size={13} fill="currentColor" /> Watch Video
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      DCS Media
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            maxWidth: '520px',
            margin: '2rem auto',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--accent-cyan)',
            }}
          >
            <Search size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No matching videos found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            We couldn&apos;t find any videos matching &ldquo;{searchQuery}&rdquo; in the selected category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.88rem' }}
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* CINEMATIC VIDEO LIGHTBOX MODAL */}
      {/* ==================================================================== */}
      {activeModalVideo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 7, 18, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflowY: 'auto',
          }}
          onClick={() => setActiveModalVideo(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '860px',
              width: '100%',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              padding: '1.5rem',
              borderRadius: '18px',
              border: '1px solid var(--accent-cyan)',
              background: '#0d1124',
              boxShadow: '0 20px 60px rgba(0, 240, 255, 0.25), 0 0 30px rgba(0, 0, 0, 0.8)',
              position: 'relative',
              margin: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.76rem' }}>
                  {activeModalVideo.category}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Dream Cyber Security Media
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* 16:9 Video Player */}
            <div
              className="video-responsive"
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                marginBottom: '1.25rem',
              }}
            >
              {activeModalVideo.video_type === 'upload' ? (
                <video controls autoPlay preload="auto">
                  <source src={activeModalVideo.video_source} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={getEmbedUrl(activeModalVideo.video_source)}
                  title={activeModalVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Title & Description */}
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: '#fff' }}>
              {activeModalVideo.title}
            </h2>
            {activeModalVideo.description && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                {activeModalVideo.description}
              </p>
            )}

            {/* Modal Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>
                <Sparkles size={14} /> Full HD Playback
              </div>
              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                className="btn btn-outline"
                style={{ padding: '6px 16px', fontSize: '0.82rem' }}
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
