'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa6';
import { Check, Clock, Calendar, Award, ArrowUpRight, Play, Sparkles, Shield, User, ChevronRight } from 'lucide-react';

export interface CourseData {
  slug: string;
  title: string;
  name?: string;
  category?: string;
  badge?: string;
  overview?: string;
  desc?: string;
  duration?: string;
  weeks?: number;
  level?: string;
  schedule?: string;
  start_date?: string;
  fee?: string;
  seats_percent?: number;
  live_projects?: number;
  intro_video_url?: string;
  youtube_id?: string;
  thumbnail_url?: string;
  video_length?: string;
  learning_outcomes?: string[];
  modules?: Array<{
    week: string;
    title: string;
    subtitle: string;
    topics: string[];
    project: string;
  }>;
  tools?: string[];
  target_audience?: Array<{
    icon: string;
    title: string;
    desc: string;
  }>;
  mentor?: {
    name: string;
    designation: string;
    bio: string;
  };
  includes?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

interface CourseDetailPageClientProps {
  course: CourseData;
  whatsappNumber?: string;
}

// Built-in rich defaults from course.html for primary academy tracks
const RICH_COURSES_METADATA: Record<string, Partial<CourseData>> = {
  // 'ai-automation': {
  //   category: 'Specialized Engineering',
  //   badge: '🔥 Hot Course',
  //   name: 'AI Automation & Agents',
  //   title: 'AI Automation & Agents',
  //   overview: 'Build AI agents, LLM-powered workflows and end-to-end business automations with n8n, Make and modern AI APIs — and deploy them for real clients.',
  //   weeks: 10,
  //   duration: '10 Weeks',
  //   level: 'Intermediate',
  //   schedule: '3 classes / week',
  //   start_date: 'Next month',
  //   fee: 'Contact for fee',
  //   seats_percent: 72,
  //   live_projects: 5,
  //   video_length: '4:32',
  //   thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80',
  //   learning_outcomes: [
  //     'Design prompts and LLM workflows that give reliable, structured output',
  //     'Build autonomous AI agents with tools, memory and guardrails',
  //     'Automate business processes end-to-end with n8n and Make',
  //     'Connect CRMs, WhatsApp, email and Google Sheets via APIs & webhooks',
  //     'Create AI chatbots trained on your own business data (RAG)',
  //     'Deploy, monitor and sell automation projects to real clients',
  //   ],
  //   modules: [
  //     {
  //       week: '1–2',
  //       title: 'Generative AI Foundations',
  //       subtitle: 'LLMs, prompting & AI APIs',
  //       topics: ['How LLMs work', 'Prompt engineering patterns', 'OpenAI / Claude APIs', 'Structured JSON outputs'],
  //       project: 'Mini project: AI content generator',
  //     },
  //     {
  //       week: '3–4',
  //       title: 'Workflow Automation',
  //       subtitle: 'n8n & Make pipelines',
  //       topics: ['Triggers, nodes & data mapping', 'Webhooks & HTTP requests', 'Error handling & retries', 'Google Workspace automations'],
  //       project: 'Mini project: Lead capture → CRM pipeline',
  //     },
  //     {
  //       week: '5–6',
  //       title: 'AI Agents',
  //       subtitle: 'Tools, memory & reasoning',
  //       topics: ['Agent architectures', 'Tool calling & function use', 'Memory & vector databases', 'Multi-agent workflows'],
  //       project: 'Mini project: Research & reply agent',
  //     },
  //     {
  //       week: '7–8',
  //       title: 'Cognitive Bots',
  //       subtitle: 'Chatbots & RAG',
  //       topics: ['Knowledge-base chatbots (RAG)', 'WhatsApp & website bots', 'Human hand-off flows', 'Bot analytics'],
  //       project: 'Mini project: Business FAQ chatbot',
  //     },
  //     {
  //       week: '9–10',
  //       title: 'Capstone & Freelancing',
  //       subtitle: 'Ship a real automation',
  //       topics: ['Client discovery & scoping', 'Deployment & monitoring', 'Pricing & proposals', 'Portfolio presentation'],
  //       project: 'Capstone: Full AI automation system for a real business',
  //     },
  //   ],
  //   tools: ['ChatGPT', 'Claude', 'n8n', 'Make', 'Zapier', 'OpenAI API', 'Pinecone', 'Google Sheets'],
  //   target_audience: [
  //     { icon: '🎯', title: 'Freelancers', desc: 'Add high-paying AI automation services to your client offering.' },
  //     { icon: '💼', title: 'Business owners', desc: 'Automate sales, support and operations to save hours daily.' },
  //     { icon: '🧑‍💻', title: 'Developers & students', desc: 'Move into one of the fastest-growing modern tech careers.' },
  //   ],
  //   mentor: {
  //     name: 'Moeed Rizwan',
  //     designation: 'Senior AI & Automations Expert, Dream Cyber Security',
  //     bio: 'Builds AI agents and automation systems for DCS enterprise clients and leads the agentic AI automations program.',
  //   },
  //   includes: [
  //     'Live instructor-led classes',
  //     'Recorded sessions for revision',
  //     'Ready-made automation templates',
  //     '5+ portfolio projects',
  //     'Verified DCS diploma',
  //     'Internship access for top performers',
  //   ],
  //   faqs: [
  //     {
  //       question: 'Do I need coding experience?',
  //       answer: 'No. We start from fundamentals — n8n and Make are visual workflow tools. Basic computer and logic skills are sufficient.',
  //     },
  //     {
  //       question: 'Will I need paid tools?',
  //       answer: 'Most tools have free tiers. We guide you step-by-step on how to practice and build projects at little to no software cost.',
  //     },
  //     {
  //       question: 'Can I freelance after this course?',
  //       answer: 'Yes — the final capstone module covers client discovery, packaging automation retainers, pricing and proposals, and you graduate with a verified portfolio.',
  //     },
  //   ],
  // },

  'ai-automation': {
    category: 'AI & Automation',
    badge: '🤖 Agentic AI',
    name: 'Agentic AI Automations',
    title: 'Agentic AI Automations',
    overview: 'A hands-on, project-based professional certification program designed to develop practical skills in Agentic AI and workflow automation. Learn n8n, Railway deployment, Google Cloud APIs, AI agents, multi-agent systems and RAG, culminating in a real-world capstone project.',
    weeks: 7,
    duration: '1.5 Months',
    level: 'Intermediate',
    schedule: '3 days / week',
    start_date: 'Next month',
    fee: 'Contact for fee',
    seats_percent: 55,
    live_projects: 1,
    video_length: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80',

    learning_outcomes: [
      'Understand Agentic AI concepts, AI agents and LLM-powered automation workflows',
      'Build automated workflows using n8n, nodes, triggers, webhooks and REST APIs',
      'Deploy and manage production-ready n8n services using Railway',
      'Integrate Gmail, Google Calendar, Google Sheets, Drive and other Google Cloud APIs',
      'Build AI agents using LLMs, memory, tool calling and the ReAct pattern',
      'Implement Retrieval-Augmented Generation (RAG) using vector stores and embeddings',
      'Design and orchestrate multi-agent systems with agent handoffs and parallel execution',
      'Monitor, secure and deploy AI automation systems using production practices',
      'Build and demonstrate a complete end-to-end Agentic AI capstone project',
    ],

    modules: [
      {
        week: '1–2',
        title: 'Foundations & Environment Setup',
        subtitle: 'Agentic AI, n8n and Railway',
        topics: [
          'Introduction to Agentic AI and AI-powered workflows',
          'Environment Setup — n8n & Railway',
          'Google Cloud Console Orientation',
          'n8n Fundamentals and Workflow Creation',
          'Webhooks, Triggers and HTTP Requests',
          'Data Transformation, Routing and Sub-workflows',
        ],
        project: 'Build and deploy your first automated n8n workflows',
      },
      {
        week: '3–4',
        title: 'Google Cloud APIs & Integrations',
        subtitle: 'Google Cloud services and AI APIs',
        topics: [
          'Gmail & Google Calendar API Integration',
          'Google Sheets & Drive API',
          'Google Cloud Storage & Vision API',
          'Vertex AI & Gemini API',
          'Google NLP, Translation & Speech APIs',
          'BigQuery & Pub/Sub Basics',
        ],
        project: 'Build an automation integrating Google Cloud services and APIs',
      },
      {
        week: '5–6',
        title: 'Agentic AI Systems & Multi-Agent Design',
        subtitle: 'Building intelligent AI agents',
        topics: [
          'LLM Agent Node, System Prompts and Memory',
          'Tool-Calling Agents and ReAct Pattern',
          'RAG — Retrieval-Augmented Generation',
          'Vector Stores, Embeddings and Knowledge-Base Q&A',
          'Multi-Agent Workflows and Orchestration',
          'Railway Production Deployment',
          'Monitoring, Logging and Security',
        ],
        project: 'Develop and deploy an intelligent multi-agent automation system',
      },
      {
        week: '7',
        title: 'Capstone Project & Certification',
        subtitle: 'End-to-end Agentic AI system',
        topics: [
          'Capstone Planning & Architecture',
          'Build & Integration Sprint',
          'Integration of n8n, Railway, GCP APIs and AI Agents',
          'Live Project Demonstration',
          'Peer Q&A, Feedback and Evaluation',
          'Certificate of Completion',
        ],
        project: 'Final Capstone: Complete End-to-End Agentic AI Automation System',
      },
    ],

    tools: [
      'n8n',
      'Railway',
      'Google Cloud Console',
      'Google Gemini API',
      'Vertex AI',
      'REST APIs',
      'Webhooks',
      'PostgreSQL',
      'Supabase',
      'Docker',
      'GitHub',
    ],

    target_audience: [
      {
        icon: '💻',
        title: 'Developers',
        desc: 'Learn to build intelligent AI agents, API integrations and automated backend workflows.',
      },
      {
        icon: '🤖',
        title: 'AI Enthusiasts',
        desc: 'Explore Agentic AI, LLM-powered workflows, RAG and multi-agent orchestration.',
      },
      {
        icon: '⚙️',
        title: 'Automation Professionals',
        desc: 'Build, deploy and manage production-ready business automation systems.',
      },
    ],

    mentor: {
      name: 'To Be Announced',
      designation: 'Agentic AI & Automation Instructor',
      bio: 'Instructor information will be announced soon.',
    },

    includes: [
      '18 instructor-led classes',
      '2 hours per session',
      'Hands-on workflow automation exercises',
      'Practical Google Cloud API integrations',
      'AI agent and multi-agent development',
      'End-to-end capstone project',
      'Live project demonstration and evaluation',
      'Professional certification from DCS Academy',
    ],

    faqs: [
      {
        question: 'Do I need programming experience?',
        answer: 'Basic familiarity with any programming language is recommended. Python is preferred but not required.',
      },
      {
        question: 'Do I need to understand APIs?',
        answer: 'Yes. A basic understanding of APIs and HTTP requests is a prerequisite for this course.',
      },
      {
        question: 'Which tools and platforms will I learn?',
        answer: 'You will work with n8n, Railway, Google Cloud Console, REST APIs, webhooks, PostgreSQL, Supabase, Docker and GitHub.',
      },
      {
        question: 'Will I build a real-world project?',
        answer: 'Yes. The course concludes with an end-to-end Agentic AI capstone project integrating n8n, Railway, Google Cloud APIs and AI agents.',
      },
      {
        question: 'What equipment do I need?',
        answer: 'You need a laptop with at least 8GB RAM, internet connectivity, a Google account and a GitHub account.',
      },
    ],
  },

  'web-development': {
    category: 'Specialized Engineering',
    badge: '💼 Career Track',
    name: 'Enterprise Web Dev',
    title: 'Enterprise Web Dev',
    overview: 'Become a job-ready full-stack developer — from HTML, CSS and JavaScript to React, Next.js, APIs and databases, with secure coding built in.',
    weeks: 12,
    duration: '12 Weeks',
    level: 'Beginner → Pro',
    schedule: '3 classes / week',
    start_date: 'Next month',
    fee: 'Contact for fee',
    seats_percent: 60,
    live_projects: 2,
    video_length: '5:10',
    thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&q=80',
    learning_outcomes: [
      'Build responsive, accessible layouts with HTML & modern CSS',
      'Write clean, modern JavaScript (ES6+)',
      'Create component-based interactive UIs with React',
      'Ship full-stack enterprise apps with Next.js and API routes',
      'Design databases with MongoDB and build REST APIs',
      'Deploy securely to Vercel and AWS with Git CI/CD workflows',
    ],
    modules: [
      {
        week: '1–3',
        title: 'Web Foundations',
        subtitle: 'HTML, CSS & responsive design',
        topics: ['Semantic HTML', 'Flexbox & CSS Grid', 'Responsive design', 'Tailwind CSS'],
        project: 'Project: Responsive business website',
      },
      {
        week: '4–6',
        title: 'JavaScript Mastery',
        subtitle: 'Logic, DOM & APIs',
        topics: ['ES6+ fundamentals', 'DOM & events', 'Async JS & fetch', 'Git & GitHub'],
        project: 'Project: Interactive web app',
      },
      {
        week: '7–9',
        title: 'React Architecture',
        subtitle: 'Components & state',
        topics: ['Components & props', 'Hooks & state management', 'Routing & layout', 'Forms & validation'],
        project: 'Project: React analytics dashboard',
      },
      {
        week: '10–12',
        title: 'Next.js & Back-end',
        subtitle: 'Full-stack with APIs',
        topics: ['App Router & server components', 'API routes & middleware', 'MongoDB & Mongoose', 'Auth & security basics'],
        project: 'Project: Full-stack SaaS application',
      },
      {
        week: '13–14',
        title: 'Capstone & Career',
        subtitle: 'Deploy & get hired',
        topics: ['Vercel deployment', 'Performance & SEO optimization', 'Portfolio & CV review', 'Technical interview prep'],
        project: 'Capstone: Production-ready client project',
      },
    ],
    tools: ['VS Code', 'HTML / CSS', 'JavaScript', 'React', 'Next.js', 'Node.js', 'MongoDB', 'Vercel'],
    target_audience: [
      { icon: '🎓', title: 'Students & graduates', desc: 'Build job-ready engineering skills and an industry portfolio employers trust.' },
      { icon: '🔁', title: 'Career switchers', desc: 'Transition into professional software engineering with a structured mentor-led path.' },
      { icon: '🚀', title: 'Founders', desc: 'Architect, code and launch your own software products and digital platforms.' },
    ],
    mentor: {
      name: 'DCS Engineering Team',
      designation: 'Senior Web Engineers, Dream Cyber Security',
      bio: 'Engineers who architect and ship production web platforms and web security applications for DCS clients every week.',
    },
    includes: [
      'Live instructor-led classes',
      'Recorded sessions for revision',
      'Code reviews on every project',
      '6 portfolio projects',
      'Verified DCS diploma',
      'Internship access for top performers',
    ],
    faqs: [
      {
        question: 'I have never coded. Can I join?',
        answer: 'Yes. The curriculum starts from absolute fundamentals and systematically builds your abilities week by week.',
      },
      {
        question: 'Do I need a powerful laptop?',
        answer: 'Any laptop with at least 8 GB of RAM and standard internet connectivity is sufficient for web development.',
      },
      {
        question: 'Will I get career and internship support?',
        answer: 'We provide portfolio reviews, resume optimization, and interview coaching. Outstanding performers earn direct internship access at DCS.',
      },
    ],
  },
  // 'video-editing-graphic-design': {
  //   category: 'Creative & Foundations',
  //   badge: '🎨 Creative',
  //   name: 'Video Editing & Design',
  //   title: 'Video Editing & Design',
  //   overview: 'Learn professional video editing, motion graphics, 3D basics and brand design to create content for social media, ads and clients.',
  //   weeks: 8,
  //   duration: '8 Weeks',
  //   level: 'Beginner',
  //   schedule: '3 classes / week',
  //   start_date: 'Next month',
  //   fee: 'Contact for fee',
  //   seats_percent: 55,
  //   live_projects: 6,
  //   video_length: '3:48',
  //   thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400&q=80',
  //   learning_outcomes: [
  //     'Design social posts, thumbnails and brand kits with Photoshop and Illustrator',
  //     'Edit reels, commercial ads and YouTube videos in Adobe Premiere Pro',
  //     'Create kinetic typography, motion graphics and logo reveals in After Effects',
  //     'Colour-grade footage and master sound design with professional audio mixing',
  //     'Build 3D product renders and scene compositions in Blender',
  //     'Package and deliver client-ready creative assets on freelance platforms',
  //   ],
  //   modules: [
  //     {
  //       week: '1–2',
  //       title: 'Design Foundations',
  //       subtitle: 'Photoshop & Illustrator',
  //       topics: ['Colour theory, typography & layout', 'Photoshop essentials', 'Illustrator & vector branding', 'Social media creatives'],
  //       project: 'Project: Brand visual identity kit',
  //     },
  //     {
  //       week: '3–4',
  //       title: 'Video Editing',
  //       subtitle: 'Adobe Premiere Pro',
  //       topics: ['Pacing & visual storytelling', 'Reels, shorts & viral framing', 'Colour grading & LUTs', 'Audio cleanup & sound FX'],
  //       project: 'Project: 3 short-form videos for a brand',
  //     },
  //     {
  //       week: '5–6',
  //       title: 'Motion Graphics',
  //       subtitle: 'Adobe After Effects',
  //       topics: ['Keyframes, curves & graph editor', 'Kinetic typography & titles', 'Logo animation & lower thirds', 'Dynamic templates'],
  //       project: 'Project: Animated commercial ad',
  //     },
  //     {
  //       week: '7',
  //       title: '3D Basics',
  //       subtitle: 'Intro to 3D & Blender',
  //       topics: ['3D modelling fundamentals', 'Materials, textures & lighting', 'Product camera angles & rendering'],
  //       project: 'Project: 3D commercial product shot',
  //     },
  //     {
  //       week: '8',
  //       title: 'Portfolio & Clients',
  //       subtitle: 'Go professional',
  //       topics: ['Building your video showreel', 'Client workflow & revisions', 'Fiverr & Upwork profile setup'],
  //       project: 'Capstone: Complete brand video campaign',
  //     },
  //   ],
  //   tools: ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'CapCut', 'Canva', 'Blender', 'Figma'],
  //   target_audience: [
  //     { icon: '📱', title: 'Content creators', desc: 'Make scroll-stopping reels, YouTube content and ads for your channels.' },
  //     { icon: '🎯', title: 'Freelancers', desc: 'Offer high-demand video editing, motion design, and branding to global clients.' },
  //     { icon: '🏢', title: 'Marketing teams', desc: 'Produce in-house commercial creative assets rapidly and effectively.' },
  //   ],
  //   mentor: {
  //     name: 'DCS Creative Team',
  //     designation: 'Video & Design Specialists, Dream Cyber Security',
  //     bio: 'Editors and designers producing high-retention brand videos, ads and motion graphics for DCS clients.',
  //   },
  //   includes: [
  //     'Live instructor-led classes',
  //     'Recorded sessions for revision',
  //     'Asset, sound & template packs',
  //     '6 portfolio projects',
  //     'Verified DCS diploma',
  //     'Internship access for top performers',
  //   ],
  //   faqs: [
  //     {
  //       question: 'Do I need my own software?',
  //       answer: 'You can practice on campus lab workstations; we also instruct you on setup, free trials, and open-source equivalents.',
  //     },
  //     {
  //       question: 'Is this good for complete beginners?',
  //       answer: 'Yes, we start from visual design fundamentals before advancing into timeline editing and motion graphics.',
  //     },
  //     {
  //       question: 'Will I have a showreel when I graduate?',
  //       answer: 'Yes, you will complete an industry-standard video showreel and a portfolio of client-ready assets.',
  //     },
  //   ],
  // },


  'graphic-designing-with-ai': {
    category: 'Creative & Design',
    badge: '🎨 Graphic Design',
    name: 'Graphic Designing with AI',
    title: 'Graphic Designing with AI',
    overview: 'Learn professional graphic design from design fundamentals to branding, social media creatives, print design, UI basics and AI-powered creative workflows. Build a professional portfolio and prepare for freelance opportunities in 12 weeks.',
    weeks: 12,
    duration: '3 Months',
    level: 'Beginner',
    schedule: '3 classes / week',
    start_date: 'Next month',
    fee: 'Contact for fee',
    seats_percent: 55,
    live_projects: 3,
    video_length: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1400&q=80',

    learning_outcomes: [
      'Design professional logos, brand identities and social media creatives',
      'Work confidently with Photoshop, Illustrator, InDesign, Figma and Canva',
      'Use AI tools to produce designs faster without compromising design quality',
      'Prepare print-ready and web-ready design files correctly',
      'Graduate with a 10+ piece portfolio and live Fiverr / Upwork profiles',
    ],

    modules: [
      {
        week: '1',
        title: 'Design Thinking & Visual Principles',
        subtitle: 'Introduction to Graphic Design',
        topics: [
          'Introduction to Graphic Design',
          'Elements & Principles of Design',
          'Colour Theory',
        ],
        project: '',
      },
      {
        week: '2',
        title: 'Typography, Layout & Photoshop Basics',
        subtitle: 'Design fundamentals and Photoshop',
        topics: [
          'Typography Fundamentals',
          'Layout, Grids & Composition',
          'Photoshop Interface & Basics',
        ],
        project: '',
      },
      {
        week: '3',
        title: 'Photoshop Power Skills',
        subtitle: 'Advanced Photoshop techniques',
        topics: [
          'Selections & Layers',
          'Masks & Adjustments',
          'Photo Manipulation & Compositing',
        ],
        project: '',
      },
      {
        week: '4',
        title: 'Illustrator & Month 1 Project',
        subtitle: 'Adobe Illustrator',
        topics: [
          'Illustrator Interface & Shapes',
          'Pen Tool & Vector Drawing',
          'Month 1 Project Lab & Review',
        ],
        project: 'Month 1 Portfolio Project',
      },
      {
        week: '5',
        title: 'Logo Design',
        subtitle: 'Branding and logo development',
        topics: [
          'Branding & Brand Strategy',
          'The Logo Design Process',
          'Logo Refinement & Presentation',
        ],
        project: '',
      },
      {
        week: '6',
        title: 'Brand Identity & Print',
        subtitle: 'Professional brand design',
        topics: [
          'Brand Guidelines',
          'Stationery & Print Design',
          'Illustrator Advanced',
        ],
        project: '',
      },
      {
        week: '7',
        title: 'Social Media Design',
        subtitle: 'Social media creative production',
        topics: [
          'Social Media Design Fundamentals',
          'Canva Pro for Fast Production',
          'Carousels & Content Series',
        ],
        project: '',
      },
      {
        week: '8',
        title: 'Ad Creatives, Figma & Month 2 Project',
        subtitle: 'Digital advertising and UI design',
        topics: [
          'Ad Creatives That Convert',
          'Figma Basics',
          'Month 2 Project Lab & Review',
        ],
        project: 'Month 2 Portfolio Project',
      },
      {
        week: '9',
        title: 'AI for Designers',
        subtitle: 'AI-powered design workflows',
        topics: [
          'AI Inside Adobe',
          'AI Image Generation & Prompting',
          'AI Workflow & Ethics',
        ],
        project: '',
      },
      {
        week: '10',
        title: 'Print, Packaging & UI',
        subtitle: 'Professional design production',
        topics: [
          'InDesign & Multi-page Design',
          'Packaging & Label Design',
          'UI Design Basics',
        ],
        project: '',
      },
      {
        week: '11',
        title: 'Portfolio & Freelancing',
        subtitle: 'Preparing for professional work',
        topics: [
          'Building Your Portfolio',
          'Freelancing on Fiverr & Upwork',
          'Client Communication & Workflow',
        ],
        project: '',
      },
      {
        week: '12',
        title: 'Final Project & Graduation',
        subtitle: 'Final portfolio presentation',
        topics: [
          'Final Project Kick-off',
          'Final Project Studio Day',
          'Final Presentation & Graduation',
        ],
        project: 'Final Portfolio Project',
      },
    ],

    tools: [
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe InDesign',
      'Figma',
      'Canva Pro',
      'Adobe Firefly',
      'Midjourney',
      'ChatGPT Images',
    ],

    target_audience: [
      {
        icon: '🎨',
        title: 'Beginners & Students',
        desc: 'Learn graphic design from the fundamentals without requiring prior design experience.',
      },
      {
        icon: '💼',
        title: 'Freelancers',
        desc: 'Build a professional design portfolio and prepare to offer creative services to clients.',
      },
      {
        icon: '📢',
        title: 'Marketers & Business Owners',
        desc: 'Create professional brand identities, advertisements and social media creatives.',
      },
    ],

    mentor: {
      name: 'To Be Announced',
      designation: 'Graphic Design Instructor',
      bio: 'Instructor information will be announced soon.',
    },

    includes: [
      '36 instructor-led classes',
      '3 portfolio projects',
      'Practical design exercises',
      'Professional portfolio development',
    ],

    faqs: [
      {
        question: 'Do I need previous graphic design experience?',
        answer: 'No. This course starts with design fundamentals and gradually progresses to professional graphic design and AI-powered workflows.',
      },
      {
        question: 'Which software will I learn?',
        answer: 'You will learn Photoshop, Illustrator, InDesign, Figma, Canva Pro, Adobe Firefly and AI image generation tools.',
      },
      {
        question: 'Will I build a portfolio?',
        answer: 'Yes. You will complete three portfolio projects and graduate with a portfolio containing 10 or more design pieces.',
      },
    ],
  },

  'video-editing-graphic-design': {
    category: 'Creative & Media',
    badge: '🎬 Video Editing',
    name: 'Video Editing with AI',
    title: 'Video Editing with AI',
    overview: 'Learn professional video editing from the fundamentals to motion graphics, colour grading, social media content, commercial editing and AI-powered production workflows. Build a professional showreel and prepare for freelance opportunities in 12 weeks.',
    weeks: 12,
    duration: '3 Months',
    level: 'Pro',
    schedule: '3 classes / week',
    start_date: 'Next month',
    fee: 'Contact for fee',
    seats_percent: 55,
    live_projects: 3,
    video_length: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400&q=80',

    learning_outcomes: [
      'Edit vlogs, Reels, YouTube videos, advertisements and podcasts professionally',
      'Create motion graphics, text animations and logo introductions in After Effects',
      'Colour-grade footage for a cinematic look using DaVinci Resolve',
      'Use AI tools for voice, captions, B-roll and faster editing',
      'Graduate with a professional showreel and live Fiverr / Upwork profiles',
    ],

    modules: [
      {
        week: '1',
        title: 'Foundations of Editing',
        subtitle: 'Introduction to Video Editing',
        topics: [
          'Introduction to Video Editing',
          'Storytelling for Editors',
          'Premiere Pro: Interface & Setup',
        ],
        project: '',
      },
      {
        week: '2',
        title: 'Cutting & Audio',
        subtitle: 'Editing techniques and sound',
        topics: [
          'Timeline Editing Tools',
          'Cutting Techniques',
          'Audio Editing Basics',
        ],
        project: '',
      },
      {
        week: '3',
        title: 'Music, Titles & Motion Basics',
        subtitle: 'Creative video production',
        topics: [
          'Music & Sound Design',
          'Text, Titles & Captions',
          'Transitions, Speed & Keyframes',
        ],
        project: '',
      },
      {
        week: '4',
        title: 'Colour, Export & Month 1 Project',
        subtitle: 'Video finishing and delivery',
        topics: [
          'Colour Correction in Lumetri',
          'Export & Mobile Editing',
          'Month 1 Project Lab & Review',
        ],
        project: 'Month 1 Portfolio Project',
      },
      {
        week: '5',
        title: 'After Effects Fundamentals',
        subtitle: 'Introduction to motion graphics',
        topics: [
          'After Effects: Interface & Keyframes',
          'Animation Principles',
          'Text Animation & Kinetic Typography',
        ],
        project: '',
      },
      {
        week: '6',
        title: 'Motion Graphics',
        subtitle: 'Advanced animation techniques',
        topics: [
          'Shapes, Masks & Track Mattes',
          'Logo Animation & Intros',
          'Tracking, Stabilising & Dynamic Link',
        ],
        project: '',
      },
      {
        week: '7',
        title: 'Colour Grading in DaVinci Resolve',
        subtitle: 'Professional colour workflows',
        topics: [
          'DaVinci Resolve Introduction',
          'Correction vs Grading',
          'Creative Looks & LUTs',
        ],
        project: '',
      },
      {
        week: '8',
        title: 'Social Content & Month 2 Project',
        subtitle: 'Social media video production',
        topics: [
          'Reels, TikTok & Shorts',
          'CapCut Pro & Trendy Effects',
          'YouTube Editing & Month 2 Review',
        ],
        project: 'Month 2 Portfolio Project',
      },
      {
        week: '9',
        title: 'AI for Editors',
        subtitle: 'AI-powered video production',
        topics: [
          'AI Editing Tools',
          'AI Video Generation',
          'AI Voice, Music & Ethics',
        ],
        project: '',
      },
      {
        week: '10',
        title: 'Commercial Editing',
        subtitle: 'Professional video production',
        topics: [
          'Ads & Commercials',
          'Podcasts & Interviews',
          'Corporate, Events & Documentary',
        ],
        project: '',
      },
      {
        week: '11',
        title: 'Showreel & Freelancing',
        subtitle: 'Preparing for professional work',
        topics: [
          'Building Your Showreel',
          'Freelancing on Fiverr & Upwork',
          'Client Workflow & File Management',
        ],
        project: '',
      },
      {
        week: '12',
        title: 'Final Project & Graduation',
        subtitle: 'Final video presentation',
        topics: [
          'Final Project Kick-off',
          'Final Project Studio Day',
          'Final Screening & Graduation',
        ],
        project: 'Final Showreel Project',
      },
    ],

    tools: [
      'Adobe Premiere Pro',
      'Adobe After Effects',
      'DaVinci Resolve',
      'CapCut Desktop & Mobile',
      'Adobe Media Encoder',
      'Descript',
      'Runway',
      'ElevenLabs',
    ],

    target_audience: [
      {
        icon: '🎥',
        title: 'Beginners & Students',
        desc: 'Learn video editing from the basics without requiring previous editing experience.',
      },
      {
        icon: '💼',
        title: 'Freelancers & Creators',
        desc: 'Build a professional showreel and offer video editing services to global clients.',
      },
      {
        icon: '📱',
        title: 'Marketers & Business Owners',
        desc: 'Create engaging social media videos, advertisements and commercial content.',
      },
    ],

    mentor: {
      name: 'To Be Announced',
      designation: 'Video Editing Instructor',
      bio: 'Instructor information will be announced soon.',
    },

    includes: [
      '36 instructor-led classes',
      '3 portfolio projects',
      'Practical video editing exercises',
      'Professional showreel development',
    ],

    faqs: [
      {
        question: 'Do I need previous video editing experience?',
        answer: 'No. The course starts with editing fundamentals and progresses to professional video editing, motion graphics and AI workflows.',
      },
      {
        question: 'Which software will I learn?',
        answer: 'You will learn Adobe Premiere Pro, After Effects, DaVinci Resolve, CapCut, Adobe Media Encoder and AI creative tools.',
      },
      {
        question: 'Will I have a showreel after completing the course?',
        answer: 'Yes. You will complete three practical projects and develop a professional showreel for your portfolio.',
      },
    ],
  },


  'computer-basics': {
    category: 'Creative & Foundations',
    badge: '🌱 Beginner Friendly',
    name: 'Computer Basics & Office',
    title: 'Computer Basics & Office',
    overview: 'Get confident with computers, MS Office, the internet, email and staying safe online — the foundation for every modern job.',
    weeks: 6,
    duration: '6 Weeks',
    level: 'Absolute Beginner',
    schedule: '3 classes / week',
    start_date: 'Next month',
    fee: 'Contact for fee',
    seats_percent: 48,
    live_projects: 4,
    video_length: '2:55',
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&q=80',
    learning_outcomes: [
      'Use Windows, files, folders and settings with total confidence',
      'Write professional letters, reports and CVs in Microsoft Word',
      'Build calculations, formulas, budgets and charts in Microsoft Excel',
      'Create polished slide decks and visual presentations in PowerPoint',
      'Navigate email, cloud storage (Google Drive/OneDrive) and online tools',
      'Protect yourself from online scams, phishing, and malware with cyber hygiene',
    ],
    modules: [
      {
        week: '1',
        title: 'Computer Fundamentals',
        subtitle: 'Hardware, OS & files',
        topics: ['Parts of a computer & peripherals', 'Windows OS navigation', 'File management & shortcuts', 'Touch typing practice'],
        project: 'Task: Organise a digital workspace',
      },
      {
        week: '2',
        title: 'MS Word Mastery',
        subtitle: 'Professional documents',
        topics: ['Text formatting & styles', 'Tables, headers & images', 'Cover letters & professional CV writing'],
        project: 'Task: Create your professional CV',
      },
      {
        week: '3–4',
        title: 'MS Excel & PowerPoint',
        subtitle: 'Data & presentations',
        topics: ['Excel formulas & basic functions', 'Data tables & charts', 'PowerPoint slides & animations'],
        project: 'Task: Budget spreadsheet & business presentation',
      },
      {
        week: '5',
        title: 'Internet & Cloud Tools',
        subtitle: 'Everyday online productivity',
        topics: ['Web browsers & search techniques', 'Gmail & professional email etiquette', 'Google Drive & file sharing'],
        project: 'Task: Professional business email setup',
      },
      {
        week: '6',
        title: 'Cyber Hygiene & Security',
        subtitle: 'Stay safe online',
        topics: ['Password security & 2FA', 'Recognizing phishing & scam links', 'Safe social media browsing'],
        project: 'Final assessment & graduation certification',
      },
    ],
    tools: ['Windows', 'MS Word', 'MS Excel', 'PowerPoint', 'Gmail', 'Google Drive', 'Chrome', '2FA Apps'],
    target_audience: [
      { icon: '🌱', title: 'Absolute beginners', desc: 'Start from zero with friendly, patient instructors guiding every click.' },
      { icon: '🧓', title: 'Adults & job seekers', desc: 'Gain the fundamental digital literacy that modern office employers require.' },
      { icon: '🎒', title: 'Students', desc: 'Build a solid IT foundation before enrolling in advanced software courses.' },
    ],
    mentor: {
      name: 'DCS Academy Trainers',
      designation: 'Foundation Instructors, Dream Cyber Security',
      bio: 'Dedicated instructors who have guided hundreds of students to achieve digital confidence and computer literacy.',
    },
    includes: [
      'Live instructor-led classes',
      'Daily practical tasks',
      'Typing speed sessions',
      'Full lab access on campus',
      'Verified DCS certificate',
      'Direct pathway to advanced tech courses',
    ],
    faqs: [
      {
        question: 'I have never used a computer before. Can I join?',
        answer: 'Absolutely. This course is specially tailored for complete beginners with zero prior experience.',
      },
      {
        question: 'Are classes conducted in Urdu or English?',
        answer: 'Classes are taught in conversational Urdu and English terminology so everyone can follow comfortably.',
      },
      {
        question: 'What course can I take after completing this?',
        answer: 'You can smoothly advance into Enterprise Web Dev, Video Editing & Graphic Design, or AI Automation.',
      },
    ],
  },
};

// Aliases lookup
const NORMALIZED_KEYS: Record<string, string> = {
  'ai-automation': 'ai-automation',
  'ai-automation-agents': 'ai-automation',
  'web': 'web-development',
  'web-dev': 'web-development',
  'web-development': 'web-development',
  'enterprise-web-dev': 'web-development',
  'video-design': 'video-editing-graphic-design',
  'video-editing': 'video-editing-graphic-design',
  'video-editing-graphic-design': 'video-editing-graphic-design',
  'computer-basics': 'computer-basics',
  'computer-basics-office': 'computer-basics',
};

export default function CourseDetailPageClient({
  course: initialCourse,
  whatsappNumber = '923165478855',
}: CourseDetailPageClientProps) {
  const normKey = NORMALIZED_KEYS[initialCourse.slug] || initialCourse.slug;
  const richDefaults = RICH_COURSES_METADATA[normKey] || RICH_COURSES_METADATA['ai-automation'] || {};

  // Merge database/props course with rich metadata
  const courseName = initialCourse.title || richDefaults.name || 'DCS Course';
  const category = richDefaults.category || 'Specialized Engineering';
  const badge = richDefaults.badge || '🔥 Hot Course';
  const overview = initialCourse.overview || richDefaults.overview || richDefaults.desc || '';
  const weeks = richDefaults.weeks || 10;
  const duration = initialCourse.duration || richDefaults.duration || `${weeks} Weeks`;
  const level = richDefaults.level || 'Beginner → Pro';
  const schedule = richDefaults.schedule || '3 classes / week';
  const startDate = richDefaults.start_date || 'Next month';
  const fee = richDefaults.fee || 'Contact for fee';
  const seatsPercent = richDefaults.seats_percent || 72;
  const liveProjects = richDefaults.live_projects || 5;
  const videoLength = richDefaults.video_length || '4:15';
  const thumbnailUrl = richDefaults.thumbnail_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80';
  const youtubeId = initialCourse.youtube_id || richDefaults.youtube_id || '';

  // Learning outcomes
  const learningOutcomes =
    initialCourse.learning_outcomes && initialCourse.learning_outcomes.length > 0
      ? initialCourse.learning_outcomes
      : richDefaults.learning_outcomes || [
        'Master modern industry workflows and professional toolchains',
        'Build practical, job-ready live capstone projects',
        'Learn from certified senior engineers and practitioners',
        'Earn a verified DCS Academy certification upon completion',
      ];

  // Modules
  const modules =
    initialCourse.modules && initialCourse.modules.length > 0
      ? initialCourse.modules
      : richDefaults.modules || [
        {
          week: '1–2',
          title: 'Core Fundamentals & Theory',
          subtitle: 'Toolchains, environment & setup',
          topics: ['Core industry foundations', 'Environment setup & tooling', 'Practical workflows', 'Best practices'],
          project: 'Mini project: Foundation showcase',
        },
      ];

  // Tools
  const tools = initialCourse.tools || richDefaults.tools || ['Visual Studio Code', 'Git', 'Figma', 'Terminal', 'Cloud Tools'];

  // Target audience
  const targetAudience = initialCourse.target_audience || richDefaults.target_audience || [
    { icon: '🎯', title: 'Freelancers', desc: 'Expand your skillset and charge higher rates for specialized client projects.' },
    { icon: '💼', title: 'Professionals', desc: 'Upgrade your workplace skills with modern industry automation and practices.' },
    { icon: '🧑‍💻', title: 'Students', desc: 'Gain certified technical competence and build an attractive hiring portfolio.' },
  ];

  // Mentor
  const mentor = initialCourse.mentor || richDefaults.mentor || {
    name: 'DCS Engineering Team',
    designation: 'Senior Technical Lead, Dream Cyber Security',
    bio: 'Industry specialists who design, harden and deploy enterprise solutions for DCS clients every week.',
  };

  // Includes
  const includesList = initialCourse.includes || richDefaults.includes || [
    'Live instructor-led interactive sessions',
    'Recorded video archives for revision',
    'Practical lab access & tool templates',
    'Live portfolio projects',
    'Verified DCS diploma certificate',
    'Internship consideration for top graduates',
  ];

  // FAQs
  const faqs = initialCourse.faqs || richDefaults.faqs || [
    {
      question: 'Do I need prior experience to enroll?',
      answer: 'Our programs start with structured foundations before moving to advanced practical applications. Check with our counselors for track prerequisites.',
    },
    {
      question: 'Are classes available online or offline?',
      answer: 'We provide both in-person campus classes in Lahore as well as interactive live online batches for students across Pakistan and abroad.',
    },
    {
      question: 'How do I confirm my seat?',
      answer: 'Click "Submit Admission Inquiry" or message our desk on WhatsApp. Our admissions coordinator will provide upcoming batch dates and registration instructions.',
    },
  ];

  // Canvases
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const netRef = useRef<HTMLCanvasElement>(null);
  const ctaParticlesRef = useRef<HTMLCanvasElement>(null);

  // States
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [animatedSeats, setAnimatedSeats] = useState(0);
  const [weeksCount, setWeeksCount] = useState(0);
  const [modulesCount, setModulesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

  // Typewriter effect for course title
  const [typedTitle, setTypedTitle] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const full = courseName;
    setTypedTitle('');
    setIsTypingDone(false);

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setTypedTitle(full.slice(0, i));
        if (i >= full.length) {
          clearInterval(interval);
          setIsTypingDone(true);
        }
      }, 45);
      return () => clearInterval(interval);
    }, 200);

    return () => clearTimeout(timer);
  }, [courseName]);

  // Count-up stats and seat bar on load
  useEffect(() => {
    const t0 = performance.now() + 300;
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / 1400));
      const e = 1 - Math.pow(1 - p, 3);
      setWeeksCount(Math.round(weeks * e));
      setModulesCount(Math.round(modules.length * e));
      setProjectsCount(Math.round(liveProjects * e));
      setAnimatedSeats(Math.round(seatsPercent * e));

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [weeks, modules.length, liveProjects, seatsPercent]);

  /* ------------------------------------------------------------------
     1. Digital Particles Canvas on Hero Shell
  ------------------------------------------------------------------ */
  useEffect(() => {
    const pc = particlesRef.current;
    if (!pc) return;
    const px = pc.getContext('2d');
    if (!px) return;

    let PW = 0;
    let PH = 0;
    let dots: Array<{ x: number; y: number; r: number; vx: number; vy: number; t: number }> = [];
    let raf = 0;
    let running = true;

    const pResize = () => {
      if (!pc) return;
      const d = window.devicePixelRatio || 1;
      const r = pc.getBoundingClientRect();
      PW = pc.width = Math.max(1, Math.floor(r.width * d));
      PH = pc.height = Math.max(1, Math.floor(r.height * d));
      dots = Array.from({ length: 75 }, () => ({
        x: Math.random() * PW,
        y: Math.random() * PH,
        r: Math.max(0.5, (Math.random() * 2 + 0.8) * d),
        vx: (Math.random() - 0.5) * 0.4 * d,
        vy: (Math.random() - 0.5) * 0.4 * d,
        t: Math.random() * 6,
      }));
    };

    pResize();
    window.addEventListener('resize', pResize);

    const pDraw = () => {
      if (!running || !px) return;
      px.clearRect(0, 0, PW, PH);
      const maxDist = 130 * (window.devicePixelRatio || 1);

      for (const p of dots) {
        p.x += p.vx;
        p.y += p.vy;
        p.t += 0.03;
        if (p.x < 0 || p.x > PW) p.vx *= -1;
        if (p.y < 0 || p.y > PH) p.vy *= -1;
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxDist) {
            px.strokeStyle = `rgba(40,36,95,${Math.max(0, (1 - d / maxDist) * 0.18)})`;
            px.lineWidth = 1;
            px.beginPath();
            px.moveTo(a.x, a.y);
            px.lineTo(b.x, b.y);
            px.stroke();
          }
        }
      }

      dots.forEach((p, i) => {
        px.fillStyle =
          i % 4 ? `rgba(40,36,95,${Math.max(0, 0.25 + Math.sin(p.t) * 0.15)})` : `rgba(255,255,255,${Math.max(0, 0.6 + Math.sin(p.t) * 0.3)})`;
        px.beginPath();
        px.arc(p.x, p.y, Math.max(0.1, p.r), 0, Math.PI * 2);
        px.fill();
      });

      raf = requestAnimationFrame(pDraw);
    };

    pDraw();

    return () => {
      running = false;
      window.removeEventListener('resize', pResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ------------------------------------------------------------------
     2. Circuit Network Canvas in Video Card
  ------------------------------------------------------------------ */
  useEffect(() => {
    const cv = netRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let pts: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let raf = 0;
    let running = true;

    const resize = () => {
      if (!cv) return;
      const r = cv.getBoundingClientRect();
      const d = window.devicePixelRatio || 1;
      W = cv.width = Math.max(1, Math.floor(r.width * d));
      H = cv.height = Math.max(1, Math.floor(r.height * d));
      pts = Array.from({ length: 42 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35 * d,
        vy: (Math.random() - 0.5) * 0.35 * d,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, W, H);
      const max = W * 0.22;

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            ctx.strokeStyle = `rgba(58,63,184,${Math.max(0, (1 - d / max) * 0.3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      pts.forEach((p, i) => {
        ctx.fillStyle = i % 5 ? 'rgba(58,63,184,0.5)' : '#f9ac43';
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, (i % 5 ? 2 : 3) * (window.devicePixelRatio || 1)), 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ------------------------------------------------------------------
     3. CTA Particles Canvas
  ------------------------------------------------------------------ */
  useEffect(() => {
    const cv = ctaParticlesRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let w = 0;
    let h = 0;
    let pts: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let raf = 0;
    let running = true;

    const rs = () => {
      if (!cv) return;
      const d = window.devicePixelRatio || 1;
      const r = cv.getBoundingClientRect();
      w = cv.width = Math.max(1, Math.floor(r.width * d));
      h = cv.height = Math.max(1, Math.floor(r.height * d));
      pts = Array.from({ length: 35 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4 * d,
        vy: (Math.random() - 0.5) * 0.4 * d,
      }));
    };

    rs();
    window.addEventListener('resize', rs);

    const dr = () => {
      if (!running || !cx) return;
      cx.clearRect(0, 0, w, h);
      const m = 120 * (window.devicePixelRatio || 1);

      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < m) {
            cx.strokeStyle = `rgba(40,36,95,${Math.max(0, (1 - d / m) * 0.18)})`;
            cx.beginPath();
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, a.y);
            cx.stroke();
          }
        }
      }

      pts.forEach((p, i) => {
        cx.fillStyle = i % 4 ? 'rgba(40,36,95,0.35)' : 'rgba(255,255,255,0.8)';
        cx.beginPath();
        cx.arc(p.x, p.y, Math.max(0.1, 2.2), 0, Math.PI * 2);
        cx.fill();
      });

      raf = requestAnimationFrame(dr);
    };

    dr();

    return () => {
      running = false;
      window.removeEventListener('resize', rs);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Assalam o Alaikum, I would like to inquire about the next batch of ${courseName} at DCS Academy.`
  )}`;

  const admissionLink = `/contact?inquiry_type=course_inquiry&target=${encodeURIComponent(courseName)}`;

  // Related programs list
  const relatedPrograms = Object.entries(RICH_COURSES_METADATA)
    .filter(([key]) => key !== normKey)
    .slice(0, 3);

  // Mentor Initials
  const mentorInitials = (mentor.name || 'MR')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dcs-course-root">
      {/* ===================================================================
          1. GOLDEN HERO SHELL
          =================================================================== */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
          <canvas ref={particlesRef} id="particles" />

          {/* Breadcrumb navigation */}
          <div className="crumbs">
            <Link href="/">Home</Link> / <Link href="/courses">Academy</Link> / <span>{courseName}</span>
          </div>

          <div className="hero">
            {/* Hero text column */}
            <div className="hero-left-content">
              <div className="tags">
                <span className="tag">
                  <i /> {category}
                </span>
                <span className="tag badge-hot">{badge}</span>
              </div>

              <h1 className="hero-heading">
                <span>{typedTitle}</span>
                {!isTypingDone && <span className="typewriter-cursor">|</span>}
              </h1>

              <p className="lead">{overview}</p>

              <div className="actions">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <FaWhatsapp size={17} style={{ color: '#25D366' }} />
                  <span>Inquire via WhatsApp</span>
                  <ArrowUpRight size={16} />
                </a>
                <Link href={admissionLink} className="btn btn-blue">
                  <span>Submit Admission Inquiry</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {/* 3 Stats: Weeks, Modules, Live Projects */}
              <div className="stats">
                <div className="stat">
                  <b>
                    {weeksCount}
                    <em></em>
                  </b>
                  <span>Weeks</span>
                </div>
                <div className="stat">
                  <b>
                    {modulesCount}
                    <em></em>
                  </b>
                  <span>Modules</span>
                </div>
                <div className="stat">
                  <b>
                    {projectsCount}
                    <em>+</em>
                  </b>
                  <span>Live Projects</span>
                </div>
              </div>
            </div>

            {/* Visual Video Card */}
            <div
              className="visual video"
              id="video"
              onClick={() => {
                if (youtubeId || initialCourse.intro_video_url) {
                  setIsPlayingVideo(true);
                } else {
                  alert(`Direct preview video for ${courseName} is available upon counselor consultation or WhatsApp demo.`);
                }
              }}
            >
              <canvas ref={netRef} id="net" />

              <div className="thumb">
                {isPlayingVideo ? (
                  <iframe
                    src={
                      youtubeId
                        ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`
                        : initialCourse.intro_video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
                    }
                    title={`${courseName} Preview`}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <img src={thumbnailUrl} alt={courseName} />
                )}
              </div>

              {!isPlayingVideo && (
                <div className="play">
                  <Play size={34} fill="currentColor" />
                </div>
              )}

              <div className="chip c1">
                <Play size={15} style={{ color: 'var(--blue)' }} />
                <span>Intro Video · {videoLength}</span>
              </div>

              <div className="chip c2">
                <Award size={15} style={{ color: '#e08a12' }} />
                <span>Online &amp; Offline Batches</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. STICKY INFO BAR
          =================================================================== */}
      <div className="infobar-wrapper">
        <div className="infobar">
          <div>
            <span>Duration</span>
            <b>{duration}</b>
          </div>
          <div>
            <span>Level</span>
            <b>{level}</b>
          </div>
          <div>
            <span>Schedule</span>
            <b>{schedule}</b>
          </div>
          <div>
            <span>Certificate</span>
            <b>Verified Diploma</b>
          </div>
          <div>
            <a href="#enroll-sidebar" className="btn btn-gold-pill">
              <span>Reserve Seat</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* ===================================================================
          3. MAIN TWO-COLUMN CONTENT LAYOUT
          =================================================================== */}
      <section className="section dcs-stacked-section" id="course-curriculum">
        <div className="layout">
          <div className="course-main-content">
            {/* Outcomes: What you'll learn */}
            <section className="block">
              <span className="eyebrow">Outcomes</span>
              <h2 className="sec-title">What you’ll learn</h2>
              <div className="learn-grid">
                {learningOutcomes.map((item, idx) => (
                  <div key={idx} className="learn">
                    <i>
                      <Check size={16} strokeWidth={3} />
                    </i>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum: Week-by-week roadmap */}
            <section className="block">
              <span className="eyebrow">Curriculum</span>
              <h2 className="sec-title">Week-by-week roadmap</h2>
              <div className="modules-list">
                {modules.map((mod, idx) => (
                  <details key={idx} className="module" open={idx === 0}>
                    <summary>
                      <span className="wk">
                        Week<b>{mod.week}</b>
                      </span>
                      <h4>
                        Module {idx + 1}: {mod.title}
                        <span>{mod.subtitle}</span>
                      </h4>
                      <i>+</i>
                    </summary>
                    <ul>
                      {mod.topics.map((t, tidx) => (
                        <li key={tidx}>{t}</li>
                      ))}
                    </ul>
                    <div className="proj">🛠 {mod.project}</div>
                  </details>
                ))}
              </div>
            </section>

            {/* Tool stack: Tools you'll master */}
            <section className="block">
              <span className="eyebrow">Tool stack</span>
              <h2 className="sec-title">Tools you’ll master</h2>
              <div className="tools-grid">
                {tools.map((t, idx) => (
                  <div key={idx} className="tool">
                    {t}
                  </div>
                ))}
              </div>
            </section>

            {/* Who it's for: Target audience */}
            <section className="block">
              <span className="eyebrow">Who it’s for</span>
              <h2 className="sec-title">Is this course right for you?</h2>
              <div className="for-grid">
                {targetAudience.map((aud, idx) => (
                  <div key={idx} className="for">
                    <i>{aud.icon}</i>
                    <b>{aud.title}</b>
                    <span>{aud.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Learn & Earn Guarantee */}
            <section className="block">
              <div className="guarantee">
                <div>
                  <span className="eyebrow">DCS Skill Academy</span>
                  <h3>
                    Learn &amp; <span>Earn</span> Guarantee
                  </h3>
                  <p>
                    Hands-on corporate labs, certified professional mentors, a verified industry diploma, and direct internship access
                    with Dream Cyber Security Pakistan.
                  </p>
                </div>
                <ul className="g-list">
                  <li>
                    <i>⚡</i> Corporate lab environments
                  </li>
                  <li>
                    <i>👨‍🏫</i> Certified professional mentors
                  </li>
                  <li>
                    <i>🎓</i> Verified DCS diploma
                  </li>
                  <li>
                    <i>💼</i> Direct internship access
                  </li>
                </ul>
              </div>
            </section>

            {/* Your mentor */}
            <section className="block">
              <span className="eyebrow">Your mentor</span>
              <h2 className="sec-title">Learn from a practitioner</h2>
              <div className="instructor">
                <div className="avatar">{mentorInitials}</div>
                <div>
                  <b>{mentor.name}</b>
                  <em>{mentor.designation}</em>
                  <p>{mentor.bio}</p>
                </div>
              </div>
            </section>

            {/* FAQ: Common questions */}
            <section className="block">
              <span className="eyebrow">FAQ</span>
              <h2 className="sec-title">Common questions</h2>
              <div className="faq-list">
                {faqs.map((faq, idx) => (
                  <details key={idx} className="faq" open={idx === 0}>
                    <summary>
                      {faq.question}
                      <i>+</i>
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* ===================================================================
            SIDEBAR (STICKY)
            =================================================================== */}
          <aside className="side" id="enroll-sidebar">
            {/* Enroll card */}
            <div className="enroll">
              <span className="eyebrow">Next Batch</span>
              <h3>Inquire about next batch</h3>
              <p>Get batch dates, online/offline options, fees, and enrollment prerequisites.</p>

              <div className="seats">
                <div>
                  <i style={{ width: `${animatedSeats}%` }} />
                </div>
                <span>
                  <span>Seats filled</span>
                  <b>{animatedSeats}%</b>
                </span>
              </div>

              <dl>
                <div>
                  <dt>Starts</dt>
                  <dd>{startDate}</dd>
                </div>
                <div>
                  <dt>Mode</dt>
                  <dd>Online &amp; Offline</dd>
                </div>
                <div>
                  <dt>Campus</dt>
                  <dd>Lahore</dd>
                </div>
                <div>
                  <dt>Fee</dt>
                  <dd>{fee}</dd>
                </div>
              </dl>

              <Link href={admissionLink} className="btn btn-gold">
                <span>Submit Admission Inquiry</span>
                <ArrowUpRight size={16} />
              </Link>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                <FaWhatsapp size={17} />
                <span>Inquire via WhatsApp</span>
                <ArrowUpRight size={16} />
              </a>
            </div>

            {/* Includes card */}
            <div className="incl">
              <h4>This course includes</h4>
              <ul>
                {includesList.map((inc, idx) => (
                  <li key={idx}>{inc}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ===================================================================
          4. EXPLORE OTHER PROGRAMS
          =================================================================== */}
      <section className="section dcs-stacked-section" id="course-related">
        <div className="block">
          <div className="head">
            <span className="eyebrow">Keep learning</span>
            <h2>
              Explore other <span className="u">programs</span>
            </h2>
          </div>
          <div className="related">
            {relatedPrograms.map(([key, item]) => (
              <Link key={key} href={`/courses/${key}`} className="rel">
                <i>{key === 'web-development' ? '</>' : key === 'video-editing-graphic-design' ? '🎬' : '🎓'}</i>
                <b>{item.name}</b>
                <span>
                  {item.title} · {item.weeks} Weeks
                </span>
                <em>View course →</em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. WARM GOLD CTA BAND
          =================================================================== */}
      <section className="section dcs-stacked-section" id="course-cta">
        <div className="block">
          <div className="cta-band">
            <canvas ref={ctaParticlesRef} id="cta-particles" />
            <div>
              <h2>{courseName} — next batch enrolling now</h2>
              <p>Reserve your seat today — limited seats per batch for personalized mentorship.</p>
            </div>
            <div className="cta-actions">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <FaWhatsapp size={18} style={{ color: '#25D366' }} />
                <span>WhatsApp Us</span>
                <ArrowUpRight size={16} />
              </a>
              <Link href={admissionLink} className="btn btn-blue">
                <span>Submit Admission Inquiry</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
