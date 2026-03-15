"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar } from "lucide-react";
import type { Experience } from "@prisma/client";
import { useLanguage } from "@/components/layout/language-provider";

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
      month: "short",
      year: "numeric",
    });

  const copy =
    lang === "id"
      ? { label: "Pengalaman", title: "Riwayat kerja", present: "Sekarang", current: "Saat ini" }
      : { label: "Experience", title: "Work history", present: "Present", current: "Current" };

  return (
    <section id="experience" className="py-24 sm:py-32 bg-secondary/30" ref={ref}>
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

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-3 hidden sm:block" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="sm:pl-10 relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-border bg-background flex items-center justify-center hidden sm:flex">
                  <div className="w-2 h-2 rounded-full bg-foreground/40" />
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-display font-semibold">{exp.position}</h3>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar size={11} />
                        <span>
                          {formatDate(exp.startDate)} —{" "}
                          {exp.current ? copy.present : exp.endDate ? formatDate(exp.endDate) : ""}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin size={11} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                      {exp.current && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {copy.current}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
