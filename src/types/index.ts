export * from "./database";

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
