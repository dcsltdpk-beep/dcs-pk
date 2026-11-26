import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Inquiry } from '@/lib/models/Inquiry';
import { Service } from '@/lib/models/Service';
import { Course } from '@/lib/models/Course';
import { Team } from '@/lib/models/Team';
import { Portfolio } from '@/lib/models/Portfolio';
import { Video } from '@/lib/models/Video';
import { Post } from '@/lib/models/Post';
import { Faq } from '@/lib/models/Faq';
import { User } from '@/lib/models/User';
import { hasModuleAccess } from '@/lib/rbac';
import Icon from '@/components/Icon';

export const revalidate = 0; // dynamic dashboard

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: { error?: string; module?: string };
}) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  await connectDB();

  // Conditionally query metrics based on the admin's granular module permissions
  const canInquiries = hasModuleAccess(admin, 'inquiries');
  const canServices = hasModuleAccess(admin, 'services');
  const canCourses = hasModuleAccess(admin, 'courses');
  const canTeam = hasModuleAccess(admin, 'team');
  const canPortfolio = hasModuleAccess(admin, 'portfolio');
  const canVideos = hasModuleAccess(admin, 'videos');
  const canPosts = hasModuleAccess(admin, 'posts');
  const canFaqs = hasModuleAccess(admin, 'faqs');
  const isSuper = admin.isSuperAdmin;

  const [
    totalInquiries,
    unreadInquiries,
    countServices,
    countCourses,
    countTeam,
    countPortfolio,
    countVideos,
    countPosts,
    countFaqs,
    countSubAdmins,
    latestInquiries,
  ] = await Promise.all([
    canInquiries ? Inquiry.countDocuments() : Promise.resolve(0),
    canInquiries ? Inquiry.countDocuments({ status: 'unread' }) : Promise.resolve(0),
    canServices ? Service.countDocuments() : Promise.resolve(0),
    canCourses ? Course.countDocuments() : Promise.resolve(0),
    canTeam ? Team.countDocuments() : Promise.resolve(0),
    canPortfolio ? Portfolio.countDocuments() : Promise.resolve(0),
    canVideos ? Video.countDocuments() : Promise.resolve(0),
    canPosts ? Post.countDocuments() : Promise.resolve(0),
    canFaqs ? Faq.countDocuments() : Promise.resolve(0),
    isSuper ? User.countDocuments() : Promise.resolve(0),
    canInquiries ? Inquiry.find().sort({ createdAt: -1 }).limit(5).lean() : Promise.resolve([]),
  ]);

  return (
    <div>
      {/* Access Denied Warning Banner */}
      {searchParams?.error === 'superadmin_required' && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid #ef4444',
            color: '#f87171',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Icon name="alert-triangle" size={20} />
          <div>
            <strong>Restricted Interface:</strong> Sub-Admin Management and Role Assignment requires
            Super Administrator privileges.
          </div>
        </div>
      )}

      {searchParams?.error === 'access_denied' && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid #ef4444',
            color: '#f87171',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Icon name="alert-triangle" size={20} />
          <div>
            <strong>Access Denied:</strong> Your administrative account does not have permission to
            access the <strong>{searchParams.module || 'requested'}</strong> module. Contact your
            Super Administrator to request access.
          </div>
        </div>
      )}

      {/* Greeting Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <span className="badge badge-cyan">Control Center</span>
          <span
            style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: admin.isSuperAdmin
                ? 'rgba(192, 132, 252, 0.15)'
                : 'rgba(0, 245, 255, 0.12)',
              color: admin.isSuperAdmin ? '#c084fc' : 'var(--accent-cyan)',
              border: `1px solid ${
                admin.isSuperAdmin ? 'rgba(192, 132, 252, 0.3)' : 'rgba(0, 245, 255, 0.3)'
              }`,
              fontWeight: 600,
            }}
          >
            {admin.isSuperAdmin ? 'Super Administrator' : 'Sub-Administrator'}
          </span>
        </div>
        <h1>
          Welcome, <span className="text-gradient">{admin.name || admin.username}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          {admin.isSuperAdmin
            ? 'Complete administrative authority over corporate services, academy training, lead funnels, and sub-admin accounts.'
            : 'Access granted to your assigned website operational modules and workflows.'}
        </p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
        {isSuper && (
          <div className="card" style={{ borderColor: 'rgba(192, 132, 252, 0.3)' }}>
            <span style={{ color: '#c084fc', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Staff & Sub-Admins
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c084fc', marginTop: '0.25rem' }}>
              {countSubAdmins}
            </div>
            <Link
              href="/admin/sub-admins"
              style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem', color: '#c084fc' }}
            >
              Manage RBAC &rarr;
            </Link>
          </div>
        )}

        {canInquiries && (
          <div className="card">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Unread Inquiries
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold, #FBAE44)', marginTop: '0.25rem' }}>
              {unreadInquiries} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {totalInquiries} total</span>
            </div>
            <Link
              href="/admin/inquiries"
              style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}
            >
              View Inbox &rarr;
            </Link>
          </div>
        )}

        {canServices && (
          <div className="card">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Core Services
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {countServices}
            </div>
            <Link
              href="/admin/services"
              style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}
            >
              Manage Services &rarr;
            </Link>
          </div>
        )}

        {canCourses && (
          <div className="card">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Academy Courses
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {countCourses}
            </div>
            <Link
              href="/admin/courses"
              style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}
            >
              Manage Courses &rarr;
            </Link>
          </div>
        )}

        {canTeam && (
          <div className="card">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Team Profiles
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {countTeam}
            </div>
            <Link
              href="/admin/team"
              style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}
            >
              Manage Team &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Secondary Stats Grid */}
      {(canPortfolio || canVideos || canPosts || canFaqs) && (
        <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
          {canPortfolio && (
            <div className="card">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Portfolio Projects</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{countPortfolio}</div>
              <Link href="/admin/portfolio" style={{ fontSize: '0.85rem' }}>Manage &rarr;</Link>
            </div>
          )}
          {canVideos && (
            <div className="card">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Video Showcase</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{countVideos}</div>
              <Link href="/admin/videos" style={{ fontSize: '0.85rem' }}>Manage &rarr;</Link>
            </div>
          )}
          {canPosts && (
            <div className="card">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Blog & Advisories</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{countPosts}</div>
              <Link href="/admin/posts" style={{ fontSize: '0.85rem' }}>Manage &rarr;</Link>
            </div>
          )}
          {canFaqs && (
            <div className="card">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Frequently Asked Questions</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{countFaqs}</div>
              <Link href="/admin/faqs" style={{ fontSize: '0.85rem' }}>Manage &rarr;</Link>
            </div>
          )}
        </div>
      )}

      {/* Recent Inquiries Section */}
      {canInquiries && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>Recent Client Inquiries & Leads</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                Latest incoming leads from contact and course inquiry forms
              </p>
            </div>
            <Link href="/admin/inquiries" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
              View All Leads
            </Link>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Client Name</th>
                  <th>Contact Details</th>
                  <th>Target / Subject</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {latestInquiries.map((inq: any) => (
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
                    <td>
                      <Link href={`/admin/inquiries?id=${inq._id}`} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
                {latestInquiries.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No inquiries recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
