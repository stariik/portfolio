"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types";

interface SortableProjectProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleStatus: (project: Project) => void;
}

function SortableProject({
  project,
  onEdit,
  onDelete,
  onToggleStatus,
}: SortableProjectProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusColors = {
    draft: "bg-yellow-500/10 text-yellow-600",
    published: "bg-green-500/10 text-green-600",
    archived: "bg-gray-500/10 text-gray-600",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-4 p-4 bg-card rounded-lg border-2 border-border shadow-[2px_2px_0_var(--border)] hover:shadow-[4px_4px_0_var(--border)] transition-shadow"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-secondary rounded"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Thumbnail */}
      <div className="w-16 h-12 rounded bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground">
        {project.title.charAt(0)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{project.title}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {project.description}
        </p>
      </div>

      {/* Badges */}
      <div className="hidden sm:flex items-center gap-2">
        <Badge className={statusColors[project.status]}>{project.status}</Badge>
        {project.featured && <Badge variant="secondary">Featured</Badge>}
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(project)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleStatus(project)}>
            {project.status === "published" ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </>
            )}
          </DropdownMenuItem>
          {project.live_url && (
            <DropdownMenuItem asChild>
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => onDelete(project)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects: initialProjects }: ProjectListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Actions are disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }

    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      // Update order in database
      const supabase = createClient();
      const updates = newProjects.map((project, index) => ({
        id: project.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("projects")
          .update({ display_order: update.display_order } as never)
          .eq("id", update.id);
      }

      toast({
        title: "Order updated",
        description: "Project order has been saved.",
      });
    }
  };

  const handleEdit = (project: Project) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Editing projects is disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }
    router.push(`/admin/projects/${project.id}/edit`);
  };

  const handleToggleStatus = async (project: Project) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Changing status is disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }
    const newStatus = project.status === "published" ? "draft" : "published";
    const supabase = createClient();

    const { error } = await supabase
      .from("projects")
      .update({ status: newStatus } as never)
      .eq("id", project.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      });
      return;
    }

    setProjects(
      projects.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p))
    );

    toast({
      title: "Status updated",
      description: `Project ${newStatus === "published" ? "published" : "unpublished"}`,
    });
  };

  const handleDelete = async () => {
    if (!deleteProject) return;
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Deleting projects is disabled in demo mode.",
        variant: "destructive",
      });
      setDeleteProject(null);
      return;
    }

    setIsDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", deleteProject.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } else {
      setProjects(projects.filter((p) => p.id !== deleteProject.id));
      toast({
        title: "Project deleted",
        description: "The project has been permanently deleted.",
      });
    }

    setIsDeleting(false);
    setDeleteProject(null);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground mb-4">No projects yet</p>
        <Button asChild>
          <Link href="/admin/projects/new">Create your first project</Link>
        </Button>
      </div>
    );
  }

  const statusColors = {
    draft: "bg-yellow-500/10 text-yellow-600",
    published: "bg-green-500/10 text-green-600",
    archived: "bg-gray-500/10 text-gray-600",
  };

  return (
    <>
      {!mounted ? (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 bg-card rounded-lg border-2 border-border"
            >
              <div className="w-5 h-5 bg-muted rounded" />
              <div className="w-16 h-12 rounded bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground">
                {project.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{project.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
              </div>
              <Badge className={statusColors[project.status]}>{project.status}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          id="projects-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {projects.map((project) => (
                  <SortableProject
                    key={project.id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={setDeleteProject}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteProject?.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteProject(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
