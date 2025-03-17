import { AppNavbar } from "@/components/bars/app-navbar";
import { CategoriesProvider } from "@/providers/category";
import { RefetchProvider } from "@/providers/notes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth";
import { ThemeProvider } from "@/providers/theme";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/bars/app-sidebar";

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
