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
import Logo from "@/assets/stratobuild-logo.svg";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EllipsisVerticalIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Separator } from "./ui/separator";

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout } = useAuthStore();

  return (
    <aside className="relative w-64 h-screen text-sm border-r shadow-lg bg-muted">
      <ScrollArea className="h-full p-4">
        <figure>
          <Link to="/home" className="flex mb-4">
            {/* <img src={Logo} alt="StratoBuild Logo" className="w-full" /> */}
          </Link>
        </figure>
        <Accordion type="multiple" className="space-y-1 mb-16 font-semibold">
          {sidebarItems.map((item, index) => {
            if (!item.children || item.children.length === 0) {
              return (
                <React.Fragment key={item.label || index}>
                  <Link
                    to={item.redirect ?? "#"}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary hover:text-primary-foreground",
                      pathname === item.redirect &&
                        "font-semibold bg-primary text-white"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                  <Separator className="my-1" />
                </React.Fragment>
              );
            }
            return (
              <AccordionItem key={index} value={item.label}>
                <AccordionTrigger className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground">
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
                            "block px-2 py-2 text-sm rounded-md hover:bg-primary hover:text-primary-foreground ",
                            pathname === child.redirect &&
                              "bg-primary font-semibold text-white"
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
              <div className="flex items-center gap-2 cursor-pointer hover:bg-secondary hover:text-secondary-foreground px-3 py-2 rounded-md bg-secondary">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
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
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon />
                  Cuenta
                </DropdownMenuItem>
              </DropdownMenuGroup>
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
