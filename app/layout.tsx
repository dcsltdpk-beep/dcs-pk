import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  themeColor: '#28245F',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Dream Cyber Security Pakistan | Cyber Defense & IT Solutions',
  description:
    'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.',
  keywords: 'cybersecurity pakistan, penetration testing lahore, web development, AI automation, IT firm pakistan, SOC monitoring',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://www.dreamcybersecurity.pk'
  ),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png' }],
  },
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
    <html lang="en" className={`${poppins.variable} ${poppins.className}`}>
      <head>
        {/* Google Fonts Poppins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

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
      <body className={`${poppins.className} font-sans`}>
        {children}
      </body>
    </html>
  );
}
