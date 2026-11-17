import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dream Cyber Security Pakistan | Cyber Defense & IT Solutions',
  description:
    'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.',
  keywords: 'cybersecurity pakistan, penetration testing lahore, web development, AI automation, IT firm pakistan, SOC monitoring',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dreamcybersecurity.pk'),
  verification: {
    google: 'pewPU0U99OKBT9gp2PI4t2h_uS--HT4ISi200Px3K9E',
  },
  other: {
    'google-site-verification': 'pewPU0U99OKBT9gp2PI4t2h_uS--HT4ISi200Px3K9E',
  },
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
        {/* Google Analytics / Google tag (gtag.js) immediately after <head> */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-N72RQZVG" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `,
          }}
        />

        {/* Google Search Console verification meta tag in <head> before <body> */}
        <meta
          name="google-site-verification"
          content="pewPU0U99OKBT9gp2PI4t2h_uS--HT4ISi200Px3K9E"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Dream Cyber Security Pakistan',
              url: 'https://www.dreamcybersecurity.pk',
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
      <body>
        {children}
      </body>
    </html>
  );
}
