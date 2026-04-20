"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { loadSettings, saveSettings } from "./actions";

type FormValues = {
  first_name: string;
  last_name: string;
  greeting: string;
  description: string;
  available_for_hire: boolean;
  roles: { value: string }[];
  social_links: { label: string; href: string }[];
};

const EMPTY: FormValues = {
  first_name: "",
  last_name: "",
  greeting: "",
  description: "",
  available_for_hire: true,
  roles: [{ value: "" }],
  social_links: [{ label: "", href: "" }],
};

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({ defaultValues: EMPTY });

  const availableForHire = watch("available_for_hire");

  const rolesFields = useFieldArray({ control, name: "roles" });
  const socialFields = useFieldArray({ control, name: "social_links" });

  useEffect(() => {
    loadSettings().then((data) => {
      if (data) {
        reset({
          first_name: data.hero.first_name,
          last_name: data.hero.last_name,
          greeting: data.hero.greeting,
          description: data.hero.description,
          available_for_hire: data.hero.available_for_hire,
          roles: data.hero.roles.map((value) => ({ value })),
          social_links: data.social_links,
        });
      }
      setIsLoaded(true);
    });
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Saving settings is disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      await saveSettings({
        hero: {
          first_name: values.first_name,
          last_name: values.last_name,
          greeting: values.greeting,
          description: values.description,
          available_for_hire: values.available_for_hire,
          roles: values.roles.map((r) => r.value).filter(Boolean),
        },
        social_links: values.social_links.filter((l) => l.label && l.href),
      });
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-8 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your portfolio settings
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <Card className="border-2 shadow-[4px_4px_0_var(--border)]">
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              Name, greeting, description and availability shown in the hero.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input id="first_name" {...register("first_name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input id="last_name" {...register("last_name")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="greeting">Greeting</Label>
              <Input id="greeting" {...register("greeting")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...register("description")} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="available_for_hire">Available for hire</Label>
                <p className="text-sm text-muted-foreground">
                  Shows a green pulse badge next to the greeting.
                </p>
              </div>
              <Switch
                id="available_for_hire"
                checked={availableForHire}
                onCheckedChange={(checked) =>
                  setValue("available_for_hire", checked, { shouldDirty: true })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[4px_4px_0_var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Typewriter roles</CardTitle>
              <CardDescription>
                Cycled through the typewriter under your name.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => rolesFields.append({ value: "" })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {rolesFields.fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`roles.${index}.value` as const)}
                  placeholder="e.g. Full-Stack Developer"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => rolesFields.remove(index)}
                  aria-label="Remove role"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[4px_4px_0_var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Social links</CardTitle>
              <CardDescription>
                Known labels (GitHub, LinkedIn, Twitter) get matching icons.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => socialFields.append({ label: "", href: "" })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {socialFields.fields.map((field, index) => (
              <div key={field.id} className="grid sm:grid-cols-[1fr_2fr_auto] gap-2">
                <Input
                  {...register(`social_links.${index}.label` as const)}
                  placeholder="Label"
                />
                <Input
                  {...register(`social_links.${index}.href` as const)}
                  placeholder="https://…"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => socialFields.remove(index)}
                  aria-label="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" variant="retro" disabled={isSaving || isDemoMode}>
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isDemoMode ? "Demo Mode (Read-only)" : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
