import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on backend development, Laravel, database design, and web engineering.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { tags: { include: { tag: true } } },
  });

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={13} />
            Back home
          </Link>
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">
            Writing
          </p>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-3">
            Blog
          </h1>
          <p className="text-muted-foreground">
            Thoughts on backend development, Laravel, databases, and building things.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block p-5 rounded-xl border border-border bg-card hover:bg-accent/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs rounded bg-secondary text-muted-foreground font-mono">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={10} />
                    {post.readingTime || "5 min read"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="text-base font-display font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Read post
                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
