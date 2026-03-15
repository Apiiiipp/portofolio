import { Navbar } from "@/components/layout/navbar";
import { Footer, type FooterContent } from "@/components/layout/footer";
import { HeroSection, type HeroContent } from "@/components/sections/hero";
import { AboutSection, type AboutContent } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { ExperienceSection } from "@/components/sections/experience";
import { BlogPreviewSection } from "@/components/sections/blog-preview";
import { ContactSection } from "@/components/sections/contact";
import { GitHubSection } from "@/components/sections/github";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, skills, posts, experience, siteConfigs] = await Promise.all([
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.siteConfig.findMany(),
  ]);

  const configMap = siteConfigs.reduce<Record<string, unknown>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <main>
        <HeroSection data={configMap.hero as HeroContent | undefined} />
        <AboutSection data={configMap.about as AboutContent | undefined} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experience} />
        <GitHubSection />
        <BlogPreviewSection posts={posts} />
        <ContactSection />
      </main>
      <Footer data={configMap.footer as FooterContent | undefined} />
    </div>
  );
}
