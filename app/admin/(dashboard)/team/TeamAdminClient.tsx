'use client';

import React, { useState, useRef } from 'react';

interface TeamMember {
  _id?: string;
  name: string;
  designation: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  order_num: number;
}

export default function TeamAdminClient({ initialTeam }: { initialTeam: TeamMember[] }) {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const emptyForm: TeamMember = {
    name: '',
    designation: '',
    bio: '',
    photo: '',
    linkedin: 'https://linkedin.com',
    twitter: '',
    github: '',
    email: '',
    order_num: team.length + 1,
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'dcs_pakistan/team');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Upload failed');
      }

      setEditing({ ...editing, photo: data.url });
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setUploadError(err?.message || 'Failed to upload photo. Please check Cloudinary setup.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const saved = await res.json();
      if (res.ok) {
        if (editing._id) {
          setTeam(team.map((t) => (t._id === saved._id ? saved : t)));
        } else {
          setTeam([...team, saved]);
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
    if (!confirm('Are you sure you want to delete this team profile?')) return;
    const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTeam(team.filter((t) => t._id !== id));
      if (editing?._id === id) setEditing(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Company Roster</span>
          <h1>Manage <span className="text-gradient">Team Members</span></h1>
        </div>
        <button onClick={() => { setEditing(emptyForm); setUploadError(null); }} className="btn btn-primary">
          + Add Team Member
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editing._id ? 'Edit Team Member' : 'Add Team Member'}</h3>
            <button onClick={() => { setEditing(null); setUploadError(null); }} className="btn btn-outline" style={{ padding: '4px 10px' }}>
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            {/* Profile Photo Upload Section */}
            <div
              style={{
                padding: '1.25rem',
                marginBottom: '1.5rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1.5rem',
              }}
            >
              {/* Photo Avatar Preview */}
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                {editing.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={editing.photo}
                    alt={editing.name || 'Team member avatar'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                {uploading && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(10, 14, 26, 0.85)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    ...
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  >
                    {uploading ? 'Uploading to Cloudinary...' : editing.photo ? 'Change Photo' : 'Upload Photo'}
                  </button>

                  {editing.photo && (
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, photo: '' })}
                      className="btn btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  Supports JPG, PNG, WebP up to 5MB. Hosted securely on Cloudinary.
                </div>

                {uploadError && (
                  <div style={{ color: '#ff6b6b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                    ⚠️ {uploadError}
                  </div>
                )}

                {/* Direct image URL option */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Or Image URL:</span>
                  <input
                    type="url"
                    placeholder="https://res.cloudinary.com/..."
                    value={editing.photo || ''}
                    onChange={(e) => setEditing({ ...editing, photo: e.target.value })}
                    className="form-control"
                    style={{ padding: '4px 10px', fontSize: '0.82rem', height: '32px' }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Designation *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={editing.designation}
                  onChange={(e) => setEditing({ ...editing, designation: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Executive Bio *</label>
              <textarea
                className="form-control"
                rows={3}
                required
                value={editing.bio}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
              />
            </div>

            <div className="grid grid-3" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={editing.linkedin || ''}
                  onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editing.email || ''}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
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

            <button type="submit" disabled={loading || uploading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving Profile...' : 'Save Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Order</th>
              <th style={{ width: '70px' }}>Photo</th>
              <th>Member Name</th>
              <th>Designation</th>
              <th>Email</th>
              <th style={{ width: '140px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member._id}>
                <td>{member.order_num}</td>
                <td>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {member.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photo}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>👤</span>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{member.name}</td>
                <td style={{ color: 'var(--accent-cyan)' }}>{member.designation}</td>
                <td>{member.email || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => { setEditing(member); setUploadError(null); }}
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => member._id && handleDelete(member._id)}
                      className="btn btn-danger"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
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
