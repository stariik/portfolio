"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/hooks/use-demo-mode";

export function DemoBanner() {
  const { isDemoMode, exitDemoMode } = useDemoMode();
  const router = useRouter();

  if (!isDemoMode) return null;

  const handleExit = () => {
    exitDemoMode();
    router.push("/admin/login");
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 shadow-lg"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span className="font-medium text-sm">
            Demo Mode - Read-only preview
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExit}
          className="text-white hover:bg-white/20 hover:text-white"
        >
          <X className="w-4 h-4 mr-1" />
          Exit
        </Button>
      </div>
    </motion.div>
  );
}
