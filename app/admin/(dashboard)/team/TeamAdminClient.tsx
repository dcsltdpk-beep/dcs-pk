'use client';

import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

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

  // QR Code Generation State
  const [qrMember, setQrMember] = useState<TeamMember | null>(null);
  const [qrType, setQrType] = useState<'vcard' | 'url'>('vcard');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

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

  // Generate QR Code whenever qrMember or qrType changes
  useEffect(() => {
    if (!qrMember) {
      setQrDataUrl('');
      return;
    }

    let payload = '';
    if (qrType === 'vcard') {
      payload = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${qrMember.name}`,
        `N:${qrMember.name};;;;`,
        'ORG:Dream Cyber Security Pakistan',
        `TITLE:${qrMember.designation}`,
        qrMember.email ? `EMAIL;TYPE=INTERNET,WORK:${qrMember.email}` : '',
        qrMember.linkedin ? `URL:${qrMember.linkedin}` : 'URL:https://www.dreamcybersecurity.pk/team',
        qrMember.bio ? `NOTE:${qrMember.bio.replace(/(\r\n|\n|\r)/gm, ' ')}` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');
    } else {
      payload = qrMember.linkedin || 'https://www.dreamcybersecurity.pk/team';
    }

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#050711',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [qrMember, qrType]);

  const handleDownloadQr = () => {
    if (!qrDataUrl || !qrMember) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_${qrMember.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_dcs.png`;
    link.click();
  };

  const handleCopyText = () => {
    if (!qrMember) return;
    const text = qrType === 'vcard'
      ? `${qrMember.name}\n${qrMember.designation}\nDream Cyber Security Pakistan\nEmail: ${qrMember.email || 'dcsltd.pk@gmail.com'}\n${qrMember.linkedin || ''}`
      : (qrMember.linkedin || 'https://www.dreamcybersecurity.pk/team');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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

                  {editing.name && (
                    <button
                      type="button"
                      onClick={() => setQrMember(editing)}
                      className="btn btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.85rem', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                    >
                      📱 Generate QR Code
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
      <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '680px' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Order</th>
              <th style={{ width: '70px' }}>Photo</th>
              <th>Member Name</th>
              <th>Designation</th>
              <th>Email</th>
              <th style={{ width: '210px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member._id}>
                <td>{member.order_num}</td>
                <td>
                  <div
                    onClick={() => setQrMember(member)}
                    title="Click to view QR code"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'var(--bg-secondary)',
                      border: '2px solid var(--border-color)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'border-color 0.2s ease',
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
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>👤</span>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{member.name}</td>
                <td style={{ color: 'var(--accent-cyan)' }}>{member.designation}</td>
                <td>{member.email || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setQrMember(member)}
                      className="btn btn-outline"
                      title="Generate Scannable QR Code / vCard"
                      style={{ padding: '3px 8px', fontSize: '0.78rem', color: 'var(--accent-cyan)', borderColor: 'rgba(0, 240, 255, 0.4)' }}
                    >
                      📱 QR Code
                    </button>
                    <button
                      onClick={() => { setEditing(member); setUploadError(null); }}
                      className="btn btn-outline"
                      style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => member._id && handleDelete(member._id)}
                      className="btn btn-danger"
                      style={{ padding: '3px 8px', fontSize: '0.78rem' }}
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

      {/* ================================================================== */}
      {/* TEAM MEMBER QR CODE MODAL POPUP (COMPACT & SCREEN-FITTED) */}
      {/* ================================================================== */}
      {qrMember && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 18, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflowY: 'auto',
          }}
          onClick={() => setQrMember(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '380px',
              width: '100%',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              padding: '1.25rem',
              borderRadius: '16px',
              border: '1px solid var(--accent-cyan)',
              background: '#0d1124',
              boxShadow: '0 16px 40px rgba(0, 240, 255, 0.2)',
              position: 'relative',
              textAlign: 'center',
              margin: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setQrMember(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#fff',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {/* Header: Avatar + Name + Designation in a neat row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                paddingRight: '28px',
                marginBottom: '0.85rem',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--accent-cyan)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0, 240, 255, 0.3)',
                }}
              >
                {qrMember.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrMember.photo}
                    alt={qrMember.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '1.2rem' }}>👤</span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    margin: '0 0 2px 0',
                    fontSize: '1rem',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {qrMember.name}
                </h4>
                <div
                  style={{
                    color: 'var(--accent-cyan)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {qrMember.designation}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Dream Cyber Security
                </div>
              </div>
            </div>

            {/* Switcher Pills */}
            <div
              style={{
                display: 'inline-flex',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '3px',
                borderRadius: '6px',
                marginBottom: '0.75rem',
                border: '1px solid var(--border-color)',
              }}
            >
              <button
                type="button"
                onClick={() => setQrType('vcard')}
                style={{
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  background: qrType === 'vcard' ? 'var(--accent-cyan)' : 'transparent',
                  color: qrType === 'vcard' ? '#0a0e1a' : 'var(--text-muted)',
                  fontWeight: qrType === 'vcard' ? 700 : 500,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                📇 vCard (Save Contact)
              </button>
              <button
                type="button"
                onClick={() => setQrType('url')}
                style={{
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  background: qrType === 'url' ? 'var(--accent-cyan)' : 'transparent',
                  color: qrType === 'url' ? '#0a0e1a' : 'var(--text-muted)',
                  fontWeight: qrType === 'url' ? 700 : 500,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                🌐 Profile Link
              </button>
            </div>

            {/* QR Code Canvas */}
            <div
              style={{
                background: '#ffffff',
                padding: '8px',
                borderRadius: '10px',
                display: 'inline-block',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                marginBottom: '0.65rem',
              }}
            >
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${qrMember.name}`}
                  style={{ width: '150px', height: '150px', display: 'block' }}
                />
              ) : (
                <div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.75rem' }}>
                  Generating QR...
                </div>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: '0 0 0.85rem 0', lineHeight: '1.3' }}>
              {qrType === 'vcard'
                ? '📱 Scan with smartphone camera to instantly save to contacts.'
                : '🌐 Scan to open official team profile.'}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={handleDownloadQr}
                className="btn btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                📥 Download PNG
              </button>
              <button
                onClick={handleCopyText}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button
                onClick={() => setQrMember(null)}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
