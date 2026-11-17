-- Seed Initial Data for Dream Cyber Security Pakistan

USE `dcs_pakistan`;

-- 1. Default Admin User: admin / admin123 (bcrypt hash: $2y$10$WqT81WsmKz6QhG6wEre7y.kGg0U6Nn5iG9yL8G771Z02Yf241aE2S)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'admin', 'dcsltd.pk@gmail.com', '$2a$12$6EZZKgEDG4FNDgZS0KEyEOCkL3nKsn/7KRHr.Unla6Tjn5qb387dO', 'admin')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 2. Initial Settings
INSERT INTO `settings` (`key_name`, `key_value`) VALUES
('site_name', 'Dream Cyber Security Pakistan'),
('site_tagline', 'International Standard Cyber Defense, Technology & Digital Innovation'),
('company_email', 'dcsltd.pk@gmail.com'),
('company_phone', '+92 300 1234567'),
('company_address', 'Level 4, IT Tower, Hali Road, Gulberg III, Lahore, Pakistan'),
('whatsapp_number', '923001234567'),
('whatsapp_message', 'Hello Dream Cyber Security Pakistan, I would like to inquire about your services.'),
('facebook_url', 'https://facebook.com/dreamcybersecurity'),
('linkedin_url', 'https://linkedin.com/company/dreamcybersecurity'),
('twitter_url', 'https://twitter.com/dreamcyberpk'),
('youtube_url', 'https://youtube.com/@dreamcybersecurity'),
('company_intro_video', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
('stat_projects', '250+'),
('stat_clients', '180+'),
('stat_team', '35+'),
('stat_experience', '8+ Years'),
('meta_title', 'Dream Cyber Security Pakistan | Cyber Defense & IT Solutions'),
('meta_description', 'Premier international-standard cybersecurity, software engineering, AI automation, and IT solutions firm operating in Pakistan.'),
('meta_keywords', 'cybersecurity pakistan, penetration testing lahore, web development, AI automation, IT firm pakistan, SOC monitoring'),
('ga4_id', 'G-DCSPAK2026'),
('gtm_id', ''),
('meta_pixel_id', '123456789012345'),
('site_language', 'en')
ON DUPLICATE KEY UPDATE `key_value`=VALUES(`key_value`);

-- 3. All 10 Required Services
INSERT INTO `services` (`title`, `slug`, `icon`, `summary`, `description`, `features`, `benefits`, `order_num`, `status`) VALUES
(
  'Web Design & Development',
  'web-design-development',
  'globe',
  'High-performance, secure, responsive enterprise websites and modern web platforms tailored to international standards.',
  'We architect modern, robust web solutions engineered for security, speed, and conversion. From corporate business portals to custom web architectures, our systems are built with zero-trust security foundations and cutting-edge responsive interfaces.',
  'Custom UI/UX Wireframing\nPure PHP & Modern Architecture\nOWASP Top 10 Security Hardened\nSub-second Page Load Speed\nFull Cross-device Responsiveness',
  'Enhanced brand authority, seamless user engagement across mobile and desktop, and zero vulnerability backdoors.',
  1,
  'active'
),
(
  'E-commerce Development',
  'ecommerce-development',
  'shopping-cart',
  'Secure, scalable digital commerce architectures optimized for conversion, high concurrency, and automated operations.',
  'Enterprise-grade e-commerce solutions that empower high-volume transactions with fortified data protection, seamless catalog management, inventory tracking, and intuitive shopping journeys.',
  'Scalable Multi-tier Architecture\nPCI-DSS Security Compliance\nAdvanced Inventory & Order Management\nCustom Cart & Checkout Funnels\nInstant Search & Filtering',
  'Maximized conversion rates, dependable uptime during traffic surges, and robust transaction integrity.',
  2,
  'active'
),
(
  'Video Editing & Motion Graphics',
  'video-editing-motion-graphics',
  'video',
  'Cinematic post-production, corporate showreels, high-impact motion graphics, and visual storytelling.',
  'Visual storytelling designed to captivate your audience and communicate complex technological concepts clearly. We deliver broadcast-quality video editing, 2D/3D motion graphics, brand stingers, and promotional campaigns.',
  '4K & 8K Color Grading & Mastering\nDynamic Kinetic Typography\nExplainer & Corporate Promo Videos\nSound Design & Audio Engineering\nPlatform-optimized Aspect Ratios',
  'Unforgettable corporate presentations, higher retention on social channels, and premium brand prestige.',
  3,
  'active'
),
(
  'Graphic Design & Branding',
  'graphic-design-branding',
  'palette',
  'Distinct corporate identities, visual guidelines, vector assets, and brand collateral that stand out globally.',
  'We create cohesive corporate brand identities that communicate strength, technological mastery, and trust. Every asset from vector logos to executive brand books is crafted with rigorous attention to detail.',
  'Complete Brand Identity Kits\nCorporate Stationery & Presentation Decks\nVector Illustrations & Iconography\nMarketing Collateral & Print Materials\nStrict Brand Guidelines Manuals',
  'Instantly recognizable market presence, cohesive touchpoints across all client media, and investor-ready assets.',
  4,
  'active'
),
(
  'AI Automation & Chatbot Development',
  'ai-automation-chatbot-development',
  'cpu',
  'Autonomous enterprise workflows, intelligent LLM agents, cognitive automation, and smart 24/7 customer assistants.',
  'Transform manual company bottlenecks into automated intelligence. We deploy tailored workflow automations, predictive algorithmic engines, and natural conversational AI agents integrated with your existing business systems.',
  'Autonomous Workflow Pipelines\nCustom LLM Chatbot Integration\nCRM & Database Automation\nLead Qualification Agents\nDocument & Data Parsing Bots',
  'Reduced operational overhead by up to 60%, instant 24/7 customer lead response, and error-free execution.',
  5,
  'active'
),
(
  'Cybersecurity Services',
  'cybersecurity-services',
  'shield-lock',
  'Vulnerability assessments, penetration testing, SOC monitoring, zero-trust audits, and compliance readiness.',
  'Comprehensive defensive and offensive cybersecurity consulting designed to shield your business assets from state-sponsored and cybercrime threats. We audit, harden, and defend enterprise infrastructures.',
  'Network & Web Penetration Testing (VAPT)\nZero-Trust Infrastructure Hardening\nISO 27001 & Compliance Consulting\nIncident Response & Forensics\nEmployee Threat Awareness Training',
  'Comprehensive peace of mind, continuous compliance with international regulations, and mitigation of catastrophic breaches.',
  6,
  'active'
),
(
  'Digital Marketing & SEO',
  'digital-marketing-seo',
  'trending-up',
  'Organic search engine dominance, technical SEO audits, data-backed conversion optimization, and authority building.',
  'Strategic search optimization tailored to elevate your corporate visibility for high-intent business keywords. We implement technical on-page architectures, rich snippets, schema markup, and authoritative backlink profiles.',
  'Technical SEO Audits & Core Web Vitals Fixes\nHigh-Intent Keyword Strategy\nStructured Schema.org Data Integration\nContent Strategy & On-page Optimization\nRank Tracking & Analytics Reporting',
  'Sustainable organic traffic pipeline, top rankings on competitive regional and global terms, and lower client acquisition costs.',
  7,
  'active'
),
(
  'Social Media Management',
  'social-media-management',
  'share-2',
  'Strategic corporate presence across LinkedIn, X/Twitter, Meta, and YouTube with targeted B2B content pipelines.',
  'Cultivate executive authority and community trust. We design and execute data-backed social communication schedules, tech-focused thought leadership, and interactive engagement strategies.',
  'B2B Thought Leadership Publishing\nMulti-platform Content Calendars\nCustom Tech Infographics & Visuals\nAudience Growth & Engagement Monitoring\nMonthly ROI Analytics & Sentiment Reports',
  'Consistent brand reputation, executive reach across B2B decision makers, and organic brand advocacy.',
  8,
  'active'
),
(
  'Software & Application Development',
  'software-application-development',
  'code',
  'Bespoke enterprise software, secure backends, high-throughput microservices, and desktop/cloud platforms.',
  'Engineering custom software architectures solving demanding industry challenges. Built with scalable design patterns, rigorous automated testing, and secure data pipelines.',
  'Custom Enterprise ERP & CRM Modules\nRobust RESTful API Gateways\nHigh-Performance Database Architectures\nRole-Based Access Control (RBAC)\nModular & Extensible Codebases',
  'Tailored fit to your unique operational workflow, complete IP ownership, and zero monthly recurring license fees.',
  9,
  'active'
),
(
  'Domain, Hosting & IT Support',
  'domain-hosting-it-support',
  'server',
  'Hardened cloud server management, 99.99% uptime, DNS protection, SSL deployment, and 24/7 dedicated support.',
  'Mission-critical hosting and proactive IT maintenance. We manage dedicated servers, automated off-site backups, DDoS mitigation, and swift 24/7 engineering helpdesk resolution.',
  'DDoS Protected Enterprise Hosting\nDaily Encrypted Cloud Backups\nSSL/TLS & DNSSEC Deployment\n24/7 Server Health Monitoring\nOn-call IT Technical Support Desk',
  'Uninterrupted business continuity, rapid disaster recovery capabilities, and swift emergency resolutions.',
  10,
  'active'
);

-- 4. The 4 Required Courses (Academy Section - Informational Showcase)
INSERT INTO `courses` (`title`, `slug`, `duration`, `target_audience`, `overview`, `syllabus`, `what_you_will_learn`, `instructor_name`, `instructor_designation`, `instructor_bio`, `intro_video_url`, `order_num`, `status`) VALUES
(
  'Video Editing & Graphic Design',
  'video-editing-graphic-design',
  '12 Weeks (Comprehensive Hands-on)',
  'Aspiring creative designers, media professionals, marketing specialists, and content creators aiming for international freelance and corporate careers.',
  'A rigorous, industry-aligned training program covering modern post-production video editing, color science, motion graphics, and corporate brand design standards.',
  'Module 1: Principles of Design, Color Theory & Visual Hierarchy\nModule 2: Adobe Photoshop & Illustrator Vector Graphics\nModule 3: Corporate Brand Identity, Logo & Social Collateral Design\nModule 4: Adobe Premiere Pro Timeline & Audio Engineering\nModule 5: Adobe After Effects Motion Graphics & Kinetic Typography\nModule 6: 4K Color Grading & Cinematic Pacing\nModule 7: Client Project Portfolio & International Freelance Workflows',
  'Industry-standard graphic design mastery\nProfessional video timeline management and cutting\nKinetic typography and 2D motion graphics\nAudio enhancement and color grading pipelines\nFull client portfolio with real corporate case studies',
  'Ahmed Raza',
  'Creative Director & Senior Motion Designer',
  'Over 10 years of international post-production experience leading branding and motion design for global digital agencies.',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  1,
  'active'
),
(
  'AI Automation',
  'ai-automation',
  '10 Weeks (Applied Enterprise Automation)',
  'IT professionals, systems administrators, business analysts, and developers looking to deploy autonomous AI agents and enterprise workflows.',
  'Master the deployment of generative AI models, autonomous workflow pipelines, cognitive bots, and smart business process automations.',
  'Module 1: Foundations of Generative AI, LLMs & Prompt Engineering\nModule 2: Workflow Automation with n8n, Make & Zapier\nModule 3: API Integration & Webhooks Architecture\nModule 4: Custom AI Assistants & RAG (Retrieval-Augmented Generation)\nModule 5: WhatsApp & Web Chatbot Deployment\nModule 6: Automated Data Scraping & CRM Ingestion\nModule 7: Deploying Secure Production Automations',
  'Build and deploy autonomous multi-step automations\nIntegrate LLMs with company databases and webhooks\nDeploy 24/7 intelligent customer engagement chatbots\nAutomate lead qualification and sales pipelines\nZero-code and low-code enterprise automation architectures',
  'Tariq Mehmood',
  'Principal AI Solutions Architect',
  'Specialist in enterprise RPA and generative AI architectures with a background in deploying automated systems across telecommunications and fintech.',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  2,
  'active'
),
(
  'Web Development',
  'web-development',
  '14 Weeks (Full-Stack Engineering)',
  'Students, career changers, and junior developers seeking full-stack web engineering competence with modern clean architecture.',
  'A structured engineering pathway starting from semantic web standards to secure server-side PHP programming, MySQL database architecture, and security hardening.',
  'Module 1: Semantic HTML5, Modern CSS3 Flexbox & Grid Systems\nModule 2: Responsive Design & Mobile-First Best Practices\nModule 3: Server-side Architecture with Modern PHP 8.x\nModule 4: Relational Database Design with MySQL & PDO\nModule 5: Security Hardening: OWASP Top 10, SQLi, XSS & CSRF Defense\nModule 6: RESTful API Development & JSON Endpoints\nModule 7: Git Version Control, Deployment & Production Server Setup',
  'Build fast, secure server-rendered web applications\nDesign and query normalized MySQL relational databases\nImplement robust authentication and role-based permissions\nProtect systems against common web vulnerabilities\nDeploy and maintain production servers on Linux environments',
  'Shahid Khan',
  'Senior Lead Full-Stack Architect',
  'Full-stack engineer with 12+ years of experience delivering robust web platforms for international clients.',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  3,
  'active'
),
(
  'Computer Basics',
  'computer-basics',
  '6 Weeks (Foundational IT Skills)',
  'Beginners, office administrators, and individuals seeking solid, professional computer literacy and IT foundational skills.',
  'A practical, empowering course focused on modern computing fundamentals, operating system mastery, professional office productivity, digital security hygiene, and internet tools.',
  'Module 1: Computer Hardware, Architecture & Operating Systems (Windows/Linux)\nModule 2: File Management, Data Organization & Cloud Storage\nModule 3: Microsoft Office Suite (Word, Excel & PowerPoint Essentials)\nModule 4: Safe Internet Browsing, Digital Privacy & Cyber Hygiene\nModule 5: Email Communication, Netiquette & Professional Documentation\nModule 6: Basic Troubleshooting, Backups & System Maintenance',
  'Confidently operate modern operating systems and hardware\nCreate professional spreadsheets, formulas, and presentations\nProtect personal and office data against malware and phishing\nEffectively use cloud drives, collaboration tools, and email\nPerform foundational IT maintenance and troubleshooting',
  'Fatima Noor',
  'IT Education Specialist & Technical Trainer',
  'Passionate computing educator with 7+ years of experience training corporate employees and students in essential computing literacy.',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  4,
  'active'
);

-- 5. Team Members (Sample corporate profiles)
INSERT INTO `team` (`name`, `designation`, `bio`, `photo`, `linkedin`, `twitter`, `github`, `email`, `order_num`) VALUES
('Muhammad Shahriar', 'Chief Executive Officer (CEO)', 'Visionary technology leader with extensive background in cyber defense, enterprise IT architecture, and digital transformation initiatives.', 'assets/img/team-1.jpg', 'https://linkedin.com', 'https://twitter.com', 'https://github.com', 'dcsltd.pk@gmail.com', 1),
('Hamza Ali', 'Head of Cybersecurity & Threat Intelligence', 'CISSP certified security veteran specializing in proactive threat detection, vulnerability assessments, and enterprise zero-trust audits.', 'assets/img/team-2.jpg', 'https://linkedin.com', 'https://twitter.com', 'https://github.com', 'dcsltd.pk@gmail.com', 2),
('Zainab Bukhari', 'Director of Software Engineering', 'Over 9 years of architecting scalable cloud platforms, database optimization, and high-performance server architectures.', 'assets/img/team-3.jpg', 'https://linkedin.com', 'https://twitter.com', 'https://github.com', 'dcsltd.pk@gmail.com', 3),
('Bilal Farooq', 'Lead AI & Automation Specialist', 'Expert in large language model pipelines, cognitive automation workflows, and machine learning integration for enterprise clients.', 'assets/img/team-4.jpg', 'https://linkedin.com', 'https://twitter.com', 'https://github.com', 'dcsltd.pk@gmail.com', 4);

-- 6. Initial Portfolio Items (Across the 4 categories)
INSERT INTO `portfolio` (`title`, `category`, `client_name`, `cover_image`, `video_url`, `description`, `order_num`) VALUES
('National Cyber Defense Portal', 'Web Development', 'GovTech Security Initiative', 'assets/img/portfolio-1.jpg', '', 'Secure, high-concurrency web portal engineered with fortified authentication, role-based authorization, and real-time security alerting.', 1),
('Corporate Threat Explainer 3D Reel', 'Video Editing', 'FinSecure Bank Ltd', 'assets/img/portfolio-2.jpg', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Cinematic 3D motion graphics showreel explaining modern ransomware attack vectors and organizational prevention protocols.', 2),
('Zero-Trust Identity Brand Kit', 'Graphic Design', 'Apex Cyber Defense', 'assets/img/portfolio-3.jpg', '', 'Comprehensive corporate visual identity, including vector brand identity, typography, corporate stationary, and security badges.', 3),
('Autonomous Lead & SOC Intake Bot', 'AI Automation', 'Global Telecom Provider', 'assets/img/portfolio-4.jpg', '', 'Multi-channel autonomous AI agent providing instant lead triaging, customer onboarding, and initial technical incident logging 24/7.', 4);

-- 7. Initial Videos for Video Gallery
INSERT INTO `videos` (`title`, `category`, `video_type`, `video_source`, `description`, `order_num`) VALUES
('Dream Cyber Security Corporate Overview 2026', 'Company Videos', 'embed', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'An executive introduction to our mission, core cyber defense capabilities, and international technology standards.', 1),
('Academy Showcase: AI Automation in Practice', 'Course Introduction Videos', 'embed', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Discover how our Academy trains professionals to deploy real-world enterprise automations and intelligent bots.', 2),
('Student Project: Cloud Incident Detection System', 'Student Projects and Work', 'embed', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Demonstration of an automated anomaly detection script built by our web and security batch students.', 3),
('Educational Guide: Defending Against Social Engineering', 'Tutorials and Educational Videos', 'embed', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Essential guidelines and proactive measures for corporate teams to safeguard credentials against phishing.', 4);

-- 8. Initial News & Blog Posts
INSERT INTO `posts` (`title`, `slug`, `category`, `tags`, `featured_image`, `excerpt`, `content`, `is_published`, `published_at`) VALUES
(
  'Dream Cyber Security Expands Operations Across Pakistan',
  'dream-cyber-security-expands-pakistan',
  'Company News',
  'expansion, cybersecurity, pakistan, technology',
  'assets/img/blog-1.jpg',
  'We are proud to announce the expansion of our enterprise cyber defense and technology consulting services to support growing businesses across Pakistan.',
  '<p>As digital adoption accelerates throughout Pakistan, the need for international-standard cyber resilience and dependable technology engineering has never been greater. Dream Cyber Security is expanding its enterprise consulting footprint to provide local organizations with world-class defenses against emerging threats.</p><p>Our dedicated team of certified engineers offers continuous monitoring, vulnerability assessments, and bespoke digital automation solutions tailored to corporate clients, financial institutions, and fast-growing enterprises.</p>',
  1,
  NOW()
),
(
  'Top 5 Cybersecurity Essentials Every Business Must Implement in 2026',
  'top-5-cybersecurity-essentials-2026',
  'Cybersecurity Tips',
  'cyber hygiene, security tips, best practices',
  'assets/img/blog-2.jpg',
  'Discover the critical security controls and organizational hygiene required to protect your business against modern ransomware and data exfiltration.',
  '<p>In modern corporate networks, perimeter defense alone is no longer sufficient. Organizations must transition to a zero-trust model where every access request is verified and inspected.</p><p>Key steps include multi-factor authentication (MFA), strict role-based access control, automated offsite encrypted backups, continuous vulnerability scanning, and employee phishing awareness drills.</p>',
  1,
  NOW()
);

-- 9. Initial FAQs
INSERT INTO `faqs` (`question`, `answer`, `category`, `order_num`) VALUES
('What cybersecurity services does Dream Cyber Security provide in Pakistan?', 'We provide comprehensive vulnerability assessment and penetration testing (VAPT), zero-trust architecture hardening, ISO 27001 readiness, incident response, and continuous security audits for enterprise infrastructures.', 'Services', 1),
('Can we enroll or purchase courses directly online?', 'Our Academy section is strictly for showcase and informational purposes. We do not sell courses online or process online admissions. To inquire about curriculum, schedules, or corporate training, please click "Contact for Details" or message us via WhatsApp.', 'Academy', 2),
('Do you provide custom software and web development?', 'Yes, we design and build bespoke enterprise web applications, corporate websites, custom CRM/ERP modules, and secure API architectures adhering to international performance and security standards.', 'Services', 3),
('How quickly can your team respond to security inquiries or project requests?', 'Our team reviews all incoming inquiries within 2 to 4 business hours. For urgent inquiries, you can reach out directly via our official WhatsApp button for immediate assistance.', 'General', 4);

