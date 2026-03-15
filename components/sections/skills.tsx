"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Skill } from "@prisma/client";
import { useLanguage } from "@/components/layout/language-provider";

const categoryColors: Record<string, string> = {
  Frontend: "text-blue-400",
  Backend: "text-emerald-400",
  Database: "text-orange-400",
  Tools: "text-purple-400",
};

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();

  const copy =
    lang === "id"
      ? {
          label: "Keahlian",
          title: "Teknologi yang saya gunakan",
          categories: {
            Frontend: "Frontend",
            Backend: "Backend",
            Database: "Basis Data",
            Tools: "Tools",
          },
        }
      : {
          label: "Skills",
          title: "Technologies I work with",
          categories: {
            Frontend: "Frontend",
            Backend: "Backend",
            Database: "Database",
            Tools: "Tools",
          },
        };

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-24 sm:py-32 bg-secondary/30" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">
            {copy.label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
            {copy.title}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(grouped).map(([category, categorySkills], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <h3 className={`text-xs font-mono font-semibold uppercase tracking-wider mb-4 ${categoryColors[category] || "text-muted-foreground"}`}>
                {copy.categories[category as keyof typeof copy.categories] || category}
              </h3>
              <div className="space-y-3">
                {categorySkills.map((skill, i) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-foreground">{skill.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 0.8, delay: catIndex * 0.1 + i * 0.05 + 0.3, ease: "easeOut" }}
                        className="h-full rounded-full bg-foreground/60"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
