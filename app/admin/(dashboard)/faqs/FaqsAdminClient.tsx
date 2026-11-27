'use client';

import React, { useState } from 'react';
import { usePermissions } from '@/app/admin/AdminContext';

interface FaqItem {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  order_num: number;
}

export default function FaqsAdminClient({ initialFaqs }: { initialFaqs: FaqItem[] }) {
  const { canCreate, canEdit, canDelete } = usePermissions('faqs');
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm: FaqItem = {
    question: '',
    answer: '',
    category: 'General',
    order_num: faqs.length + 1,
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const saved = await res.json();
      if (res.ok) {
        if (editing._id) {
          setFaqs(faqs.map((f) => (f._id === saved._id ? saved : f)));
        } else {
          setFaqs([...faqs, saved]);
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
    if (!confirm('Are you sure you want to delete this FAQ entry?')) return;
    const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setFaqs(faqs.filter((f) => f._id !== id));
      if (editing?._id === id) setEditing(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Knowledge Base</span>
          <h1 style={{ color: '#1c1949', fontWeight: 800 }}>Manage Frequently Asked Questions</h1>
        </div>
        {canCreate && (
          <button onClick={() => setEditing(emptyForm)} className="btn btn-primary">
            + Add FAQ Entry
          </button>
        )}
      </div>

      {editing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1.5px solid #f9ac43', boxShadow: '0 10px 30px -10px rgba(28, 25, 73, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editing._id ? 'Edit FAQ' : 'Add FAQ Entry'}</h3>
            <button onClick={() => setEditing(null)} className="btn btn-outline" style={{ padding: '4px 10px' }}>
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Services">Services</option>
                  <option value="Academy">Academy</option>
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
            </div>

            <div className="form-group">
              <label className="form-label">Question Text *</label>
              <input
                type="text"
                className="form-control"
                required
                value={editing.question}
                onChange={(e) => setEditing({ ...editing, question: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Answer Text *</label>
              <textarea
                className="form-control"
                rows={4}
                required
                value={editing.answer}
                onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving FAQ...' : 'Save FAQ'}
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
              <th>Category</th>
              <th>Question</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq._id}>
                <td>{faq.order_num}</td>
                <td><span className="badge badge-cyan">{faq.category}</span></td>
                <td style={{ fontWeight: 600 }}>{faq.question}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  {canEdit && (
                    <button
                      onClick={() => setEditing(faq)}
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => faq._id && handleDelete(faq._id)}
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
