import { AdminSidebar } from "@/components/admin/sidebar";
import { DemoBanner } from "@/components/admin/demo-banner";
import { Toaster } from "@/components/ui/toaster";
import { DemoModeProvider } from "@/hooks/use-demo-mode";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoModeProvider>
      <div className="flex flex-col min-h-screen">
        <DemoBanner />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 admin-content overflow-auto">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </DemoModeProvider>
  );
}
