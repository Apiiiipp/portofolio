# Hafif Saputra — Developer Portfolio

A world-class developer portfolio platform built with **Next.js 14**, **TypeScript**, **TailwindCSS**, **Prisma ORM**, and **MySQL**. Features a full admin CMS, blog system with Markdown, GitHub integration, contact system, dark/light mode, and smooth animations.

---

## ✨ Features

- **Landing Page** — Animated hero, about, skills, projects, experience, GitHub repos, blog preview, contact
- **Blog System** — Markdown-powered posts with categories, tags, and view tracking
- **GitHub Integration** — Live repository data fetched from GitHub API
- **Admin Dashboard** — Full CRUD for projects, blog posts, skills, and messages (protected by NextAuth)
- **Contact Form** — Stores submissions to MySQL, optional email notification
- **SEO Optimized** — OpenGraph, sitemap.xml, robots.txt, structured metadata
- **Dark / Light Mode** — System-aware with manual toggle
- **Responsive** — Mobile-first design, works on all screen sizes
- **Animations** — Framer Motion scroll-triggered reveals and transitions

---

## 🗂️ Project Structure

```
hafif-portfolio/
├── app/
│   ├── admin/
│   │   ├── dashboard/       # Stats overview
│   │   ├── projects/        # Project CRUD
│   │   ├── blog/            # Post management
│   │   ├── skills/          # Skills management
│   │   ├── messages/        # Contact messages
│   │   ├── login/           # Admin login
│   │   └── layout.tsx       # Auth-protected layout
│   ├── api/
│   │   ├── auth/            # NextAuth handlers
│   │   ├── contact/         # Contact form API
│   │   ├── projects/        # Projects CRUD API
│   │   ├── posts/           # Blog posts CRUD API
│   │   ├── skills/          # Skills CRUD API
│   │   └── admin/           # Admin-specific APIs
│   ├── blog/
│   │   ├── page.tsx         # Blog listing
│   │   └── [slug]/page.tsx  # Blog post detail
│   ├── layout.tsx           # Root layout + SEO
│   ├── page.tsx             # Homepage
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots.txt
├── components/
│   ├── admin/               # Admin panel components
│   ├── layout/              # Navbar, Footer, ThemeProvider
│   ├── sections/            # Homepage sections
│   └── ui/                  # Reusable UI primitives
├── lib/
│   ├── auth.ts              # NextAuth v5 config
│   ├── prisma.ts            # Prisma client singleton
│   ├── github.ts            # GitHub API helpers
│   └── utils.ts             # cn(), formatDate(), etc.
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Initial seed data
├── types/
│   └── index.ts             # TypeScript types
├── middleware.ts             # Route protection
└── public/                  # Static assets
```

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `User` | Admin users for CMS login |
| `Account` / `Session` | NextAuth adapter tables |
| `Project` | Portfolio projects |
| `Skill` | Skills with categories and proficiency levels |
| `Experience` | Work history / internships |
| `Certificate` | Certifications |
| `Post` | Blog posts with Markdown content |
| `Tag` / `PostTag` | Blog tagging system |
| `Contact` | Contact form submissions |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8+ (or PlanetScale / Railway / Aiven)
- Git

### 1. Clone and install

```bash
git clone https://github.com/hafifsaputra/portfolio.git
cd hafif-portfolio
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Required
DATABASE_URL="mysql://root:password@localhost:3306/hafif_portfolio"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Optional — GitHub integration
GITHUB_TOKEN="ghp_your_personal_access_token"
GITHUB_USERNAME="your-github-username"

# Optional — Contact email notifications
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASSWORD="your-app-password"
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Set up the database

Create the MySQL database:
```sql
CREATE DATABASE hafif_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Push the Prisma schema:
```bash
npx prisma db push
```

Generate Prisma client:
```bash
npx prisma generate
```

### 4. Seed initial data

```bash
npm run db:seed
```

This creates:
- 4 portfolio projects (Procurement System, SIPEBANAS, Mosque Finance, E-Koperasi)
- 16 skills across Frontend, Backend, Database, Tools
- 2 sample blog posts
- 1 internship experience record

### 5. Create admin user

Open Prisma Studio:
```bash
npm run db:studio
```

In the `User` table, create a new record:
```json
{
  "id": "cuid-auto-generated",
  "email": "admin@example.com",
  "password": "your-password",
  "name": "Hafif Saputra",
  "role": "admin"
}
```

> ⚠️ For production, hash the password with bcrypt:
> ```bash
> node -e "const b=require('bcryptjs'); b.hash('your-password',12).then(console.log)"
> ```

### 6. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔧 Customization

### Update personal information

1. **Name, role, location** — Edit `components/sections/hero.tsx`
2. **About text** — Edit `components/sections/about.tsx`
3. **Social links** — Update URLs in `components/layout/footer.tsx` and `components/sections/hero.tsx`
4. **GitHub username** — Set `GITHUB_USERNAME` in `.env`
5. **Email** — Update `CONTACT_EMAIL` in `.env` and email references in contact section

### Customize the design

- **Colors** — Edit CSS variables in `app/globals.css`
- **Fonts** — Change the Google Fonts import in `globals.css` and update `--font-display` / `--font-sans`
- **Theme** — Modify `tailwind.config.ts` for color palette and spacing

### Add/manage content via Admin

Navigate to `/admin/login` and use your credentials to:
- **Projects** — Add/edit/delete with category, description, tech stack, GitHub/demo URLs
- **Blog Posts** — Write Markdown posts, set published/draft status, view counts
- **Skills** — Manage proficiency levels and categories
- **Messages** — Read and reply to contact form submissions

---

## 🌐 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial portfolio"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add all environment variables from `.env`
4. Deploy

### 3. Database for production

Use a managed MySQL provider:
- **PlanetScale** (serverless MySQL, free tier) — Recommended
- **Railway** (PostgreSQL/MySQL)
- **Aiven** (MySQL)
- **TiDB Cloud** (MySQL-compatible)

PlanetScale example:
```env
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/hafif_portfolio?sslaccept=strict"
```

### 4. Post-deployment

After first deployment, run migrations:
```bash
npx prisma db push
npm run db:seed
```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + custom CSS |
| Components | Shadcn UI + custom |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | MySQL |
| ORM | Prisma |
| Auth | NextAuth v5 (JWT) |
| Markdown | react-markdown + remark-gfm |
| Deployment | Vercel |

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema to DB
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed initial data
```

---

## 🔒 Security Notes

- Admin routes are protected by NextAuth middleware
- API routes should be further protected with session checks for production
- Always use hashed passwords (bcrypt) in production
- Set a strong `NEXTAUTH_SECRET` (minimum 32 characters)
- Never commit `.env` to version control

---

## 📄 License

MIT License — free to use and customize for your own portfolio.

---

Built with ❤️ by Hafif Saputra · Pekanbaru, Indonesia
