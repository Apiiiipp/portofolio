import { prisma } from "@/lib/prisma";
import { MessagesTable } from "@/components/admin/messages-table";

export default async function AdminMessagesPage() {
  const messages = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {messages.filter((m) => !m.read).length} unread · {messages.length} total
        </p>
      </div>
      <MessagesTable initialMessages={messages} />
    </div>
  );
}
