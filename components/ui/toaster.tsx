"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface Toast {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

export function toast(message: string, type: Toast["type"] = "info") {
  const id = Math.random().toString(36).slice(2);
  currentToasts = [...currentToasts, { id, message, type }];
  toastListeners.forEach((l) => l(currentToasts));
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    toastListeners.forEach((l) => l(currentToasts));
  }, 4000);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast[]) => setToasts([...t]);
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter((l) => l !== listener); };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm shadow-lg max-w-sm ${
            t.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : t.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-card border-border text-foreground"
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => {
              currentToasts = currentToasts.filter((ct) => ct.id !== t.id);
              toastListeners.forEach((l) => l(currentToasts));
            }}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
