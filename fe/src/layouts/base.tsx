import { AppNavbar } from "@/components/app-navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { RefetchProvider } from "@/components/search/provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
        <RefetchProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
              <AppNavbar />
              <Outlet />
            </SidebarInset>
          </SidebarProvider>
        </RefetchProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
