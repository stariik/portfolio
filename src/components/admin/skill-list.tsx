"use client";

import { useState, useEffect } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GripVertical,
  Pencil,
  Trash2,
  MoreVertical,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { createClient } from "@/lib/supabase/client";
import type { Skill } from "@/types";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.number().min(0).max(100),
  icon_name: z.string().optional(),
  color: z.string().optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

const categories = [
  "Frontend",
  "Backend",
  "Languages",
  "Database",
  "DevOps",
  "Tools",
  "Other",
];

const categoryColors: Record<string, string> = {
  Frontend: "bg-orange-500/10 text-orange-600",
  Backend: "bg-green-500/10 text-green-600",
  Languages: "bg-blue-500/10 text-blue-600",
  Database: "bg-purple-500/10 text-purple-600",
  DevOps: "bg-red-500/10 text-red-600",
  Tools: "bg-gray-500/10 text-gray-600",
  Other: "bg-pink-500/10 text-pink-600",
};

interface SortableSkillProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

function SortableSkill({ skill, onEdit, onDelete }: SortableSkillProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

      {/* Color indicator */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: skill.color || "#888" }}
      >
        {skill.name.charAt(0)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold">{skill.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={categoryColors[skill.category] || categoryColors.Other}>
            {skill.category}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {skill.proficiency}%
          </span>
        </div>
      </div>

      {/* Proficiency bar */}
      <div className="hidden sm:block w-32">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${skill.proficiency}%`,
              backgroundColor: skill.color || "#888",
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(skill)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(skill)}
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

interface SkillListProps {
  skills: Skill[];
}

export function SkillList({ skills: initialSkills }: SkillListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();
  const [mounted, setMounted] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [deleteSkill, setDeleteSkill] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "Frontend",
      proficiency: 80,
      icon_name: "",
      color: "#3178C6",
    },
  });

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
      const oldIndex = skills.findIndex((s) => s.id === active.id);
      const newIndex = skills.findIndex((s) => s.id === over.id);

      const newSkills = arrayMove(skills, oldIndex, newIndex);
      setSkills(newSkills);

      const supabase = createClient();
      const updates = newSkills.map((skill, index) => ({
        id: skill.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("skills")
          .update({ display_order: update.display_order } as never)
          .eq("id", update.id);
      }

      toast({
        title: "Order updated",
        description: "Skill order has been saved.",
      });
    }
  };

  const openAddDialog = () => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Adding skills is disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }
    reset({
      name: "",
      category: "Frontend",
      proficiency: 80,
      icon_name: "",
      color: "#3178C6",
    });
    setEditSkill(null);
    setShowAddDialog(true);
  };

  const openEditDialog = (skill: Skill) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Editing skills is disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }
    reset({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon_name: skill.icon_name || "",
      color: skill.color || "#3178C6",
    });
    setEditSkill(skill);
    setShowAddDialog(true);
  };

  const onSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      if (editSkill) {
        // Update existing skill
        const { error } = await supabase
          .from("skills")
          .update({
            name: data.name,
            category: data.category,
            proficiency: data.proficiency,
            icon_name: data.icon_name || null,
            color: data.color || null,
          } as never)
          .eq("id", editSkill.id);

        if (error) throw error;

        setSkills(
          skills.map((s) =>
            s.id === editSkill.id
              ? { ...s, ...data, icon_name: data.icon_name || null, color: data.color || null }
              : s
          )
        );

        toast({
          title: "Skill updated",
          description: `${data.name} has been updated.`,
        });
      } else {
        // Add new skill
        const { data: newSkill, error } = await supabase
          .from("skills")
          .insert({
            name: data.name,
            category: data.category,
            proficiency: data.proficiency,
            icon_name: data.icon_name || null,
            color: data.color || null,
            display_order: skills.length,
          })
          .select()
          .single();

        if (error) throw error;

        setSkills([...skills, newSkill]);

        toast({
          title: "Skill added",
          description: `${data.name} has been added.`,
        });
      }

      setShowAddDialog(false);
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save skill",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSkill) return;
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Deleting skills is disabled in demo mode.",
        variant: "destructive",
      });
      setDeleteSkill(null);
      return;
    }

    setIsDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", deleteSkill.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    } else {
      setSkills(skills.filter((s) => s.id !== deleteSkill.id));
      toast({
        title: "Skill deleted",
        description: "The skill has been permanently deleted.",
      });
    }

    setIsDeleting(false);
    setDeleteSkill(null);
  };

  return (
    <>
      {/* Add Button */}
      <div className="mb-6">
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground mb-4">No skills yet</p>
          <Button onClick={openAddDialog}>Add your first skill</Button>
        </div>
      ) : !mounted ? (
        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-4 p-4 bg-card rounded-lg border-2 border-border"
            >
              <div className="w-5 h-5 bg-muted rounded" />
              <div
                className="w-10 h-10 rounded-lg"
                style={{ backgroundColor: skill.color || "#888" }}
              />
              <div className="flex-1">
                <div className="font-semibold">{skill.name}</div>
                <Badge className={categoryColors[skill.category] || categoryColors.Other}>
                  {skill.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          id="skills-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={skills.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {skills.map((skill) => (
                  <SortableSkill
                    key={skill.id}
                    skill={skill}
                    onEdit={openEditDialog}
                    onDelete={setDeleteSkill}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
            <DialogDescription>
              {editSkill
                ? "Update the skill details below."
                : "Fill in the details to add a new skill."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., React, Python, Docker"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proficiency">Proficiency ({watch("proficiency")}%)</Label>
              <Input
                id="proficiency"
                type="range"
                min={0}
                max={100}
                {...register("proficiency", { valueAsNumber: true })}
                className="cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon_name">Icon Name (optional)</Label>
                <Input
                  id="icon_name"
                  placeholder="e.g., react, python"
                  {...register("icon_name")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    {...register("color")}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    placeholder="#3178C6"
                    value={watch("color")}
                    onChange={(e) => setValue("color", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editSkill ? (
                  "Update Skill"
                ) : (
                  "Add Skill"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteSkill} onOpenChange={() => setDeleteSkill(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteSkill?.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteSkill(null)}
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
