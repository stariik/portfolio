"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DemoModeContextType {
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

const DEMO_MODE_COOKIE = "portfolio_demo_mode";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const demoMode = getCookie(DEMO_MODE_COOKIE);
    if (demoMode === "true") {
      setIsDemoMode(true);
    }
  }, []);

  const enterDemoMode = () => {
    setCookie(DEMO_MODE_COOKIE, "true", 1);
    setIsDemoMode(true);
  };

  const exitDemoMode = () => {
    deleteCookie(DEMO_MODE_COOKIE);
    setIsDemoMode(false);
  };

  return (
    <DemoModeContext.Provider value={{ isDemoMode, enterDemoMode, exitDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return context;
}
