"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Post } from "@prisma/client";
import { useLanguage } from "@/components/layout/language-provider";

export function BlogPreviewSection({ posts }: { posts: Post[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();

  const copy =
    lang === "id"
      ? {
          label: "Tulisan",
          title: "Posting terbaru",
          all: "Semua tulisan",
          readMore: "Baca selengkapnya",
          minutes: "mnt",
        }
      : {
          label: "Writing",
          title: "Latest posts",
          all: "All posts",
          readMore: "Read more",
          minutes: "min",
        };

  if (!posts.length) return null;

  return (
    <section id="blog" className="py-24 sm:py-32 bg-secondary/30" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">
              {copy.label}
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
              {copy.title}
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            {copy.all}
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block p-5 rounded-xl border border-border bg-card hover:bg-accent/20 transition-all h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs rounded bg-secondary text-muted-foreground font-mono">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={10} />
                    {post.readingTime || `5 ${copy.minutes} read`}
                  </span>
                </div>
                <h3 className="text-sm font-display font-semibold mb-2 group-hover:text-foreground transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {copy.readMore}
                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
