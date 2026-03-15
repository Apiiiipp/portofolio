import { prisma } from "@/lib/prisma";
import { FolderKanban, FileText, Zap, Mail, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [projectCount, postCount, skillCount, unreadMessages, totalViews, recentMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.skill.count(),
      prisma.contact.count({ where: { read: false } }),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "Projects", value: projectCount, icon: FolderKanban, href: "/admin/projects" },
    { label: "Published Posts", value: postCount, icon: FileText, href: "/admin/blog" },
    { label: "Skills", value: skillCount, icon: Zap, href: "/admin/skills" },
    { label: "Unread Messages", value: unreadMessages, icon: Mail, href: "/admin/messages" },
    { label: "Total Post Views", value: totalViews._sum.views ?? 0, icon: Eye, href: "/admin/blog" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="p-5 rounded-xl border border-border bg-card hover:bg-accent/20 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-mono">{label}</p>
              <Icon size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <p className="text-3xl font-display font-bold">{value.toLocaleString()}</p>
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-sm font-display font-semibold">Recent Messages</h2>
          <Link href="/admin/messages" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No messages yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="p-4 flex items-start gap-3">
                <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${msg.read ? "bg-muted-foreground/30" : "bg-blue-400"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-medium truncate">{msg.name}</p>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/projects", label: "Add Project", icon: FolderKanban },
          { href: "/admin/blog", label: "Write Post", icon: FileText },
          { href: "/admin/skills", label: "Manage Skills", icon: Zap },
          { href: "/", label: "View Portfolio", icon: TrendingUp },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            target={href === "/" ? "_blank" : undefined}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
