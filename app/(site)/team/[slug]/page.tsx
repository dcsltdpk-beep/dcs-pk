import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTeam, getTeamMemberBySlug, getSettings, toPlain } from '@/lib/data';
import TeamMemberDetailClient, { TeamMemberData } from '@/components/TeamMemberDetailClient';

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
  const [member, allTeam, settings] = await Promise.all([
    getTeamMemberBySlug(params.slug),
    getTeam(),
    getSettings(),
  ]);

  if (!member) notFound();

  return (
    <TeamMemberDetailClient
      member={toPlain(member) as TeamMemberData}
      allTeam={toPlain(allTeam) as TeamMemberData[]}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
