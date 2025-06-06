import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { sidebarItems } from "@/constants/sidebarItems";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import { Separator } from "./ui/separator";
import Logo from "@/assets/stratobuild-logo.svg";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EllipsisVerticalIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout } = useAuthStore();

  return (
    <aside className="relative w-64 h-screen border-r bg-white shadow-sm text-sm">
      <ScrollArea className="h-full p-4">
        <figure>
          <Link to="/home" className="flex mb-4">
            <img src={Logo} alt="StratoBuild Logo" className="w-full" />
          </Link>
        </figure>
        <Accordion type="multiple" className="space-y-1 mb-16">
          {sidebarItems.map((item, index) => {
            if (!item.children || item.children.length === 0) {
              return (
                <React.Fragment key={item.label || index}>
                  <Link
                    to={item.redirect ?? "#"}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted hover:underline",
                      pathname === item.redirect && "bg-muted font-semibold",
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                  <Separator />
                </React.Fragment>
              );
            }
            return (
              <AccordionItem key={index} value={item.label}>
                <AccordionTrigger className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-6 space-y-1">
                    {item.children.map((child, i) => (
                      <li key={i}>
                        <Link
                          to={child.redirect}
                          className={clsx(
                            "block px-2 py-1 text-sm rounded hover:bg-muted",
                            pathname === child.redirect &&
                              "bg-muted font-semibold",
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <footer className="absolute bottom-0 py-4 text-xs w-full pr-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-muted px-3 py-2 rounded-md bg-white">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
                <EllipsisVerticalIcon className="ml-auto size-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage alt={user?.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon />
                  Cuenta
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOutIcon />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </footer>
      </ScrollArea>
    </aside>
  );
}
