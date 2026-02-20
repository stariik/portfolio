"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export function CursorTrail() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailIdRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const addTrailPoint = useCallback((x: number, y: number) => {
    trailIdRef.current += 1;
    setTrail((prev) => [...prev.slice(-12), { x, y, id: trailIdRef.current }]);
  }, []);

  useEffect(() => {
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      // Add trail points based on distance moved
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
      );

      if (distance > 5) {
        addTrailPoint(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        !!target.closest("[role='button']") ||
        getComputedStyle(target).cursor === "pointer";
      setIsPointer(isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setTrail([]);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cursorX, cursorY, addTrailPoint]);

  // Clean up old trail points
  useEffect(() => {
    const cleanup = setInterval(() => {
      setTrail((prev) => prev.slice(-8));
    }, 50);
    return () => clearInterval(cleanup);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="cursor-trail-container" style={{ mixBlendMode: "difference" }}>
      {/* Trail particles */}
      <AnimatePresence>
        {trail.map((point, index) => {
          const size = Math.max(4, 16 - index * 1.2);
          const opacity = Math.max(0.1, 0.8 - index * 0.08);

          return (
            <motion.div
              key={point.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed rounded-full pointer-events-none"
              style={{
                left: point.x,
                top: point.y,
                width: size,
                height: size,
                x: "-50%",
                y: "-50%",
                background: `radial-gradient(circle, rgba(232, 106, 23, ${opacity}) 0%, transparent 70%)`,
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Outer ring */}
      <motion.div
        className="fixed rounded-full pointer-events-none border-2 border-primary"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isPointer ? 48 : isClicking ? 28 : 36,
          height: isPointer ? 48 : isClicking ? 28 : 36,
          opacity: isPointer ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed rounded-full pointer-events-none bg-primary"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isClicking ? 12 : isPointer ? 6 : 8,
          height: isClicking ? 12 : isPointer ? 6 : 8,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Glow effect */}
      <motion.div
        className="fixed rounded-full pointer-events-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(232, 106, 23, 0.3) 0%, transparent 60%)",
        }}
        animate={{
          width: isPointer ? 80 : 60,
          height: isPointer ? 80 : 60,
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
