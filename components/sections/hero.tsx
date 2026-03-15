"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, MapPin } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";

// ─── Animated particle field ────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    const isDark = () => document.documentElement.classList.contains("dark");
    const PARTICLE_COUNT = 80;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      opacity: number;
      pulseOffset: number;
    }

    let particles: Particle[] = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    };

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);
      const dark = isDark();
      const baseColor = dark ? "255,255,255" : "0,0,0";

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        const pulse = Math.sin(t * 1.5 + p.pulseOffset) * 0.2 + 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor},${p.opacity * pulse})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${baseColor},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

// ─── Floating code snippets ──────────────────────────────────────────────────
const codeSnippets = [
  "php artisan migrate",
  "SELECT * FROM users",
  "git push origin main",
  "composer require laravel",
  "npm run build",
  "CREATE INDEX idx_user",
  "Route::apiResource()",
  "DB::transaction(fn)",
  "return response()->json()",
  "Schema::create('posts')",
];

function FloatingCode() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {codeSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-xs text-foreground/[0.04] dark:text-foreground/[0.06] whitespace-nowrap"
          style={{
            left: `${5 + (i * 9.3) % 88}%`,
            top: `${8 + (i * 11.7) % 84}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 6 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        >
          {snippet}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Cursor glow ─────────────────────────────────────────────────────────────
function CursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
      style={{
        x: useTransform(springX, (v) => v - 250),
        y: useTransform(springY, (v) => v - 250),
        background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
      }}
    />
  );
}

// ─── Animated grid with scan lines ───────────────────────────────────────────
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--foreground)/0.15), transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-0 bottom-0 w-px"
        style={{ background: "linear-gradient(180deg, transparent, hsl(var(--foreground)/0.08), transparent)" }}
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
      />
    </div>
  );
}

// ─── Typewriter cycling roles ─────────────────────────────────────────────────
function TypingRole({ roles }: { roles: string[] }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");

  useEffect(() => {
    setRoleIndex(0);
    setDisplayed("");
    setPhase("typing");
  }, [roles]);

  useEffect(() => {
    const current = roles[roleIndex] || "";

    if (phase === "typing") {
      if (displayed.length < current.length) {
        const t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          70
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("pause"), 2000);
      return () => clearTimeout(t);
    }

    if (phase === "pause") {
      const t = setTimeout(() => setPhase("deleting"), 300);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
        return () => clearTimeout(t);
      }
      setRoleIndex((i) => (i + 1) % roles.length);
      setPhase("typing");
    }
  }, [displayed, phase, roleIndex, roles]);

  return (
    <div className="relative inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-border/60 bg-background/70 backdrop-blur-sm font-mono min-w-[230px] justify-center">
      <span className="text-emerald-400 text-xs">{"<"}</span>
      <span className="text-emerald-400/60 text-xs">{"//"}</span>
      {/* fixed width container so layout doesn't shift */}
      <span className="text-foreground/80 tracking-widest uppercase text-[10px] inline-flex items-center w-[140px]">
        <span>{displayed}</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
          className="inline-block w-[2px] h-[10px] bg-emerald-400 ml-[2px] shrink-0"
        />
      </span>
      <span className="text-emerald-400 text-xs">{">"}</span>
    </div>
  );
}

// ─── Copy ────────────────────────────────────────────────────────────────────
export type HeroContent = {
  nameFirst: string;
  nameLast: string;
  badge: { id: string; en: string };
  desc: { id: string; en: string };
  location: { id: string; en: string };
  ctaPrimary: { id: string; en: string };
  ctaSecondary: { id: string; en: string };
  ctaDownload: { id: string; en: string };
  roles: { id: string[]; en: string[] };
};

const defaultCopy: HeroContent = {
  nameFirst: "HAFIF",
  nameLast: "SAPUTRA",
  badge: { id: "Siap kolaborasi & freelance", en: "Open for collaboration & freelance" },
  desc: {
    id: "Membangun sistem backend yang kokoh, API yang rapi, dan aplikasi web yang skalabel. Fokus di Laravel, arsitektur database, serta deployment yang terukur.",
    en: "Building robust backend systems, clean REST APIs, and scalable web applications. Specialized in Laravel, MySQL architecture, and reliable deployments.",
  },
  location: { id: "Pekanbaru, Indonesia", en: "Pekanbaru, Indonesia" },
  ctaPrimary: { id: "Lihat Proyek", en: "View Projects" },
  ctaSecondary: { id: "Hubungi Saya", en: "Contact Me" },
  ctaDownload: { id: "Unduh CV", en: "Download CV" },
  roles: {
    id: ["Programmer", "Pengembang Web", "Fullstack Developer", "Backend Engineer", "Laravel Dev"],
    en: ["Programmer", "Web Developer", "Fullstack Developer", "Backend Engineer", "Laravel Dev"],
  },
};

// ─── Framer variants ──────────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// ─── Main export ──────────────────────────────────────────────────────────────
export function HeroSection({ data }: { data?: HeroContent }) {
  const [hovered, setHovered] = useState(false);
  const { lang } = useLanguage();
  const t = data || defaultCopy;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient mesh */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsl(160 60% 40% / 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsl(210 80% 55% / 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 50% 10%, hsl(240 60% 60% / 0.04) 0%, transparent 70%)
          `,
        }}
      />

      <AnimatedGrid />
      <ParticleField />
      <FloatingCode />
      <CursorGlow />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center"
      >
        {/* Badge */}
        <motion.div variants={item} className="inline-flex mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 border border-border text-muted-foreground backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {lang === "id" ? t.badge.id : t.badge.en}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="text-5xl sm:text-7xl md:text-8xl font-display font-bold tracking-tight mb-6 cursor-default whitespace-nowrap"
        >
          <motion.span
            className="inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)/0.7) 40%, hsl(var(--foreground)) 60%, hsl(var(--foreground)/0.5) 100%)",
              backgroundSize: "300% 100%",
            }}
            animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
            transition={{ duration: hovered ? 1.5 : 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {t.nameFirst}
          </motion.span>
          <motion.span
            className="inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(var(--foreground)/0.4) 0%, hsl(var(--foreground)/0.7) 50%, hsl(var(--foreground)/0.3) 100%)",
              backgroundSize: "300% 100%",
            }}
            animate={{ backgroundPositionX: ["100%", "0%", "100%"] }}
            transition={{ duration: hovered ? 1.5 : 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          >
            {t.nameLast}
          </motion.span>
        </motion.h1>

        {/* Typing role */}
        <motion.div variants={item} className="flex items-center justify-center gap-3 mb-7">
          <div className="h-px w-12 bg-border" />
          <div className="relative">
            {/* outer glow ring */}
            <motion.div
              className="absolute -inset-px rounded-full blur-[3px]"
              animate={{
                background: [
                  "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(34,211,238,0.2), rgba(59,130,246,0.3))",
                  "linear-gradient(225deg, rgba(59,130,246,0.3), rgba(16,185,129,0.2), rgba(34,211,238,0.3))",
                  "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(34,211,238,0.2), rgba(59,130,246,0.3))",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <TypingRole roles={lang === "id" ? t.roles.id : t.roles.en} />
          </div>
          <div className="h-px w-12 bg-border" />
        </motion.div>

        {/* Description */}
        <motion.p
          variants={item}
          className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-4"
        >
          {lang === "id" ? t.desc.id : t.desc.en}
        </motion.p>

        {/* Location */}
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-1.5 mb-10 text-sm text-muted-foreground/60"
        >
          <MapPin size={12} />
          <span className="font-mono text-xs tracking-wide">
            {lang === "id" ? t.location.id : t.location.en}
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="#projects"
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium overflow-hidden transition-all"
            style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
          >
            <motion.span
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              whileHover={{ translateX: "200%" }}
              transition={{ duration: 0.5 }}
            />
            {lang === "id" ? t.ctaPrimary.id : t.ctaPrimary.en}
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent backdrop-blur-sm transition-all"
          >
            {lang === "id" ? t.ctaSecondary.id : t.ctaSecondary.en}
          </Link>

          <a
            href="/cv.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent backdrop-blur-sm transition-all"
          >
            <Download size={14} />
            {lang === "id" ? t.ctaDownload.id : t.ctaDownload.en}
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-5 mt-10"
        >
          <a
            href="https://github.com/hafifsaputra"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <Github size={14} />
            GitHub
          </a>
          <span className="w-1 h-1 rounded-full bg-border" />
          <a
            href="https://linkedin.com/in/hafifsaputra"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={item}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-muted-foreground/40"
          >
            <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-current to-transparent" />
            <div className="w-1 h-1 rounded-full bg-current" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
