"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Skill } from "@prisma/client";
import { useLanguage } from "@/components/layout/language-provider";

// ── Translations ─────────────────────────────────────────────────────────────
const translations = {
  sectionTitle: { id: "Keahlian", en: "Skills" },
  sectionSubtitle: {
    id: "Teknologi yang saya gunakan untuk membangun sistem siap produksi.",
    en: "A curated set of tools and frameworks I use to build production-ready systems."
  },
  technologiesTitle: {
    id: "Teknologi yang saya gunakan",
    en: "Technologies I work with"
  },
  skillsCount: { id: "keahlian", en: "skills" },
  categories: {
    Frontend: { id: "Frontend", en: "Frontend" },
    Backend: { id: "Backend", en: "Backend" },
    Database: { id: "Database", en: "Database" },
    Tools: { id: "Tools", en: "Tools" },
  },
};

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, {
  color: string;       // text color
  dot: string;         // dot bg
  glow: string;        // glow behind card on hover
  border: string;      // hover border tint
  number: string;      // large decorative number
}> = {
  Frontend: {
    color:  "text-blue-400",
    dot:    "bg-blue-400",
    glow:   "hover:shadow-blue-500/10",
    border: "hover:border-blue-500/20",
    number: "01",
  },
  Backend: {
    color:  "text-emerald-400",
    dot:    "bg-emerald-400",
    glow:   "hover:shadow-emerald-500/10",
    border: "hover:border-emerald-500/20",
    number: "02",
  },
  Database: {
    color:  "text-orange-400",
    dot:    "bg-orange-400",
    glow:   "hover:shadow-orange-500/10",
    border: "hover:border-orange-500/20",
    number: "03",
  },
  Tools: {
    color:  "text-purple-400",
    dot:    "bg-purple-400",
    glow:   "hover:shadow-purple-500/10",
    border: "hover:border-purple-500/20",
    number: "04",
  },
};

const CATEGORY_ORDER = ["Frontend", "Backend", "Database", "Tools"];

// ── Individual skill pill ────────────────────────────────────────────────────
function SkillPill({
  skill,
  dotColor,
  index,
  isInView,
}: {
  skill: Skill;
  dotColor: string;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="group flex items-center gap-2.5 py-2 border-b border-border/40 last:border-0 hover:border-border/70 transition-colors"
    >
      {/* animated dot */}
      <motion.span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: index * 0.2,
          ease: "easeInOut",
        }}
      />
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-none">
        {skill.name}
      </span>
    </motion.div>
  );
}

// ── Category card ────────────────────────────────────────────────────────────
function CategoryCard({
  category,
  skills,
  index,
  isInView,
  skillsCountLabel,
}: {
  category: string;
  skills: Skill[];
  index: number;
  isInView: boolean;
  skillsCountLabel: string;
}) {
  const cfg = CATEGORY_CONFIG[category] ?? {
    color: "text-muted-foreground",
    dot: "bg-muted-foreground",
    glow: "",
    border: "",
    number: `0${index + 1}`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      className={`
        relative p-6 rounded-2xl border border-border bg-card
        transition-all duration-300 hover:shadow-xl ${cfg.glow} ${cfg.border}
        overflow-hidden
      `}
    >
      {/* Decorative large number */}
      <span className="absolute top-3 right-4 font-display font-bold text-6xl text-foreground/[0.03] select-none pointer-events-none leading-none">
        {cfg.number}
      </span>

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        <h3 className={`text-xs font-mono font-semibold uppercase tracking-widest ${cfg.color}`}>
          {category}
        </h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground/50">
          {skills.length} {skillsCountLabel}
        </span>
      </div>

      {/* Skills list */}
      <div>
        {skills.map((skill, i) => (
          <SkillPill
            key={skill.id}
            skill={skill}
            dotColor={cfg.dot}
            index={i}
            isInView={isInView}
          />
        ))}
      </div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.12 + 0.4, ease: "easeOut" }}
        className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left`}
        style={{
          background: `linear-gradient(90deg, ${
            category === "Frontend" ? "rgb(96,165,250)" :
            category === "Backend"  ? "rgb(52,211,153)" :
            category === "Database" ? "rgb(251,146,60)"  :
            "rgb(192,132,252)"
          }, transparent)`,
        }}
      />
    </motion.div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export function SkillsSection({ skills }: { skills: Skill[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { lang } = useLanguage();

  // Group and maintain order
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const orderedEntries = CATEGORY_ORDER
    .filter((cat) => grouped[cat]?.length)
    .map((cat) => [cat, grouped[cat]] as [string, Skill[]]);

  // Also add any unlisted categories
  Object.entries(grouped).forEach(([cat, list]) => {
    if (!CATEGORY_ORDER.includes(cat)) orderedEntries.push([cat, list]);
  });

  return (
    <section id="skills" className="py-24 sm:py-32 bg-secondary/20" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">
            {lang === "id" ? translations.sectionTitle.id : translations.sectionTitle.en}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
              {lang === "id" ? translations.technologiesTitle.id : translations.technologiesTitle.en}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              {lang === "id" ? translations.sectionSubtitle.id : translations.sectionSubtitle.en}
            </p>
          </div>

          {/* Thin divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-8 h-px bg-gradient-to-r from-border via-border/50 to-transparent origin-left"
          />
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {orderedEntries.map(([category, categorySkills], i) => (
            <CategoryCard
              key={category}
              category={lang === "id" ? translations.categories[category as keyof typeof translations.categories]?.id || category : translations.categories[category as keyof typeof translations.categories]?.en || category}
              skills={categorySkills}
              index={i}
              isInView={isInView}
              skillsCountLabel={lang === "id" ? translations.skillsCount.id : translations.skillsCount.en}
            />
          ))}
        </div>

        {/* Bottom summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2"
        >
          {orderedEntries.map(([category]) => {
            const cfg = CATEGORY_CONFIG[category];
            return (
              <span
                key={category}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg?.dot ?? "bg-muted-foreground"}`} />
                {lang === "id" ? translations.categories[category as keyof typeof translations.categories]?.id || category : translations.categories[category as keyof typeof translations.categories]?.en || category}
              </span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}