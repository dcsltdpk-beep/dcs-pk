'use client';

import React, { useState } from 'react';
import Icon from '@/components/Icon';
import { usePermissions } from '@/app/admin/AdminContext';

interface ServiceItem {
  _id?: string;
  title: string;
  slug: string;
  icon: string;
  summary: string;
  description: string;
  features: string;
  benefits: string;
  order_num: number;
  status: 'active' | 'inactive';
}

export default function ServicesClient({ initialServices }: { initialServices: ServiceItem[] }) {
  const { canCreate, canEdit, canDelete } = usePermissions('services');
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm: ServiceItem = {
    title: '',
    slug: '',
    icon: 'shield',
    summary: '',
    description: '',
    features: '',
    benefits: '',
    order_num: services.length + 1,
    status: 'active',
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const saved = await res.json();
      if (res.ok) {
        if (editing._id) {
          setServices(services.map((s) => (s._id === saved._id ? saved : s)));
        } else {
          setServices([...services, saved]);
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
    if (!confirm('Are you sure you want to delete this service?')) return;
    const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setServices(services.filter((s) => s._id !== id));
      if (editing?._id === id) setEditing(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Catalog Management</span>
          <h1 style={{ color: '#1c1949', fontWeight: 800 }}>Manage Core Services</h1>
        </div>
        {canCreate && (
          <button onClick={() => setEditing(emptyForm)} className="btn btn-primary">
            + Add New Service
          </button>
        )}
      </div>

      {/* Editor Modal / Card */}
      {editing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1.5px solid #f9ac43', boxShadow: '0 10px 30px -10px rgba(28, 25, 73, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editing._id ? 'Edit Service' : 'Add New Service'}</h3>
            <button onClick={() => setEditing(null)} className="btn btn-outline" style={{ padding: '4px 10px' }}>
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Service Title *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug (leave blank to auto-generate)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-3" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Icon Name</label>
                <select
                  className="form-control"
                  value={editing.icon}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                >
                  <option value="shield">shield</option>
                  <option value="shield-lock">shield-lock</option>
                  <option value="globe">globe</option>
                  <option value="shopping-cart">shopping-cart</option>
                  <option value="video">video</option>
                  <option value="palette">palette</option>
                  <option value="cpu">cpu</option>
                  <option value="trending-up">trending-up</option>
                  <option value="share-2">share-2</option>
                  <option value="code">code</option>
                  <option value="server">server</option>
                </select>
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

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Summary (Short card description) *</label>
              <textarea
                className="form-control"
                rows={2}
                required
                value={editing.summary}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Technical Description *</label>
              <textarea
                className="form-control"
                rows={4}
                required
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Key Features (One feature per line)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editing.features}
                  onChange={(e) => setEditing({ ...editing, features: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Strategic Business Benefits</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editing.benefits}
                  onChange={(e) => setEditing({ ...editing, benefits: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving Service...' : 'Save Service'}
            </button>
          </form>
        </div>
      )}

      {/* Services Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Icon</th>
              <th>Service Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((srv) => (
              <tr key={srv._id}>
                <td>{srv.order_num}</td>
                <td>
                  <span style={{ color: 'var(--accent-cyan)' }}>
                    <Icon name={srv.icon} size={20} />
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{srv.title}</td>
                <td style={{ color: 'var(--text-muted)' }}>{srv.slug}</td>
                <td>
                  <span className={`badge ${srv.status === 'active' ? 'badge-cyan' : ''}`}>
                    {srv.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  {canEdit && (
                    <button
                      onClick={() => setEditing(srv)}
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => srv._id && handleDelete(srv._id)}
                      className="btn btn-danger"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      Delete
                    </button>
                  )}
                  {!canEdit && !canDelete && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>View Only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
