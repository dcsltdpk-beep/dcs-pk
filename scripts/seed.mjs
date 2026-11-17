import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const targetUri = process.argv[2] || process.env.MONGODB_URI;

if (!targetUri) {
  console.error('\n❌ MONGODB_URI is not defined.');
  console.error('Please configure MONGODB_URI in .env.local or pass it as an argument:');
  console.error('  node scripts/seed.mjs "mongodb+srv://user:pass@cluster.mongodb.net/dbname"\n');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

const settingSchema = new mongoose.Schema({
  key_name: { type: String, required: true, unique: true },
  key_value: { type: String, default: '' },
});

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: 'shield' },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: String, default: '' },
  benefits: { type: String, default: '' },
  order_num: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  duration: { type: String, required: true },
  target_audience: { type: String, required: true },
  overview: { type: String, required: true },
  syllabus: { type: String, required: true },
  what_you_will_learn: { type: String, required: true },
  instructor_name: { type: String, required: true },
  instructor_designation: { type: String, required: true },
  instructor_bio: { type: String, default: '' },
  instructor_photo: { type: String, default: '' },
  intro_video_url: { type: String, default: '' },
  order_num: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  bio: { type: String, required: true },
  photo: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  github: { type: String, default: '' },
  email: { type: String, default: '' },
  order_num: { type: Number, default: 0 },
}, { timestamps: true });

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  client_name: { type: String, default: '' },
  client_logo: { type: String, default: '' },
  cover_image: { type: String, default: '' },
  video_url: { type: String, default: '' },
  description: { type: String, required: true },
  order_num: { type: Number, default: 0 },
}, { timestamps: true });

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  video_type: { type: String, default: 'embed' },
  video_source: { type: String, required: true },
  description: { type: String, default: '' },
  order_num: { type: Number, default: 0 },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'Updates' },
  tags: { type: String, default: '' },
  featured_image: { type: String, default: '' },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  is_published: { type: Boolean, default: true },
  published_at: { type: Date, default: Date.now },
}, { timestamps: true });

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  order_num: { type: Number, default: 0 },
});

const landingPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  meta_title: { type: String, default: '' },
  meta_description: { type: String, default: '' },
  headline: { type: String, required: true },
  subheadline: { type: String, default: '' },
  body_content: { type: String, required: true },
  cta_text: { type: String, default: 'Contact Us' },
  cta_link: { type: String, default: '/contact' },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

async function seed() {
  console.log('----------------------------------------------------');
  console.log('🛡️ Dream Cyber Security Pakistan - Database Seeder');
  const maskedUri = targetUri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
  console.log(`Connecting to MongoDB at: ${maskedUri}`);
  console.log('----------------------------------------------------');

  try {
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    console.log('✓ Successfully connected to MongoDB database.');
  } catch (err) {
    console.error('\n⚠️ Could not connect to MongoDB server:', err.message);
    console.log('\n💡 Tips:');
    console.log('1. If running locally, make sure your MongoDB service is started: `mongod`');
    console.log('2. Or pass your MongoDB Atlas URI: `npm run seed -- "mongodb+srv://user:pass@cluster.mongodb.net/dcs_pakistan"`');
    console.log('3. The web portal is fully functional with instant fallback using `database/seed-data.json`!\n');
    return;
  }

  const User = mongoose.model('User', userSchema);
  const Setting = mongoose.model('Setting', settingSchema);
  const Service = mongoose.model('Service', serviceSchema);
  const Course = mongoose.model('Course', courseSchema);
  const Team = mongoose.model('Team', teamSchema);
  const Portfolio = mongoose.model('Portfolio', portfolioSchema);
  const Video = mongoose.model('Video', videoSchema);
  const Post = mongoose.model('Post', postSchema);
  const Faq = mongoose.model('Faq', faqSchema);
  const LandingPage = mongoose.model('LandingPage', landingPageSchema);

  // Read seed-data.json
  const seedJsonPath = path.resolve(__dirname, '../database/seed-data.json');
  const rawSeed = JSON.parse(fs.readFileSync(seedJsonPath, 'utf8'));

  // 1. Admin User
  const existingUser = await User.findOne({ username: 'admin' });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      email: 'dcsltd.pk@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('✓ Admin user verified/created (username: admin, password: admin123).');
  } else {
    console.log('✓ Admin user already exists.');
  }

  // 2. Settings
  const settingKeys = Object.keys(rawSeed.settings);
  for (const key of settingKeys) {
    await Setting.findOneAndUpdate(
      { key_name: key },
      { key_name: key, key_value: rawSeed.settings[key] },
      { upsert: true }
    );
  }
  console.log(`✓ ${settingKeys.length} Settings seeded.`);

  // 3. Services
  for (const s of rawSeed.services) {
    await Service.findOneAndUpdate({ slug: s.slug }, s, { upsert: true });
  }
  console.log(`✓ ${rawSeed.services.length} Services seeded.`);

  // 4. Courses
  for (const c of rawSeed.courses) {
    await Course.findOneAndUpdate({ slug: c.slug }, c, { upsert: true });
  }
  console.log(`✓ ${rawSeed.courses.length} Courses seeded.`);

  // 5. Team
  for (const t of rawSeed.team) {
    await Team.findOneAndUpdate({ name: t.name }, t, { upsert: true });
  }
  console.log(`✓ ${rawSeed.team.length} Team members seeded.`);

  // 6. Portfolio
  for (const p of rawSeed.portfolio) {
    await Portfolio.findOneAndUpdate({ title: p.title }, p, { upsert: true });
  }
  console.log(`✓ ${rawSeed.portfolio.length} Portfolio items seeded.`);

  // 7. Videos
  for (const v of rawSeed.videos) {
    await Video.findOneAndUpdate({ title: v.title }, v, { upsert: true });
  }
  console.log(`✓ ${rawSeed.videos.length} Videos seeded.`);

  // 8. Posts
  for (const post of rawSeed.posts) {
    await Post.findOneAndUpdate(
      { slug: post.slug },
      { ...post, published_at: new Date() },
      { upsert: true }
    );
  }
  console.log(`✓ ${rawSeed.posts.length} Blog posts seeded.`);

  // 9. FAQs
  for (const f of rawSeed.faqs) {
    await Faq.findOneAndUpdate({ question: f.question }, f, { upsert: true });
  }
  console.log(`✓ ${rawSeed.faqs.length} FAQs seeded.`);

  // 10. Landing Pages
  for (const lp of rawSeed.landingPages) {
    await LandingPage.findOneAndUpdate({ slug: lp.slug }, lp, { upsert: true });
  }
  console.log(`✓ ${rawSeed.landingPages.length} Landing pages seeded.`);

  console.log('----------------------------------------------------');
  console.log('🎉 ALL DATABASE SEED CONTENT POPULATED SUCCESSFULLY!');
  console.log('----------------------------------------------------');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Fatal seed script error:', err);
  process.exit(1);
});
