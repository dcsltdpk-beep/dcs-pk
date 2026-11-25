'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function extractYoutubeId(urlOrId?: string): string {
  if (!urlOrId) return 'inWWhr5tnEA';
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:embed\/|v=|vi=|youtu\.be\/|\/v\/|watch\?v=)([\w-]{11})/);
  return match ? match[1] : 'inWWhr5tnEA';
}

/**
 * Hook to trigger reveal-on-scroll and count-up on [data-count]
 */
function useHomeScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const parent = target.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children).filter((c) =>
              c.classList.contains('rv')
            );
            const index = siblings.indexOf(target);
            target.style.transitionDelay = `${(index % 6) * 70}ms`;
          }
          target.classList.add('in');
          io.unobserve(target);

          target.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
            const end = parseFloat(el.dataset.count || '0');
            const em = el.querySelector('em')?.outerHTML || '';
            const t0 = performance.now();
            const frame = (now: number) => {
              const p = Math.min(1, (now - t0) / 1400);
              el.innerHTML = Math.round(end * (1 - Math.pow(1 - p, 3))) + em;
              if (p < 1) requestAnimationFrame(frame);
            };
            requestAnimationFrame(frame);
          });
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.rv').forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, []);
}

interface HomeWhoWeAreProps {
  settings?: any;
}

export function HomeWhoWeAre({ settings = {} }: HomeWhoWeAreProps) {
  useHomeScrollReveal();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const videoId = extractYoutubeId(settings.company_intro_video);

  return (
    <section className="section hm panel yellow on-yellow who">
      <div className="wrap panel-inner who-grid">
        <div className="rv">
          <span className="eyebrow" style={{ color: 'var(--navy-900)' }}>
            Who We Are
          </span>
          <h2 className="title">
            Pioneering cyber resilience &amp; <span className="mark">digital mastery</span>
          </h2>
          <p className="lead">
            Founded to deliver international-standard cyber defense, zero-trust architectures and
            software engineering to enterprises across Pakistan and the region — from our
            headquarters in Lahore.
          </p>
          <div className="pillars">
            <div className="pillar card">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                </svg>
              </span>
              <div>
                <b>Cyber Defense</b>
                <small>VAPT, SOC &amp; hardening</small>
              </div>
            </div>
            <div className="pillar card">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
                </svg>
              </span>
              <div>
                <b>Engineering</b>
                <small>Secure web, apps &amp; cloud</small>
              </div>
            </div>
            <div className="pillar card">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="8" width="16" height="12" rx="3" />
                  <path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2" />
                </svg>
              </span>
              <div>
                <b>AI Automation</b>
                <small>Agents &amp; workflows</small>
              </div>
            </div>
            <div className="pillar card">
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10 12 5 2 10l10 5 10-5z" />
                  <path d="M6 12v5c3 2 9 2 12 0v-5" />
                </svg>
              </span>
              <div>
                <b>Skill Academy</b>
                <small>Training local talent</small>
              </div>
            </div>
          </div>
          <div className="actions">
            <Link className="btn btn-blue" href="/about">
              Explore Our Story{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </Link>
            <Link className="btn btn-navy" href="/team">
              Meet the Team{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="video-wrap rv">
          <div
            className="video"
            id="introVideo"
            onClick={() => setIsPlayingVideo(true)}
            role="button"
            tabIndex={0}
            aria-label="Play corporate video"
          >
            {isPlayingVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Dream Cyber Security corporate video"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1400&q=80"
                  alt="Dream Cyber Security corporate video"
                />
                <span className="play">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 4v16l13-8z" />
                  </svg>
                </span>
              </>
            )}
          </div>
          <span className="vchip a">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>{' '}
            Strict NDA &amp; zero-leakage
          </span>
          <span className="vchip b">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>{' '}
            Reply in 2–4 business hours
          </span>
        </div>
      </div>
    </section>
  );
}

interface HomeLowerSectionsProps {
  settings?: any;
  courses?: any[];
  portfolio?: any[];
  posts?: any[];
}

export function HomeLowerSections({
  settings = {},
  courses = [],
  portfolio = [],
  posts = [],
}: HomeLowerSectionsProps) {
  useHomeScrollReveal();

  const whatsappNum = settings.whatsapp_number || '923165478855';

  // Fallback courses matching the 4 in template
  const fallbackCourses = [
    {
      title: 'AI Automation & Agents',
      tag: 'HOT',
      tagClass: 'hot',
      duration: '10 Weeks',
      summary: 'LLM workflows, AI agents and n8n automations for real businesses.',
      slug: 'ai-automation-chatbot-development',
      href: '/courses/ai-automation-chatbot-development',
    },
    {
      title: 'Enterprise Web Dev',
      tag: 'CAREER',
      tagClass: 'career',
      duration: '14 Weeks',
      summary: 'Full-stack React, Next.js and APIs with secure coding built in.',
      slug: 'web-design-development',
      href: '/courses/web-design-development',
    },
    {
      title: 'Video Editing & Design',
      tag: '',
      tagClass: '',
      duration: '8 Weeks',
      summary: 'Premiere Pro, After Effects and 3D for brands and social media.',
      slug: 'video-editing-motion-graphics',
      href: '/courses',
    },
    {
      title: 'Computer Basics & Office',
      tag: '',
      tagClass: '',
      duration: '6 Weeks',
      summary: 'Digital literacy, MS Office and cyber hygiene from zero.',
      slug: 'computer-basics',
      href: '/courses',
    },
  ];

  const displayCourses = courses && courses.length >= 4 ? courses.slice(0, 4) : fallbackCourses;

  // Fallback portfolio matching the 4 in template
  const fallbackWorks = [
    {
      badge: 'Web Development',
      client: 'GovTech Security Initiative',
      title: 'National Cyber Defense Portal',
      description:
        'Secure, high-traffic web portal with hardened authentication, role-based access control and real-time security alerts.',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
        </svg>
      ),
    },
    {
      badge: 'Video Editing',
      client: 'FinSecure Bank Ltd',
      title: 'Corporate Threat Explainer 3D Reel',
      description:
        '3D motion-graphics showreel explaining modern ransomware attack methods and prevention.',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="6" width="14" height="12" rx="2" />
          <path d="m16 10 6-3v10l-6-3" />
        </svg>
      ),
    },
    {
      badge: 'Graphic Design',
      client: 'Apex Cyber Defense',
      title: 'Zero-Trust Identity Brand Kit',
      description:
        'Corporate identity package: vector logo, typography, stationery and security badges.',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="13.5" cy="6.5" r="1" />
          <circle cx="17.5" cy="10.5" r="1" />
          <circle cx="8.5" cy="7.5" r="1" />
          <circle cx="6.5" cy="12.5" r="1" />
          <path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2A5.6 5.6 0 0 0 22 11 10 9.5 0 0 0 12 2z" />
        </svg>
      ),
    },
    {
      badge: 'AI Automation',
      client: 'Global Telecom Provider',
      title: 'Autonomous Lead & SOC Intake Bot',
      description:
        'Multi-channel AI agent that triages leads, onboards customers and logs incidents 24/7.',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="8" width="16" height="12" rx="3" />
          <path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2" />
        </svg>
      ),
    },
  ];

  // Fallback posts matching the 2 in template
  const fallbackPosts = [
    {
      category: 'Cybersecurity Tips',
      title: 'Top 5 Cybersecurity Essentials Every Business Must Implement in 2026',
      summary:
        'The critical controls and organisational hygiene that defend against ransomware and data exfiltration.',
      href: '/blog',
    },
    {
      category: 'Company News',
      title: 'Dream Cyber Security Expands Operations Across Pakistan',
      summary:
        'Expanding our enterprise cyber defense and technology consulting for growing Pakistani businesses.',
      href: '/blog',
    },
  ];

  const displayPosts =
    posts && posts.length > 0
      ? posts.slice(0, 2).map((p: any) => ({
          category: p.category || 'Threat Advisory',
          title: p.title,
          summary:
            p.excerpt ||
            p.meta_description ||
            'The critical controls and organisational hygiene that defend against modern cyber threats.',
          href: p.slug ? `/blog/${p.slug}` : '/blog',
        }))
      : fallbackPosts;

  return (
    <>
      {/* 4. HOW WE DELIVER */}
      <section className="section hm panel light">
        <div className="wrap panel-inner">
          <div className="center rv" style={{ marginBottom: '36px' }}>
            <span className="eyebrow">How We Deliver</span>
            <h2 className="title">
              From first call to <span className="mark">secure launch</span>
            </h2>
            <p className="lead">
              Whichever service you choose, every engagement follows the same security-first process.
            </p>
          </div>
          <div className="proc">
            <ol className="steps">
              <li className="step rv">
                <span className="n">01</span>
                <span className="ic gold">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-5-5" />
                  </svg>
                </span>
                <h3>Discover &amp; Assess</h3>
                <p>We audit your goals, systems and risk exposure to define a clear, measurable scope.</p>
              </li>
              <li className="step rv">
                <span className="n">02</span>
                <span className="ic gold">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.6 7.6" />
                  </svg>
                </span>
                <h3>Architect</h3>
                <p>Zero-trust architecture, UX and security controls designed and approved first.</p>
              </li>
              <li className="step rv">
                <span className="n">03</span>
                <span className="ic gold">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <h3>Build &amp; Harden</h3>
                <p>Agile sprints with peer review, vulnerability testing and secure coding.</p>
              </li>
              <li className="step rv">
                <span className="n">04</span>
                <span className="ic gold">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z" />
                  </svg>
                </span>
                <h3>Launch &amp; Defend</h3>
                <p>Deployment, monitoring and support so you stay fast, stable and protected.</p>
              </li>
            </ol>
            <aside className="pkg rv">
              <span className="lbl">✦ All-in-one solution</span>
              <h3>Business Startup Package</h3>
              <p>
                A complete launch suite for ambitious startups — branding, logo, website, socials and
                a promo video, secured from day one.
              </p>
              <div className="chips">
                <span>Branding</span>
                <span>Website</span>
                <span>SEO</span>
                <span>Security</span>
                <span>Promo Video</span>
              </div>
              <Link className="btn btn-gold" href="/contact?type=quote&service=startup-package">
                Get the Package{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* 5. DELIVERED WORK */}
      <section className="section hm panel light">
        <div className="wrap panel-inner">
          <div className="head rv">
            <div>
              <span className="eyebrow">Delivered Work</span>
              <h2 className="title">
                Proof, not <span className="mark">promises</span>
              </h2>
              <p className="lead">The same services, delivered for real enterprise clients.</p>
            </div>
            <Link className="btn btn-navy" href="/portfolio">
              View All Case Studies{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </Link>
          </div>
          <div className="works">
            {fallbackWorks.map((work, idx) => (
              <article key={idx} className="work rv">
                <div className="work-media">
                  <span className="glyph">{work.icon}</span>
                  <span className="badge">{work.badge}</span>
                </div>
                <div className="work-body">
                  <small>{work.client}</small>
                  <h3>{work.title}</h3>
                  <p>{work.description}</p>
                  <span className="ok">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 5 5 9-10" />
                    </svg>{' '}
                    Verified client engagement
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ACADEMY */}
      <section className="section hm panel yellow on-yellow">
        <div className="wrap panel-inner">
          <div className="head rv">
            <div>
              <span className="eyebrow" style={{ color: 'var(--navy-900)' }}>
                DCS Skill Academy
              </span>
              <h2 className="title">
                Learn the skills <span className="mark">we use on client work</span>
              </h2>
              <p className="lead">
                Practical, mentor-led programs taught by the engineers who deliver our services.
              </p>
            </div>
            <Link className="btn btn-navy" href="/courses">
              View All Programs{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </Link>
          </div>
          <div className="courses">
            {displayCourses.map((c: any, idx) => {
              const courseTitle = c.title || '';
              const courseDur = c.duration || '8 Weeks';
              const courseDesc =
                c.summary || c.overview || 'Practical technical training with real enterprise labs.';
              const courseSlug = c.slug || '';
              const isHot = idx === 0 || c.tag === 'HOT';
              const isCareer = idx === 1 || c.tag === 'CAREER';

              return (
                <article key={idx} className="course rv">
                  <div className="course-top">
                    <span className="ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {idx === 0 && (
                          <>
                            <rect x="4" y="8" width="16" height="12" rx="3" />
                            <path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2" />
                          </>
                        )}
                        {idx === 1 && (
                          <>
                            <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
                          </>
                        )}
                        {idx === 2 && (
                          <>
                            <rect x="2" y="6" width="14" height="12" rx="2" />
                            <path d="m16 10 6-3v10l-6-3" />
                          </>
                        )}
                        {idx >= 3 && (
                          <>
                            <rect x="2" y="4" width="20" height="13" rx="2" />
                            <path d="M8 21h8M12 17v4" />
                          </>
                        )}
                      </svg>
                    </span>
                    <span className="dur">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>{' '}
                      {courseDur}
                    </span>
                  </div>
                  <h3>
                    {courseTitle}{' '}
                    {isHot && <em className="hot">HOT</em>}
                    {isCareer && <em className="career">CAREER</em>}
                  </h3>
                  <p>{courseDesc}</p>
                  <div className="course-act">
                    <Link className="link" href={courseSlug ? `/courses/${courseSlug}` : '/courses'}>
                      Syllabus{' '}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M7 17 17 7M8 7h9v9" />
                      </svg>
                    </Link>
                    <Link
                      className="btn btn-blue sm"
                      href={`/contact?type=admission&course=${encodeURIComponent(courseSlug || courseTitle)}`}
                    >
                      Contact for Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="guarantee rv">
            <span className="ic gold">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
              </svg>
            </span>
            <div>
              <b>Learn &amp; Earn Guarantee</b>
              <span>
                Hands-on corporate labs, certified mentors, a verified diploma and direct internship
                access.
              </span>
            </div>
            <a
              className="btn btn-wa sm"
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                'Assalam o Alaikum, I want details about the next Academy batch.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
              </svg>{' '}
              Ask about next batch
            </a>
          </div>
        </div>
      </section>

      {/* 7. WHY PARTNER WITH US */}
      <section className="section hm panel light">
        <div className="wrap panel-inner">
          <div className="why rv">
            <div>
              <span className="eyebrow">Why Partner With Us</span>
              <h2 className="title">
                Built on trust, precision &amp; <span>security</span>
              </h2>
              <ul>
                <li>
                  <span className="ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <div>
                    <b>Absolute confidentiality</b>
                    <span>Strict NDAs, encrypted communications and zero-leakage protocols.</span>
                  </div>
                </li>
                <li>
                  <span className="ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                    </svg>
                  </span>
                  <div>
                    <b>Zero-trust by default</b>
                    <span>Every platform and automation is built with hardened defensive controls.</span>
                  </div>
                </li>
                <li>
                  <span className="ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
                    </svg>
                  </span>
                  <div>
                    <b>Engineering rigor</b>
                    <span>Multi-stage peer testing and vulnerability analysis on every release.</span>
                  </div>
                </li>
                <li>
                  <span className="ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
                    </svg>
                  </span>
                  <div>
                    <b>Direct access to engineers</b>
                    <span>Immediate escalation channels and transparent progress reports.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="wstats">
              <div>
                <b data-count="250">
                  0<em>+</em>
                </b>
                <span>Enterprise Projects</span>
              </div>
              <div>
                <b data-count="180">
                  0<em>+</em>
                </b>
                <span>Satisfied Clients</span>
              </div>
              <div>
                <b data-count="35">
                  0<em>+</em>
                </b>
                <span>Security &amp; Tech Experts</span>
              </div>
              <div>
                <b>2–4h</b>
                <span>Response SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. THREAT ADVISORIES & FAQ */}
      <section className="section hm panel light">
        <div className="wrap panel-inner ins">
          <div className="rv">
            <div className="head">
              <div>
                <span className="eyebrow">Threat Advisories &amp; News</span>
                <h2 className="title">
                  Latest <span className="mark">insights</span>
                </h2>
              </div>
              <Link className="link" href="/blog">
                All posts{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
            </div>
            <div className="list">
              {displayPosts.map((post, idx) => (
                <Link key={idx} className="post" href={post.href}>
                  <span className="ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8z" />
                    </svg>
                  </span>
                  <div>
                    <small>{post.category}</small>
                    <h3>{post.title}</h3>
                    <p>{post.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rv">
            <div className="head">
              <div>
                <span className="eyebrow">Knowledgebase</span>
                <h2 className="title">
                  Quick <span className="mark">answers</span>
                </h2>
              </div>
              <Link className="link" href="/faq">
                All FAQs{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
            </div>
            <div className="list">
              <details className="faq" open>
                <summary>
                  How quickly can your team respond?<i>+</i>
                </summary>
                <p>
                  Our team reviews every inquiry within 2–4 business hours. Urgent matters can go
                  through WhatsApp for faster help.
                </p>
              </details>
              <details className="faq">
                <summary>
                  What cybersecurity services do you provide?<i>+</i>
                </summary>
                <p>
                  VAPT, zero-trust hardening, ISO 27001 readiness, incident response and continuous
                  security audits for enterprises.
                </p>
              </details>
              <details className="faq">
                <summary>
                  Can we enroll in courses online?<i>+</i>
                </summary>
                <p>
                  The Academy section is for information only. For schedules or corporate training use
                  &ldquo;Contact for Details&rdquo; or WhatsApp.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="section hm panel light">
        <div className="wrap panel-inner">
          <div className="hm-cta on-yellow rv">
            <span className="lbl">Get in touch</span>
            <h2 className="title">
              Ready to fortify your enterprise &amp; <span className="mark">innovate with AI?</span>
            </h2>
            <p className="lead">
              Book a confidential cybersecurity evaluation, request a project proposal, or ask about
              the next Academy batch — our Lahore team replies within 2–4 business hours.
            </p>
            <div className="actions">
              <Link className="btn btn-blue" href="/contact?type=security_audit">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                </svg>{' '}
                Schedule Security Audit
              </Link>
              <Link className="btn btn-navy" href="/contact?type=quote">
                Request a Proposal{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
              <a
                className="btn btn-wa"
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                  'Hello Dream Cyber Security Pakistan, I would like to get in touch.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
                </svg>{' '}
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
