'use client';

import React, { useState } from 'react';

interface VideoItem {
  _id?: string;
  title: string;
  category:
    | 'Company Videos'
    | 'Course Introduction Videos'
    | 'Student Projects and Work'
    | 'Tutorials and Educational Videos';
  video_type: 'embed' | 'upload';
  video_source: string;
  description?: string;
  order_num: number;
}

export default function VideosAdminClient({ initialVideos }: { initialVideos: VideoItem[] }) {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm: VideoItem = {
    title: '',
    category: 'Company Videos',
    video_type: 'embed',
    video_source: '',
    description: '',
    order_num: videos.length + 1,
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const saved = await res.json();
      if (res.ok) {
        if (editing._id) {
          setVideos(videos.map((v) => (v._id === saved._id ? saved : v)));
        } else {
          setVideos([...videos, saved]);
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
    if (!confirm('Are you sure you want to delete this video?')) return;
    const res = await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setVideos(videos.filter((v) => v._id !== id));
      if (editing?._id === id) setEditing(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Media Gallery</span>
          <h1>Manage <span className="text-gradient">Video Content</span></h1>
        </div>
        <button onClick={() => setEditing(emptyForm)} className="btn btn-primary">
          + Add New Video
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editing._id ? 'Edit Video' : 'Add New Video'}</h3>
            <button onClick={() => setEditing(null)} className="btn btn-outline" style={{ padding: '4px 10px' }}>
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Video Title *</label>
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
                <select
                  className="form-control"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as any })}
                >
                  <option value="Company Videos">Company Videos</option>
                  <option value="Course Introduction Videos">Course Introduction Videos</option>
                  <option value="Student Projects and Work">Student Projects and Work</option>
                  <option value="Tutorials and Educational Videos">Tutorials and Educational Videos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Video Embed URL (YouTube/Vimeo) *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={editing.video_source}
                  onChange={(e) => setEditing({ ...editing, video_source: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={editing.order_num}
                  onChange={(e) => setEditing({ ...editing, order_num: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving Video...' : 'Save Video'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Video Title</th>
              <th>Category</th>
              <th>Source / Embed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((vid) => (
              <tr key={vid._id}>
                <td>{vid.order_num}</td>
                <td style={{ fontWeight: 600 }}>{vid.title}</td>
                <td><span className="badge badge-cyan">{vid.category}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{vid.video_source}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditing(vid)}
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => vid._id && handleDelete(vid._id)}
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
