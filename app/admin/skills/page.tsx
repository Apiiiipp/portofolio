import { prisma } from "@/lib/prisma";
import { SkillsManager } from "@/components/admin/skills-manager";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold tracking-tight">Skills</h1>
        <p className="text-sm text-muted-foreground mt-1">{skills.length} skills configured</p>
      </div>
      <SkillsManager initialSkills={skills} />
    </div>
  );
}
