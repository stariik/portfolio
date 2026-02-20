import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single() as { data: Project | null };

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Tornike Kalandadze`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single() as { data: Project | null };

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{project.category}</Badge>
              {project.featured && <Badge variant="default">Featured</Badge>}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>

            <p className="text-xl text-muted-foreground mb-6">
              {project.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.live_url && (
                <Button asChild variant="retro">
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button asChild variant="outline">
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Source
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Project Image */}
          <div className="aspect-video relative rounded-xl overflow-hidden bg-secondary border-2 border-border shadow-[8px_8px_0_var(--border)] mb-12">
            {project.thumbnail_url ? (
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl text-muted-foreground">
                {project.title.charAt(0)}
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-base px-4 py-2">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Content */}
          {project.content && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">About This Project</h2>
              <div dangerouslySetInnerHTML={{ __html: project.content }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
