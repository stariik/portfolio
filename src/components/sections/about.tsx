"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import {
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Code2,
  Coffee,
  Sparkles,
  Heart,
} from "lucide-react";

const timeline = [
  {
    id: "1",
    title: "Senior Full-Stack Developer",
    subtitle: "Freelancing",
    description:
      "Architecting and leading development of scalable SaaS and mobile applications using React, Next.js, Node.js, TypeScript, and React Native. Designing system architecture, database structures, and making key technical decisions while delivering production-ready products end-to-end.",
    date: "2026 - Present",
    type: "work" as const,
    icon: Briefcase,
  },
  {
    id: "2",
    title: "Full-Stack Developer + Mobile Dev",
    subtitle: "Freelancing",
    description:
      "Built SaaS platforms, CRM systems, marketplaces, and e-commerce applications for international clients. Managed backend architecture, frontend implementation, database design, and deployment workflows.",
    date: "2024 - 2025",
    type: "work" as const,
    icon: Briefcase,
  },
  {
    id: "3",
    title: "Cyber Security",
    subtitle: "Pentesting & Security Research",
    description:
      "Focused on web application security, penetration testing, and vulnerability assessment. Practiced identifying security flaws, analyzing system weaknesses, and applying secure development principles.",
    date: "2022 - 2024",
    type: "education" as const,
    icon: GraduationCap,
  },
  {
    id: "4",
    title: "Front-End Developer",
    subtitle: "Freelancing",
    description:
      "Developed responsive and high-performance user interfaces using React, Next.js, and modern CSS frameworks. Focused on clean UI implementation, component architecture, and performance optimization.",
    date: "2019 - 2022",
    type: "work" as const,
    icon: Briefcase,
  },
];

const stats = [
  { label: "Years Experience", value: 7, suffix: "+", icon: Code2 },
  { label: "Projects Completed", value: 8, suffix: "+", icon: Sparkles },
  { label: "Happy Clients", value: 10, suffix: "+", icon: Heart },
  { label: "Cups of Coffee", value: 999, suffix: "+", icon: Coffee },
];

function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.5 + index * 0.1, type: "spring" }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <div className="relative text-center p-6 bg-card rounded-xl border-2 border-border shadow-[4px_4px_0_var(--border)] hover:shadow-[6px_6px_0_var(--primary)] transition-all duration-300 overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(232, 106, 23, 0.1) 0%, transparent 70%)",
          }}
        />

        {/* Icon */}
        <motion.div
          className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <stat.icon className="w-6 h-6 text-primary" />
        </motion.div>

        <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
        </div>
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

function TimelineItem({
  item,
  index,
  isInView,
}: {
  item: (typeof timeline)[0];
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current || !isInView) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        rotateY: index % 2 === 0 ? -10 : 10,
      },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.8,
        delay: 0.7 + index * 0.2,
        ease: "power3.out",
      },
    );
  }, [isInView, index]);

  return (
    <motion.div
      className={`relative flex items-center ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col md:gap-8`}
    >
      {/* Content */}
      <div
        className={`w-full md:w-1/2 ${
          index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
        } text-left pl-16 md:pl-0`}
      >
        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative bg-card p-6 rounded-xl border-2 border-border shadow-[4px_4px_0_var(--border)] hover:shadow-[8px_8px_0_var(--primary)] transition-all duration-300 inline-block text-left group cursor-default"
          style={{ perspective: "1000px" }}
        >
          <div className="flex items-center gap-2 text-primary mb-2">
            <motion.div
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Calendar className="w-4 h-4" />
            </motion.div>
            <span className="text-sm font-medium">{item.date}</span>
          </div>
          <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
            {item.title}
          </h4>
          <p className="text-muted-foreground text-sm mb-2">{item.subtitle}</p>
          <p className="text-muted-foreground text-sm">{item.description}</p>
        </div>
      </div>

      {/* Icon with pulse effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{
          delay: 0.8 + index * 0.2,
          type: "spring",
          stiffness: 200,
        }}
        className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10"
      >
        <div className="relative">
          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          />
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-4 border-background shadow-lg">
            <item.icon className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Spacer for layout */}
      <div className="hidden md:block w-1/2" />
    </motion.div>
  );
}

function ProfileCard({ isInView }: { isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 100,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 100,
    damping: 20,
  });

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
      initial={{ opacity: 0, x: -100, rotateY: -30 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {/* Profile placeholder */}
      <div className="aspect-square max-w-md mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/30 border-2 border-border shadow-[12px_12px_0_var(--border)] overflow-hidden group">
        {/* Animated gradient background */}
        {/* Initials with 3D effect */}
        <div
          className="w-full h-full flex items-center justify-center relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <span
            className="text-8xl md:text-9xl font-black bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent"
            style={{ transform: "translateZ(30px)" }}
          >
            TK
          </span>
        </div>

        {/* Scanlines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute -bottom-4 -right-4 bg-card border-2 border-primary shadow-[4px_4px_0_var(--primary)] rounded-xl p-4 z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "translateZ(50px)" }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <MapPin className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="font-bold">Tbilisi, Georgia</span>
        </div>
      </motion.div>

      {/* Available badge */}
      <motion.div
        className="absolute -top-4 -left-4 bg-green-500 text-white shadow-lg rounded-full px-4 py-2 z-10"
        initial={{ scale: 0, rotate: -20 }}
        animate={isInView ? { scale: 1, rotate: -12 } : {}}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <span className="flex items-center gap-2 text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Available
        </span>
      </motion.div>
    </motion.div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!titleRef.current || !isInView) return;

    const chars = titleRef.current.querySelectorAll(".char");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 50, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.3,
      },
    );
  }, [isInView]);

  const sectionTitle = "About Me";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-48 h-48 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
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
            className="inline-block text-primary font-medium px-4 py-1 rounded-full bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            Get to know me
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
        </motion.div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
          {/* Profile Card */}
          <ProfileCard isInView={isInView} />

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <motion.h3
              className="text-2xl md:text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              A passionate developer crafting{" "}
              <span className="text-primary">digital experiences</span>
            </motion.h3>

            {[
              "Hello, I’m Tornike — a full-stack and mobile developer based in Tbilisi, Georgia, with 7 years of experience building scalable digital products.",
              "I specialize in SaaS platforms, CRM systems, marketplaces, e-commerce solutions, admin dashboards, and real-time systems. My core stack includes Node.js, Next.js, React, TypeScript, TailwindCSS, and React Native. I design backend architecture, structure databases, and deliver clean, high-performance interfaces.",
              "I build products from the ground up — fast and independently — handling both frontend and backend without dependency. I think like a product owner, focusing not just on code, but on scalability, performance, and long-term maintainability.",
            ].map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-muted-foreground leading-relaxed"
              >
                {text}
              </motion.p>
            ))}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {stats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            My <span className="text-primary">Journey</span>
          </h3>

          <div className="relative">
            {/* Timeline line with gradient */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

            {/* Timeline items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
