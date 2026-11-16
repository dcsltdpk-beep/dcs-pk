import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Inquiry } from '@/lib/models/Inquiry';
import { Service } from '@/lib/models/Service';
import { Course } from '@/lib/models/Course';
import { Team } from '@/lib/models/Team';
import { Portfolio } from '@/lib/models/Portfolio';
import { Video } from '@/lib/models/Video';
import { Post } from '@/lib/models/Post';
import { Faq } from '@/lib/models/Faq';

export const revalidate = 0; // dynamic dashboard

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  await connectDB();

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
    latestInquiries,
  ] = await Promise.all([
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: 'unread' }),
    Service.countDocuments(),
    Course.countDocuments(),
    Team.countDocuments(),
    Portfolio.countDocuments(),
    Video.countDocuments(),
    Post.countDocuments(),
    Faq.countDocuments(),
    Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Control Center</span>
        <h1>Welcome, <span className="text-gradient">{session.username || 'Administrator'}</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Manage all website content, corporate services, academy training programs, and client leads.
        </p>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
        <div className="card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Unread Inquiries</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00f2fe', marginTop: '0.25rem' }}>
            {unreadInquiries} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {totalInquiries} total</span>
          </div>
          <Link href="/admin/inquiries" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}>
            View Inbox &rarr;
          </Link>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Core Services</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
            {countServices}
          </div>
          <Link href="/admin/services" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}>
            Manage Services &rarr;
          </Link>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Academy Courses</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
            {countCourses}
          </div>
          <Link href="/admin/courses" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}>
            Manage Courses &rarr;
          </Link>
        </div>

        <div className="card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Team Profiles</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
            {countTeam}
          </div>
          <Link href="/admin/team" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}>
            Manage Team &rarr;
          </Link>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
        <div className="card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Portfolio Projects</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{countPortfolio}</div>
          <Link href="/admin/portfolio" style={{ fontSize: '0.85rem' }}>Manage &rarr;</Link>
        </div>
        <div className="card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Video Showcase</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{countVideos}</div>
          <Link href="/admin/videos" style={{ fontSize: '0.85rem' }}>Manage &rarr;</Link>
        </div>
        <div className="card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Blog & Advisories</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{countPosts}</div>
          <Link href="/admin/posts" style={{ fontSize: '0.85rem' }}>Manage &rarr;</Link>
        </div>
        <div className="card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Frequently Asked Questions</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{countFaqs}</div>
          <Link href="/admin/faqs" style={{ fontSize: '0.85rem' }}>Manage &rarr;</Link>
        </div>
      </div>

      {/* Recent Inquiries Section */}
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
                  <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
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
    </div>
  );
}
