import { getUser } from "@/lib/supabase-server";
import KBar from "@/web/components/kbar";
import AppSidebar from "@/web/components/layout/app-sidebar";
import Header from "@/web/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/web/components/ui/sidebar";
import { SupabaseAuthContextProvider } from "@/web/lib/supabase-client";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = cookies();
  const user = await getUser();

  // const auth = auth;
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SupabaseAuthContextProvider user={user}>
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar user={user} />
          <SidebarInset>
            <Header />
            {/* page main content */}
            {children}
            {/* page main content ends */}
          </SidebarInset>
        </SidebarProvider>
      </KBar>
    </SupabaseAuthContextProvider>
  );
}
