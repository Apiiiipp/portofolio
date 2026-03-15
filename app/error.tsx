"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-mono text-muted-foreground mb-2">Something went wrong</p>
        <h2 className="text-xl font-display font-bold tracking-tight mb-6">
          {error.message || "An unexpected error occurred"}
        </h2>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
