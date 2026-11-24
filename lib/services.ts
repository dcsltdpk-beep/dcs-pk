import {
  Code, Megaphone, Bot, Search, ShieldCheck, ShoppingCart, Clapperboard,
  Palette, Smartphone, Server, Share2, Cloud, type LucideIcon,
} from "lucide-react";

export type Service = {
  title: string;
  slug: string;
  short: string;
  desc: string;
  points: string[];
  icon: LucideIcon;
  hue: string; // per-service glow accent
};

export const services: Service[] = [
  {
    title: "Web Development",
    slug: "web-design-development",
    short: "Web Dev",
    icon: Code,
    hue: "#5b8cff",
    desc: "Fast, secure and scalable websites and web apps built with modern stacks like Next.js and React.",
    points: ["Custom websites", "Web applications", "CMS & dashboards"],
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing-seo",
    short: "Marketing",
    icon: Megaphone,
    hue: "#f5a524",
    desc: "Performance-driven campaigns that turn attention into qualified leads and measurable revenue.",
    points: ["Paid ads (Meta / Google)", "Funnels & landing pages", "Analytics & reporting"],
  },
  {
    title: "AI & Automation",
    slug: "ai-automation-chatbot-development",
    short: "AI",
    icon: Bot,
    hue: "#a78bfa",
    desc: "AI agents and workflow automations that remove repetitive work and run your business 24/7.",
    points: ["AI agents & chatbots", "n8n / Make workflows", "CRM automation"],
  },
  {
    title: "SEO",
    slug: "digital-marketing-seo",
    short: "SEO",
    icon: Search,
    hue: "#34d399",
    desc: "Technical, on-page and off-page SEO that earns rankings and sustainable organic traffic.",
    points: ["Technical audits", "Content & keywords", "Link building"],
  },
  {
    title: "Cyber Security",
    slug: "cybersecurity-services",
    short: "Security",
    icon: ShieldCheck,
    hue: "#f43f5e",
    desc: "Protect your systems, data and customers with audits, hardening and continuous monitoring.",
    points: ["Penetration testing", "Security audits", "Hardening & monitoring"],
  },
  {
    title: "E-commerce Development",
    slug: "ecommerce-development",
    short: "E-commerce",
    icon: ShoppingCart,
    hue: "#fb923c",
    desc: "Conversion-focused online stores on Shopify, WooCommerce or fully custom platforms.",
    points: ["Shopify / WooCommerce", "Payment integrations", "Store optimisation"],
  },
  {
    title: "Video & Motion Graphics",
    slug: "video-editing-motion-graphics",
    short: "Video",
    icon: Clapperboard,
    hue: "#f472b6",
    desc: "Scroll-stopping edits, explainers and motion graphics that tell your brand story.",
    points: ["Video editing", "2D motion graphics", "Reels & ads"],
  },
  {
    title: "Graphic Design & Branding",
    slug: "graphic-design-branding",
    short: "Branding",
    icon: Palette,
    hue: "#facc15",
    desc: "Identity systems, logos and creatives that make your brand instantly recognisable.",
    points: ["Logo & identity", "Social creatives", "Print & packaging"],
  },
  {
    title: "Software & App Development",
    slug: "software-application-development",
    short: "Apps",
    icon: Smartphone,
    hue: "#38bdf8",
    desc: "Custom software and mobile apps engineered around your exact business processes.",
    points: ["Android & iOS apps", "Custom software", "APIs & integrations"],
  },
  {
    title: "Domain, Hosting & IT Support",
    slug: "domain-hosting-it-support",
    short: "Hosting",
    icon: Server,
    hue: "#60a5fa",
    desc: "Reliable domains, hosting, business email and day-to-day IT support you can count on.",
    points: ["Domains & hosting", "Business email", "IT support"],
  },
  {
    title: "Social Media Management",
    slug: "social-media-management",
    short: "Social",
    icon: Share2,
    hue: "#e879f9",
    desc: "Consistent, on-brand content and community management across every platform.",
    points: ["Content calendars", "Community management", "Growth strategy"],
  },
  {
    title: "Cloud & DevOps Solutions",
    slug: "cloud-devops-solutions",
    short: "Cloud",
    icon: Cloud,
    hue: "#22d3ee",
    desc: "Cloud architecture, CI/CD and infrastructure that keeps you fast, stable and scalable.",
    points: ["AWS / Vercel / GCP", "CI/CD pipelines", "Monitoring & scaling"],
  },
];
