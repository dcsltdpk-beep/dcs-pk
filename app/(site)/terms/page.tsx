import React from 'react';

export const metadata = {
  title: 'Terms of Service | Dream Cyber Security Pakistan',
  description: 'Terms of service, engagement conditions, and legal policies of Dream Cyber Security Pakistan.',
};

export default function TermsPage() {
  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Last Updated: 2026
        </p>

        <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.9', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <p>
            Welcome to the official web portal of <strong>Dream Cyber Security Pakistan</strong>. By accessing or using this website, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h3 style={{ color: '#fff' }}>1. Scope of Portal</h3>
          <p>
            This website functions as an enterprise showcase and lead generation portal for our cybersecurity consulting services, bespoke software engineering, and informational academy syllabus. No commercial transactions or payment processing take place on this platform.
          </p>

          <h3 style={{ color: '#fff' }}>2. Intellectual Property</h3>
          <p>
            All content, including corporate branding, vector graphics, code architectures, training syllabi, and technical documentation, is the exclusive intellectual property of Dream Cyber Security Pakistan and protected under copyright and trade secret laws.
          </p>

          <h3 style={{ color: '#fff' }}>3. Professional Engagements</h3>
          <p>
            Formal consulting, penetration testing, and security audit engagements are executed under separate, legally binding bilateral service contracts accompanied by mutual Non-Disclosure Agreements (NDAs).
          </p>

          <h3 style={{ color: '#fff' }}>4. Disclaimer of Warranties</h3>
          <p>
            While we strive to ensure that all information on this site is accurate and up to date, information is provided on an &quot;as is&quot; basis without warranties of any kind.
          </p>

          <h3 style={{ color: '#fff' }}>5. Contact Information</h3>
          <p>
            For legal inquiries or corporate contracts, reach out to our legal affairs desk at{' '}
            <a href="mailto:info@dreamcyber.pk">info@dreamcyber.pk</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
