'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import WysiwygEditor from '@/components/WysiwygEditor';
import { usePermissions } from '@/app/admin/AdminContext';

export interface PostItem {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  tags?: string;
  featured_image?: string;
  excerpt: string;
  content: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  read_time?: string;
  is_featured?: boolean;
  status?: 'published' | 'draft' | 'scheduled';
  is_published?: boolean;
  published_at?: string | Date;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  focus_keyword?: string;
  secondary_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORY_PRESETS = [
  'Cybersecurity & Ethical Hacking',
  'Threat Intelligence & Advisories',
  'Artificial Intelligence & ML',
  'Web & Full-Stack Development',
  'Mobile App Development',
  'Cloud Computing & DevOps',
  'Software Architecture & Engineering',
  'UI/UX & Graphic Design',
  'Video Production & 3D Animation',
  'Data Science & Analytics',
  'Network & IT Infrastructure',
  'Blockchain & Web3',
  'Digital Marketing & Tech SEO',
  'Company News & Announcements',
  'Tech Careers & Training',
  'Tech Tutorials & How-To Guides',
  'Cybersecurity Tips',
  'Zero-Day Advisories',
  'Defense Engineering',
];

function formatSafeDate(val?: string | Date | null): string {
  if (!val) return '—';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return '—';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return '—';
  }
}

export default function PostsAdminClient({ initialPosts }: { initialPosts: PostItem[] }) {
  const { canCreate, canEdit, canDelete } = usePermissions('posts');
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  // Active modal state
  const [editing, setEditing] = useState<PostItem | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'content' | 'media' | 'publishing' | 'seo'>('content');
  const [previewPost, setPreviewPost] = useState<PostItem | null>(null);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');

  // Loading & uploads
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const emptyForm: PostItem = {
    title: '',
    slug: '',
    category: 'Cybersecurity & Ethical Hacking',
    tags: '',
    featured_image: '',
    excerpt: '',
    content: '<h2>Executive Summary</h2><p>Provide an overview of the security advisory, research finding, or technology breakthrough...</p>',
    author_name: 'DCS Cyber Threat Research Team',
    author_role: 'Principal Threat Intelligence Architect',
    author_avatar: '/logo.png',
    read_time: '5 min read',
    is_featured: false,
    status: 'published',
    is_published: true,
    published_at: new Date().toISOString().slice(0, 16),
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    focus_keyword: '',
    secondary_keywords: '',
    canonical_url: '',
    og_image: '',
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = posts.length;
    let published = 0;
    let drafts = 0;
    let scheduled = 0;
    let featured = 0;

    const now = Date.now();
    for (const p of posts) {
      if (p.is_featured) featured++;
      const pDate = p.published_at ? new Date(p.published_at).getTime() : 0;
      if (p.status === 'draft' || p.is_published === false) {
        drafts++;
      } else if (p.status === 'scheduled' || pDate > now) {
        scheduled++;
      } else {
        published++;
      }
    }
    return { total, published, drafts, scheduled, featured };
  }, [posts]);

  // Unique categories in current collection
  const availableCategories = useMemo(() => {
    const set = new Set(CATEGORY_PRESETS);
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  // Filtered & Paginated Posts
  const filteredPosts = useMemo(() => {
    const now = Date.now();
    return posts.filter((p) => {
      // 1. Status Filter
      if (statusFilter !== 'all') {
        const pDate = p.published_at ? new Date(p.published_at).getTime() : 0;
        if (statusFilter === 'draft') {
          if (p.status !== 'draft' && p.is_published !== false) return false;
        } else if (statusFilter === 'scheduled') {
          if (p.status !== 'scheduled' && pDate <= now) return false;
        } else if (statusFilter === 'published') {
          if (p.status === 'draft' || p.is_published === false || (p.status === 'scheduled' && pDate > now)) {
            return false;
          }
        }
      }

      // 2. Category Filter
      if (categoryFilter !== 'all') {
        if (p.category?.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title?.toLowerCase().includes(q);
        const inSlug = p.slug?.toLowerCase().includes(q);
        const inExcerpt = p.excerpt?.toLowerCase().includes(q);
        const inAuthor = p.author_name?.toLowerCase().includes(q);
        const inTags = p.tags?.toLowerCase().includes(q);
        if (!inTitle && !inSlug && !inExcerpt && !inAuthor && !inTags) return false;
      }

      return true;
    });
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, page, pageSize]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setCustomCategoryInput('');
    setEditing({
      ...emptyForm,
      published_at: new Date().toISOString().slice(0, 16),
    });
    setActiveFormTab('content');
    setImageError(null);
    setFeedback(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: PostItem) => {
    if (post.category && !CATEGORY_PRESETS.includes(post.category)) {
      setCustomCategoryInput(post.category);
    } else {
      setCustomCategoryInput('');
    }
    setEditing({
      ...post,
      published_at: post.published_at
        ? new Date(post.published_at).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    });
    setActiveFormTab('content');
    setImageError(null);
    setFeedback(null);
  };

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploadingCover(true);
    setImageError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'dcs_pakistan/blog_covers');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload cover image');
      }

      setEditing({ ...editing, featured_image: data.url });
    } catch (err: any) {
      setImageError(err?.message || 'Failed to upload image');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Handle Author Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploadingAvatar(true);
    setImageError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'dcs_pakistan/blog_authors');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload author avatar');
      }

      setEditing({ ...editing, author_avatar: data.url });
    } catch (err: any) {
      setImageError(err?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Toggle Featured status directly in list
  const handleToggleFeatured = async (post: PostItem) => {
    if (!canEdit || !post._id) return;
    const nextFeatured = !post.is_featured;

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: post._id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          is_featured: nextFeatured,
        }),
      });

      const data = await res.json();
      if (res.ok && data.post) {
        setPosts((prev) => prev.map((p) => (p._id === post._id ? { ...p, is_featured: nextFeatured } : p)));
      }
    } catch {
      alert('Failed to update featured state');
    }
  };

  // Save Article (Create or Edit)
  const handleSave = async (forceStatus?: 'published' | 'draft' | 'scheduled') => {
    if (!editing) return;

    if (!editing.title.trim()) {
      setFeedback({ type: 'error', message: 'Article title is required.' });
      setActiveFormTab('content');
      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!editing.content.trim()) {
      setFeedback({ type: 'error', message: 'Article body content cannot be empty.' });
      setActiveFormTab('content');
      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const targetStatus = forceStatus || editing.status || 'published';
    const cleanSlug = editing.slug ? generateSlug(editing.slug) : generateSlug(editing.title);

    const payload = {
      ...editing,
      slug: cleanSlug,
      category: editing.category?.trim() || 'Cybersecurity & Ethical Hacking',
      status: targetStatus,
      is_published: targetStatus === 'published',
      published_at: editing.published_at || new Date().toISOString(),
      meta_title: editing.meta_title?.trim() || editing.title.trim(),
      meta_description: editing.meta_description?.trim() || editing.excerpt.trim(),
      meta_keywords: editing.meta_keywords?.trim() || editing.tags?.trim() || '',
      focus_keyword: editing.focus_keyword?.trim() || '',
      secondary_keywords: editing.secondary_keywords?.trim() || '',
      canonical_url: editing.canonical_url?.trim() || '',
      og_image: editing.og_image?.trim() || editing.featured_image?.trim() || '',
    };

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.post) {
        throw new Error(data.error || 'Failed to save article.');
      }

      setFeedback({ type: 'success', message: data.message || 'Article saved successfully.' });

      if (editing._id) {
        setPosts((prev) => prev.map((p) => (p._id === data.post._id ? data.post : p)));
      } else {
        setPosts((prev) => [data.post, ...prev]);
      }

      setTimeout(() => {
        setEditing(null);
      }, 700);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Network exception occurred.' });
      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  // Delete Article
  const handleDelete = async (post: PostItem) => {
    if (!canDelete || !post._id) return;
    if (!confirm(`Are you sure you want to permanently delete '${post.title}'? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/posts?id=${post._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== post._id));
        if (editing?._id === post._id) setEditing(null);
      } else {
        alert(data.error || 'Failed to delete article.');
      }
    } catch {
      alert('Network error while deleting article.');
    }
  };

  return (
    <div>
      {/* Top Header & Overview */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.45rem' }}>
            Threat Intelligence &amp; News
          </span>
          <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#1c1949', fontWeight: 800 }}>
            Production Blog &amp; Advisories Engine
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '6px 0 0 0' }}>
            Create, schedule, and optimize technical threat advisories, cyber research, and company announcements with rich-text media and full Google SEO schema.
          </p>
        </div>

        {canCreate && (
          <button onClick={handleOpenCreate} className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
            <Icon name="plus" size={16} />
            <span style={{ marginLeft: '6px' }}>Create New Article</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-4" style={{ gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #3a3fb8' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Total Articles
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1949', marginTop: '4px' }}>
            {metrics.total}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Live &amp; Published
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {metrics.published}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Draft Articles
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {metrics.drafts}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #3a3fb8' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Scheduled
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3a3fb8', marginTop: '4px' }}>
            {metrics.scheduled}
          </div>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['all', 'published', 'draft', 'scheduled'] as const).map((st) => {
            const count =
              st === 'all'
                ? metrics.total
                : st === 'published'
                  ? metrics.published
                  : st === 'draft'
                    ? metrics.drafts
                    : metrics.scheduled;
            const isActive = statusFilter === st;

            return (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.82rem', textTransform: 'capitalize' }}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Category & Search Inputs */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end', minWidth: '320px' }}>
          <select
            className="admin-input-control"
            style={{ width: 'auto', minWidth: '180px' }}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="admin-input-control"
            style={{ maxWidth: '280px' }}
            placeholder="Search title, tags, author..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Articles Data Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Cover</th>
              <th>Article Title &amp; Permalink</th>
              <th>Category &amp; Tags</th>
              <th>Author</th>
              <th>Status &amp; Schedule</th>
              <th style={{ textAlign: 'center', width: '80px' }}>Featured</th>
              <th style={{ textAlign: 'right', width: '210px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <Icon name="file-text" size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                  <div>No articles found matching the current criteria.</div>
                </td>
              </tr>
            ) : (
              paginatedPosts.map((post) => {
                const isDraft = post.status === 'draft' || post.is_published === false;
                const pTime = post.published_at ? new Date(post.published_at).getTime() : 0;
                const isScheduled = post.status === 'scheduled' || pTime > Date.now();

                return (
                  <tr key={post._id || post.slug}>
                    {/* Cover Thumbnail */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div
                        style={{
                          width: '54px',
                          height: '38px',
                          borderRadius: '6px',
                          backgroundColor: '#0a0f1d',
                          border: '1px solid var(--border-color)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {post.featured_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.featured_image}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Icon name="file-text" size={16} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#1c1949', marginBottom: '3px' }}>
                        {post.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '0.75rem',
                            color: 'var(--accent-cyan)',
                            background: 'rgba(0, 240, 255, 0.08)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          /blog/{post.slug}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {post.read_time || '5 min read'}
                        </span>
                      </div>
                    </td>

                    {/* Category & Tags */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'inline-block' }}>
                        {post.category || 'General'}
                      </span>
                      {post.tags && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          #{post.tags.replace(/,/g, ' #')}
                        </div>
                      )}
                    </td>

                    {/* Author */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.author_avatar || '/logo.png'}
                          alt=""
                          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500 }}>
                            {post.author_name || 'DCS Security Team'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {post.author_role || 'Threat Analyst'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status & Schedule */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {isDraft ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: 'rgba(245, 158, 11, 0.12)',
                            color: '#f59e0b',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                          Draft (Private)
                        </span>
                      ) : isScheduled ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: 'rgba(185, 221, 235, 0.12)',
                            color: '#B9DDEB',
                            border: '1px solid rgba(185, 221, 235, 0.35)',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#B9DDEB' }} />
                          Scheduled: {formatSafeDate(post.published_at)}
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                          Published ({formatSafeDate(post.published_at)})
                        </span>
                      )}
                    </td>

                    {/* Featured Star Toggle */}
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(post)}
                        disabled={!canEdit}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: canEdit ? 'pointer' : 'default',
                          fontSize: '1.25rem',
                          color: post.is_featured ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                          transition: 'transform 0.15s ease',
                        }}
                        title={post.is_featured ? 'Featured Post (Click to toggle)' : 'Mark as Featured Post'}
                      >
                        {post.is_featured ? '★' : '☆'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {/* Live Preview Button */}
                        <button
                          type="button"
                          onClick={() => setPreviewPost(post)}
                          className="btn btn-outline"
                          style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          title="Preview Full Article Layout"
                        >
                          <Icon name="eye" size={13} />
                          <span style={{ marginLeft: '4px' }}>Preview</span>
                        </button>

                        {/* Edit Button */}
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(post)}
                            className="btn btn-outline"
                            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                            title="Edit Article"
                          >
                            <Icon name="edit" size={13} />
                            <span style={{ marginLeft: '4px' }}>Edit</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(post)}
                            className="btn btn-danger"
                            style={{ padding: '5px 8px', fontSize: '0.78rem' }}
                            title="Delete Article"
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredPosts.length)} of {filteredPosts.length} articles
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            >
              &larr; Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                type="button"
                className={`btn ${pNum === page ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPage(pNum)}
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                {pNum}
              </button>
            ))}

            <button
              type="button"
              className="btn btn-outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CREATE / EDIT ARTICLE
          ===================================================================== */}
      {editing && (
        <div className="admin-subadmin-modal-overlay">
          <div
            className="admin-subadmin-modal-card"
            style={{
              maxWidth: '1080px',
              height: '92vh',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 60px -15px rgba(28, 25, 73, 0.25)',
            }}
          >
            {/* Modal Header */}
            <div
              className="admin-subadmin-modal-header"
              style={{
                flexShrink: 0,
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                padding: '1.15rem 1.75rem',
              }}
            >
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '0.35rem' }}>
                  {editing._id ? 'Article Modification' : 'New Article Authoring'}
                </span>
                <h2 style={{ margin: 0, fontSize: '1.45rem', color: '#1c1949', fontWeight: 800 }}>
                  {editing._id ? `Edit Article: ${editing.title}` : 'Create New Technical Article / Advisory'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.75rem',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                }}
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            {/* Sub-tab Navigation Header */}
            <div className="admin-modal-tab-header">
              {[
                { id: 'content', step: '1', label: 'Content & Rich Body', icon: 'file-text' },
                { id: 'media', step: '2', label: 'Cover Image & Author', icon: 'image' },
                { id: 'publishing', step: '3', label: 'Publishing & Schedule', icon: 'calendar' },
                { id: 'seo', step: '4', label: 'SEO & SERP Metadata', icon: 'search' },
              ].map((tab) => {
                const isActive = activeFormTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFormTab(tab.id as any)}
                    className={`admin-modal-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: isActive ? '#f9ac43' : '#f8fafc',
                        color: isActive ? '#1c1949' : '#64748b',
                      }}
                    >
                      {tab.step}
                    </span>
                    <Icon name={tab.icon as any} size={15} style={{ color: isActive ? '#f9ac43' : '#64748b' }} />
                    <span style={{ lineHeight: 1.2 }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Form Body */}
            <div
              className="admin-subadmin-modal-body"
              ref={modalBodyRef}
              style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '1.75rem' }}
            >
              {feedback && (
                <div
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor:
                      feedback.type === 'success' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: `1px solid ${feedback.type === 'success' ? '#34d399' : '#ef4444'}`,
                    color: feedback.type === 'success' ? '#34d399' : '#ef4444',
                  }}
                >
                  <Icon name={feedback.type === 'success' ? 'check-circle' : 'alert-triangle'} size={18} />
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Hidden file input for cover photo */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleCoverUpload}
              />

              {/* TAB 1: CONTENT & RICH BODY */}
              {activeFormTab === 'content' && (
                <div>
                  <div className="grid grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                    {/* Title */}
                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <Icon name="file-text" size={15} style={{ color: 'var(--accent-cyan)' }} />
                        <span>Article Headline / Title</span>
                        <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <p className="admin-field-hint">Compelling threat research title, tutorial name, or tech bulletin</p>
                      <input
                        type="text"
                        className="admin-input-control"
                        placeholder="e.g. Next-Gen Zero-Day Threat Mitigation in Enterprise Cloud"
                        value={editing.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          const currentAuto = generateSlug(editing.title);
                          if (!editing._id && (!editing.slug || editing.slug === currentAuto)) {
                            setEditing({ ...editing, title: val, slug: generateSlug(val) });
                          } else {
                            setEditing({ ...editing, title: val });
                          }
                        }}
                      />
                    </div>

                    {/* Category Selection (Any Tech / Custom Category) */}
                    <div className="admin-field-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="admin-field-label">
                          <Icon name="shield" size={15} style={{ color: 'var(--accent-cyan)' }} />
                          <span>Category &amp; Tech Domain</span>
                          <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <span style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)' }}>
                          Any Tech / Custom
                        </span>
                      </div>
                      <p className="admin-field-hint">Choose any technology discipline or specify a custom category</p>
                      <select
                        className="admin-input-control"
                        value={CATEGORY_PRESETS.includes(editing.category) ? editing.category : '__custom__'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '__custom__') {
                            setEditing({ ...editing, category: customCategoryInput || '' });
                          } else {
                            setCustomCategoryInput('');
                            setEditing({ ...editing, category: val });
                          }
                        }}
                      >
                        <optgroup label="Technology Domains &amp; Disciplines">
                          {CATEGORY_PRESETS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Custom Category">
                          <option value="__custom__">➕ + Custom Category (Type your own)</option>
                        </optgroup>
                      </select>

                      {/* Custom Category Input if not preset or mode active */}
                      {(!CATEGORY_PRESETS.includes(editing.category) || customCategoryInput !== '') && (
                        <div style={{ marginTop: '8px' }}>
                          <input
                            type="text"
                            className="admin-input-control"
                            placeholder="Type any custom category (e.g. Embedded Firmware, Quantum AI, IoT Security)..."
                            value={editing.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomCategoryInput(val);
                              setEditing({ ...editing, category: val });
                            }}
                            style={{
                              borderColor: 'var(--accent-cyan)',
                              boxShadow: '0 0 10px rgba(251, 174, 68, 0.15)',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Cover Image Uploader in Tab 1 */}
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: '74px',
                          height: '48px',
                          borderRadius: '6px',
                          backgroundColor: '#070b14',
                          border: '1px solid var(--border-color)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {editing.featured_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={editing.featured_image}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Icon name="image" size={20} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1949' }}>
                          Blog Cover Image (Cloudinary)
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {editing.featured_image ? 'Cover image attached' : 'Upload photo or set URL (Recommended 1200x630)'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={uploadingCover}
                        onClick={() => coverInputRef.current?.click()}
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        {uploadingCover ? 'Uploading to Cloudinary...' : '📁 Upload Image to Cloudinary'}
                      </button>
                      {editing.featured_image && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => setEditing({ ...editing, featured_image: '' })}
                          style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#f87171' }}
                        >
                          Remove
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setActiveFormTab('media')}
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Media &amp; Author Settings &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Slug & Tags */}
                  <div className="grid grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                    {/* Slug */}
                    <div className="admin-field-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="admin-field-label">
                          <Icon name="external-link" size={15} style={{ color: 'var(--accent-cyan)' }} />
                          <span>URL Slug (Permalink)</span>
                          <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, slug: generateSlug(editing.title) })}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-cyan)',
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                          }}
                        >
                          ⚡ Auto-Generate
                        </button>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'var(--bg-secondary)',
                          // border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '0 10px',
                        }}
                      >
                        <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem' }}>
                          /blog/
                        </span>
                        <input
                          type="text"
                          value={editing.slug}
                          onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                          placeholder="custom-article-slug"
                          style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#1c1949',
                            padding: '10px 8px',
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '0.88rem',
                          }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Keywords &amp; Tags</span>
                      </label>
                      <p className="admin-field-hint">Comma-separated tags (e.g. ransomware, devops, zero-day, SOC)</p>
                      <input
                        type="text"
                        className="admin-input-control"
                        placeholder="e.g. threat-intel, cve-2026, ransomware, incident-response"
                        value={editing.tags || ''}
                        onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="admin-field-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="admin-field-label">
                      <span>Article Synopsis / Summary Excerpt</span>
                      <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <p className="admin-field-hint">Brief 2-3 sentence overview displayed on blog cards, search feeds, and preview headers</p>
                    <textarea
                      className="admin-input-control"
                      rows={2}
                      placeholder="Brief abstract detailing the advisory or technical article..."
                      value={editing.excerpt}
                      onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                    />
                  </div>

                  {/* WYSIWYG Editor */}
                  <div className="admin-field-group">
                    <label className="admin-field-label">
                      <span>Full Article Body (Rich Text WYSIWYG Editor)</span>
                      <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <p className="admin-field-hint">
                      Format with headings, code blocks, quote callouts, media embeds, and structured tables.
                    </p>
                    <WysiwygEditor
                      value={editing.content}
                      onChange={(html) => setEditing({ ...editing, content: html })}
                      placeholder="Write your comprehensive technical analysis here..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & AUTHOR */}
              {activeFormTab === 'media' && (
                <div>
                  {/* Featured Image Cover */}
                  <div
                    style={{
                      padding: '1.5rem',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      marginBottom: '1.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#1c1949', fontWeight: 800 }}>
                        Featured Cover Image (Cloudinary)
                      </h3>
                      <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                        Cloudinary CDN
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 1.25rem 0' }}>
                      Displayed at the top of the article, in social sharing cards, and on the public blog feed.
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div
                        style={{
                          width: '260px',
                          height: '150px',
                          borderRadius: '8px',
                          backgroundColor: '#070b14',
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
                          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <Icon name="image" size={28} style={{ marginBottom: '6px' }} />
                            <div>No Cover Image</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>PNG, JPG, WebP</div>
                          </div>
                        )}
                        {uploadingCover && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundColor: 'rgba(6, 8, 22, 0.88)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--accent-cyan)',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              gap: '8px',
                            }}
                          >
                            <Icon name="refresh-cw" size={16} style={{ animation: 'radar-spin 0.85s linear infinite' }} />
                            Uploading to Cloudinary...
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={uploadingCover}
                            onClick={() => coverInputRef.current?.click()}
                            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                          >
                            <Icon name="upload" size={14} style={{ marginRight: '6px' }} />
                            {uploadingCover ? 'Uploading...' : 'Upload Cover Image to Cloudinary'}
                          </button>
                          {editing.featured_image && (
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => setEditing({ ...editing, featured_image: '' })}
                              style={{ padding: '8px 14px', fontSize: '0.84rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                            >
                              Remove Image
                            </button>
                          )}
                        </div>

                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Or Paste Direct Image URL (Cloudinary, Unsplash, CDN)
                        </label>
                        <input
                          type="url"
                          className="admin-input-control"
                          placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                          value={editing.featured_image || ''}
                          onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })}
                        />
                        {imageError && (
                          <div style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '6px' }}>{imageError}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Author Profile */}
                  <div
                    style={{
                      padding: '1.5rem',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      marginBottom: '1.75rem',
                    }}
                  >
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', color: '#1c1949', fontWeight: 800 }}>
                      Author Byline &amp; Credentials
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 1.25rem 0' }}>
                      Attributed author credentials displayed alongside the article and in structured data.
                    </p>

                    <div className="grid grid-3" style={{ gap: '1.25rem' }}>
                      <div className="admin-field-group">
                        <label className="admin-field-label">Author Name</label>
                        <input
                          type="text"
                          className="admin-input-control"
                          placeholder="e.g. Sarah Connor / DCS Research Team"
                          value={editing.author_name || ''}
                          onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Author Role / Designation</label>
                        <input
                          type="text"
                          className="admin-input-control"
                          placeholder="e.g. Lead Malware Reverse Engineer"
                          value={editing.author_role || ''}
                          onChange={(e) => setEditing({ ...editing, author_role: e.target.value })}
                        />
                      </div>

                      <div className="admin-field-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label className="admin-field-label">Author Avatar URL</label>
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatarUpload}
                          />
                          <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.74rem', cursor: 'pointer' }}
                          >
                            Upload
                          </button>
                        </div>
                        <input
                          type="text"
                          className="admin-input-control"
                          placeholder="/logo.png or avatar URL"
                          value={editing.author_avatar || ''}
                          onChange={(e) => setEditing({ ...editing, author_avatar: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reading Time & Featured Switch */}
                  <div className="grid grid-2" style={{ gap: '1.25rem' }}>
                    <div className="admin-field-group">
                      <label className="admin-field-label">Reading Time Estimation</label>
                      <p className="admin-field-hint">e.g. '5 min read' (Leave blank for automatic calculation)</p>
                      <input
                        type="text"
                        className="admin-input-control"
                        placeholder="e.g. 5 min read"
                        value={editing.read_time || ''}
                        onChange={(e) => setEditing({ ...editing, read_time: e.target.value })}
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Featured Article Placement</label>
                      <p className="admin-field-hint">Highlight this article at the top of the blog landing page</p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginTop: '6px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <input
                          type="checkbox"
                          id="is_featured_cb"
                          checked={Boolean(editing.is_featured)}
                          onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                        />
                        <label htmlFor="is_featured_cb" style={{ color: '#1c1949', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                          ⭐ Promote as Featured Advisory on Blog Home
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PUBLISHING & SCHEDULE */}
              {activeFormTab === 'publishing' && (
                <div>
                  <div
                    style={{
                      padding: '1.5rem',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      marginBottom: '1.75rem',
                    }}
                  >
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', color: '#1c1949', fontWeight: 800 }}>
                      Publication State &amp; Scheduling
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 1.25rem 0' }}>
                      Determine when and how this article is exposed to visitors, search engines, and RSS feeds.
                    </p>

                    <div className="grid grid-3" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                      {/* Published Radio Card */}
                      <label
                        style={{
                          padding: '1.25rem',
                          borderRadius: '8px',
                          border: `2px solid ${editing.status === 'published' ? '#10b981' : 'var(--border-color)'}`,
                          backgroundColor: editing.status === 'published' ? 'rgba(16, 185, 129, 0.08)' : '#ffffff',
                          cursor: 'pointer',
                          display: 'block',
                        }}
                      >
                        <input
                          type="radio"
                          name="status_radio"
                          value="published"
                          checked={editing.status === 'published'}
                          onChange={() => setEditing({ ...editing, status: 'published', is_published: true })}
                          style={{ display: 'none' }}
                        />
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                          🟢 Published (Live)
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: '1.4' }}>
                          Article is live, publicly visible, and indexed across Google &amp; sitemaps immediately.
                        </div>
                      </label>

                      {/* Draft Radio Card */}
                      <label
                        style={{
                          padding: '1.25rem',
                          borderRadius: '8px',
                          border: `2px solid ${editing.status === 'draft' ? '#f59e0b' : 'var(--border-color)'}`,
                          backgroundColor: editing.status === 'draft' ? 'rgba(245, 158, 11, 0.08)' : '#ffffff',
                          cursor: 'pointer',
                          display: 'block',
                        }}
                      >
                        <input
                          type="radio"
                          name="status_radio"
                          value="draft"
                          checked={editing.status === 'draft'}
                          onChange={() => setEditing({ ...editing, status: 'draft', is_published: false })}
                          style={{ display: 'none' }}
                        />
                        <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                          🟡 Draft (Private)
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: '1.4' }}>
                          Work-in-progress. Hidden from the public and search engines. Only visible to authenticated admins.
                        </div>
                      </label>

                      {/* Scheduled Radio Card */}
                      <label
                        style={{
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: `2px solid ${editing.status === 'scheduled' ? '#3a3fb8' : '#e2e8f0'}`,
                          backgroundColor: editing.status === 'scheduled' ? 'rgba(58, 63, 184, 0.05)' : '#ffffff',
                          cursor: 'pointer',
                          display: 'block',
                        }}
                      >
                        <input
                          type="radio"
                          name="status_radio"
                          value="scheduled"
                          checked={editing.status === 'scheduled'}
                          onChange={() => setEditing({ ...editing, status: 'scheduled' })}
                          style={{ display: 'none' }}
                        />
                        <div style={{ color: '#3a3fb8', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                          ⏱️ Scheduled
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: '1.4' }}>
                          Auto-publish at a future date and time. Remains private until the publication timestamp arrives.
                        </div>
                      </label>
                    </div>

                    {/* Publication Timestamp */}
                    <div className="admin-field-group" style={{ maxWidth: '340px' }}>
                      <label className="admin-field-label">
                        <Icon name="calendar" size={15} style={{ color: 'var(--accent-cyan)' }} />
                        <span>Publication Date &amp; Time</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="admin-input-control"
                        value={
                          editing.published_at
                            ? typeof editing.published_at === 'string'
                              ? editing.published_at.slice(0, 16)
                              : new Date(editing.published_at).toISOString().slice(0, 16)
                            : ''
                        }
                        onChange={(e) => setEditing({ ...editing, published_at: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SEO & SERP PREVIEW */}
              {activeFormTab === 'seo' && (
                <div>
                  {/* Google SERP Card */}
                  <div
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '8px',
                      backgroundColor: '#0a0d1a',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      marginBottom: '1.75rem',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '6px' }}>
                      🔍 Google Search Live Snippet (SERP Preview)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '4px', fontFamily: 'var(--font-mono, monospace)' }}>
                      https://www.dreamcybersecurity.pk/blog/<span style={{ color: 'var(--accent-cyan)' }}>{editing.slug || 'article-slug'}</span>
                    </div>
                    <div style={{ color: '#58a6ff', fontSize: '1.15rem', fontWeight: 500, lineHeight: '1.3', marginBottom: '4px' }}>
                      {editing.meta_title || editing.title || 'Article Headline'} | Dream Cyber Security Pakistan
                    </div>
                    <div style={{ color: '#8b949e', fontSize: '0.85rem', lineHeight: '1.45' }}>
                      {editing.meta_description || editing.excerpt || 'Comprehensive threat intelligence briefing and tech analysis by DCS experts...'}
                    </div>
                  </div>

                  <div className="grid grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                    {/* Meta Title */}
                    <div className="admin-field-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="admin-field-label">
                          <span>Meta Title (Search Engine Headline)</span>
                        </label>
                        <span style={{ fontSize: '0.74rem', color: (editing.meta_title || editing.title || '').length > 60 ? '#f59e0b' : 'var(--text-muted)' }}>
                          {(editing.meta_title || editing.title || '').length} / 60 chars
                        </span>
                      </div>
                      <p className="admin-field-hint">Optimized headline for Google SERP (Defaults to Article Title)</p>
                      <input
                        type="text"
                        className="admin-input-control"
                        placeholder="Leave blank to use Article Title automatically"
                        value={editing.meta_title || ''}
                        onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
                      />
                    </div>

                    {/* Primary Focus Keyword */}
                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Primary Focus Keyword</span>
                      </label>
                      <p className="admin-field-hint">The main keyword or phrase this article targets for ranking</p>
                      <input
                        type="text"
                        className="admin-input-control"
                        placeholder="e.g. ransomware defense lahore, cloud security audit"
                        value={editing.focus_keyword || ''}
                        onChange={(e) => setEditing({ ...editing, focus_keyword: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                    {/* Secondary Keywords */}
                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Secondary Keywords (LSI &amp; Related)</span>
                      </label>
                      <p className="admin-field-hint">Comma-separated related queries, synonyms, and variations</p>
                      <input
                        type="text"
                        className="admin-input-control"
                        placeholder="e.g. zero-trust architecture, endpoint detection, soc monitoring"
                        value={editing.secondary_keywords || ''}
                        onChange={(e) => setEditing({ ...editing, secondary_keywords: e.target.value })}
                      />
                    </div>

                    {/* Canonical URL Override */}
                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Canonical URL (Optional Override)</span>
                      </label>
                      <p className="admin-field-hint">Preferred indexing URL (Defaults to https://www.dreamcybersecurity.pk/blog/{editing.slug || 'slug'})</p>
                      <input
                        type="url"
                        className="admin-input-control"
                        placeholder="https://www.dreamcybersecurity.pk/blog/..."
                        value={editing.canonical_url || ''}
                        onChange={(e) => setEditing({ ...editing, canonical_url: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div className="admin-field-group" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="admin-field-label">
                        <span>Meta Description (Snippet)</span>
                      </label>
                      <span style={{ fontSize: '0.74rem', color: (editing.meta_description || editing.excerpt || '').length > 160 ? '#f59e0b' : 'var(--text-muted)' }}>
                        {(editing.meta_description || editing.excerpt || '').length} / 160 chars
                      </span>
                    </div>
                    <p className="admin-field-hint">Compelling summary shown in Google search result cards (Defaults to Article Excerpt)</p>
                    <textarea
                      className="admin-input-control"
                      rows={2}
                      placeholder="Leave blank to use Article Excerpt automatically..."
                      value={editing.meta_description || ''}
                      onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                    />
                  </div>

                  {/* Social Share OG Image Override */}
                  <div className="admin-field-group">
                    <label className="admin-field-label">Social Share OG Image URL (Optional Override)</label>
                    <p className="admin-field-hint">Image used when shared on WhatsApp, LinkedIn, Twitter/X (Defaults to Cover Image)</p>
                    <input
                      type="url"
                      className="admin-input-control"
                      placeholder="https://res.cloudinary.com/... or https://..."
                      value={editing.og_image || ''}
                      onChange={(e) => setEditing({ ...editing, og_image: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Sticky Footer */}
            <div
              className="admin-subadmin-modal-footer"
              style={{
                flexShrink: 0,
                backgroundColor: '#14103c',
                borderTop: '1px solid rgba(63, 57, 131, 0.8)',
                padding: '1rem 1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                  {editing.status || 'published'}
                </span>
                <span>Permalink: /blog/{editing.slug || 'slug'}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setPreviewPost(editing)}
                  style={{ padding: '0.65rem 1.2rem' }}
                >
                  <Icon name="eye" size={14} />
                  <span style={{ marginLeft: '4px' }}>Live Preview</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  style={{ padding: '0.65rem 1.2rem', borderColor: '#f59e0b', color: '#f59e0b' }}
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSave(editing.status || 'published')}
                  disabled={saving}
                  style={{ minWidth: '150px', padding: '0.65rem 1.4rem' }}
                >
                  {saving ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="refresh-cw" size={14} style={{ animation: 'radar-spin 0.85s linear infinite' }} />
                      Saving...
                    </span>
                  ) : editing.status === 'scheduled' ? (
                    'Schedule Article'
                  ) : editing._id ? (
                    'Update Article'
                  ) : (
                    'Publish Article'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: LIVE ARTICLE PUBLIC DESIGN PREVIEW
          ===================================================================== */}
      {previewPost && (
        <div className="admin-subadmin-modal-overlay">
          <div
            className="admin-subadmin-modal-card"
            style={{ maxWidth: '960px', maxHeight: '92vh', backgroundColor: '#070b14' }}
          >
            {/* Preview Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-cyan">Public Article Preview</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  /blog/{previewPost.slug}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                ✕ Close Preview
              </button>
            </div>

            {/* Preview Body with Real Public Page Styles */}
            <div style={{ overflowY: 'auto', padding: '2.5rem 2rem' }}>
              <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                {/* Meta bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-cyan">{previewPost.category || 'Threat Intelligence'}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {formatSafeDate(previewPost.published_at || new Date())}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>&bull;</span>
                  <span style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                    {previewPost.read_time || '5 min read'}
                  </span>
                </div>

                {/* Title */}
                <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1c1949', lineHeight: '1.25', marginBottom: '1.5rem' }}>
                  {previewPost.title}
                </h1>

                {/* Author Pill */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 16px',
                    borderRadius: '99px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    marginBottom: '2rem',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewPost.author_avatar || '/logo.png'}
                    alt=""
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1949' }}>
                      {previewPost.author_name || 'DCS Cyber Threat Research Team'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#3a3fb8', fontWeight: 600 }}>
                      {previewPost.author_role || 'Principal Threat Intelligence Architect'}
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                {previewPost.featured_image && (
                  <div
                    style={{
                      width: '100%',
                      maxHeight: '440px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                      marginBottom: '2rem',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewPost.featured_image}
                      alt={previewPost.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Lead Excerpt */}
                {previewPost.excerpt && (
                  <div
                    style={{
                      fontSize: '1.18rem',
                      lineHeight: '1.75',
                      color: '#e2e8f0',
                      borderLeft: '4px solid var(--accent-cyan)',
                      padding: '1rem 1.5rem',
                      backgroundColor: 'rgba(0, 240, 255, 0.04)',
                      borderRadius: '0 8px 8px 0',
                      marginBottom: '2.5rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {previewPost.excerpt}
                  </div>
                )}

                {/* Rendered HTML Article Content */}
                <div
                  className="dcs-article-content"
                  dangerouslySetInnerHTML={{ __html: previewPost.content }}
                />

                {/* Tags */}
                {previewPost.tags && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Keywords:</span>
                    {previewPost.tags.split(',').map((t, idx) => (
                      <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.74rem' }}>
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
