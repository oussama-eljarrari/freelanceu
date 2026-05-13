import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const databasePath = join(dataDir, 'freelanceu.db');
const db = new Database(databasePath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ───────────────────────────────────────────────────────────────────

db.exec(`
  DROP TABLE IF EXISTS messages;
  DROP TABLE IF EXISTS reviews;
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS gig_tags;
  DROP TABLE IF EXISTS tags;
  DROP TABLE IF EXISTS gigs;
  DROP TABLE IF EXISTS users;
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'client' CHECK(role IN ('client', 'freelancer', 'admin')),
    bio TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    rating REAL DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS gigs (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('Graphic Design', 'Translation', 'Development', 'Writing', 'Tutoring', 'Video Editing', 'Photo Editing', 'Audio & Voice')),
    price REAL NOT NULL,
    delivery_days INTEGER NOT NULL,
    thumbnail TEXT,
    rating REAL DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gig_tags (
    gig_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (gig_id, tag_id),
    FOREIGN KEY(gig_id) REFERENCES gigs(id) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    gig_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    freelancer_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'delivered', 'completed', 'cancelled')),
    price REAL NOT NULL,
    requirements TEXT,
    delivery_deadline DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(gig_id) REFERENCES gigs(id) ON DELETE CASCADE,
    FOREIGN KEY(client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(freelancer_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    order_id TEXT UNIQUE,
    gig_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY(gig_id) REFERENCES gigs(id) ON DELETE CASCADE,
    FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    gig_id TEXT,
    sender_id TEXT,
    receiver_id TEXT NOT NULL,
    subject TEXT,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sender_email TEXT,
    receiver_email TEXT,
    client_id TEXT,
    client_email TEXT,
    FOREIGN KEY(gig_id) REFERENCES gigs(id) ON DELETE SET NULL,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY(receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(client_id) REFERENCES users(id) ON DELETE SET NULL
  );
`);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uuid() {
  return randomUUID();
}

function genAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const colors = ['6C5CE7', '00B894', '0984E3', 'E17055', 'FD79A8', '6C5CE7', 'FDCB6E', 'E17055'];
  const bg = colors[name.length % colors.length];
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="#${bg}" rx="12"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#fff" font-family="Arial" font-size="48" font-weight="600">${initials}</text></svg>`)}`;
}

function dateSub(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

function dateAdd(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

// ─── Seed Users ───────────────────────────────────────────────────────────────

const insertUser = db.prepare(`
  INSERT INTO users (id, name, email, password_hash, avatar, role, bio, joined_at, rating, total_reviews)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const users = [
  { id: 'u1', name: 'Sara Malik', email: 'sara@example.com', password: 'sara123', role: 'freelancer', bio: 'Graphic designer with 5 years of experience in branding and UI.', joinedAt: '2024-01-10 10:00:00', rating: 4.9, reviews: 134 },
  { id: 'u2', name: 'Karim Benali', email: 'karim@example.com', password: 'karim123', role: 'freelancer', bio: 'Full-stack developer specialized in React and NestJS.', joinedAt: '2024-03-05 08:30:00', rating: 4.7, reviews: 89 },
  { id: 'u3', name: 'Lina Ouhab', email: 'lina@example.com', password: 'lina123', role: 'client', bio: 'Startup founder looking for reliable freelancers.', joinedAt: '2024-06-01 12:00:00', rating: 0, reviews: 0 },
  { id: 'u4', name: 'Amine Zaidi', email: 'amine@example.com', password: 'amine123', role: 'freelancer', bio: 'Professional video editor and motion graphics artist.', joinedAt: '2024-02-15 09:15:00', rating: 4.8, reviews: 56 },
  { id: 'u5', name: 'Yasmine Khoury', email: 'yasmine@example.com', password: 'yasmine123', role: 'freelancer', bio: 'Certified translator (EN/FR/AR) with 7 years of experience.', joinedAt: '2024-04-20 14:00:00', rating: 4.6, reviews: 72 },
  { id: 'u6', name: 'Hicham Alami', email: 'hicham@example.com', password: 'hicham123', role: 'client', bio: 'E-commerce entrepreneur scaling my online store.', joinedAt: '2024-07-10 11:30:00', rating: 0, reviews: 0 },
  { id: 'u7', name: 'Nadia Fassi', email: 'nadia@example.com', password: 'nadia123', role: 'freelancer', bio: 'SEO content writer and copywriter for B2B SaaS companies.', joinedAt: '2024-05-01 16:45:00', rating: 4.5, reviews: 41 },
  { id: 'u8', name: 'Omar Benslimane', email: 'omar@example.com', password: 'omar123', role: 'admin', bio: 'Platform administrator and community manager.', joinedAt: '2023-11-01 08:00:00', rating: 0, reviews: 0 },
];

for (const u of users) {
  insertUser.run(u.id, u.name, u.email, u.password, genAvatar(u.name), u.role, u.bio, u.joinedAt, u.rating, u.reviews);
}
console.log(`✓ Inserted ${users.length} users`);

// ─── Seed Tags ────────────────────────────────────────────────────────────────

const insertTag = db.prepare(`INSERT INTO tags (id, name) VALUES (?, ?)`);

const tagNames = [
  'logo', 'branding', 'design', 'react', 'nestjs', 'fullstack',
  'social-media', 'instagram', 'graphics', 'translation', 'french', 'arabic',
  'video', 'editing', 'youtube', 'writing', 'seo', 'blog',
  'illustration', 'figma', 'ui-ux', 'python', 'api', 'database',
  'copywriting', 'marketing', 'wordpress', 'photoshop', 'animation', 'motion',
  'voiceover', 'podcast', 'audio', 'tutoring', 'math', 'english',
];

const tags = tagNames.map((name) => ({ id: uuid(), name }));
for (const t of tags) {
  insertTag.run(t.id, t.name);
}
const tagMap = Object.fromEntries(tags.map((t) => [t.name, t.id]));
console.log(`✓ Inserted ${tags.length} tags`);

// ─── Seed Gigs ────────────────────────────────────────────────────────────────

const insertGig = db.prepare(`
  INSERT INTO gigs (id, seller_id, title, description, category, price, delivery_days, thumbnail, rating, total_reviews, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertGigTag = db.prepare(`INSERT INTO gig_tags (gig_id, tag_id) VALUES (?, ?)`);

const gigs = [
  { id: 'g1', sellerId: 'u1', title: 'I will design a professional logo for your brand', description: 'High quality logo design with unlimited revisions. Delivered in PNG, SVG, and AI formats. Includes brand color palette.', category: 'Graphic Design', price: 50, deliveryDays: 3, thumbnail: 'https://picsum.photos/seed/logo/400/300', rating: 4.8, reviews: 12, createdAt: dateSub(90), tags: ['logo', 'branding', 'design'] },
  { id: 'g2', sellerId: 'u2', title: 'I will build a React web app with NestJS backend', description: 'Full-stack development with clean code, REST API, and deployment. Includes authentication and database setup.', category: 'Development', price: 300, deliveryDays: 14, thumbnail: 'https://picsum.photos/seed/dev/400/300', rating: 5.0, reviews: 8, createdAt: dateSub(120), tags: ['react', 'nestjs', 'fullstack'] },
  { id: 'g3', sellerId: 'u1', title: 'I will create social media graphics for your business', description: 'Eye-catching posts and stories for Instagram, Facebook, and LinkedIn. Delivered in all required sizes.', category: 'Graphic Design', price: 30, deliveryDays: 2, thumbnail: 'https://picsum.photos/seed/social/400/300', rating: 4.9, reviews: 15, createdAt: dateSub(80), tags: ['social-media', 'graphics', 'instagram'] },
  { id: 'g4', sellerId: 'u5', title: 'I will translate your documents from English to French or Arabic', description: 'Native-level translation for documents, websites, and marketing copy. Fast turnaround guaranteed. Certified translations available.', category: 'Translation', price: 20, deliveryDays: 1, thumbnail: 'https://picsum.photos/seed/translate/400/300', rating: 4.6, reviews: 45, createdAt: dateSub(100), tags: ['translation', 'french', 'arabic'] },
  { id: 'g5', sellerId: 'u4', title: 'I will edit your video professionally for YouTube and social media', description: 'Professional video editing with color grading, transitions, motion graphics, and subtitles. Ready for YouTube, Reels, and TikTok.', category: 'Video Editing', price: 80, deliveryDays: 5, thumbnail: 'https://picsum.photos/seed/video/400/300', rating: 4.8, reviews: 52, createdAt: dateSub(70), tags: ['video', 'editing', 'youtube'] },
  { id: 'g6', sellerId: 'u7', title: 'I will write SEO-optimized blog posts for your website', description: 'Well-researched, engaging blog content tailored to your niche. Includes keyword research, meta description, and internal linking suggestions.', category: 'Writing', price: 40, deliveryDays: 3, thumbnail: 'https://picsum.photos/seed/writing/400/300', rating: 4.5, reviews: 38, createdAt: dateSub(85), tags: ['writing', 'seo', 'blog'] },
  { id: 'g7', sellerId: 'u4', title: 'I will create a stunning motion graphics intro for your brand', description: 'Custom animated intro with your logo, brand colors, and music. Perfect for YouTube channels, podcasts, or corporate presentations.', category: 'Video Editing', price: 120, deliveryDays: 7, thumbnail: 'https://picsum.photos/seed/motion/400/300', rating: 4.7, reviews: 23, createdAt: dateSub(60), tags: ['animation', 'motion', 'video'] },
  { id: 'g8', sellerId: 'u2', title: 'I will build a REST API with Python and FastAPI', description: 'Scalable REST API with FastAPI, SQLAlchemy, Docker, and automated tests. Includes Swagger documentation and deployment scripts.', category: 'Development', price: 250, deliveryDays: 10, thumbnail: 'https://picsum.photos/seed/api/400/300', rating: 4.9, reviews: 31, createdAt: dateSub(55), tags: ['python', 'api', 'database'] },
  { id: 'g9', sellerId: 'u1', title: 'I will design a modern UI/UX for your app in Figma', description: 'Complete UI/UX design from wireframes to high-fidelity prototypes. Includes design system, component library, and user flow mapping.', category: 'Graphic Design', price: 200, deliveryDays: 7, thumbnail: 'https://picsum.photos/seed/figma/400/300', rating: 4.8, reviews: 19, createdAt: dateSub(45), tags: ['figma', 'ui-ux', 'design'] },
  { id: 'g10', sellerId: 'u7', title: 'I will write compelling copy for your landing page', description: 'Conversion-focused copywriting for SaaS landing pages, including headline variants, feature descriptions, and CTAs.', category: 'Writing', price: 60, deliveryDays: 2, thumbnail: 'https://picsum.photos/seed/copy/400/300', rating: 4.6, reviews: 27, createdAt: dateSub(40), tags: ['copywriting', 'marketing', 'writing'] },
  { id: 'g11', sellerId: 'u5', title: 'I will proofread and edit your academic paper or thesis', description: 'Thorough proofreading and editing for academic papers, theses, and essays. Grammar, style, and structure improvement included.', category: 'Writing', price: 35, deliveryDays: 3, thumbnail: 'https://picsum.photos/seed/proofread/400/300', rating: 4.4, reviews: 33, createdAt: dateSub(50), tags: ['writing', 'english', 'editing'] },
  { id: 'g12', sellerId: 'u1', title: 'I will retouch and enhance your photos professionally', description: 'Professional photo retouching including color correction, background removal, skin smoothing, and object removal.', category: 'Photo Editing', price: 25, deliveryDays: 1, thumbnail: 'https://picsum.photos/seed/photo/400/300', rating: 4.7, reviews: 61, createdAt: dateSub(30), tags: ['photoshop', 'graphics', 'design'] },
];

for (const g of gigs) {
  insertGig.run(g.id, g.sellerId, g.title, g.description, g.category, g.price, g.deliveryDays, g.thumbnail, g.rating, g.reviews, g.createdAt);
  for (const tagName of g.tags) {
    if (tagMap[tagName]) {
      insertGigTag.run(g.id, tagMap[tagName]);
    }
  }
}
console.log(`✓ Inserted ${gigs.length} gigs with tags`);

// ─── Seed Orders ──────────────────────────────────────────────────────────────

const insertOrder = db.prepare(`
  INSERT INTO orders (id, gig_id, client_id, freelancer_id, status, price, requirements, delivery_deadline, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const orders = [
  { id: 'o1', gigId: 'g1', clientId: 'u3', freelancerId: 'u1', status: 'in_progress', price: 50, requirements: 'I need a logo for my coffee shop called Brew & Co. Colors: brown and cream.', deadline: dateAdd(3), createdAt: dateSub(10) },
  { id: 'o2', gigId: 'g2', clientId: 'u3', freelancerId: 'u2', status: 'completed', price: 300, requirements: 'E-commerce app with Stripe payments and product catalog.', deadline: dateSub(5), createdAt: dateSub(20) },
  { id: 'o3', gigId: 'g3', clientId: 'u3', freelancerId: 'u1', status: 'pending', price: 30, requirements: 'Need 10 Instagram posts for a skincare brand launch.', deadline: dateAdd(5), createdAt: dateSub(2) },
  { id: 'o4', gigId: 'g4', clientId: 'u6', freelancerId: 'u5', status: 'delivered', price: 40, requirements: 'Translate our product catalog (8 pages) from English to Arabic.', deadline: dateSub(3), createdAt: dateSub(8) },
  { id: 'o5', gigId: 'g5', clientId: 'u6', freelancerId: 'u4', status: 'in_progress', price: 80, requirements: 'Edit a 12-minute product demo video. Add captions and background music.', deadline: dateAdd(7), createdAt: dateSub(4) },
  { id: 'o6', gigId: 'g8', clientId: 'u3', freelancerId: 'u2', status: 'completed', price: 250, requirements: 'Build an inventory management API with stock tracking and reporting.', deadline: dateSub(20), createdAt: dateSub(35) },
  { id: 'o7', gigId: 'g6', clientId: 'u6', freelancerId: 'u7', status: 'delivered', price: 120, requirements: '3 blog posts (1500 words each) about dropshipping tips.', deadline: dateSub(1), createdAt: dateSub(7) },
  { id: 'o8', gigId: 'g9', clientId: 'u6', freelancerId: 'u1', status: 'pending', price: 200, requirements: 'Full UI/UX design for a mobile fashion shopping app.', deadline: dateAdd(14), createdAt: dateSub(1) },
  { id: 'o9', gigId: 'g10', clientId: 'u3', freelancerId: 'u7', status: 'cancelled', price: 60, requirements: 'Copy for a fitness app landing page.', deadline: dateSub(10), createdAt: dateSub(15) },
  { id: 'o10', gigId: 'g12', clientId: 'u6', freelancerId: 'u1', status: 'completed', price: 50, requirements: 'Retouch 20 product photos for my online store.', deadline: dateSub(2), createdAt: dateSub(5) },
];

for (const o of orders) {
  insertOrder.run(o.id, o.gigId, o.clientId, o.freelancerId, o.status, o.price, o.requirements, o.deadline, o.createdAt);
}
console.log(`✓ Inserted ${orders.length} orders`);

// ─── Seed Reviews ─────────────────────────────────────────────────────────────

const insertReview = db.prepare(`
  INSERT INTO reviews (id, order_id, gig_id, author_id, rating, comment, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const reviews = [
  { id: 'r1', orderId: 'o2', gigId: 'g2', authorId: 'u3', rating: 5, comment: 'Karim delivered exactly what I needed. Clean code and great communication throughout.', createdAt: dateSub(18) },
  { id: 'r2', orderId: 'o1', gigId: 'g1', authorId: 'u3', rating: 5, comment: 'Sara is incredibly talented. The logo perfectly captured our brand identity.', createdAt: dateSub(8) },
  { id: 'r3', orderId: 'o4', gigId: 'g4', authorId: 'u6', rating: 4, comment: 'Great translation quality. Delivered a day early.', createdAt: dateSub(6) },
  { id: 'r4', orderId: 'o6', gigId: 'g8', authorId: 'u3', rating: 5, comment: 'Excellent API design with thorough documentation.', createdAt: dateSub(18) },
  { id: 'r5', orderId: 'o7', gigId: 'g6', authorId: 'u6', rating: 4, comment: 'Well-written blog posts. Will order again.', createdAt: dateSub(4) },
  { id: 'r6', orderId: 'o10', gigId: 'g12', authorId: 'u6', rating: 5, comment: 'Amazing photo retouching work. Photos look like professional studio shots.', createdAt: dateSub(3) },
  { id: 'r7', orderId: 'o5', gigId: 'g5', authorId: 'u6', rating: 5, comment: 'So far the editing looks great. Very responsive.', createdAt: dateSub(2) },
];

for (const r of reviews) {
  insertReview.run(r.id, r.orderId, r.gigId, r.authorId, r.rating, r.comment, r.createdAt);
}
console.log(`✓ Inserted ${reviews.length} reviews`);

// ─── Seed Messages ────────────────────────────────────────────────────────────

const insertMessage = db.prepare(`
  INSERT INTO messages (id, gig_id, sender_id, receiver_id, subject, body, created_at, sender_email, receiver_email, client_id, client_email)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const messages = [
  { id: 'm1', gigId: 'g1', senderId: 'u3', receiverId: 'u1', subject: 'Question about logo design', body: 'Hi Sara, I love your portfolio. Can you also design business cards along with the logo?', createdAt: dateSub(12) },
  { id: 'm2', gigId: 'g1', senderId: 'u1', receiverId: 'u3', subject: 'Re: Question about logo design', body: "Hi Lina, yes absolutely! I offer business card design as an add-on. I'll include a quote in your order.", createdAt: dateSub(11) },
  { id: 'm3', gigId: 'g9', senderId: 'u6', receiverId: 'u1', subject: 'UI/UX design for fashion app', body: 'Hi Sara, I need a complete mobile app design for my fashion store. Can we discuss the timeline?', createdAt: dateSub(3) },
  { id: 'm4', gigId: 'g9', senderId: 'u1', receiverId: 'u6', subject: 'Re: UI/UX design for fashion app', body: "Hi Hicham, I'd love to work on this. The 7-day delivery works well for a full app design. Let me know if you have any specific references.", createdAt: dateSub(2) },
  { id: 'm5', gigId: 'g5', senderId: 'u6', receiverId: 'u4', subject: 'Video editing specs', body: 'Hi Amine, the product demo video is ready for upload. Can you add French subtitles as well?', createdAt: dateSub(3) },
  { id: 'm6', gigId: 'g5', senderId: 'u4', receiverId: 'u6', subject: 'Re: Video editing specs', body: 'Sure, I can add French subtitles. It might add an extra day to the delivery. Is that okay?', createdAt: dateSub(2) },
  { id: 'm7', gigId: 'g2', senderId: 'u3', receiverId: 'u2', subject: 'API documentation', body: 'Hi Karim, the API is working great. Could you also provide a Postman collection for the endpoints?', createdAt: dateSub(22) },
];

const userById = Object.fromEntries(users.map((u) => [u.id, u]));

for (const m of messages) {
  const sender = userById[m.senderId];
  const receiver = userById[m.receiverId];
  const clientId = sender.role === 'client' ? sender.id : receiver.id;
  const clientEmail = userById[clientId]?.email ?? sender.email;
  insertMessage.run(
    m.id,
    m.gigId,
    m.senderId,
    m.receiverId,
    m.subject,
    m.body,
    m.createdAt,
    sender.email,
    receiver.email,
    clientId,
    clientEmail,
  );
}
console.log(`✓ Inserted ${messages.length} messages`);

// ─── Summary ──────────────────────────────────────────────────────────────────

const counts = {
  users: db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number },
  gigs: db.prepare('SELECT COUNT(*) as count FROM gigs').get() as { count: number },
  tags: db.prepare('SELECT COUNT(*) as count FROM tags').get() as { count: number },
  gigTags: db.prepare('SELECT COUNT(*) as count FROM gig_tags').get() as { count: number },
  orders: db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number },
  reviews: db.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number },
  messages: db.prepare('SELECT COUNT(*) as count FROM messages').get() as { count: number },
};

console.log('\n─── Database seeded successfully ───');
console.log(`Database file: ${databasePath}`);
for (const [table, { count }] of Object.entries(counts)) {
  console.log(`  ${table.padEnd(10)} ${count} rows`);
}

db.close();
