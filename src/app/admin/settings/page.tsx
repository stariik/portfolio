"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/hooks/use-demo-mode";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      siteTitle: "Tornike Kalandadze",
      siteDescription: "Full-Stack Developer Portfolio",
      heroSubtitle: "Full-Stack Developer",
      heroBio: "I craft beautiful, performant web experiences with modern technologies.",
      email: "hello@tornike.dev",
      github: "https://github.com/tornikekalandadze",
      linkedin: "https://linkedin.com/in/tornikekalandadze",
      twitter: "https://twitter.com/tornikekalandadze",
    },
  });

  const onSubmit = async () => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Saving settings is disabled in demo mode.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your portfolio settings
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        {/* Site Settings */}
        <Card className="border-2 shadow-[4px_4px_0_var(--border)]">
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>
              General settings for your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input id="siteTitle" {...register("siteTitle")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea id="siteDescription" {...register("siteDescription")} />
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="border-2 shadow-[4px_4px_0_var(--border)]">
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              Customize the hero section of your homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Subtitle</Label>
              <Input id="heroSubtitle" {...register("heroSubtitle")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroBio">Bio</Label>
              <Textarea id="heroBio" {...register("heroBio")} rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-2 shadow-[4px_4px_0_var(--border)]">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Your social media and contact links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" {...register("github")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" {...register("linkedin")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" {...register("twitter")} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" variant="retro" disabled={isLoading || isDemoMode}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isDemoMode ? "Demo Mode (Read-only)" : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
