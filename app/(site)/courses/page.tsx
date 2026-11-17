import React from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { getCourses } from '@/lib/data';

export const metadata = {
  title: 'Training Academy | Dream Cyber Security Pakistan',
  description: 'Hands-on practical training programs in AI Automation, Enterprise Web Engineering, Graphic Design, and IT Basics.',
};

export const revalidate = 60;

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Practical IT Academy</span>
          <h1 className="section-title">
            Industry-Standard <span className="text-gradient">Training Programs</span>
          </h1>
          <p className="section-desc">
            Bridging technical theory with active industry mentorship. Designed to cultivate in-demand engineering competencies.
          </p>
        </div>

        {/* Informational Policy Notice */}
        <div
          className="card"
          style={{
            marginBottom: '3rem',
            borderLeft: '4px solid var(--accent-cyan)',
            background: 'rgba(251, 174, 68, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <span style={{ color: 'var(--accent-cyan)' }}><Icon name="info" size={24} /></span>
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            <strong>Showcase & Admissions Advisory:</strong> Our academy curriculum is published transparently for informational review. We do not conduct online e-commerce sales or take credit card payments. For batch dates, eligibility criteria, and corporate training, please submit an official inquiry or contact our desk on WhatsApp.
          </p>
        </div>

        <div className="grid grid-2">
          {courses.map((c) => (
            <div key={c.slug} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-cyan">Academy Program</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Icon name="clock" size={14} /> {c.duration}
                  </span>
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>{c.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  {c.overview}
                </p>
                <div style={{ borderLeft: '2px solid var(--accent-cyan)', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>Lead Instructor:</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {c.instructor_name} ({c.instructor_designation})
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link href={`/courses/${c.slug}`} className="btn btn-outline" style={{ flex: 1 }}>
                  View Full Syllabus
                </Link>
                <Link
                  href={`/contact?inquiry_type=course_inquiry&target=${encodeURIComponent(c.title)}`}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Inquire for Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
