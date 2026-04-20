export * from "./database";

import type { Project, Skill } from "./database";

// Narrow shapes used by the public landing page cards; keeps the
// homepage query from over-fetching and keeps props honest about
// what the UI actually reads.
export type ProjectCard = Pick<
  Project,
  | "id"
  | "title"
  | "slug"
  | "description"
  | "thumbnail_url"
  | "images"
  | "technologies"
  | "live_url"
  | "github_url"
  | "category"
  | "featured"
>;

export type SkillSummary = Pick<
  Skill,
  "id" | "name" | "category" | "proficiency" | "color"
>;

export interface NavItem {
  label: string;
  href: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  type: "work" | "education";
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
