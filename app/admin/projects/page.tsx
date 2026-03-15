import { prisma } from "@/lib/prisma";
import { ProjectsTable } from "@/components/admin/projects-table";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} total projects</p>
        </div>
      </div>
      <ProjectsTable initialProjects={projects} />
    </div>
  );
}
