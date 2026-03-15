"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@prisma/client";
import { useLanguage } from "@/components/layout/language-provider";

const categoryColors: Record<string, string> = {
  Internship: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Academic: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Personal: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("All");
  const { lang } = useLanguage();

  const categoryLabels =
    lang === "id"
      ? {
          All: "Semua",
          Internship: "Magang",
          Academic: "Akademik",
          Personal: "Personal",
        }
      : {
          All: "All",
          Internship: "Internship",
          Academic: "Academic",
          Personal: "Personal",
        };

  const categories = ["All", "Internship", "Academic", "Personal"].map((value) => ({
    value,
    label: categoryLabels[value as keyof typeof categoryLabels] || value,
  }));

  const copy =
    lang === "id"
      ? {
          label: "Proyek",
          title: "Hal yang pernah saya buat",
        }
      : {
          label: "Projects",
          title: "Things I've built",
        };

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 sm:py-32" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">
            {copy.label}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
              {copy.title}
            </h2>
            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors font-mono ${
                    activeCategory === cat.value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {filtered.map((project, i) => {
            const techs: string[] = JSON.parse(project.technologies || "[]");
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-xl border border-border bg-card hover:bg-accent/20 transition-all hover:border-border/80"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-0.5 text-xs rounded border font-mono ${categoryColors[project.category] || "bg-secondary text-muted-foreground border-border"}`}>
                    {categoryLabels[project.category as keyof typeof categoryLabels] || project.category}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-accent transition-colors">
                        <Github size={14} className="text-muted-foreground" />
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-accent transition-colors">
                        <ExternalLink size={14} className="text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-display font-semibold mb-2 group-hover:text-foreground transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {techs.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 text-xs rounded bg-secondary text-muted-foreground font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
