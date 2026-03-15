"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { Code2, Database, GitBranch, Layers, MapPin, Calendar } from "lucide-react";

const iconMap = {
  code: Code2,
  database: Database,
  layers: Layers,
  git: GitBranch,
};

export type AboutContent = {
  imageSrc?: string;
  imageAlt?: string;
  badge?: string;
  stats?: { value: string; label: string }[];
  location?: string;
  availability?: string;
  headline?: string;
  subheadline?: string;
  paragraphs?: string[];
  highlights?: { label: string; icon?: keyof typeof iconMap }[];
  techStack?: string[];
};

const highlights: { label: string; icon: keyof typeof iconMap }[] = [
  { icon: "code", label: "Backend Engineering" },
  { icon: "database", label: "Database Architecture" },
  { icon: "layers", label: "System Design" },
  { icon: "git", label: "Clean Code" },
];

const techStack = [
  "Laravel", "PHP", "MySQL", "JavaScript",
  "REST API", "Bootstrap", "TailwindCSS",
];

const stats = [
  { value: "4+",  label: "Projects" },
  { value: "2+",  label: "Years Coding" },
  { value: "100%", label: "Commitment" },
];

export function AboutSection({ data }: { data?: AboutContent }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [imageError, setImageError] = useState(false);

  const resolvedStats = data?.stats?.length ? data.stats : stats;
  const resolvedHighlights = data?.highlights?.length ? data.highlights : highlights;
  const resolvedTechStack = data?.techStack?.length ? data.techStack : techStack;
  const headline = data?.headline ?? "Membangun sistem";
  const subheadline = data?.subheadline ?? "yang benar-benar berfungsi.";
  const paragraphs =
    data?.paragraphs?.length
      ? data.paragraphs
      : [
          "Saya Hafif Saputra, seorang programmer dari Pekanbaru, Indonesia dengan fokus membangun sistem backend yang kuat dan mudah dirawat.",
          "Pekerjaan saya meliputi sistem pengadaan enterprise, platform koperasi, dan alat pelaporan keuangan — semuanya dibuat dengan fokus pada integritas data, arsitektur yang bersih, dan kegunaan nyata.",
          "Di luar menulis kode Laravel dan merancang skema MySQL, saya mengeksplorasi pola desain sistem dan berkontribusi pada proyek yang memecahkan masalah nyata bagi pengguna.",
        ];

  return (
    <section id="about" className="py-24 sm:py-32" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">


        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT — Photo column ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center lg:items-start gap-6"
          >
            {/* Photo frame */}
            <div className="relative group">
              {/* Animated glow border */}
              <motion.div
                className="absolute -inset-[2px] rounded-2xl opacity-60"
                animate={{
                  background: [
                    "linear-gradient(135deg, rgba(16,185,129,0.5), rgba(59,130,246,0.3), rgba(16,185,129,0.1))",
                    "linear-gradient(225deg, rgba(59,130,246,0.5), rgba(16,185,129,0.3), rgba(59,130,246,0.1))",
                    "linear-gradient(315deg, rgba(16,185,129,0.5), rgba(59,130,246,0.3), rgba(16,185,129,0.1))",
                    "linear-gradient(135deg, rgba(16,185,129,0.5), rgba(59,130,246,0.3), rgba(16,185,129,0.1))",
                  ],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />

              {/* Photo container */}
              <div className="relative w-64 h-80 sm:w-72 sm:h-[360px] rounded-2xl overflow-hidden border border-border bg-secondary">
                {/* Placeholder — replace src with your actual photo path */}
                <Image
                  src={data?.imageSrc || "/images/programmer.jpeg"}
                  alt={data?.imageAlt || "Hafif Saputra"}
                  fill
                  sizes="(max-width: 640px) 16rem, 18rem"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    setImageError(true);
                  }}
                />

                {/* Fallback initials (shown when no photo) */}
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-accent">
                    <span className="text-6xl font-display font-bold text-muted-foreground/30 select-none">
                      HS
                    </span>
                  </div>
                )}

                {/* Bottom overlay gradient */}
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />
              </div>

              {/* Floating badge — availability */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-4 -right-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card/90 backdrop-blur-sm shadow-lg text-xs font-mono"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {data?.badge || "Open to work"}
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-6 pt-4"
            >
              {resolvedStats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-display font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>

            {/* Location + availability */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin size={12} />
                <span>{data?.location || "Pekanbaru, Riau, Indonesia"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar size={12} />
                <span>{data?.availability || "Available for freelance & full-time"}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT — Text column ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight leading-tight">
              {headline}
              <br />
              <span className="text-muted-foreground/50">{subheadline}</span>
            </h2>

            {/* Paragraphs */}
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              {paragraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
              ))}
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {resolvedHighlights.map(({ icon, label }, i) => {
                const Icon = iconMap[icon || "code"] || Code2;
                return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors"
                >
                  <Icon size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium leading-tight">{label}</span>
                </motion.div>
                );
              })}
            </div>

            {/* Tech stack */}
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {resolvedTechStack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                    className="px-2.5 py-1 text-xs rounded-md bg-secondary border border-border text-muted-foreground font-mono hover:border-emerald-500/30 hover:text-foreground transition-colors cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
