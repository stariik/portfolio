import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContactMessage } from "@/types";

async function MessagesContent() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false }) as { data: ContactMessage[] | null };

  if (!messages || messages.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No messages yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card
          key={message.id}
          className="border-2 shadow-[2px_2px_0_var(--border)]"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {message.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-lg">{message.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!message.is_read && (
                  <Badge variant="default">New</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {message.subject && (
              <p className="font-medium mb-2">{message.subject}</p>
            )}
            <p className="text-muted-foreground whitespace-pre-wrap">
              {message.message}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MessagesLoading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Contact form submissions
        </p>
      </div>

      <Suspense fallback={<MessagesLoading />}>
        <MessagesContent />
      </Suspense>
    </div>
  );
}
