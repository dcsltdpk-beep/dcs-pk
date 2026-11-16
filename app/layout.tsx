import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dream Cyber Security Pakistan | Cyber Defense & IT Solutions',
  description:
    'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.',
  keywords: 'cybersecurity pakistan, penetration testing lahore, web development, AI automation, IT firm pakistan, SOC monitoring',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'Dream Cyber Security Pakistan',
    title: 'Dream Cyber Security Pakistan | Cyber Defense & IT Solutions',
    description:
      'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dream Cyber Security Pakistan | Cyber Defense & IT Solutions',
    description:
      'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Dream Cyber Security Pakistan',
              url: 'https://dreamcyber.pk',
              description:
                'International-standard cyber defense, custom software engineering, AI workflow automations, and enterprise technology solutions.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Level 4, IT Tower, Hali Road, Gulberg III',
                addressLocality: 'Lahore',
                addressCountry: 'PK',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+92 300 1234567',
                contactType: 'Customer Support',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
