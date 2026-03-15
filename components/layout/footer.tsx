"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";

const socialLinks = [
  { href: "https://github.com/hafifsaputra", label: "GitHub", icon: Github },
  { href: "https://linkedin.com/in/hafifsaputra", label: "LinkedIn", icon: Linkedin },
  { href: "https://twitter.com/hafifsaputra", label: "Twitter", icon: Twitter },
  { href: "mailto:hafif@example.com", label: "Email", icon: Mail },
];

export type FooterContent = {
  tagline: { id: string; en: string };
  rights: { id: string; en: string };
  built: { id: string; en: string };
};

const defaultCopy: FooterContent = {
  tagline: { id: "Membangun sistem yang siap skala.", en: "Building systems that scale." },
  rights: { id: "Semua hak dilindungi.", en: "All rights reserved." },
  built: { id: "Dibuat dengan", en: "Built with" },
};

export function Footer({ data }: { data?: FooterContent }) {
  const { lang } = useLanguage();
  const copy = data || defaultCopy;

  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link href="/" className="font-display font-bold text-xl tracking-tight">
              hs.
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "id" ? copy.tagline.id : copy.tagline.en}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Hafif Saputra. {lang === "id" ? copy.rights.id : copy.rights.en}</p>
          <p>
            {lang === "id" ? copy.built.id : copy.built.en}{" "}
            <a href="https://nextjs.org" className="hover:text-foreground transition-colors underline underline-offset-2">
              Next.js
            </a>{" "}
            &{" "}
            <a href="https://tailwindcss.com" className="hover:text-foreground transition-colors underline underline-offset-2">
              Tailwind
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
