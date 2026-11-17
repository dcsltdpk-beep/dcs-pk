'use client';

import React, { useState } from 'react';
import Icon from '@/components/Icon';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface ContactClientProps {
  initialType: string;
  initialTarget: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  whatsappNumber: string;
}

export default function ContactClient({
  initialType,
  initialTarget,
  companyEmail,
  companyPhone,
  companyAddress,
  whatsappNumber,
}: ContactClientProps) {
  const [formData, setFormData] = useState({
    inquiry_type: initialType,
    target_name: initialTarget,
    name: '',
    email: '',
    phone: '',
    subject: initialTarget ? `Inquiry regarding: ${initialTarget}` : '',
    message: '',
    website_hp: '', // Honeypot
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit inquiry. Please try again.');
      } else {
        setSuccess(
          `Thank you, ${formData.name}! Your message has been recorded. Our team will contact you within 2-4 business hours.`
        );
        setFormData({
          inquiry_type: 'contact',
          target_name: '',
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          website_hp: '',
        });
      }
    } catch {
      setError('A network or server error occurred. Please message us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Connect With Us</span>
          <h1 className="section-title">
            Initiate a <span className="text-gradient">Security Consultation</span>
          </h1>
          <p className="section-desc">
            Whether inquiring about cyber assessments, bespoke software architecture, or academy training programs, our technical team is ready to assist.
          </p>
        </div>

        <div className="grid grid-2" style={{ alignItems: 'start', gap: '3rem' }}>
          {/* Left Column: Form */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Send Us a Message</h3>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Honeypot field (hidden from human users) */}
              <div style={{ display: 'none' }}>
                <input
                  type="text"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Inquiry Category *</label>
                  <select
                    className="form-control"
                    value={formData.inquiry_type}
                    onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                    required
                  >
                    <option value="contact">General Consultation</option>
                    <option value="course_inquiry">Academy Course Admission</option>
                    <option value="quote">Corporate RFP / Price Quote</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject / Target Program</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. AI Automation Course"
                    value={formData.target_name}
                    onChange={(e) => setFormData({ ...formData, target_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Business / Personal Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Contact Phone / WhatsApp</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+92 300 0000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject Heading</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message Details *</label>
                <textarea
                  className="form-control"
                  rows={5}
                  required
                  placeholder="Describe your requirements, timeline, or training inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
              >
                {loading ? 'Submitting Inquiry...' : 'Submit Confidential Inquiry'}
              </button>
            </form>
          </div>

          {/* Right Column: Direct Info */}
          <div>
            <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>Direct Communication Desk</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaWhatsapp size={24} /></span>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Instant WhatsApp Support</span>
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                      +{whatsappNumber}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--accent-orange, #FBAE44)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={22} /></span>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Call Line</span>
                    <a href={`tel:${companyPhone.replace(/\s+/g, '')}`} style={{ display: 'block', color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                      {companyPhone}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--accent-orange, #FBAE44)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={22} /></span>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inquiry Email</span>
                    <a href={`mailto:${companyEmail}`} style={{ display: 'block', color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                      {companyEmail}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: 'var(--accent-orange, #FBAE44)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '3px' }}><MapPin size={22} /></span>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Corporate Headquarters</span>
                    <span style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {companyAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Box */}
            <div className="card" style={{ padding: '1.75rem', borderLeft: '3px solid var(--accent-cyan)' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#fff' }}>SLA Commitment</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                All corporate security inquiries and academy admission requests are logged in our secure internal queue and responded to within <strong>2 to 4 business hours</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
