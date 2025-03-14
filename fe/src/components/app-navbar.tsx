import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "./ui/sidebar";

export function AppNavbar() {
  return (
    <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-0.5" />
    </header>
  );
}
