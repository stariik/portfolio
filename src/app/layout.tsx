import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tornike Kalandadze | Full-Stack Developer",
  description:
    "Full-Stack Developer portfolio showcasing web applications built with React, Next.js, TypeScript, and more. Crafting beautiful, performant digital experiences.",
  keywords: [
    "Full-Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Tornike Kalandadze",
  ],
  authors: [{ name: "Tornike Kalandadze" }],
  creator: "Tornike Kalandadze",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Tornike Kalandadze | Full-Stack Developer",
    description:
      "Full-Stack Developer portfolio showcasing web applications built with React, Next.js, TypeScript, and more.",
    siteName: "Tornike Kalandadze Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tornike Kalandadze | Full-Stack Developer",
    description:
      "Full-Stack Developer portfolio showcasing web applications built with React, Next.js, TypeScript, and more.",
    creator: "@tornikekalandadze",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
