import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Icon from '@/components/Icon';
import { getTeam, getTeamMemberBySlug, getSettings } from '@/lib/data';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const team = await getTeam();
  return team.map((m: any) => ({ slug: m.slug || m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = await getTeamMemberBySlug(params.slug);
  if (!member) return { title: 'Team Member Not Found | Dream Cyber Security' };
  return {
    title: `${member.name} — ${member.designation} | Dream Cyber Security Pakistan`,
    description: member.bio,
    openGraph: {
      title: `${member.name} | Dream Cyber Security Pakistan`,
      description: member.bio,
      images: member.photo ? [{ url: member.photo }] : [],
    },
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const [member, settings] = await Promise.all([
    getTeamMemberBySlug(params.slug),
    getSettings(),
  ]);

  if (!member) notFound();

  const whatsappNum = settings.whatsapp_number || '923001234567';
  const whatsappMsg = encodeURIComponent(
    `Hello Dream Cyber Security, I would like to connect with ${member.name} (${member.designation}).`
  );

  const baseUrl = 'https://www.dreamcybersecurity.pk';
  const memberUrl = `${baseUrl}/team/${member.slug}`;

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        {/* Back link */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/team" style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>
            &larr; Back to Team
          </Link>
        </div>

        <div className="grid grid-2" style={{ alignItems: 'start', gap: '3rem' }}>
          {/* Left: Profile Card */}
          <div>
            {/* Avatar */}
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '16px',
                background: 'var(--bg-secondary)',
                border: '2px solid var(--accent-cyan)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 240, 255, 0.2)',
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
                <Icon name="user" size={64} />
              )}
            </div>

            <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
              Team Member
            </span>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>{member.name}</h1>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              {member.designation}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              {member.bio}
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '2rem' }}>
              {member.linkedin && member.linkedin !== 'https://linkedin.com' && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '0.88rem' }}
                >
                  <Icon name="briefcase" size={15} /> LinkedIn
                </a>
              )}
              {member.twitter && member.twitter !== 'https://twitter.com' && (
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '0.88rem' }}
                >
                  <Icon name="share-2" size={15} /> Twitter / X
                </a>
              )}
              {member.github && member.github !== 'https://github.com' && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '0.88rem' }}
                >
                  <Icon name="code" size={15} /> GitHub
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '0.88rem' }}
                >
                  <Icon name="mail" size={15} /> Email
                </a>
              )}
              <a
                href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '0.88rem' }}
              >
                <Icon name="whatsapp" size={15} /> WhatsApp
              </a>
            </div>

            {/* Page URL chip */}
            {/* <div
              style={{
                padding: '8px 14px',
                background: 'rgba(0,240,255,0.06)',
                borderRadius: '8px',
                border: '1px solid rgba(0,240,255,0.15)',
                fontSize: '0.78rem',
                color: 'var(--accent-cyan)',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}
            >
              🔗 {memberUrl}
            </div> */}
          </div>

          {/* Right: QR Code (server-rendered via API route) */}
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '2.5rem',
              border: '1px solid var(--border-color)',
            }}
          >
            <span className="badge badge-cyan" style={{ marginBottom: '1rem' }}>
              QR Code — Scan to Visit Profile
            </span>
            <h3 style={{ marginBottom: '0.5rem' }}>{member.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              {member.designation}
            </p>

            {/* QR image served by /api/team/qr/[slug] */}
            <div
              style={{
                background: '#fff',
                padding: '12px',
                borderRadius: '12px',
                display: 'inline-block',
                boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
                marginBottom: '1.25rem',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/team/qr/${member.slug}`}
                alt={`QR Code for ${member.name}`}
                width={220}
                height={220}
                style={{ display: 'block', imageRendering: 'pixelated' }}
              />
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Scan this QR code to open <strong>{member.name}</strong>&apos;s public profile page directly.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`/api/team/qr/${member.slug}?download=1`}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                📥 Download QR
              </a>
              <Link href="/team" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                View Full Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
