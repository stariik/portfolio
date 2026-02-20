"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-foreground shadow-[2px_2px_0_var(--foreground)] hover:shadow-[1px_1px_0_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 180 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {theme === "light" ? (
          <Sun className="w-5 h-5 text-primary" />
        ) : (
          <Moon className="w-5 h-5 text-primary" />
        )}
      </motion.div>
    </motion.button>
  );
}
