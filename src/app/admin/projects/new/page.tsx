import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Project</h1>
        <p className="text-muted-foreground">
          Create a new portfolio project
        </p>
      </div>

      <div className="max-w-3xl">
        <ProjectForm />
      </div>
    </div>
  );
}
