"use client";

import { useState } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";
import type { Skill } from "@prisma/client";

const CATEGORIES = ["Frontend", "Backend", "Database", "Tools"];
const EMPTY: Partial<Skill> = { name: "", category: "Frontend", level: 80, order: 0 };

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const openNew = () => { setEditing({ ...EMPTY }); setIsNew(true); };
  const close = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const url = isNew ? "/api/skills" : `/api/skills/${editing.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        throw new Error("Save failed");
      }
      const saved = await res.json();
      if (isNew) setSkills((p) => [...p, saved]);
      else setSkills((p) => p.map((s) => (s.id === saved.id ? saved : s)));
      close();
    } catch {
      alert("Gagal menyimpan skill. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete skill?")) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setSkills((p) => p.filter((s) => s.id !== id));
    } catch {
      alert("Gagal menghapus skill. Coba lagi.");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all"
        >
          <Plus size={14} /> Add Skill
        </button>
      </div>

      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-secondary/30">
              <h2 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">{cat}</h2>
            </div>
            <div className="divide-y divide-border">
              {(grouped[cat] || []).map((skill) => (
                <div key={skill.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{skill.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-foreground/50"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-8">{skill.level}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditing({ ...skill }); setIsNew(false); }}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <Plus size={13} className="rotate-45" />
                    </button>
                    <button
                      onClick={() => remove(skill.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {(!grouped[cat] || grouped[cat].length === 0) && (
                <div className="px-5 py-4 text-sm text-muted-foreground">No {cat} skills yet.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display font-semibold">{isNew ? "Add Skill" : "Edit Skill"}</h2>
              <button onClick={close} className="p-1.5 rounded-md hover:bg-accent transition-colors"><X size={15} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Skill Name *</label>
                <input
                  type="text"
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Category</label>
                <select
                  value={editing.category || "Frontend"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                  Proficiency Level: {editing.level}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={editing.level || 80}
                  onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })}
                  className="w-full accent-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Order</label>
                <input
                  type="number"
                  value={editing.order || 0}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-border">
              <button onClick={close} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-accent transition-colors">Cancel</button>
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
