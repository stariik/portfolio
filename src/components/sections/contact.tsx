"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Send, Loader2, CheckCircle, MessageSquare, Sparkles, Phone, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@tornike.dev",
    href: "mailto:hello@tornike.dev",
    color: "#E86A17",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Tbilisi, Georgia",
    href: null,
    color: "#C2873D",
  },
  {
    icon: Clock,
    label: "Timezone",
    value: "GMT+4",
    href: null,
    color: "#F07B1A",
  },
];

function FloatingParticle({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-primary/30"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -100, -200],
        x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    />
  );
}

function ContactInfoCard({ info, index, isInView }: { info: typeof contactInfo[0]; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, rotateY: -20 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      {info.href ? (
        <a
          href={info.href}
          className="flex items-start gap-4 p-5 bg-card rounded-xl border-2 border-border shadow-[4px_4px_0_var(--border)] hover:shadow-[8px_8px_0_var(--primary)] transition-all duration-300 relative overflow-hidden"
        >
          <ContactCardContent info={info} isHovered={isHovered} />
        </a>
      ) : (
        <div className="flex items-start gap-4 p-5 bg-card rounded-xl border-2 border-border shadow-[4px_4px_0_var(--border)] hover:shadow-[8px_8px_0_var(--primary)] transition-all duration-300 relative overflow-hidden">
          <ContactCardContent info={info} isHovered={isHovered} />
        </div>
      )}
    </motion.div>
  );
}

function ContactCardContent({ info, isHovered }: { info: typeof contactInfo[0]; isHovered: boolean }) {
  return (
    <>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${info.color}15 0%, transparent 50%)`,
        }}
      />

      <motion.div
        className="p-3 rounded-xl relative z-10"
        style={{ backgroundColor: `${info.color}15` }}
        animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <info.icon className="w-6 h-6" style={{ color: info.color }} />
      </motion.div>
      <div className="relative z-10">
        <h4 className="font-semibold group-hover:text-primary transition-colors">{info.label}</h4>
        <p className="text-muted-foreground text-sm">{info.value}</p>
      </div>

      {info.href && (
        <motion.div
          className="ml-auto self-center"
          animate={isHovered ? { x: 5 } : { x: 0 }}
        >
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.div>
      )}
    </>
  );
}

function FormField({
  label,
  id,
  error,
  children,
  delay = 0,
  isInView,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
  delay?: number;
  isInView: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="space-y-2 relative"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <Label
        htmlFor={id}
        className={`transition-colors duration-300 ${isFocused ? "text-primary" : ""}`}
      >
        {label}
      </Label>
      <div className="relative">
        {children}

        {/* Focus glow effect */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute inset-0 -z-10 rounded-lg"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(232, 106, 23, 0.15) 0%, transparent 70%)",
                filter: "blur(10px)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="text-sm text-destructive flex items-center gap-1"
          >
            <span className="w-1 h-1 rounded-full bg-destructive" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SuccessAnimation() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-card/95 backdrop-blur-sm rounded-xl z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
        </motion.div>
        <motion.h3
          className="text-xl font-bold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Message Sent!
        </motion.h3>
        <motion.p
          className="text-muted-foreground text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          I&apos;ll get back to you soon.
        </motion.p>

        {/* Confetti particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ["#E86A17", "#F07B1A", "#C2873D", "#22C55E"][i % 4],
              left: "50%",
              top: "40%",
            }}
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * 80,
              y: Math.sin((i * 30 * Math.PI) / 180) * 80,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const formRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 100, damping: 30 });
  const formRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 100, damping: 30 });

  const handleFormMouseMove = (e: React.MouseEvent<HTMLFormElement>) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleFormMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

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

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // In production, this would call a server action to save to Supabase
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setIsSubmitted(true);
      reset();
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
        variant: "success",
      });

      // Reset success state after a delay
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionTitle = "Let's Work Together";

  return (
    <section id="contact" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(60px)",
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
            className="inline-flex items-center gap-2 text-primary font-medium px-4 py-1 rounded-full bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <MessageSquare className="w-4 h-4" />
            Get in Touch
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
            Have a project in mind or just want to chat? Feel free to reach out.
            I&apos;m always open to discussing new opportunities.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info - Left side */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-2">
                Contact <span className="text-primary">Information</span>
              </h3>
              <p className="text-muted-foreground mb-8">
                Feel free to reach out through the form or contact me directly.
              </p>
            </motion.div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <ContactInfoCard key={info.label} info={info} index={index} isInView={isInView} />
              ))}
            </div>

            {/* Decorative element */}
            <motion.div
              className="hidden lg:block mt-8 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="h-48 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-2xl border-2 border-border/50 overflow-hidden relative">
                {/* Animated gradient */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 80%, rgba(232, 106, 23, 0.2) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 20%, rgba(232, 106, 23, 0.2) 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 80%, rgba(232, 106, 23, 0.2) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />

                {/* Floating particles */}
                <div className="absolute bottom-4 left-4">
                  {[...Array(5)].map((_, i) => (
                    <FloatingParticle key={i} delay={i * 0.5} />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-8 h-8 text-primary mb-2" />
                  </motion.div>
                  <p className="text-sm font-medium">Available for freelance</p>
                  <p className="text-xs text-muted-foreground">projects and full-time roles</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form - Right side */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit(onSubmit)}
              onMouseMove={handleFormMouseMove}
              onMouseLeave={handleFormMouseLeave}
              style={{
                rotateX: formRotateX,
                rotateY: formRotateY,
                perspective: 1000,
                transformStyle: "preserve-3d",
              }}
              className="relative bg-card rounded-2xl border-2 border-border p-8 shadow-[8px_8px_0_var(--border)] hover:shadow-[12px_12px_0_var(--primary)] transition-shadow duration-300"
            >
              {/* Success overlay */}
              <AnimatePresence>
                {isSubmitted && <SuccessAnimation />}
              </AnimatePresence>

              <div className="space-y-6">
                {/* Name and Email row */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField label="Name" id="name" error={errors.name?.message} delay={0.4} isInView={isInView}>
                    <Input
                      id="name"
                      variant="retro"
                      placeholder="John Doe"
                      {...register("name")}
                      className={`transition-all duration-300 ${errors.name ? "border-destructive ring-1 ring-destructive" : "focus:ring-2 focus:ring-primary/20"}`}
                    />
                  </FormField>

                  <FormField label="Email" id="email" error={errors.email?.message} delay={0.45} isInView={isInView}>
                    <Input
                      id="email"
                      type="email"
                      variant="retro"
                      placeholder="john@example.com"
                      {...register("email")}
                      className={`transition-all duration-300 ${errors.email ? "border-destructive ring-1 ring-destructive" : "focus:ring-2 focus:ring-primary/20"}`}
                    />
                  </FormField>
                </div>

                {/* Subject */}
                <FormField label="Subject (Optional)" id="subject" delay={0.5} isInView={isInView}>
                  <Input
                    id="subject"
                    variant="retro"
                    placeholder="Project inquiry"
                    {...register("subject")}
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </FormField>

                {/* Message */}
                <FormField label="Message" id="message" error={errors.message?.message} delay={0.55} isInView={isInView}>
                  <Textarea
                    id="message"
                    variant="retro"
                    placeholder="Tell me about your project..."
                    rows={5}
                    {...register("message")}
                    className={`transition-all duration-300 resize-none ${errors.message ? "border-destructive ring-1 ring-destructive" : "focus:ring-2 focus:ring-primary/20"}`}
                  />
                </FormField>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    variant="retro"
                    size="lg"
                    className="w-full group relative overflow-hidden"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />

                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Send Message
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
