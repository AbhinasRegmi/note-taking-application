import { useAuthContext } from "@/providers/auth";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Avatar } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { NavLink } from "react-router";
import { useState } from "react";

export function SidebarUser() {
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={() => setOpen((p) => !p)}>
          <DropdownMenuTrigger className="w-full">
            <SidebarMenuButton
              tabIndex={-1}
              size={"lg"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <AboutUser />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <AboutUser />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="py-1.5 space-y-1">
              <DropdownMenuItem className="px-2 py-2 rounded-sm hover:bg-sidebar-accent">
                <NavLink to={""} onClick={() => setOpen(false)}>
                  <p className="text-xs font-semibold">Manage Account</p>
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-2 py-2 rounded-sm hover:bg-sidebar-accent">
                <NavLink to={"#"} onClick={() => setOpen(false)}>
                  <p className="text-xs font-semibold">Logout</p>
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function AboutUser() {
  const { name, email } = useAuthContext();

  return (
    <>
      <Avatar className="">
        <AvatarFallback className="rounded-lg bg-accent h-8 w-8 uppercase flex items-center justify-center">
          {name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{name}</span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </>
  );
}
