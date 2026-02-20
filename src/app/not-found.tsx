"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <motion.h1
            className="text-[10rem] md:text-[15rem] font-bold text-primary leading-none"
            animate={{
              textShadow: [
                "4px 4px 0 var(--foreground)",
                "8px 8px 0 var(--foreground)",
                "4px 4px 0 var(--foreground)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Glitch effect text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for seems to have wandered off into the digital void.
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Retro terminal effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card border-2 border-foreground shadow-[6px_6px_0_var(--foreground)] rounded-lg p-6 max-w-md mx-auto mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="font-mono text-left text-sm">
            <p className="text-muted-foreground">$ find /page</p>
            <p className="text-destructive mt-1">Error: Page not found</p>
            <p className="text-muted-foreground mt-2">$ suggest_action</p>
            <p className="text-primary mt-1 flex items-center gap-1">
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                &gt;
              </motion.span>
              Return to homepage
            </p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild variant="retro" size="lg">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </motion.div>

        {/* Floating shapes decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 border-2 border-primary/20 rounded-lg"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
