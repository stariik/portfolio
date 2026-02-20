import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";
import { Hero, About, Projects, Skills, Contact } from "@/components/sections";
import { NoiseOverlay, EasterEggs } from "@/components/effects";
import { createClient } from "@/lib/supabase/server";

async function ProjectsSection() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  return <Projects projects={projects || undefined} />;
}

async function SkillsSection() {
  const supabase = await createClient();
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("display_order", { ascending: true });

  return <Skills skills={skills || undefined} />;
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SkillsSkeleton />}>
          <SkillsSection />
        </Suspense>
        <Contact />
      </main>
      <Footer />
      <NoiseOverlay />
      <EasterEggs />
    </>
  );
}

function ProjectsSkeleton() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-4 w-24 bg-muted rounded mx-auto mb-2" />
          <div className="h-8 w-48 bg-muted rounded mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border-2 border-border overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-muted" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSkeleton() {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="h-4 w-24 bg-muted rounded mx-auto mb-2" />
          <div className="h-8 w-48 bg-muted rounded mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border-2 border-border p-6 animate-pulse"
            >
              <div className="h-6 bg-muted rounded w-1/3 mb-6" />
              <div className="space-y-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j}>
                    <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-3 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
