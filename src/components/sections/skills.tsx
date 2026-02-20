"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { Zap } from "lucide-react";
import type { Skill } from "@/types";

// Sample skills data (will be replaced with Supabase data)
const sampleSkills: Skill[] = [
  { id: "1", name: "React", category: "Frontend", proficiency: 95, icon_name: "react", color: "#61DAFB", display_order: 1, created_at: "" },
  { id: "2", name: "Next.js", category: "Frontend", proficiency: 90, icon_name: "nextjs", color: "#000000", display_order: 2, created_at: "" },
  { id: "3", name: "TypeScript", category: "Languages", proficiency: 90, icon_name: "typescript", color: "#3178C6", display_order: 3, created_at: "" },
  { id: "4", name: "JavaScript", category: "Languages", proficiency: 95, icon_name: "javascript", color: "#F7DF1E", display_order: 4, created_at: "" },
  { id: "5", name: "Node.js", category: "Backend", proficiency: 85, icon_name: "nodejs", color: "#339933", display_order: 5, created_at: "" },
  { id: "6", name: "Python", category: "Backend", proficiency: 75, icon_name: "python", color: "#3776AB", display_order: 6, created_at: "" },
  { id: "7", name: "PostgreSQL", category: "Database", proficiency: 80, icon_name: "postgresql", color: "#4169E1", display_order: 7, created_at: "" },
  { id: "8", name: "MongoDB", category: "Database", proficiency: 75, icon_name: "mongodb", color: "#47A248", display_order: 8, created_at: "" },
  { id: "9", name: "Redis", category: "Database", proficiency: 70, icon_name: "redis", color: "#DC382D", display_order: 9, created_at: "" },
  { id: "10", name: "Docker", category: "DevOps", proficiency: 75, icon_name: "docker", color: "#2496ED", display_order: 10, created_at: "" },
  { id: "11", name: "AWS", category: "DevOps", proficiency: 70, icon_name: "aws", color: "#FF9900", display_order: 11, created_at: "" },
  { id: "12", name: "Tailwind CSS", category: "Frontend", proficiency: 95, icon_name: "tailwindcss", color: "#06B6D4", display_order: 12, created_at: "" },
  { id: "13", name: "GraphQL", category: "Backend", proficiency: 80, icon_name: "graphql", color: "#E10098", display_order: 13, created_at: "" },
  { id: "14", name: "Git", category: "Tools", proficiency: 90, icon_name: "git", color: "#F05032", display_order: 14, created_at: "" },
];

const categoryColors: Record<string, string> = {
  Frontend: "#E86A17",
  Backend: "#C2873D",
  Languages: "#F07B1A",
  Database: "#C9924A",
  DevOps: "#8B7355",
  Tools: "#6B5D4D",
};

const categoryIcons: Record<string, string> = {
  Frontend: "🎨",
  Backend: "⚙️",
  Languages: "💻",
  Database: "🗄️",
  DevOps: "🚀",
  Tools: "🔧",
};

interface SkillsProps {
  skills?: Skill[];
}

function CircularProgress({ skill, index, isInView }: { skill: Skill; index: number; isInView: boolean }) {
  const [progress, setProgress] = useState(0);
  const circumference = 2 * Math.PI * 40; // radius = 40

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        setProgress(skill.proficiency);
      }, index * 100 + 300);
      return () => clearTimeout(timeout);
    }
  }, [isInView, skill.proficiency, index]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <motion.div
        className="relative flex flex-col items-center p-4"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Circular SVG */}
        <div className="relative w-24 h-24 mb-3">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-secondary"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={skill.color || categoryColors[skill.category]}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              {progress}%
            </motion.span>
          </div>

        </div>

        {/* Skill name */}
        <span className="font-medium text-sm text-center group-hover:text-primary transition-colors">
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

function SkillOrb({ skill, index, totalSkills }: { skill: Skill; index: number; totalSkills: number }) {
  const orbRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const angle = (index / totalSkills) * 2 * Math.PI;
  const radius = 180;
  const x = Math.round(Math.cos(angle) * radius);
  const y = Math.round(Math.sin(angle) * radius);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!orbRef.current) return;
    const rect = orbRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 10);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 10);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={orbRef}
      className="absolute"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3 + index * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2,
        }}
        whileHover={{ scale: 1.2 }}
      >
        {/* Orb */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white/20 backdrop-blur-sm transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${skill.color || categoryColors[skill.category]} 0%, ${skill.color || categoryColors[skill.category]}80 100%)`,
            boxShadow: isHovered
              ? `0 0 30px ${skill.color || categoryColors[skill.category]}80, 0 10px 30px rgba(0,0,0,0.3)`
              : `0 0 10px ${skill.color || categoryColors[skill.category]}40, 0 5px 15px rgba(0,0,0,0.2)`,
          }}
        >
          <span className="text-center leading-tight">{skill.name.split(" ")[0]}</span>
        </div>

        {/* Tooltip */}
        <motion.div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl pointer-events-none"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -5 }}
        >
          {skill.name} - {skill.proficiency}%
        </motion.div>

        {/* Pulse rings */}
        {isHovered && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: skill.color || categoryColors[skill.category] }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: skill.color || categoryColors[skill.category] }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function CategoryCard({ category, skills, index, isInView }: { category: string; skills: Skill[]; index: number; isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
      style={{ rotateX, rotateY, perspective: 1000, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group"
    >
      <div className="relative bg-card rounded-2xl border-2 border-border p-6 shadow-[6px_6px_0_var(--border)] hover:shadow-[10px_10px_0_var(--primary)] transition-all duration-300 overflow-hidden">
        {/* Background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${categoryColors[category]}15 0%, transparent 50%)`,
          }}
        />

        {/* Category header */}
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${categoryColors[category]}20` }}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {categoryIcons[category]}
          </motion.div>
          <div>
            <h3
              className="text-lg font-bold"
              style={{ color: categoryColors[category] }}
            >
              {category}
            </h3>
            <p className="text-xs text-muted-foreground">{skills.length} skills</p>
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-2 gap-2 relative z-10">
          {skills.map((skill, skillIndex) => (
            <CircularProgress
              key={skill.id}
              skill={skill}
              index={index * skills.length + skillIndex}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Skills({ skills = sampleSkills }: SkillsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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

  const sectionTitle = "Skills & Technologies";
  // Sort by proficiency (highest first) and take top 7 for the orbital visualization
  const topSkills = [...skills]
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 7);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-flex items-center gap-2 text-primary font-medium px-4 py-1 rounded-full bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <Zap className="w-4 h-4" />
            My Expertise
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
            I work with a variety of technologies to build modern, scalable web applications.
            Here are some of the tools I use regularly.
          </motion.p>
        </motion.div>

        {/* Orbital Skills Visualization */}
        <motion.div
          ref={orbContainerRef}
          className="relative h-[500px] mb-20 hidden lg:flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Center element */}
          <motion.div
            className="relative z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
              <span className="text-4xl font-black text-primary-foreground">TK</span>
            </div>
          </motion.div>

          {/* Orbit ring */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full border-2 border-dashed border-border/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          />

          {/* Orbiting skills */}
          {topSkills.map((skill, index) => (
            <SkillOrb key={skill.id} skill={skill} index={index} totalSkills={topSkills.length} />
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
            <CategoryCard
              key={category}
              category={category}
              skills={categorySkills}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Tech Stack Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-bold mb-6">
            Also experienced with
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Prisma",
              "tRPC",
              "Zustand",
              "React Query",
              "Framer Motion",
              "Three.js",
              "Supabase",
              "Firebase",
              "Vercel",
              "Netlify",
              "Linux",
              "Nginx",
            ].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.05, type: "spring" }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-card rounded-full border-2 border-border text-sm font-medium hover:border-primary hover:text-primary hover:shadow-[4px_4px_0_var(--primary)] transition-all cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
