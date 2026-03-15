import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={session.user} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
