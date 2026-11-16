'use client';

import React, { useState } from 'react';

interface CourseItem {
  _id?: string;
  title: string;
  slug: string;
  duration: string;
  target_audience: string;
  overview: string;
  syllabus: string;
  what_you_will_learn: string;
  instructor_name: string;
  instructor_designation: string;
  instructor_bio: string;
  intro_video_url: string;
  order_num: number;
  status: 'active' | 'inactive';
}

export default function CoursesClient({ initialCourses }: { initialCourses: CourseItem[] }) {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [editing, setEditing] = useState<CourseItem | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm: CourseItem = {
    title: '',
    slug: '',
    duration: '10 Weeks',
    target_audience: '',
    overview: '',
    syllabus: '',
    what_you_will_learn: '',
    instructor_name: '',
    instructor_designation: '',
    instructor_bio: '',
    intro_video_url: '',
    order_num: courses.length + 1,
    status: 'active',
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const saved = await res.json();
      if (res.ok) {
        if (editing._id) {
          setCourses(courses.map((c) => (c._id === saved._id ? saved : c)));
        } else {
          setCourses([...courses, saved]);
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
    if (!confirm('Are you sure you want to delete this course program?')) return;
    const res = await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCourses(courses.filter((c) => c._id !== id));
      if (editing?._id === id) setEditing(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Academy Center</span>
          <h1>Manage <span className="text-gradient">Training Courses</span></h1>
        </div>
        <button onClick={() => setEditing(emptyForm)} className="btn btn-primary">
          + Add New Course
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editing._id ? 'Edit Course' : 'Add New Course'}</h3>
            <button onClick={() => setEditing(null)} className="btn btn-outline" style={{ padding: '4px 10px' }}>
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Course Title *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. 12 Weeks (Comprehensive)"
                  value={editing.duration}
                  onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-3" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Lead Instructor Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={editing.instructor_name}
                  onChange={(e) => setEditing({ ...editing, instructor_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Instructor Designation *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={editing.instructor_designation}
                  onChange={(e) => setEditing({ ...editing, instructor_designation: e.target.value })}
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

            <div className="form-group">
              <label className="form-label">Course Overview (Summary) *</label>
              <textarea
                className="form-control"
                rows={3}
                required
                value={editing.overview}
                onChange={(e) => setEditing({ ...editing, overview: e.target.value })}
              />
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Audience *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  required
                  value={editing.target_audience}
                  onChange={(e) => setEditing({ ...editing, target_audience: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Instructor Bio</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={editing.instructor_bio}
                  onChange={(e) => setEditing({ ...editing, instructor_bio: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Syllabus Modules (One module per line) *</label>
                <textarea
                  className="form-control"
                  rows={5}
                  required
                  value={editing.syllabus}
                  onChange={(e) => setEditing({ ...editing, syllabus: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">What You Will Learn (One point per line) *</label>
                <textarea
                  className="form-control"
                  rows={5}
                  required
                  value={editing.what_you_will_learn}
                  onChange={(e) => setEditing({ ...editing, what_you_will_learn: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Intro Video Embed URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://www.youtube.com/embed/..."
                value={editing.intro_video_url}
                onChange={(e) => setEditing({ ...editing, intro_video_url: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving Course...' : 'Save Course Program'}
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
              <th>Program Title</th>
              <th>Duration</th>
              <th>Lead Instructor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id}>
                <td>{c.order_num}</td>
                <td style={{ fontWeight: 600 }}>{c.title}</td>
                <td>{c.duration}</td>
                <td>{c.instructor_name}</td>
                <td>
                  <span className={`badge ${c.status === 'active' ? 'badge-cyan' : ''}`}>
                    {c.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditing(c)}
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => c._id && handleDelete(c._id)}
                    className="btn btn-danger"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
