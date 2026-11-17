'use client';

import React, { useState, useRef } from 'react';

interface PostItem {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  tags?: string;
  featured_image?: string;
  excerpt: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_published: boolean;
}

export default function PostsAdminClient({ initialPosts }: { initialPosts: PostItem[] }) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [editing, setEditing] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const emptyForm: PostItem = {
    title: '',
    slug: '',
    category: 'Cybersecurity Tips',
    tags: '',
    featured_image: '',
    excerpt: '',
    content: '<p>Write your detailed article or advisory here...</p>',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_published: true,
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (val: string) => {
    if (!editing) return;
    const currentAutoSlug = generateSlug(editing.title);
    if (!editing._id && (!editing.slug || editing.slug === currentAutoSlug)) {
      setEditing({ ...editing, title: val, slug: generateSlug(val) });
    } else {
      setEditing({ ...editing, title: val });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploadingImage(true);
    setImageError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'dcs_pakistan/blog');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setEditing({ ...editing, featured_image: data.url });
    } catch (err: any) {
      console.error('Blog image upload error:', err);
      setImageError(err?.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    const payload = {
      ...editing,
      slug: editing.slug ? generateSlug(editing.slug) : generateSlug(editing.title),
      meta_title: editing.meta_title?.trim() || editing.title,
      meta_description: editing.meta_description?.trim() || editing.excerpt,
      meta_keywords: editing.meta_keywords?.trim() || editing.tags || '',
    };

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const saved = await res.json();
      if (res.ok) {
        if (editing._id) {
          setPosts(posts.map((p) => (p._id === saved._id ? saved : p)));
        } else {
          setPosts([saved, ...posts]);
        }
        setEditing(null);
      } else {
        alert(saved.error || 'Failed to save article');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while saving article');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    const res = await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts(posts.filter((p) => p._id !== id));
      if (editing?._id === id) setEditing(null);
    }
  };

  const previewTitle = editing?.meta_title || editing?.title || 'Article Title';
  const previewDesc = editing?.meta_description || editing?.excerpt || 'Article summary excerpt displayed in Google search snippet...';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Advisories & News</span>
          <h1>Manage <span className="text-gradient">Blog Articles</span></h1>
        </div>
        <button onClick={() => { setEditing(emptyForm); setImageError(null); }} className="btn btn-primary">
          + Create New Article
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editing._id ? 'Edit Article & SEO' : 'Create New Article & SEO'}</h3>
            <button onClick={() => { setEditing(null); setImageError(null); }} className="btn btn-outline" style={{ padding: '4px 10px' }}>
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Article Title *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Top 5 Cybersecurity Essentials Every Business Must Implement in 2026"
                  value={editing.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Cybersecurity Tips, Threat Intelligence, Company News"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                />
              </div>
            </div>

            {/* DEDICATED BLOG SEO & META INTELLIGENCE SECTION */}
            <div
              style={{
                padding: '1.5rem',
                marginBottom: '1.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 240, 255, 0.03)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🎯</span>
                  <h4 style={{ margin: 0, color: 'var(--accent-cyan)' }}>Blog SEO, Meta Tags & Google SERP Preview</h4>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>Indexed by Google</span>
              </div>

              {/* Live SERP Preview Card for this Blog Post */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '6px',
                  background: '#0a0d1a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '6px' }}>
                  🔍 Google Search Preview for this Article
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8b949e', marginBottom: '4px', fontFamily: 'var(--font-mono, monospace)' }}>
                  https://www.dreamcybersecurity.pk/blog/<span style={{ color: 'var(--accent-cyan)' }}>{editing.slug || 'article-slug'}</span>
                </div>
                <div style={{ color: '#58a6ff', fontSize: '1.1rem', fontWeight: 500, lineHeight: '1.3', marginBottom: '4px' }}>
                  {previewTitle} | Dream Cyber Security Pakistan
                </div>
                <div style={{ color: '#8b949e', fontSize: '0.85rem', lineHeight: '1.45' }}>
                  {previewDesc}
                </div>
              </div>

              {/* Custom URL Slug Editor */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem' }}>
                    1. Article URL Slug (Permalink) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, slug: generateSlug(editing.title) })}
                    className="btn btn-outline"
                    style={{ padding: '2px 8px', fontSize: '0.72rem', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                  >
                    ⚡ Auto-Generate from Title
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0 12px',
                    overflow: 'hidden',
                    marginTop: '6px',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--accent-cyan)',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                      fontWeight: 600,
                    }}
                  >
                    /blog/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="custom-seo-url-slug"
                    value={editing.slug}
                    onChange={(e) => {
                      const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                      setEditing({ ...editing, slug: sanitized });
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      padding: '8px',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                {/* Custom SEO Meta Title */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ margin: 0, fontSize: '0.85rem' }}>
                      2. Custom Meta Title (Google SERP Title)
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, meta_title: editing.title })}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                    >
                      Copy Title
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Leave blank to use Article Title automatically"
                    value={editing.meta_title || ''}
                    onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
                    style={{ marginTop: '4px' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {(editing.meta_title || editing.title || '').length} / 60 characters
                  </div>
                </div>

                {/* Primary Keywords */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ margin: 0, fontSize: '0.85rem' }}>
                      3. Primary Keywords (Comma-separated)
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, meta_keywords: editing.tags || '' })}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                    >
                      Copy Tags
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. ransomware recovery, SOC monitoring lahore, zero-trust"
                    value={editing.meta_keywords || ''}
                    onChange={(e) => setEditing({ ...editing, meta_keywords: e.target.value })}
                    style={{ marginTop: '4px' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Injected into &lt;meta name=&quot;keywords&quot;&gt;
                  </div>
                </div>
              </div>

              {/* Custom Meta Description */}
              <div className="form-group" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.85rem' }}>
                    4. Custom Meta Description (Google Snippet)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, meta_description: editing.excerpt })}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                  >
                    Copy Excerpt
                  </button>
                </div>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Leave blank to use Summary Excerpt automatically..."
                  value={editing.meta_description || ''}
                  onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                  style={{ marginTop: '4px' }}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {(editing.meta_description || editing.excerpt || '').length} / 160 characters
                </div>
              </div>
            </div>

            {/* Featured Image (Cover & Social Share Card) */}
            <div
              style={{
                padding: '1.25rem',
                marginBottom: '1.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed var(--border-color)',
              }}
            >
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Featured Cover Image (SEO & Social Share)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '120px',
                    height: '70px',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {editing.featured_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editing.featured_image}
                      alt="Cover Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Image</span>
                  )}
                  {uploadingImage && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>
                      ...
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => imageInputRef.current?.click()}
                      className="btn btn-primary"
                      style={{ padding: '5px 12px', fontSize: '0.82rem' }}
                    >
                      {uploadingImage ? 'Uploading...' : editing.featured_image ? 'Change Image' : 'Upload Cover'}
                    </button>
                    {editing.featured_image && (
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, featured_image: '' })}
                        className="btn btn-outline"
                        style={{ padding: '5px 10px', fontSize: '0.82rem', color: '#ff6b6b' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Or enter direct image URL (https://res.cloudinary.com/...)"
                    className="form-control"
                    style={{ padding: '4px 10px', fontSize: '0.82rem' }}
                    value={editing.featured_image || ''}
                    onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })}
                  />
                  {imageError && <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '4px' }}>{imageError}</div>}
                </div>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Article Tags (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ransomware, zero-trust, cloud-security, lahore"
                  value={editing.tags || ''}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publication Status</label>
                <select
                  className="form-control"
                  value={editing.is_published ? 'true' : 'false'}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.value === 'true' })}
                >
                  <option value="true">Published (Live & Indexed)</option>
                  <option value="false">Draft (Hidden from Google & Visitors)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Summary Excerpt *</label>
              <textarea
                className="form-control"
                rows={2}
                required
                placeholder="Brief 1-2 sentence synopsis shown on blog cards..."
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full HTML Body Content *</label>
              <textarea
                className="form-control"
                rows={9}
                required
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading || uploadingImage} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving Article...' : 'Save & Publish Article'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Article Title & Slug</th>
              <th>Category</th>
              <th>SEO Title / Status</th>
              <th style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id || post.slug}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.98rem' }}>{post.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.78rem',
                        color: 'var(--accent-cyan)',
                        background: 'rgba(0, 240, 255, 0.08)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      /blog/{post.slug}
                    </span>
                  </div>
                </td>
                <td><span className="badge badge-cyan">{post.category}</span></td>
                <td>
                  <span className={`badge ${post.is_published ? 'badge-cyan' : ''}`} style={{ marginBottom: '4px', display: 'inline-block' }}>
                    {post.is_published ? 'Live' : 'Draft'}
                  </span>
                  {post.meta_title && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      SEO: {post.meta_title.slice(0, 28)}...
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                    >
                      View ↗
                    </a>
                    <button
                      onClick={() => { setEditing(post); setImageError(null); }}
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => post._id && handleDelete(post._id)}
                      className="btn btn-danger"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
