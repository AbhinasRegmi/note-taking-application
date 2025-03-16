import { AppNavbar } from "@/components/app-navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { CategoriesProvider } from "@/components/search/category";
import { RefetchProvider } from "@/components/search/notes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth";
import { ThemeProvider } from "@/providers/theme";
import { Outlet } from "react-router";

export function BaseLayout() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="note-taking-application-theme-key"
    >
      <AuthProvider>
        <RefetchProvider>
          <CategoriesProvider>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar />
              <SidebarInset>
                <AppNavbar />
                <Outlet />
              </SidebarInset>
            </SidebarProvider>
          </CategoriesProvider>
        </RefetchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
