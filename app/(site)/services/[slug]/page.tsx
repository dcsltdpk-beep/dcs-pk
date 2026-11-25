import React from 'react';
import { notFound } from 'next/navigation';
import ServiceDetailPageClient from '@/components/ServiceDetailPageClient';
import { getServiceBySlug, getServices, getSettings } from '@/lib/data';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const services = await getServices();
  const dbSlugs = services.map((s) => ({ slug: s.slug }));
  const aliasSlugs = [
    'cybersecurity',
    'web-development',
    'software-development',
    'cloud-devops',
    'ai-automation',
    'ecommerce',
    'video-motion',
    'graphic-design',
  ].map((slug) => ({ slug }));
  return [...dbSlugs, ...aliasSlugs];
}

export async function generateMetadata({ params }: Props) {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: 'Service Not Found | Dream Cyber Security' };
  return {
    title: `${service.title} | Dream Cyber Security Pakistan`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const [service, settings] = await Promise.all([
    getServiceBySlug(params.slug),
    getSettings(),
  ]);

  if (!service) {
    notFound();
  }

  const whatsappNum = settings.whatsapp_number || '923165478855';
  const whatsappMsg = `Hello Dream Cyber Security Pakistan, I would like to inquire about ${service.title}.`;

  return (
    <ServiceDetailPageClient
      service={{
        title: service.title,
        slug: service.slug,
        summary: service.summary,
        description: service.description,
        features: service.features,
        benefits: service.benefits,
        icon: service.icon,
      }}
      whatsappNumber={whatsappNum}
      whatsappMessage={whatsappMsg}
    />
  );
}
