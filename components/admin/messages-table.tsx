"use client";

import { useState } from "react";
import { Check, Trash2, Mail } from "lucide-react";
import type { Contact } from "@prisma/client";

export function MessagesTable({ initialMessages }: { initialMessages: Contact[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<Contact | null>(null);

  const markRead = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) {
        throw new Error("Update failed");
      }
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch {
      alert("Gagal memperbarui pesan. Coba lagi.");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      alert("Gagal menghapus pesan. Coba lagi.");
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      {/* List */}
      <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => { setSelected(msg); if (!msg.read) markRead(msg.id); }}
              className={`w-full text-left p-4 hover:bg-accent/20 transition-colors ${selected?.id === msg.id ? "bg-accent/30" : ""}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
                  <p className={`text-sm truncate ${msg.read ? "text-muted-foreground" : "font-medium"}`}>
                    {msg.name}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">
                  {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
              <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
            </button>
          ))}
          {messages.length === 0 && (
            <div className="p-8 text-center">
              <Mail size={24} className="mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-3 rounded-xl border border-border bg-card">
        {selected ? (
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold text-lg">{selected.name}</h2>
                <a href={`mailto:${selected.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {selected.email}
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(selected.createdAt).toLocaleDateString("en-US", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {!selected.read && (
                  <button
                    onClick={() => markRead(selected.id)}
                    className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    title="Mark as read"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  onClick={() => remove(selected.id)}
                  className="p-2 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="border-t border-border pt-5">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </p>
            </div>
            <div className="mt-6">
              <a
                href={`mailto:${selected.email}?subject=Re: Your message`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all"
              >
                <Mail size={13} />
                Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-12">
            <div className="text-center">
              <Mail size={32} className="mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Select a message to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
