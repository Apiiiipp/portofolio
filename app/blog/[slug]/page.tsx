import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params?.slug) return { title: "Post Not Found" };
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: Props) {
  if (!params?.slug) notFound();
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: { tags: { include: { tag: true } } },
  });

  if (!post) notFound();

  // Increment views
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={13} />
          All posts
        </Link>

        <article>
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-2 py-0.5 text-xs rounded bg-secondary text-muted-foreground font-mono">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={11} />
                {post.readingTime || "5 min read"}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={11} />
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.tags.map(({ tag }) => (
                  <span key={tag.id} className="px-2 py-0.5 text-xs rounded-full border border-border text-muted-foreground">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="border-t border-border pt-8">
            <div className="prose-custom">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} />
            Back to all posts
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
