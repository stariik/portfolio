import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionProvider } from "@/components/providers/motion-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tornikekalandadze.com";
const siteTitle = "Tornike Kalandadze | Full-Stack Developer";
const siteDescription =
  "Full-Stack Developer portfolio showcasing web applications built with React, Next.js, TypeScript, and more. Crafting beautiful, performant digital experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "Full-Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Tornike Kalandadze",
  ],
  authors: [{ name: "Tornike Kalandadze", url: siteUrl }],
  creator: "Tornike Kalandadze",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "Tornike Kalandadze Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tornike Kalandadze — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@tornikekalandadze",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tornike Kalandadze",
  url: siteUrl,
  jobTitle: "Full-Stack Developer",
  sameAs: [
    "https://github.com/stariik",
    "https://www.linkedin.com/in/tornike-kalandadze-997701365/",
    "https://twitter.com/tornikekalandadze",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MotionProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
