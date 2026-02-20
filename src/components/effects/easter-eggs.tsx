"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Console easter egg
const asciiArt = `
   ████████╗██╗  ██╗
   ╚══██╔══╝██║ ██╔╝
      ██║   █████╔╝
      ██║   ██╔═██╗
      ██║   ██║  ██╗
      ╚═╝   ╚═╝  ╚═╝

   Hey there, curious developer! 👋

   Thanks for exploring the console.
   If you're interested in the code,
   check out my GitHub!

   Built with Next.js, Three.js,
   and lots of coffee ☕
`;

export function EasterEggs() {
  const [showRetroScreen, setShowRetroScreen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const konamiSequence = useRef<string[]>([]);
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  // Konami code confetti
  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#E86A17", "#F07B1A", "#C9924A", "#FFB366"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#E86A17", "#F07B1A", "#C9924A", "#FFB366"],
      });
    }, 250);
  }, []);

  useEffect(() => {
    // Console message
    console.log(
      "%c" + asciiArt,
      "color: #E86A17; font-family: monospace; font-size: 12px;"
    );
    console.log(
      "%c🔥 Looking for the source code? https://github.com/tornikekalandadze",
      "color: #C9924A; font-size: 14px; font-weight: bold;"
    );

    // Konami code listener
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiSequence.current.push(e.code);
      konamiSequence.current = konamiSequence.current.slice(-10);

      if (
        konamiSequence.current.length === konamiCode.length &&
        konamiSequence.current.every((code, i) => code === konamiCode[i])
      ) {
        triggerConfetti();
        konamiSequence.current = [];
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerConfetti]);

  // Logo click easter egg
  useEffect(() => {
    const logo = document.querySelector('a[href="/"]');
    if (!logo) return;

    const handleClick = () => {
      setLogoClicks((prev) => {
        const newCount = prev + 1;
        if (newCount >= 5) {
          setShowRetroScreen(true);
          setTimeout(() => setShowRetroScreen(false), 3000);
          return 0;
        }
        return newCount;
      });
    };

    logo.addEventListener("click", handleClick);
    return () => logo.removeEventListener("click", handleClick);
  }, []);

  return (
    <AnimatePresence>
      {showRetroScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-primary text-6xl mb-8"
            >
              TK
            </motion.div>
            <div className="flex items-center gap-2 text-primary">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Loading
              </motion.span>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  .
                </motion.span>
              ))}
            </div>
            <motion.div
              className="mt-8 h-2 w-64 bg-gray-800 rounded-full overflow-hidden mx-auto"
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
