"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff } from "lucide-react";
import type { Post, PostTag, Tag } from "@prisma/client";

type PostWithTags = Post & { tags: (PostTag & { tag: Tag })[] };

const EMPTY_POST: Partial<Post> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "General",
  published: false,
  featured: false,
  readingTime: "5 min read",
};

const CATEGORIES = ["General", "Backend", "Frontend", "Database", "DevOps", "Tutorial"];

export function BlogTable({ initialPosts }: { initialPosts: PostWithTags[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const openNew = () => { setEditing({ ...EMPTY_POST }); setIsNew(true); };
  const openEdit = (p: Post) => { setEditing({ ...p }); setIsNew(false); };
  const close = () => { setEditing(null); setIsNew(false); };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const payload = {
        ...editing,
        slug: editing.slug || autoSlug(editing.title || ""),
        readingTime: editing.readingTime || "5 min read",
      };
      const url = isNew ? "/api/posts" : `/api/posts/${editing.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Save failed");
      }
      const saved = await res.json();
      if (isNew) {
        setPosts((prev) => [{ ...saved, tags: [] }, ...prev]);
      } else {
        setPosts((prev) => prev.map((p) => (p.id === saved.id ? { ...saved, tags: p.tags } : p)));
      }
      close();
    } catch {
      alert("Gagal menyimpan post. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Gagal menghapus post. Coba lagi.");
    }
  };

  const togglePublish = async (p: PostWithTags) => {
    try {
      const res = await fetch(`/api/posts/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !p.published }),
      });
      if (!res.ok) {
        throw new Error("Update failed");
      }
      const updated = await res.json();
      setPosts((prev) => prev.map((post) => (post.id === updated.id ? { ...updated, tags: post.tags } : post)));
    } catch {
      alert("Gagal mengubah status publish. Coba lagi.");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all"
        >
          <Plus size={14} />
          New Post
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground hidden md:table-cell">Views</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 text-xs font-mono text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{p.title}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="px-2 py-0.5 text-xs rounded bg-secondary text-muted-foreground font-mono">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.views}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(p)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded border font-mono transition-colors ${
                        p.published
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      {p.published ? <Eye size={10} /> : <EyeOff size={10} />}
                      {p.published ? "Published" : "Draft"}
                    </button>
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
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No posts yet. Write your first one!
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
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display font-semibold">{isNew ? "New Post" : "Edit Post"}</h2>
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
                  onChange={(e) => setEditing({
                    ...editing,
                    title: e.target.value,
                    slug: editing.slug || autoSlug(e.target.value),
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">Slug</label>
                  <input
                    type="text"
                    value={editing.slug || ""}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">Category</label>
                  <select
                    value={editing.category || "General"}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Excerpt *</label>
                <textarea
                  rows={2}
                  value={editing.excerpt || ""}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                  Content (Markdown)
                </label>
                <textarea
                  rows={10}
                  value={editing.content || ""}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none font-mono"
                  placeholder="# Your post content in Markdown..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">Reading Time</label>
                  <input
                    type="text"
                    value={editing.readingTime || "5 min read"}
                    onChange={(e) => setEditing({ ...editing, readingTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    placeholder="5 min read"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.published || false}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="rounded"
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured || false}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="rounded"
                  />
                  Featured
                </label>
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
                {loading ? "Saving..." : "Save Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
