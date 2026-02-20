"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ArrowDown, Github, Linkedin, Twitter, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/ui/button";

const Scene = dynamic(() => import("@/components/three/scene").then((mod) => mod.Scene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-muted-foreground">Loading 3D scene...</span>
      </motion.div>
    </div>
  ),
});

const socialLinks = [
  { icon: Github, href: "https://github.com/tornikekalandadze", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/tornikekalandadze", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/tornikekalandadze", label: "Twitter" },
];

const roles = [
  "Full-Stack Developer",
  "React Enthusiast",
  "UI/UX Designer",
  "Problem Solver",
  "Coffee Lover",
];

function TypewriterText() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentRole];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < role.length) {
            setDisplayText(role.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentRole((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole]);

  return (
    <span className="text-primary">
      {displayText}
      <motion.span
        className="inline-block w-[3px] h-[1.1em] bg-primary ml-1 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  );
}

function FloatingBadge({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay }}
        className="px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-lg text-sm font-medium"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation for name
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll(".char");
        gsap.fromTo(
          chars,
          {
            opacity: 0,
            y: 100,
            rotateX: -90,
            transformOrigin: "50% 50% -50px",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.04,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.3,
          }
        );
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 1 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const firstName = "Tornike";
  const lastName = "Kalandadze";

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Scene Background */}
      <Scene className="canvas-container" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "10%", "-10%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: ["10%", "-10%", "10%"],
            y: ["10%", "-10%", "10%"],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      {/* Floating badges */}
      <FloatingBadge delay={2} className="top-[20%] left-[10%] hidden lg:block">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Next.js Expert
        </span>
      </FloatingBadge>
      <FloatingBadge delay={2.3} className="top-[30%] right-[12%] hidden lg:block">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available for hire
        </span>
      </FloatingBadge>
      <FloatingBadge delay={2.6} className="bottom-[25%] left-[15%] hidden lg:block">
        TypeScript Lover
      </FloatingBadge>

      {/* Content */}
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 backdrop-blur-sm">
            <motion.span
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              👋
            </motion.span>
            Hello, I&apos;m
          </span>
        </motion.div>

        {/* Name */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4"
          style={{ perspective: "1000px" }}
        >
          <span className="block">
            {firstName.split("").map((char, index) => (
              <span
                key={`first-${index}`}
                className="char inline-block hover:text-primary transition-colors duration-200"
                style={{ display: "inline-block" }}
              >
                {char}
              </span>
            ))}
          </span>
          <span className="block text-primary mt-2">
            {lastName.split("").map((char, index) => (
              <span
                key={`last-${index}`}
                className="char inline-block hover:text-foreground transition-colors duration-200"
                style={{ display: "inline-block" }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* Role typewriter */}
        <div
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl font-medium mb-6 h-[1.5em]"
        >
          <TypewriterText />
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          I craft <span className="text-foreground font-medium">beautiful</span>,{" "}
          <span className="text-foreground font-medium">performant</span> web experiences
          with modern technologies. Passionate about clean code, great UX, and pushing
          the boundaries of what&apos;s possible on the web.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <MagneticButton variant="retro" size="lg" onClick={scrollToProjects}>
            View My Work
          </MagneticButton>
          <MagneticButton variant="outline" size="lg" onClick={scrollToContact}>
            Get in Touch
          </MagneticButton>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary transition-all duration-300"
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + index * 0.1 }}
              aria-label={link.label}
            >
              <link.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
              <motion.span
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-foreground text-background px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
              >
                {link.label}
              </motion.span>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.5 }}
      >
        <motion.button
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <motion.div
            className="p-2 rounded-full border border-current"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-20 left-8 w-20 h-20 border-l-2 border-t-2 border-primary/20 hidden lg:block" />
      <div className="absolute bottom-20 right-8 w-20 h-20 border-r-2 border-b-2 border-primary/20 hidden lg:block" />
    </section>
  );
}
