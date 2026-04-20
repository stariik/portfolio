import { createClient } from "@/lib/supabase/server";

export type HeroSettings = {
  first_name: string;
  last_name: string;
  greeting: string;
  description: string;
  roles: string[];
  available_for_hire: boolean;
};

export type SocialLink = {
  label: "GitHub" | "LinkedIn" | "Twitter" | string;
  href: string;
};

const DEFAULT_HERO: HeroSettings = {
  first_name: "Tornike",
  last_name: "Kalandadze",
  greeting: "Hello, I'm",
  description:
    "I craft beautiful, performant web experiences with modern technologies. Passionate about clean code, great UX, and pushing the boundaries of what's possible on the web.",
  roles: [
    "Full-Stack Developer",
    "React Enthusiast",
    "UI/UX Designer",
    "Problem Solver",
  ],
  available_for_hire: true,
};

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/stariik" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tornike-kalandadze-997701365/",
  },
  { label: "Twitter", href: "https://twitter.com/tornikekalandadze" },
];

export async function getHeroSettings(): Promise<HeroSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero")
    .maybeSingle();

  if (!data?.value || typeof data.value !== "object") return DEFAULT_HERO;
  return { ...DEFAULT_HERO, ...(data.value as Partial<HeroSettings>) };
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "social_links")
    .maybeSingle();

  if (!Array.isArray(data?.value)) return DEFAULT_SOCIAL_LINKS;
  return (data.value as SocialLink[]).filter(
    (link) => link && typeof link.label === "string" && typeof link.href === "string",
  );
}
