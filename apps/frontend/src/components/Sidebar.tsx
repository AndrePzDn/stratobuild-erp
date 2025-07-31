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
// import Logo from "@/assets/stratobuild-logo.svg";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EllipsisVerticalIcon, LogOutIcon, UserIcon, MenuIcon, XIcon } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <figure>
        <Link to="/home" className="flex mb-4" onClick={() => setIsMobileMenuOpen(false)}>
          {/* <img src={Logo} alt="StratoBuild Logo" className="w-full" /> */}
        </Link>
      </figure>
      <Accordion type="multiple" className="space-y-1 font-semibold">
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
                  onClick={() => setIsMobileMenuOpen(false)}
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
              <AccordionTrigger
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground font-semibold",
                  item.children &&
                    item.children.some(
                      (child) => child.redirect === (pathname.includes(child.redirect) ? child.redirect : null)
                    ) &&
                    "bg-secondary font-semibold text-secondary-foreground"
                )}
              >
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
                        onClick={() => setIsMobileMenuOpen(false)}
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
      <div className="mt-8 pt-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-secondary hover:text-secondary-foreground px-3 py-2 rounded-md bg-secondary">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.charAt(0) || "U"}
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
            className="w-56 rounded-lg"
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
      </div>
    </>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-background border shadow-md"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Abrir menú de navegación"
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      <aside className="hidden md:flex md:flex-col relative w-64 h-screen text-sm border-r shadow-lg bg-muted">
        <ScrollArea className="flex-1 p-4">
          <figure>
            <Link to="/home" className="flex mb-4" onClick={() => setIsMobileMenuOpen(false)}>
              {/* <img src={Logo} alt="StratoBuild Logo" className="w-full" /> */}
            </Link>
          </figure>
          <Accordion type="multiple" className="space-y-1 font-semibold">
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
                      onClick={() => setIsMobileMenuOpen(false)}
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
                  <AccordionTrigger
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground font-semibold",
                      item.children &&
                        item.children.some(
                          (child) => child.redirect === (pathname.includes(child.redirect) ? child.redirect : null)
                        ) &&
                        "bg-secondary font-semibold text-secondary-foreground"
                    )}
                  >
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
                            onClick={() => setIsMobileMenuOpen(false)}
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
        </ScrollArea>
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-secondary hover:text-secondary-foreground px-3 py-2 rounded-md bg-secondary">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.charAt(0) || "U"}
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
              className="w-56 rounded-lg"
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
        </div>
      </aside>

      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent 
          className="p-0 max-w-64 h-screen left-0 top-0 translate-x-0 translate-y-0 rounded-none border-r border-l-0 border-t-0 border-b-0 animate-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-64"
          showCloseButton={false}
        >
          <div className="relative w-full h-full text-sm bg-muted">
            <div className="flex justify-between items-center p-4">
              <span className="font-semibold text-lg">Menú</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-4rem)] px-4">
              <SidebarContent />
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
