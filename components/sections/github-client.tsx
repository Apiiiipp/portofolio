"use client";

import { Star, GitFork, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";
import type { GitHubRepo } from "@/lib/github";

const languageColors: Record<string, string> = {
  PHP: "bg-indigo-400",
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-400",
  Python: "bg-green-400",
  CSS: "bg-purple-400",
  HTML: "bg-orange-400",
  Vue: "bg-emerald-400",
};

export function GitHubSectionClient({ repos }: { repos: GitHubRepo[] }) {
  const { lang } = useLanguage();

  const copy =
    lang === "id"
      ? {
          label: "Open Source",
          title: "Aktivitas GitHub",
          viewAll: "Lihat semua repository di GitHub",
        }
      : {
          label: "Open Source",
          title: "GitHub activity",
          viewAll: "View all repositories on GitHub",
        };

  return (
    <section id="github" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">
            {copy.label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
            {copy.title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-xl border border-border bg-card hover:bg-accent/20 transition-all hover:border-border/80"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-mono font-medium truncate flex-1 pr-2">
                  {repo.name}
                </h3>
                <ExternalLink
                  size={13}
                  className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0 mt-0.5"
                />
              </div>

              {repo.description && (
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${languageColors[repo.language] || "bg-gray-400"}`}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star size={11} />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={11} />
                  {repo.forks_count}
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a
            href="https://github.com/hafifsaputra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {copy.viewAll}
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
