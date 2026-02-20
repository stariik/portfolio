import { Suspense } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { SkillList } from "@/components/admin/skill-list";
import { Skeleton } from "@/components/ui/skeleton";

async function SkillsContent() {
  const supabase = await createClient();
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("display_order", { ascending: true });

  return <SkillList skills={skills || []} />;
}

function SkillsLoading() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default function AdminSkillsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground">
            Manage your skills and technologies
          </p>
        </div>
      </div>

      <Suspense fallback={<SkillsLoading />}>
        <SkillsContent />
      </Suspense>
    </div>
  );
}
