import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, MessageSquare, Eye, Zap } from "lucide-react";
import type { ContactMessage } from "@/types";

async function DashboardStats() {
  const supabase = await createClient();

  const [
    { count: projectsCount },
    { count: skillsCount },
    { count: messagesCount },
    { count: unreadCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const stats = [
    {
      title: "Total Projects",
      value: projectsCount || 0,
      icon: FolderKanban,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Skills",
      value: skillsCount || 0,
      icon: Zap,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Messages",
      value: messagesCount || 0,
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Unread Messages",
      value: unreadCount || 0,
      icon: Eye,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-2 shadow-[4px_4px_0_var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function RecentMessages() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5) as { data: ContactMessage[] | null };

  return (
    <Card className="border-2 shadow-[4px_4px_0_var(--border)]">
      <CardHeader>
        <CardTitle>Recent Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {message.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{message.name}</p>
                    {!message.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {message.email}
                  </p>
                  <p className="text-sm mt-1 line-clamp-2">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No messages yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your portfolio.
        </p>
      </div>

      <div className="space-y-8">
        <Suspense fallback={<StatsLoading />}>
          <DashboardStats />
        </Suspense>

        <div className="grid gap-8 lg:grid-cols-2">
          <Suspense
            fallback={
              <Card className="border-2">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            }
          >
            <RecentMessages />
          </Suspense>

          <Card className="border-2 shadow-[4px_4px_0_var(--border)]">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href="/admin/projects/new"
                className="block p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Add New Project</p>
                    <p className="text-sm text-muted-foreground">
                      Create a new portfolio project
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/skills"
                className="block p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Manage Skills</p>
                    <p className="text-sm text-muted-foreground">
                      Add or edit your skills
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/messages"
                className="block p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">View Messages</p>
                    <p className="text-sm text-muted-foreground">
                      Check your contact messages
                    </p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
