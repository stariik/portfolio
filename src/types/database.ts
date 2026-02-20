export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          content: string | null;
          thumbnail_url: string | null;
          images: string[];
          technologies: string[];
          live_url: string | null;
          github_url: string | null;
          category: string;
          featured: boolean;
          display_order: number;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          content?: string | null;
          thumbnail_url?: string | null;
          images?: string[];
          technologies?: string[];
          live_url?: string | null;
          github_url?: string | null;
          category?: string;
          featured?: boolean;
          display_order?: number;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          content?: string | null;
          thumbnail_url?: string | null;
          images?: string[];
          technologies?: string[];
          live_url?: string | null;
          github_url?: string | null;
          category?: string;
          featured?: boolean;
          display_order?: number;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          proficiency: number;
          icon_name: string | null;
          color: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          proficiency?: number;
          icon_name?: string | null;
          color?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          proficiency?: number;
          icon_name?: string | null;
          color?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_status: "draft" | "published" | "archived";
    };
  };
};

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"];
export type SkillUpdate = Database["public"]["Tables"]["skills"]["Update"];

export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type ContactMessageInsert = Database["public"]["Tables"]["contact_messages"]["Insert"];

export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
