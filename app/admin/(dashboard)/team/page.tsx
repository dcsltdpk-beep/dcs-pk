import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Team } from '@/lib/models/Team';
import TeamAdminClient from './TeamAdminClient';

export const revalidate = 0;

export default async function TeamAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const team = await Team.find().sort({ order_num: 1 }).lean();

  return <TeamAdminClient initialTeam={JSON.parse(JSON.stringify(team))} />;
}
