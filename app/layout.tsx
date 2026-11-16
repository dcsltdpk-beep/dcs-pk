import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dream Cyber Security Pakistan | Cyber Defense & IT Solutions',
  description:
    'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.',
  keywords: 'cybersecurity pakistan, penetration testing lahore, web development, AI automation, IT firm pakistan, SOC monitoring',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="pewPU0U99OKBT9gp2PI4t2h_uS--HT4ISi200Px3K9E"
        />

        {/* Google Tag Manager (Header Script) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N72RQZVG');`,
          }}
        />

        {/* Google Analytics / GTAG initialization */}
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
      <body>
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N72RQZVG"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
