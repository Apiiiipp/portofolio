"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Database, GitBranch, Layers } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";

type HighlightItem = {
  icon: "code" | "database" | "layers" | "git";
  title: string;
  description: string;
};

export type AboutContent = {
  label: { id: string; en: string };
  title: { id: string; en: string };
  titleEmphasis: { id: string; en: string };
  paragraphs: { id: string[]; en: string[] };
  highlights: { id: HighlightItem[]; en: HighlightItem[] };
};

const defaultCopy: AboutContent = {
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

const iconMap = {
  code: Code2,
  database: Database,
  layers: Layers,
  git: GitBranch,
} as const;

export function AboutSection({ data }: { data?: AboutContent }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();
  const copy = data || defaultCopy;
  const paragraphs = lang === "id" ? copy.paragraphs.id : copy.paragraphs.en;
  const highlights = lang === "id" ? copy.highlights.id : copy.highlights.en;

  return (
    <section id="about" className="py-24 sm:py-32" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">
              {lang === "id" ? copy.label.id : copy.label.en}
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-6">
              {lang === "id" ? copy.title.id : copy.title.en}
              <br />
              <span className="text-muted-foreground/60">
                {lang === "id" ? copy.titleEmphasis.id : copy.titleEmphasis.en}
              </span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Laravel", "PHP", "MySQL", "JavaScript", "REST API", "Bootstrap", "TailwindCSS"].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs rounded-md bg-secondary border border-border text-muted-foreground font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Highlights grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {highlights.map((item, i) => {
              const Icon = iconMap[item.icon] || Code2;
              return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="p-5 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors"
              >
                <Icon size={20} className="mb-3 text-muted-foreground" />
                <h3 className="text-sm font-display font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            );})}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
