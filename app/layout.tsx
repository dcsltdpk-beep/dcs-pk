import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import TopProgressBar from '@/components/TopProgressBar';
import { getSettings } from '@/lib/data';

export const viewport: Viewport = {
  themeColor: '#28245F',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const siteName = settings.site_name || 'Dream Cyber Security Pakistan';
  const metaTitle = settings.meta_title || `${siteName} | Cyber Defense & IT Solutions`;
  const metaDesc =
    settings.meta_description ||
    'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.';
  const metaKeywords =
    settings.meta_keywords ||
    'cybersecurity pakistan, penetration testing lahore, web development, AI automation, IT firm pakistan, SOC monitoring';
  const siteUrl =
    settings.site_url ||
    (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://www.dreamcybersecurity.pk');
  const googleVerification =
    settings.google_verification || 'pewPU0U99OKBT9gp2PI4t2h_uS--HT4ISi200Px3K9E';
  const ogImage = settings.og_image || '/icon.png';

  const metadataBaseUrl = new URL(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`);

  return {
    metadataBase: metadataBaseUrl,
    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },
    description: metaDesc,
    keywords: metaKeywords,
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon.png', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon.png' }],
    },
    verification: {
      google: googleVerification,
    },
    other: {
      'google-site-verification': googleVerification,
    },
    openGraph: {
      type: 'website',
      siteName: siteName,
      title: metaTitle,
      description: metaDesc,
      locale: 'en_US',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: siteName }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  const siteName = settings.site_name || 'Dream Cyber Security Pakistan';
  const siteUrl = settings.site_url || 'https://www.dreamcybersecurity.pk';
  const googleVerification =
    settings.google_verification || 'pewPU0U99OKBT9gp2PI4t2h_uS--HT4ISi200Px3K9E';
  const gtmId = settings.gtm_id || 'GTM-N72RQZVG';
  const ga4Id = settings.ga4_id;

  return (
    <html lang="en">
      <head>
        {/* Instant pre-hydration script to guarantee ZERO flash of page content on reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var p = window.location.pathname;
                  if (p === '/' || p === '') {
                    document.documentElement.classList.add('intro-active');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.intro-active, html.intro-active body {
                overflow: hidden !important;
                height: 100vh !important;
                max-height: 100vh !important;
                background: #020617 !important;
              }
              html.intro-active header,
              html.intro-active .site-header,
              html.intro-active .hero-content-col,
              html.intro-active .stats-bar,
              html.intro-active .hero-banner-bottom-fade,
              html.intro-active .floating-actions,
              html.intro-active .floating-whatsapp,
              html.intro-active .scroll-to-top-btn {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
              }
              html.intro-active .site-subsections,
              html.intro-active footer,
              html.intro-active .site-footer {
                display: none !important;
              }
            `,
          }}
        />

        {/* Google Fonts: Cinzel (Display), Manrope (Text), JetBrains Mono (Technical) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

        {/* Google Tag Manager (GTM) */}
        {gtmId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                `,
              }}
            />
          </>
        )}

        {/* Google Analytics 4 (GA4) if present */}
        {ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${ga4Id}');
                `,
              }}
            />
          </>
        )}

        {/* Google Search Console verification meta tag */}
        <meta
          name="google-site-verification"
          content={googleVerification}
        />

        {/* Dynamic Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteName,
              url: siteUrl,
              description:
                settings.meta_description ||
                'International-standard cyber defense, custom software engineering, AI workflow automations, and enterprise technology solutions.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: settings.company_address || 'Level 4, IT Tower, Hali Road, Gulberg III',
                addressLocality: 'Lahore',
                addressCountry: 'PK',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: settings.company_phone || '+92 300 1234567',
                contactType: 'Customer Support',
                email: settings.company_email || 'dcsltd.pk@gmail.com',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
