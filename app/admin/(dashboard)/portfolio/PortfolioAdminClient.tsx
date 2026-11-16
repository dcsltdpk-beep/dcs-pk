'use client';

import React, { useState } from 'react';

interface PortfolioItem {
  _id?: string;
  title: string;
  category: 'Video Editing' | 'Graphic Design' | 'Web Development' | 'AI Automation';
  client_name?: string;
  cover_image?: string;
  video_url?: string;
  description: string;
  order_num: number;
}

export default function PortfolioAdminClient({ initialItems }: { initialItems: PortfolioItem[] }) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm: PortfolioItem = {
    title: '',
    category: 'Web Development',
    client_name: '',
    cover_image: '',
    video_url: '',
    description: '',
    order_num: items.length + 1,
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const saved = await res.json();
      if (res.ok) {
        if (editing._id) {
          setItems(items.map((i) => (i._id === saved._id ? saved : i)));
        } else {
          setItems([...items, saved]);
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
    if (!confirm('Are you sure you want to delete this portfolio project?')) return;
    const res = await fetch(`/api/admin/portfolio?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems(items.filter((i) => i._id !== id));
      if (editing?._id === id) setEditing(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Case Studies</span>
          <h1>Manage <span className="text-gradient">Portfolio Work</span></h1>
        </div>
        <button onClick={() => setEditing(emptyForm)} className="btn btn-primary">
          + Add New Project
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editing._id ? 'Edit Project' : 'Add New Project'}</h3>
            <button onClick={() => setEditing(null)} className="btn btn-outline" style={{ padding: '4px 10px' }}>
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
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
                  <option value="Web Development">Web Development</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="AI Automation">AI Automation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editing.client_name}
                  onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Video Embed URL (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://www.youtube.com/embed/..."
                  value={editing.video_url}
                  onChange={(e) => setEditing({ ...editing, video_url: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Case Study Description *</label>
              <textarea
                className="form-control"
                rows={4}
                required
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving Project...' : 'Save Project'}
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
              <th>Project Title</th>
              <th>Category</th>
              <th>Client</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.order_num}</td>
                <td style={{ fontWeight: 600 }}>{item.title}</td>
                <td><span className="badge badge-cyan">{item.category}</span></td>
                <td>{item.client_name || '—'}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditing(item)}
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => item._id && handleDelete(item._id)}
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
