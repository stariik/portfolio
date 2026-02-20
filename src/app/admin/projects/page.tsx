import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ProjectList } from "@/components/admin/project-list";
import { Skeleton } from "@/components/ui/skeleton";

async function ProjectsContent() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  return <ProjectList projects={projects || []} />;
}

function ProjectsLoading() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ProjectsLoading />}>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}
