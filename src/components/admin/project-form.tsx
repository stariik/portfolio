"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Loader2, Plus, X, Upload, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { createClient } from "@/lib/supabase/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Project } from "@/types";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().optional(),
  thumbnail_url: z.string().optional(),
  live_url: z.string().url().optional().or(z.literal("")),
  github_url: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const MAX_IMAGES = 5;

function SortableImage({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group w-28 h-28 rounded-lg overflow-hidden border-2 border-border bg-muted flex-shrink-0"
    >
      <Image src={url} alt="" fill className="object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
      <button
        type="button"
        className="absolute bottom-1 left-1 p-1 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-3 h-3" />
      </button>
    </div>
  );
}

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();
  const [isLoading, setIsLoading] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>(
    project?.technologies || []
  );
  const [techInput, setTechInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>(project?.images || []);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      description: project?.description || "",
      content: project?.content || "",
      thumbnail_url: project?.thumbnail_url || "",
      live_url: project?.live_url || "",
      github_url: project?.github_url || "",
      category: project?.category || "web",
      featured: project?.featured || false,
      status: project?.status || "draft",
    },
  });

  const watchTitle = watch("title");
  const watchFeatured = watch("featured");
  const watchStatus = watch("status");

  // Auto-generate slug from title
  const generateSlug = () => {
    const slug = watchTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setValue("slug", slug);
  };

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Uploading images is disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      setValue("thumbnail_url", data.publicUrl);
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Uploading images is disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    const filesToUpload = Array.from(files).slice(0, remaining);

    setIsUploadingImages(true);
    try {
      const supabase = createClient();
      const newUrls: string[] = [];

      for (const file of filesToUpload) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("project-images")
          .getPublicUrl(fileName);

        newUrls.push(data.publicUrl);
      }

      setImages((prev) => [...prev, ...newUrls]);
      toast({
        title: "Images uploaded",
        description: `${newUrls.length} image(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImages(false);
      if (imagesInputRef.current) imagesInputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Creating/editing projects is disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const projectData = {
        ...data,
        technologies,
        images,
        live_url: data.live_url || null,
        github_url: data.github_url || null,
        content: data.content || null,
        thumbnail_url: data.thumbnail_url || null,
      };

      if (project) {
        const { error } = await supabase
          .from("projects")
          .update(projectData as never)
          .eq("id", project.id);

        if (error) throw error;

        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
        });
      } else {
        const { error } = await supabase.from("projects").insert(projectData as never);

        if (error) throw error;

        toast({
          title: "Project created",
          description: "Your project has been created successfully.",
        });
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="My Awesome Project"
            {...register("title")}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <div className="flex gap-2">
            <Input
              id="slug"
              placeholder="my-awesome-project"
              {...register("slug")}
              className={errors.slug ? "border-destructive" : ""}
            />
            <Button type="button" variant="outline" onClick={generateSlug}>
              Generate
            </Button>
          </div>
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="A brief description of your project..."
          rows={3}
          {...register("description")}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <Label>Thumbnail Image</Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="https://example.com/image.jpg"
              {...register("thumbnail_url")}
            />
          </div>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button type="button" variant="outline" disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span className="ml-2">Upload</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Project Images */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Project Images</Label>
          <span className="text-sm text-muted-foreground">
            {images.length}/{MAX_IMAGES} images
          </span>
        </div>
        {images.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-3 flex-wrap">
                {images.map((url) => (
                  <SortableImage
                    key={url}
                    url={url}
                    onRemove={() => removeImage(url)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        <div className="relative inline-block">
          <input
            ref={imagesInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploadingImages || images.length >= MAX_IMAGES}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploadingImages || images.length >= MAX_IMAGES}
          >
            {isUploadingImages ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span className="ml-2">
              {images.length >= MAX_IMAGES
                ? "Max images reached"
                : "Upload Images"}
            </span>
          </Button>
        </div>
        {images.length > 1 && (
          <p className="text-xs text-muted-foreground">
            Drag images to reorder. First image is shown as the main image.
          </p>
        )}
      </div>

      {/* Technologies */}
      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="flex gap-2">
          <Input
            placeholder="React, TypeScript, etc."
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
          />
          <Button type="button" variant="outline" onClick={addTechnology}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="gap-1">
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Live URL */}
        <div className="space-y-2">
          <Label htmlFor="live_url">Live URL</Label>
          <Input
            id="live_url"
            placeholder="https://myproject.com"
            {...register("live_url")}
          />
        </div>

        {/* GitHub URL */}
        <div className="space-y-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            placeholder="https://github.com/username/repo"
            {...register("github_url")}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register("category")}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="web">Web App</option>
            <option value="mobile">Mobile</option>
            <option value="ai">AI/ML</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            {...register("status")}
            value={watchStatus}
            onChange={(e) => setValue("status", e.target.value as "draft" | "published" | "archived")}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Featured */}
        <div className="space-y-2">
          <Label>Featured</Label>
          <div className="flex items-center gap-2 h-10">
            <Switch
              checked={watchFeatured}
              onCheckedChange={(checked) => setValue("featured", checked)}
            />
            <span className="text-sm text-muted-foreground">
              {watchFeatured ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" variant="retro" disabled={isLoading || isDemoMode}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isDemoMode ? "Demo Mode (Read-only)" : project ? "Update Project" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
