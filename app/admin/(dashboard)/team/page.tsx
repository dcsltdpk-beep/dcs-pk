import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Team } from '@/lib/models/Team';
import { hasModuleAccess } from '@/lib/rbac';
import TeamAdminClient from './TeamAdminClient';

export const revalidate = 0;

export default async function TeamAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'team')) {
    redirect('/admin?error=access_denied&module=team');
  }

  await connectDB();
  const team = await Team.find().sort({ order_num: 1 }).lean();

  return <TeamAdminClient initialTeam={JSON.parse(JSON.stringify(team))} />;
}
