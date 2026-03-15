import { prisma } from "@/lib/prisma";
import { BlogTable } from "@/components/admin/blog-table";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { tags: { include: { tag: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} total posts</p>
        </div>
      </div>
      <BlogTable initialPosts={posts} />
    </div>
  );
}
