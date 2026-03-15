"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Project } from "@prisma/client";

const CATEGORIES = ["Internship", "Academic", "Personal"];
const EMPTY: Partial<Project> = {
  title: "",
  description: "",
  category: "Personal",
  technologies: "[]",
  github: "",
  demo: "",
  featured: false,
  order: 0,
};

export function ProjectsTable({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const openNew = () => {
    setEditing({ ...EMPTY });
    setIsNew(true);
  };

  const openEdit = (p: Project) => {
    setEditing({ ...p });
    setIsNew(false);
  };

  const close = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const url = isNew ? "/api/projects" : `/api/projects/${editing.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        throw new Error("Save failed");
      }
      const saved = await res.json();
      if (isNew) {
        setProjects((prev) => [...prev, saved]);
      } else {
        setProjects((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      }
      close();
    } catch {
      alert("Gagal menyimpan project. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Gagal menghapus project. Coba lagi.");
    }
  };

  const parseTechs = (t: string) => {
    try { return (JSON.parse(t) as string[]).join(", "); } catch { return t; }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground hidden md:table-cell">Technologies</th>
                <th className="text-right px-4 py-3 text-xs font-mono text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{p.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded bg-secondary text-muted-foreground font-mono">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-muted-foreground line-clamp-1">{parseTechs(p.technologies)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No projects yet. Add your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display font-semibold">{isNew ? "Add Project" : "Edit Project"}</h2>
              <button onClick={close} className="p-1.5 rounded-md hover:bg-accent transition-colors">
                <X size={15} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Title *</label>
                <input
                  type="text"
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Category</label>
                <select
                  value={editing.category || "Personal"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Description *</label>
                <textarea
                  rows={3}
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                  Technologies (JSON array, e.g. ["Laravel","MySQL"])
                </label>
                <input
                  type="text"
                  value={editing.technologies || "[]"}
                  onChange={(e) => setEditing({ ...editing, technologies: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">GitHub URL</label>
                  <input
                    type="url"
                    value={editing.github || ""}
                    onChange={(e) => setEditing({ ...editing, github: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">Demo URL</label>
                  <input
                    type="url"
                    value={editing.demo || ""}
                    onChange={(e) => setEditing({ ...editing, demo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editing.featured || false}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm text-muted-foreground">Featured project</label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-5 border-t border-border">
              <button
                onClick={close}
                className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 transition-all"
              >
                <Check size={14} />
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
