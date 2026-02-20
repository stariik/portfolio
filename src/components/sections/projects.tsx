"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ExternalLink, Github, ArrowRight, Sparkles, Eye, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Project } from "@/types";

// Sample projects data (will be replaced with Supabase data)
const sampleProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    description:
      "A full-featured e-commerce platform with real-time inventory, Stripe payments, and admin dashboard.",
    content: null,
    thumbnail_url: "/projects/ecommerce.jpg",
    images: [],
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind"],
    live_url: "https://example.com",
    github_url: "https://github.com/example",
    category: "web",
    featured: true,
    display_order: 1,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Task Management App",
    slug: "task-management",
    description:
      "A collaborative task management application with real-time updates and team features.",
    content: null,
    thumbnail_url: "/projects/taskapp.jpg",
    images: [],
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Redux"],
    live_url: "https://example.com",
    github_url: "https://github.com/example",
    category: "web",
    featured: true,
    display_order: 2,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "AI Content Generator",
    slug: "ai-content-generator",
    description:
      "An AI-powered content generation tool that helps create blog posts, social media content, and more.",
    content: null,
    thumbnail_url: "/projects/ai-generator.jpg",
    images: [],
    technologies: ["Python", "FastAPI", "OpenAI", "React", "Docker"],
    live_url: "https://example.com",
    github_url: "https://github.com/example",
    category: "ai",
    featured: false,
    display_order: 3,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Real Estate Platform",
    slug: "real-estate-platform",
    description:
      "A modern real estate platform with virtual tours, map integration, and advanced search filters.",
    content: null,
    thumbnail_url: "/projects/realestate.jpg",
    images: [],
    technologies: ["Next.js", "Mapbox", "Prisma", "PostgreSQL", "AWS"],
    live_url: "https://example.com",
    github_url: "https://github.com/example",
    category: "web",
    featured: false,
    display_order: 4,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function isValidImageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  return url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://");
}

const categories = [
  { id: "all", label: "All Projects", icon: Layers },
  { id: "web", label: "Web Apps", icon: Sparkles },
  { id: "ai", label: "AI/ML", icon: Sparkles },
  { id: "mobile", label: "Mobile", icon: Sparkles },
];

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Reduced tilt intensity for subtlety: 4/-4 degrees instead of 15/-15
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Gradient colors for placeholder
  const gradients = [
    "from-primary/30 via-accent/20 to-secondary/40",
    "from-accent/30 via-primary/20 to-secondary/40",
    "from-secondary/40 via-accent/30 to-primary/20",
    "from-primary/20 via-secondary/30 to-accent/40",
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
      className="group perspective-1000"
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className="relative bg-card rounded-2xl border-2 border-border overflow-hidden shadow-[4px_4px_0_var(--border)] hover:shadow-[8px_8px_0_var(--primary)] transition-all duration-300 cursor-pointer"
      >
        {/* Subtle edge highlight - only visible on hover, no sweep animation */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)",
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Featured badge */}
        {project.featured && (
          <motion.div
            className="absolute top-4 right-4 z-30"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          >
            <Badge className="bg-primary text-primary-foreground shadow-lg px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </motion.div>
        )}

        {/* Image container */}
        <div className="aspect-video relative overflow-hidden" style={{ transform: "translateZ(10px)" }}>
          {isValidImageUrl(project.thumbnail_url) || isValidImageUrl(project.images?.[0]) ? (
            <>
              {project.category === "mobile" && (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`} />
              )}
              <Image
                src={(isValidImageUrl(project.thumbnail_url) ? project.thumbnail_url : project.images[0]) as string}
                alt={project.title}
                fill
                className={`${project.category === "mobile" ? "object-contain p-2" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
              />
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
              <motion.span
                className="text-6xl font-black text-foreground/20"
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {project.title.charAt(0)}
              </motion.span>
            </div>
          )}

          {/* Overlay gradient - cleaner transition */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 0.75 : 0.6 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* View project overlay - cleaner reveal */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-[4px_4px_0_var(--border)]"
              initial={{ y: 10, scale: 0.95 }}
              animate={isHovered ? { y: 0, scale: 1 } : { y: 10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Eye className="w-4 h-4" />
              View Project
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 relative" style={{ transform: "translateZ(15px)" }}>
          <motion.h3
            className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300"
            layout
          >
            {project.title}
          </motion.h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Technologies with stagger animation */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech, techIndex) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + techIndex * 0.05 + 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors duration-200 cursor-default"
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </motion.a>
            )}
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Github className="w-4 h-4" />
                Code
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ImageCarousel({ images, isMobile = false }: { images: string[]; isMobile?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  return (
    <div className={`${isMobile ? "flex justify-center py-6" : "aspect-video"} relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20`}>
      {isMobile ? (
        <>
          <div className="relative h-[55vh] aspect-[9/16]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`Project image ${currentIndex + 1}`}
                  fill
                  className="object-contain rounded-lg"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows for mobile - outside the image */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-primary w-6"
                        : "bg-foreground/30 hover:bg-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentIndex]}
                alt={`Project image ${currentIndex + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-primary w-6"
                        : "bg-foreground/30 hover:bg-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

interface ProjectsProps {
  projects?: Project[];
}

export function Projects({ projects = sampleProjects }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  useEffect(() => {
    if (!titleRef.current || !isInView) return;

    const chars = titleRef.current.querySelectorAll(".char");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 30, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.03,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: 0.2
      }
    );
  }, [isInView]);

  const sectionTitle = "Featured Projects";

  return (
    <section id="projects" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-flex items-center gap-2 text-primary font-medium px-4 py-1 rounded-full bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4" />
            My Work
          </motion.span>
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold mt-4"
            style={{ perspective: "1000px" }}
          >
            {sectionTitle.split("").map((char, index) => (
              <span
                key={index}
                className="char inline-block"
                style={{ display: char === " " ? "inline" : "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mt-4 max-w-2xl mx-auto"
          >
            Here are some of my recent projects. Each one was built with
            attention to detail and focus on user experience.
          </motion.p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`relative px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground bg-card border-2 border-border hover:border-primary/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-primary rounded-full shadow-[4px_4px_0_var(--foreground)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {category.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Button variant="retro" size="lg" className="group">
            View All Projects
            <motion.span
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Button>
        </motion.div>
      </div>

      {/* Project Detail Dialog */}
      <AnimatePresence>
        {selectedProject && (
          <Dialog
            open={!!selectedProject}
            onOpenChange={() => setSelectedProject(null)}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Project Image / Carousel */}
                {selectedProject.images && selectedProject.images.length > 0 ? (
                  <ImageCarousel images={selectedProject.images} isMobile={selectedProject.category === "mobile"} />
                ) : (
                  <div className={`${selectedProject.category === "mobile" ? "flex justify-center py-6" : "aspect-video"} relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20`}>
                    {isValidImageUrl(selectedProject.thumbnail_url) ? (
                      selectedProject.category === "mobile" ? (
                        <div className="relative h-[55vh] aspect-[9/16]">
                          <Image
                            src={selectedProject.thumbnail_url}
                            alt={selectedProject.title}
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <Image
                          src={selectedProject.thumbnail_url}
                          alt={selectedProject.title}
                          fill
                          className="object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-8xl font-black text-foreground/10">
                          {selectedProject.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  </div>
                )}

                <div className="p-8">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-3xl font-bold">
                      {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-2">
                      {selectedProject.description}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Technologies */}
                  <div className="mb-8">
                    <h4 className="font-semibold mb-4 text-lg">Technologies Used</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.technologies.map((tech, index) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Badge
                            variant="secondary"
                            className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {selectedProject.live_url && (
                      <Button asChild size="lg">
                        <a
                          href={selectedProject.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Live Demo
                        </a>
                      </Button>
                    )}
                    {selectedProject.github_url && (
                      <Button variant="outline" size="lg" asChild>
                        <a
                          href={selectedProject.github_url}
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
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
