import React, { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  DollarSign, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  Bell, 
  Shield 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  
  // Navigation items
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "User Management",
      href: "/admin/user-management",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Tournament Management",
      href: "/admin/tournaments",
      icon: <Trophy className="h-5 w-5" />,
      subItems: [
        {
          title: "All Tournaments",
          href: "/admin/tournaments",
        },
        {
          title: "Create Tournament",
          href: "/admin/tournaments/create",
        },
      ],
    },
    {
      title: "Payment Management",
      href: "/admin/payment-management",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Audit Logs",
      href: "/admin/audit-logs",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];
  
  // Navigation component for sidebar and mobile drawer
  const Navigation = ({ mobile = false }: { mobile?: boolean }) => {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    
    return (
      <div className={cn("flex flex-col gap-1", mobile && "mt-8")}>
        {navItems.map((item) => (
          <div key={item.title} className="flex flex-col">
            {item.subItems ? (
              <>
                <button
                  onClick={() => setExpandedItem(expandedItem === item.title ? null : item.title)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm",
                    "transition-colors duration-200",
                    location.startsWith(item.href) 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      "transition-transform duration-200",
                      expandedItem === item.title && "transform rotate-180"
                    )} 
                  />
                </button>
                
                {expandedItem === item.title && (
                  <div className="ml-10 pl-3 border-l border-border space-y-1 my-1">
                    {item.subItems.map((subItem) => (
                      <Link 
                        key={subItem.title} 
                        href={subItem.href}
                        onClick={() => mobile && setOpen(false)}
                      >
                        <a 
                          className={cn(
                            "block py-2 px-3 rounded-md text-sm",
                            "transition-colors duration-200",
                            location === subItem.href 
                              ? "bg-secondary text-foreground" 
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          )}
                        >
                          {subItem.title}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link 
                href={item.href}
                onClick={() => mobile && setOpen(false)}
              >
                <a 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                    "transition-colors duration-200",
                    location === item.href 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 border-r border-border flex-col">
        <div className="h-16 border-b border-border flex items-center px-4">
          <Link href="/admin/dashboard">
            <a className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Admin Panel</span>
            </a>
          </Link>
        </div>
        
        <ScrollArea className="flex-1 px-4 py-6">
          <Navigation />
        </ScrollArea>
        
        <div className="border-t border-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">Admin User</span>
                    <span className="text-xs text-muted-foreground">Super Admin</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden h-16 px-4">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="h-16 border-b border-border flex items-center px-4 justify-between">
            <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
              <a className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Admin Panel</span>
              </a>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-4rem)] p-4">
            <Navigation mobile />
          </ScrollArea>
        </SheetContent>
      </Sheet>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="md:hidden mr-2" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="text-lg font-semibold md:hidden">
              BattleSphere Admin
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/">
                    <a className="flex items-center w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Back to Site</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}