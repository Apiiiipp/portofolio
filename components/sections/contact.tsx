"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Mail, MapPin, Github, Linkedin } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { lang } = useLanguage();

  const copy =
    lang === "id"
      ? {
          label: "Kontak",
          title: "Mari bekerja sama",
          info:
            "Saya terbuka untuk freelance, magang, dan pekerjaan full-time. Jika ada proyek atau sekadar ingin terhubung, inbox saya selalu terbuka.",
          name: "Nama",
          email: "Email",
          message: "Pesan",
          namePlaceholder: "Nama kamu",
          messagePlaceholder: "Ceritakan tentang proyekmu...",
          success: "Pesan terkirim! Saya akan balas secepatnya.",
          error: "Terjadi kesalahan. Silakan coba lagi.",
          sending: "Mengirim...",
          send: "Kirim Pesan",
        }
      : {
          label: "Contact",
          title: "Let's work together",
          info:
            "I'm open to freelance opportunities, internships, and full-time roles. Whether you have a project in mind or just want to connect — my inbox is always open.",
          name: "Name",
          email: "Email",
          message: "Message",
          namePlaceholder: "Your name",
          messagePlaceholder: "Tell me about your project...",
          success: "Message sent! I'll get back to you soon.",
          error: "Something went wrong. Please try again.",
          sending: "Sending...",
          send: "Send Message",
        };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32" ref={ref}>
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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-muted-foreground leading-relaxed mb-8">
              {copy.info}
            </p>
            <div className="space-y-4">
              <a href="mailto:hafif@example.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <span className="p-2 rounded-md bg-secondary border border-border group-hover:bg-accent transition-colors">
                  <Mail size={14} />
                </span>
                hafif@example.com
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="p-2 rounded-md bg-secondary border border-border">
                  <MapPin size={14} />
                </span>
                Pekanbaru, Riau, Indonesia
              </div>
              <a href="https://github.com/hafifsaputra" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <span className="p-2 rounded-md bg-secondary border border-border group-hover:bg-accent transition-colors">
                  <Github size={14} />
                </span>
                github.com/hafifsaputra
              </a>
              <a href="https://linkedin.com/in/hafifsaputra" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <span className="p-2 rounded-md bg-secondary border border-border group-hover:bg-accent transition-colors">
                  <Linkedin size={14} />
                </span>
                linkedin.com/in/hafifsaputra
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-mono">{copy.name}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-muted-foreground/50 transition-colors"
                  placeholder={copy.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-mono">{copy.email}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-muted-foreground/50 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-mono">{copy.message}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-muted-foreground/50 transition-colors resize-none"
                  placeholder={copy.messagePlaceholder}
                />
              </div>

              {status === "success" && (
                <p className="text-sm text-emerald-400">{copy.success}</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-400">{copy.error}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {status === "loading" ? (
                  copy.sending
                ) : (
                  <>
                    <Send size={14} />
                    {copy.send}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
