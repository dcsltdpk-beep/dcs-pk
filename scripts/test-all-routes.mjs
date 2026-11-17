import fs from 'fs';
import path from 'path';

async function testAll() {
  const seed = JSON.parse(fs.readFileSync('database/seed-data.json', 'utf8'));

  const files = [
    'components/Header.tsx',
    'components/Footer.tsx',
    'app/(site)/page.tsx',
    'app/(site)/about/page.tsx',
    'app/(site)/services/page.tsx',
    'app/(site)/courses/page.tsx',
    'app/(site)/portfolio/page.tsx',
    'app/(site)/videos/page.tsx',
    'app/(site)/team/page.tsx',
    'app/(site)/blog/page.tsx',
    'app/(site)/faq/page.tsx',
    'app/(site)/contact/page.tsx',
    'app/(site)/privacy/page.tsx',
    'app/(site)/terms/page.tsx',
  ];

  const linkSet = new Set([
    '/',
    '/about',
    '/services',
    '/courses',
    '/portfolio',
    '/videos',
    '/team',
    '/blog',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/sitemap.xml',
    '/admin/login',
    '/admin',
  ]);

  for (const f of files) {
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf8');
      const matches = content.matchAll(/href=["'`](\/[^"'`?#\s]+)/g);
      for (const m of matches) {
        if (!m[1].startsWith('/api')) {
          linkSet.add(m[1]);
        }
      }
    }
  }

  // Add all seed slugs
  if (seed.services) {
    for (const s of seed.services) {
      linkSet.add(`/services/${s.slug}`);
    }
  }
  if (seed.courses) {
    for (const c of seed.courses) {
      linkSet.add(`/courses/${c.slug}`);
    }
  }
  if (seed.posts) {
    for (const p of seed.posts) {
      linkSet.add(`/blog/${p.slug}`);
    }
  }

  console.log(`Testing ${linkSet.size} unique routes against http://localhost:3000...\n`);

  const results = [];
  for (const route of Array.from(linkSet).sort()) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, {
        redirect: 'manual',
      });
      results.push({ route, status: res.status });
      if (res.status === 404) {
        console.error(`❌ 404 NOT FOUND: ${route}`);
      } else if (res.status >= 300 && res.status < 400) {
        console.log(`↪️  ${res.status} REDIRECT: ${route} -> ${res.headers.get('location')}`);
      } else if (res.status >= 500) {
        console.error(`💥 ${res.status} SERVER ERROR: ${route}`);
      } else {
        console.log(`✅ ${res.status}: ${route}`);
      }
    } catch (e) {
      console.error(`❌ ERROR testing ${route}: ${e.message}`);
    }
  }

  const failures = results.filter((r) => r.status === 404);
  console.log('\n========================================');
  console.log('--- ROUTE AUDIT SUMMARY ---');
  console.log(`Total Tested: ${results.length}`);
  console.log(`404 Failures: ${failures.length}`);
  failures.forEach((f) => console.log(` - ${f.route}`));
  console.log('========================================\n');
}

testAll();
