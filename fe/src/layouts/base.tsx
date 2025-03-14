import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth";
import { ThemeProvider } from "@/providers/theme";
import { Outlet } from "react-router";

export function BaseLayout() {
  return (
    <AuthProvider>
      <ThemeProvider
        defaultTheme="system"
        storageKey="note-taking-application-theme-key"
      >
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            <Outlet />
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
