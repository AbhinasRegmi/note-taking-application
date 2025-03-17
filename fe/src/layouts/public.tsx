import { ThemeProvider } from "@/providers/theme";
import { Outlet } from "react-router";

export function PublicLayout() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="note-taking-application-theme-key"
    >
      <Outlet />
    </ThemeProvider>
  );
}
