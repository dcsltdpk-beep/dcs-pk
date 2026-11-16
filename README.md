# Dream Cyber Security Pakistan (Next.js & Turbopack)

The complete enterprise web portal and academy training platform for **Dream Cyber Security Pakistan**, fully converted from PHP to **Next.js 14 App Router (Turbopack)** and **MongoDB (Mongoose)** with 100% design fidelity, sub-second performance, and instant-offline resilience.

---

## 🌟 Technology Stack & Architecture

- **Frontend & Server Engine:** Next.js 14 (Turbopack, App Router, SSG, ISR & Server Components).
- **Bundler:** Next.js Turbopack (`next dev --turbo`) for instant HMR and rapid cold starts.
- **Styling & Theme:** Pure CSS3 (Dark/Neon Cyber Blue theme) matching the original design system with zero external UI framework dependencies.
- **Database Architecture:**
  - **MongoDB / Mongoose:** Primary database for dynamic administration.
  - **Relational SQL Compatible:** Includes complete `schema.sql` and `seeds.sql` for MySQL/MariaDB deployments.
  - **Instant-Fallback Seed Cache:** Bundled `database/seed-data.json` ensures 100% uptime, ultra-fast initial page loads, and zero downtime even before the database daemon is booted.
- **Security:**
  - Bcrypt password hashing for administrative access.
  - Signed JWT session cookies (`admin_token`) for the Admin Control Center.
  - Honeypot anti-spam defense on contact and inquiry forms.
  - Zero online payment/cart attack surface (Consultation & Lead Gen architecture).
- **SEO & AI Search:**
  - Dynamic `sitemap.xml` automatically indexing all active services, courses, blog posts, and landing pages.
  - `robots.txt` protecting admin paths while allowing search engines.
  - Clean `llms.txt` following standard AI discovery formats.
  - Schema.org JSON-LD structured data and OpenGraph tags.

---

## 🚀 Key Website Features & Structure

### 1. Public Portal
- **Home (`/`):** Hero section, live stats counters, company presentation video, core services showcase, academy courses, why-us trust blocks, portfolio highlights, testimonials, and dynamic CTAs.
- **About Us (`/about`):** Corporate story, mission, vision, core values, and executive introduction.
- **Services (`/services` & `/services/[slug]`):** Dedicated pages for all 10 corporate services:
  1. Web Design & Development
  2. E-commerce Development
  3. Video Editing & Motion Graphics
  4. Graphic Design & Branding
  5. AI Automation & Chatbot Development
  6. Cybersecurity Services
  7. Digital Marketing & SEO
  8. Social Media Management
  9. Software & Application Development
  10. Domain, Hosting & IT Support
- **Training Academy (`/courses` & `/courses/[slug]`):** Comprehensive course syllabus, duration, target audience, learning outcomes, instructor cards, and admission inquiry forms.
- **Portfolio (`/portfolio`):** Filterable by Video Editing, Graphic Design, Web Development, and AI Automation with client badges.
- **Video Gallery (`/videos`):** Categorized gallery supporting YouTube/Vimeo embeds and direct uploads.
- **Our Team (`/team`):** Professional profiles, bios, designations, and social links.
- **Advisories & Blog (`/blog` & `/blog/[slug]`):** Technical threat advisories and corporate milestones.
- **FAQ (`/faq`):** Semantic animated accordion without JavaScript dependencies.
- **Contact Us (`/contact`):** Lead capture form with honeypot anti-spam protection, phone link, and direct WhatsApp button.
- **Campaign Landing Pages (`/landing/[slug]`):** Dedicated marketing campaign landing pages.
- **Legal Compliance (`/privacy` & `/terms`):** Corporate privacy policy and terms of service.

### 2. Admin Management Panel (`/admin`)
- **Login (`/admin/login`):** Secure bcrypt session authentication.
  - **Default Username:** `admin`
  - **Default Password:** `admin123`
- **Dashboard (`/admin`):** Live metric counters and latest leads.
- **Inquiries Inbox (`/admin/inquiries`):** Filter leads, mark read/responded, reply via email/WhatsApp, and **Export to CSV**.
- **Services Manager (`/admin/services`):** Full CRUD for all 10 services.
- **Courses Manager (`/admin/courses`):** Full CRUD for academy training courses.
- **Portfolio Manager (`/admin/portfolio`):** Projects and case studies manager.
- **Videos Manager (`/admin/videos`):** Video gallery embeds and sources.
- **News & Advisories Manager (`/admin/posts`):** Technical advisories and blog publisher.
- **Team Manager (`/admin/team`):** Leadership and staff profiles.
- **FAQ Database (`/admin/faqs`):** Frequently asked questions organizer.
- **Campaign Landing Pages (`/admin/landing-pages`):** Marketing landing page generator.
- **Homepage Editor (`/admin/home-content`):** Customize every headline and counter directly.
- **Global Settings & SEO (`/admin/settings`):** Manage WhatsApp number, contacts, GA4/Meta Pixel IDs, and SEO meta tags.

---

## 🛠️ How to Run Locally

### 1. Start Development Server with Turbopack
Turbopack is enabled by default for blazing-fast hot-reloading:
```bash
npm run dev
```
*(If Webpack is ever preferred as a fallback: `npm run dev:webpack`)*

### 2. Database Seeding
To populate MongoDB with all 10 services, courses, team profiles, portfolio items, initial settings, and the default admin user:
```bash
# Seed local MongoDB
npm run seed

# Or seed a remote MongoDB Atlas cluster:
npm run seed -- "mongodb+srv://user:pass@cluster.mongodb.net/dcs_pakistan"
```

The database directory contains:
- `database/seed-data.json`: Portable JSON master seed data.
- `database/schema.sql`: Full relational schema definition for MySQL.
- `database/seeds.sql`: SQL seed statements for MySQL.

### 3. Build & Production
```bash
npm run build
npm run start
```

The application is accessible at:
- **Public Portal:** `http://localhost:3000`
- **Admin Control Center:** `http://localhost:3000/admin` (Username: `admin`, Password: `admin123`)
- **LLMs AI Discovery:** `http://localhost:3000/llms.txt`
- **XML Sitemap:** `http://localhost:3000/sitemap.xml`
- **Robots:** `http://localhost:3000/robots.txt`
