import React from 'react';
import Icon from '@/components/Icon';
import { getTeam } from '@/lib/data';

export const metadata = {
  title: 'Our Team & Leadership | Dream Cyber Security Pakistan',
  description: 'Meet the executive leadership, principal cybersecurity researchers, and technical trainers behind Dream Cyber Security.',
};

export const revalidate = 60;

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Leadership & Engineers</span>
          <h1 className="section-title">
            Meet Our <span className="text-gradient">Specialist Team</span>
          </h1>
          <p className="section-desc">
            A cohesive squad of certified security researchers, full-stack software architects, and AI automation practitioners dedicated to your defense.
          </p>
        </div>

        <div className="grid grid-2">
          {team.map((member) => (
            <div key={member._id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '75px',
                  height: '75px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  flexShrink: 0,
                }}
              >
                <Icon name="user" size={36} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{member.name}</h3>
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.85rem' }}>
                  {member.designation}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  {member.bio}
                </p>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                      LinkedIn
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                      Twitter
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                      GitHub
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
