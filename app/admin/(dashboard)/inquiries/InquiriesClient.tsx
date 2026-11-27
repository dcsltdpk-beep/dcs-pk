'use client';

import React, { useState } from 'react';
import Icon from '@/components/Icon';
import { usePermissions } from '@/app/admin/AdminContext';

interface Inquiry {
  _id: string;
  type: string;
  target_name?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function InquiriesClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const { canEdit, canDelete } = usePermissions('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries(inquiries.map((i) => (i._id === id ? { ...i, status } : i)));
        if (selected && selected._id === id) {
          setSelected({ ...selected, status });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead record?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries(inquiries.filter((i) => i._id !== id));
        if (selected?._id === id) setSelected(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Leads Center</span>
          <h1 style={{ color: '#1c1949', fontWeight: 800 }}>Inquiries & Leads Inbox</h1>
        </div>
        <div>
          <a
            href="/api/admin/inquiries?action=export"
            download
            className="btn btn-outline"
            style={{ fontSize: '0.88rem' }}
          >
            Export All to CSV (Excel)
          </a>
        </div>
      </div>

      {/* Detail Modal / Drawer if selected */}
      {selected && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: '1.5px solid #f9ac43', boxShadow: '0 10px 30px -10px rgba(28, 25, 73, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>{selected.type}</span>
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#1c1949', fontWeight: 800 }}>{selected.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }} suppressHydrationWarning>
                {selected.email} {selected.phone && `• ${selected.phone}`} • Received: {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
            <button onClick={() => setSelected(null)} className="btn btn-outline" style={{ padding: '4px 10px' }}>
              ✕ Close
            </button>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#1c1949', marginBottom: '0.5rem', fontWeight: 700 }}>
              Target: {selected.target_name || selected.subject || 'General Consultation'}
            </h4>
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>
              {selected.message}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {canEdit && selected.status !== 'read' && (
              <button onClick={() => handleUpdateStatus(selected._id, 'read')} className="btn btn-outline">
                Mark as Read
              </button>
            )}
            {canEdit && selected.status !== 'responded' && (
              <button onClick={() => handleUpdateStatus(selected._id, 'responded')} className="btn btn-primary">
                Mark as Responded
              </button>
            )}
            <a href={`mailto:${selected.email}?subject=RE: ${selected.subject || 'Inquiry'}`} className="btn btn-outline">
              Reply via Email
            </a>
            {selected.phone && (
              <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <Icon name="whatsapp" size={16} /> WhatsApp Client
              </a>
            )}
            {canDelete && (
              <button onClick={() => handleDelete(selected._id)} className="btn btn-danger" style={{ marginLeft: 'auto' }}>
                Delete Lead
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Client Name</th>
              <th>Contact Email & Phone</th>
              <th>Target / Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id}>
                <td suppressHydrationWarning>{new Date(inq.createdAt).toLocaleDateString()}</td>
                <td><span className="badge badge-cyan">{inq.type}</span></td>
                <td style={{ fontWeight: 600 }}>{inq.name}</td>
                <td>
                  <div>{inq.email}</div>
                  {inq.phone && <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{inq.phone}</div>}
                </td>
                <td>{inq.target_name || inq.subject || 'General'}</td>
                <td>
                  <span className={`badge ${inq.status === 'unread' ? 'badge-cyan' : ''}`}>
                    {inq.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setSelected(inq)}
                    className="btn btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                  >
                    View
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(inq._id)}
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                  No inquiries in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
