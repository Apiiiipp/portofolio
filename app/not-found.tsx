import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-display font-bold text-muted-foreground/20 mb-4">404</p>
        <h1 className="text-2xl font-display font-bold tracking-tight mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
