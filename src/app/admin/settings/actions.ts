"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { HeroSettings, SocialLink } from "@/lib/site-settings";

export type SettingsPayload = {
  hero: HeroSettings;
  social_links: SocialLink[];
};

export async function loadSettings(): Promise<SettingsPayload | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["hero", "social_links"]);

  if (!data) return null;

  const hero = data.find((row) => row.key === "hero")?.value as
    | HeroSettings
    | undefined;
  const social_links = data.find((row) => row.key === "social_links")?.value as
    | SocialLink[]
    | undefined;

  if (!hero || !social_links) return null;
  return { hero, social_links };
}

export async function saveSettings(payload: SettingsPayload) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("site_settings").upsert(
    [
      { key: "hero", value: payload.hero },
      { key: "social_links", value: payload.social_links },
    ],
    { onConflict: "key" },
  );

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
