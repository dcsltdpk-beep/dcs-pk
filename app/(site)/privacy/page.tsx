import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Dream Cyber Security Pakistan',
  description: 'Privacy policy, data protection, and confidentiality commitments of Dream Cyber Security Pakistan.',
};

export default function PrivacyPage() {
  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Last Updated: 2026
        </p>

        <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.9', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <p>
            At <strong>Dream Cyber Security Pakistan</strong>, we take the confidentiality, privacy, and integrity of our clients&apos; and visitors&apos; information with utmost seriousness. This Privacy Policy details how we collect, handle, and protect data acquired through this corporate website.
          </p>

          <h3 style={{ color: '#fff' }}>1. Information We Collect</h3>
          <p>
            When you submit an inquiry through our contact forms or request information regarding our services and academy courses, we may collect your full name, corporate email address, telephone/WhatsApp number, and project details. We do not process or store any financial, payment card, or student billing credentials, as our site functions strictly as an informational and lead-generation portal.
          </p>

          <h3 style={{ color: '#fff' }}>2. Use of Information</h3>
          <p>The information you provide is utilized solely to:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Respond promptly to your technical inquiries and project briefs.</li>
            <li>Deliver requested security consulting proposals or academy syllabus information.</li>
            <li>Maintain confidential corporate client communications.</li>
          </ul>

          <h3 style={{ color: '#fff' }}>3. Confidentiality & Non-Disclosure</h3>
          <p>
            As a cybersecurity firm, confidentiality is our core tenet. We never sell, lease, or share your contact information, network details, or project documentation with any third-party marketing entities.
          </p>

          <h3 style={{ color: '#fff' }}>4. Cookies & Web Analytics</h3>
          <p>
            We may employ anonymous analytics identifiers (such as Google Analytics 4) to monitor overall website performance and user experience metrics. These analytics do not capture personally identifiable data.
          </p>

          <h3 style={{ color: '#fff' }}>5. Inquiries & Contact</h3>
          <p>
            If you have questions regarding this Privacy Policy, please contact our data governance team at{' '}
            <a href="mailto:dcsltd.pk@gmail.com">dcsltd.pk@gmail.com</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
