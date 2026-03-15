import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "hafif@example.com" },
    update: {},
    create: {
      name: "Hafif Saputra",
      email: "hafif@example.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Seed skills
  const skillsData = [
    // Frontend
    { name: "HTML", category: "Frontend", level: 90, icon: "html", order: 1 },
    { name: "CSS", category: "Frontend", level: 85, icon: "css", order: 2 },
    { name: "JavaScript", category: "Frontend", level: 80, icon: "javascript", order: 3 },
    { name: "Bootstrap", category: "Frontend", level: 85, icon: "bootstrap", order: 4 },
    { name: "TailwindCSS", category: "Frontend", level: 80, icon: "tailwind", order: 5 },
    { name: "Vue.js", category: "Frontend", level: 70, icon: "vue", order: 6 },
    // Backend
    { name: "PHP", category: "Backend", level: 90, icon: "php", order: 1 },
    { name: "Laravel", category: "Backend", level: 90, icon: "laravel", order: 2 },
    { name: "REST API", category: "Backend", level: 85, icon: "api", order: 3 },
    // Database
    { name: "MySQL", category: "Database", level: 88, icon: "mysql", order: 1 },
    { name: "SQL", category: "Database", level: 85, icon: "sql", order: 2 },
    { name: "Oracle", category: "Database", level: 70, icon: "oracle", order: 3 },
    // Tools
    { name: "Git", category: "Tools", level: 85, icon: "git", order: 1 },
    { name: "Figma", category: "Tools", level: 75, icon: "figma", order: 2 },
    { name: "Whimsical", category: "Tools", level: 70, icon: "whimsical", order: 3 },
    { name: "Insomnia", category: "Tools", level: 80, icon: "insomnia", order: 4 },
  ];

  for (const skill of skillsData) {
    await prisma.skill.upsert({
      where: { id: skillsData.indexOf(skill) + 1 },
      update: {},
      create: skill,
    });
  }

  // Seed projects
  const projects = [
    {
      title: "Procurement Approval System",
      description:
        "A comprehensive system used to manage procurement approval processes efficiently and transparently. Designed to streamline purchase requests and approval workflows across departments.",
      category: "Internship",
      technologies: JSON.stringify(["Laravel", "MySQL", "Bootstrap", "JavaScript", "Spatie"]),
      featured: true,
      order: 1,
    },
    {
      title: "SIPEBANAS",
      description:
        "Aid recipient management system designed to manage beneficiary data, verification processes, and aid distribution monitoring for government assistance programs.",
      category: "Academic",
      technologies: JSON.stringify(["Laravel", "MySQL", "Bootstrap", "JavaScript"]),
      featured: true,
      order: 2,
    },
    {
      title: "Mosque Cash Management System",
      description:
        "A financial management system for mosques to track income, record expenses, and generate comprehensive financial reports for transparent community management.",
      category: "Academic",
      technologies: JSON.stringify(["Laravel", "MySQL", "Bootstrap"]),
      featured: false,
      order: 3,
    },
    {
      title: "E-Koperasi",
      description:
        "A full-featured savings and loan cooperative management system with member management, loan applications, savings tracking, and transaction monitoring.",
      category: "Personal",
      technologies: JSON.stringify(["Laravel", "MySQL", "Bootstrap"]),
      featured: true,
      order: 4,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: projects.indexOf(project) + 1 },
      update: {},
      create: project,
    });
  }

  // Seed experiences
  await prisma.experience.upsert({
    where: { id: 1 },
    update: {},
    create: {
      company: "PT. Riau Andalan Pulp and Paper",
      position: "Web Developer Intern",
      location: "Pekanbaru, Indonesia",
      startDate: new Date("2023-07-01"),
      endDate: new Date("2023-10-01"),
      current: false,
      description:
        "Developed and maintained the Procurement Approval System used across departments. Collaborated with senior developers on database architecture and backend logic. Implemented role-based access control using Spatie Laravel Permission.",
      technologies: JSON.stringify(["Laravel", "MySQL", "Bootstrap", "JavaScript", "Spatie"]),
      order: 1,
    },
  });

  // Seed blog posts
  const tags = ["Laravel", "PHP", "MySQL", "Web Development", "Backend"];
  const createdTags: { id: number; name: string; slug: string }[] = [];
  for (const tagName of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagName.toLowerCase().replace(/ /g, "-") },
      update: {},
      create: {
        name: tagName,
        slug: tagName.toLowerCase().replace(/ /g, "-"),
      },
    });
    createdTags.push(tag);
  }

  await prisma.post.upsert({
    where: { slug: "getting-started-with-laravel-11" },
    update: {},
    create: {
      title: "Getting Started with Laravel 11: A Complete Guide",
      category: "Backend",
      slug: "getting-started-with-laravel-11",
      excerpt:
        "Laravel 11 brings exciting new features and improvements. In this guide, we'll walk through setting up a new Laravel 11 project from scratch.",
      content: `# Getting Started with Laravel 11

Laravel 11 is the latest major release of the popular PHP framework, bringing exciting new features and a cleaner project structure.

## Prerequisites

Before we begin, ensure you have the following installed:

- PHP 8.2 or higher
- Composer
- MySQL or another supported database

## Installation

\`\`\`bash
composer create-project laravel/laravel my-app
cd my-app
cp .env.example .env
php artisan key:generate
\`\`\`

## Key Features in Laravel 11

### Streamlined Application Structure
Laravel 11 ships with a significantly slimmed-down skeleton with fewer default service providers and a simplified configuration approach.

### New Artisan Commands
Several new artisan commands have been added to improve the developer experience.

## Conclusion

Laravel 11 is a significant step forward for the framework. The streamlined structure makes it easier to get started while the new features provide more power for experienced developers.`,
      published: true,
      featured: true,
      readingTime: "5 min read",
      tags: {
        create: [{ tagId: createdTags[0].id }, { tagId: createdTags[1].id }],
      },
    },
  });

  // Seed site config
  const heroConfig: Prisma.JsonObject = {
    nameFirst: "HAFIF",
    nameLast: "SAPUTRA",
    badge: {
      id: "Siap kolaborasi & freelance",
      en: "Open for collaboration & freelance",
    },
    desc: {
      id: "Membangun sistem backend yang kokoh, API yang rapi, dan aplikasi web yang skalabel. Fokus di Laravel, arsitektur database, serta deployment yang terukur.",
      en: "Building robust backend systems, clean REST APIs, and scalable web applications. Specialized in Laravel, MySQL architecture, and reliable deployments.",
    },
    location: {
      id: "Pekanbaru, Indonesia",
      en: "Pekanbaru, Indonesia",
    },
    ctaPrimary: { id: "Lihat Proyek", en: "View Projects" },
    ctaSecondary: { id: "Hubungi Saya", en: "Contact Me" },
    ctaDownload: { id: "Unduh CV", en: "Download CV" },
    roles: {
      id: ["Programmer", "Pengembang Web", "Fullstack Developer", "Backend Engineer", "Laravel Dev"],
      en: ["Programmer", "Web Developer", "Fullstack Developer", "Backend Engineer", "Laravel Dev"],
    },
  };

  const aboutConfig: Prisma.JsonObject = {
    label: { id: "Tentang", en: "About" },
    title: { id: "Membangun sistem", en: "Building systems" },
    titleEmphasis: { id: "yang benar-benar berfungsi.", en: "that actually work." },
    paragraphs: {
      id: [
        "Saya Hafif Saputra, seorang programmer dari Pekanbaru, Indonesia dengan fokus membangun sistem backend yang kuat dan mudah dirawat.",
        "Pekerjaan saya meliputi sistem pengadaan enterprise, platform koperasi, dan alat pelaporan keuangan — semuanya dibuat dengan fokus pada integritas data, arsitektur yang bersih, dan kegunaan nyata.",
        "Di luar menulis kode Laravel dan merancang skema MySQL, saya mengeksplorasi pola desain sistem dan berkontribusi pada proyek yang memecahkan masalah nyata.",
      ],
      en: [
        "I'm Hafif Saputra, a programmer from Pekanbaru, Indonesia with a focus on building backend systems that are strong and maintainable.",
        "My work spans enterprise procurement systems, cooperative platforms, and financial reporting tools — all built with a focus on data integrity, clean architecture, and real-world usability.",
        "When I'm not writing Laravel code or designing MySQL schemas, I explore system design patterns and contribute to projects that solve real problems.",
      ],
    },
    highlights: {
      id: [
        { icon: "code", title: "Rekayasa Backend", description: "Membangun sistem server-side yang kokoh dengan Laravel dan PHP untuk aplikasi nyata." },
        { icon: "database", title: "Arsitektur Database", description: "Merancang skema MySQL yang efisien dengan normalisasi, indexing, dan optimasi query." },
        { icon: "layers", title: "Desain Sistem", description: "Menciptakan arsitektur scalable untuk procurement, koperasi, dan sistem manajemen." },
        { icon: "git", title: "Kode Bersih", description: "Menulis kode yang mudah dirawat dengan prinsip SOLID dan praktik PHP modern." },
      ],
      en: [
        { icon: "code", title: "Backend Engineering", description: "Building robust server-side systems with Laravel and PHP that power real-world apps." },
        { icon: "database", title: "Database Architecture", description: "Designing efficient MySQL schemas with proper normalization, indexing, and query optimization." },
        { icon: "layers", title: "System Design", description: "Creating scalable architectures for enterprise procurement, cooperative, and management systems." },
        { icon: "git", title: "Clean Code", description: "Writing maintainable code following SOLID principles and modern PHP best practices." },
      ],
    },
  };

  const footerConfig: Prisma.JsonObject = {
    tagline: { id: "Membangun sistem yang siap skala.", en: "Building systems that scale." },
    rights: { id: "Semua hak dilindungi.", en: "All rights reserved." },
    built: { id: "Dibuat dengan", en: "Built with" },
  };

  await prisma.siteConfig.upsert({
    where: { key: "hero" },
    update: { value: heroConfig },
    create: { key: "hero", value: heroConfig },
  });
  await prisma.siteConfig.upsert({
    where: { key: "about" },
    update: { value: aboutConfig },
    create: { key: "about", value: aboutConfig },
  });
  await prisma.siteConfig.upsert({
    where: { key: "footer" },
    update: { value: footerConfig },
    create: { key: "footer", value: footerConfig },
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
