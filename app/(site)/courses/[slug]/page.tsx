import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import { getCourseBySlug, getCourses, getSettings } from '@/lib/data';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const course = await getCourseBySlug(params.slug);
  if (!course) return { title: 'Course Not Found | Dream Cyber Security' };
  return {
    title: `${course.title} - Academy Training | Dream Cyber Security Pakistan`,
    description: course.overview,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const [course, settings] = await Promise.all([
    getCourseBySlug(params.slug),
    getSettings(),
  ]);

  if (!course) {
    notFound();
  }
  const whatsappNum = settings.whatsapp_number || '923001234567';
  const whatsappMsg = encodeURIComponent(`Hello Dream Cyber Security, I would like to inquire about ${course.title} training.`);

  const syllabusModules = course.syllabus
    ? course.syllabus.split('\n').map((m: string) => m.trim()).filter((m: string) => m.length > 0)
    : [];

  const learningPoints = course.what_you_will_learn
    ? course.what_you_will_learn.split('\n').map((p: string) => p.trim()).filter((p: string) => p.length > 0)
    : [];

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/courses" style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>
            &larr; Back to All Courses
          </Link>
        </div>

        <div className="grid grid-2" style={{ alignItems: 'start', gap: '3rem' }}>
          {/* Left Column: Details & Syllabus */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <span className="badge badge-cyan">Academy Course</span>
              <span style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Icon name="clock" size={15} /> Duration: {course.duration}
              </span>
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>{course.title}</h1>

            <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem', whiteSpace: 'pre-line' }}>
              {course.overview}
            </div>

            {/* Intro Video */}
            {course.intro_video_url && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Course Introduction Video</h3>
                <div className="video-responsive">
                  <iframe src={course.intro_video_url} title={`${course.title} Preview`} allowFullScreen loading="lazy"></iframe>
                </div>
              </div>
            )}

            {/* Syllabus */}
            {syllabusModules.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>Detailed Course Syllabus</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {syllabusModules.map((mod: string, idx: number) => (
                    <div key={idx} className="card" style={{ padding: '1rem 1.25rem', borderLeft: '3px solid var(--accent-cyan)' }}>
                      <span style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600 }}>
                        {mod}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Audience */}
            {course.target_audience && (
              <div className="card" style={{ marginBottom: '3rem', borderLeft: '3px solid var(--accent-blue)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#fff' }}>Who Should Attend This Program?</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {course.target_audience}
                </p>
              </div>
            )}

            {/* What you will learn */}
            {learningPoints.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>What You Will Master</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {learningPoints.map((pt: string, idx: number) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: 'var(--accent-cyan)' }}><Icon name="check" size={16} /></span>
                      <span style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor Card */}
            <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                <Icon name="user" size={30} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.15rem' }}>{course.instructor_name}</h4>
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, margin: '2px 0 6px 0' }}>
                  {course.instructor_designation}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                  {course.instructor_bio}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Lead Box */}
          <div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Inquire About Next Batch</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Request upcoming batch schedules, offline/online attendance options, and enrollment prerequisites.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link
                  href={`/contact?inquiry_type=course_inquiry&target=${encodeURIComponent(course.title)}`}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Submit Admission Inquiry
                </Link>

                <a
                  href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%' }}
                >
                  <Icon name="whatsapp" size={18} /> Inquire via WhatsApp
                </a>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Program Features</h4>
                <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>✓ Live Practical Lab Environments</li>
                  <li>✓ Active Industry Mentorship</li>
                  <li>✓ Capstone Portfolio Projects</li>
                  <li>✓ Certificate of Verified Competence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
