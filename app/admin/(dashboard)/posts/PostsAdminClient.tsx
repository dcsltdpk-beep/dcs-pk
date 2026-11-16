'use client';

import React, { useState } from 'react';

interface PostItem {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  tags?: string;
  excerpt: string;
  content: string;
  is_published: boolean;
}

export default function PostsAdminClient({ initialPosts }: { initialPosts: PostItem[] }) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [editing, setEditing] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm: PostItem = {
    title: '',
    slug: '',
    category: 'Company News',
    tags: '',
    excerpt: '',
    content: '<p>Write your detailed article or advisory here...</p>',
    is_published: true,
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const saved = await res.json();
      if (res.ok) {
        if (editing._id) {
          setPosts(posts.map((p) => (p._id === saved._id ? saved : p)));
        } else {
          setPosts([saved, ...posts]);
        }
        setEditing(null);
      }
    } catch (e) {
      console.error(e);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Advisories & News</span>
          <h1>Manage <span className="text-gradient">Blog Articles</span></h1>
        </div>
        <button onClick={() => setEditing(emptyForm)} className="btn btn-primary">
          + Create New Article
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editing._id ? 'Edit Article' : 'Create New Article'}</h3>
            <button onClick={() => setEditing(null)} className="btn btn-outline" style={{ padding: '4px 10px' }}>
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
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Cybersecurity Tips, Company News"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ransomware, zero-trust, cloud"
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
                  <option value="true">Published (Live)</option>
                  <option value="false">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Summary Excerpt *</label>
              <textarea
                className="form-control"
                rows={2}
                required
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full HTML Body Content *</label>
              <textarea
                className="form-control"
                rows={8}
                required
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
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
              <th>Article Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td style={{ fontWeight: 600 }}>{post.title}</td>
                <td><span className="badge badge-cyan">{post.category}</span></td>
                <td>
                  <span className={`badge ${post.is_published ? 'badge-cyan' : ''}`}>
                    {post.is_published ? 'Live' : 'Draft'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditing(post)}
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => post._id && handleDelete(post._id)}
                    className="btn btn-danger"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
