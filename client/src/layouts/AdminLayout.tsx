import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Users, 
  Trophy, 
  BarChart3, 
  Settings, 
  CreditCard, 
  Menu,
  X,
  FileText,
  ChevronRight,
  ChevronDown,
  Gamepad,
  BadgeCheck,
  Eye,
  MessageSquare,
  Megaphone,
  Flag,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  variant?: "default" | "success" | "destructive" | "outline";
}

interface SidebarSection {
  name: string;
  items: SidebarItem[];
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const sidebarSections: SidebarSection[] = [
    {
      name: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/admin/dashboard",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          name: "Users",
          href: "/admin/user-management",
          icon: <Users className="h-4 w-4" />,
          badge: "45",
        },
        {
          name: "Payments",
          href: "/admin/payment-management",
          icon: <CreditCard className="h-4 w-4" />,
          badge: "2",
          variant: "success",
        },
        {
          name: "Audit Logs",
          href: "/admin/audit-logs",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      name: "Tournament Management",
      items: [
        {
          name: "Tournaments",
          href: "/admin/tournaments",
          icon: <Trophy className="h-4 w-4" />,
        },
        {
          name: "Create Tournament",
          href: "/admin/tournaments/create",
          icon: <ChevronRight className="h-4 w-4" />,
        },
        {
          name: "Games",
          href: "/admin/games",
          icon: <Gamepad className="h-4 w-4" />,
        },
      ],
    },
    {
      name: "Team Management",
      items: [
        {
          name: "Teams",
          href: "/admin/teams",
          icon: <Users className="h-4 w-4" />,
        },
        {
          name: "Verification Requests",
          href: "/admin/verification-requests",
          icon: <BadgeCheck className="h-4 w-4" />,
          badge: "3",
          variant: "destructive",
        },
      ],
    },
    {
      name: "Content Management",
      items: [
        {
          name: "Streams",
          href: "/admin/streams",
          icon: <Eye className="h-4 w-4" />,
        },
        {
          name: "Messages",
          href: "/admin/messages",
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          name: "Announcements",
          href: "/admin/announcements",
          icon: <Megaphone className="h-4 w-4" />,
        },
      ],
    },
    {
      name: "Moderation",
      items: [
        {
          name: "Reports",
          href: "/admin/reports",
          icon: <Flag className="h-4 w-4" />,
          badge: "5",
          variant: "destructive",
        },
        {
          name: "Notifications",
          href: "/admin/notifications",
          icon: <Bell className="h-4 w-4" />,
        },
      ],
    },
    {
      name: "Platform",
      items: [
        {
          name: "Settings",
          href: "/admin/settings",
          icon: <Settings className="h-4 w-4" />,
        },
      ],
    },
  ];

  const renderSidebarContent = () => (
    <>
      <div className="flex items-center gap-2 py-6 px-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-bold text-lg">Admin Panel</div>
          <div className="text-xs text-muted-foreground">Super Admin</div>
        </div>
      </div>
      
      <div className="space-y-1 px-3">
        {sidebarSections.map((section, sectionIndex) => (
          <Accordion
            key={section.name}
            type="single"
            collapsible
            defaultValue={sectionIndex <= 1 ? section.name : undefined}
            className="border-none"
          >
            <AccordionItem value={section.name} className="border-none">
              <AccordionTrigger className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:no-underline">
                {section.name}
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-0">
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                      <a
                        className={cn(
                          "flex items-center justify-between rounded-md py-2 px-3 text-sm font-medium transition-colors",
                          location === item.href
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={location === item.href ? "text-foreground" : "text-muted-foreground"}>
                            {item.icon}
                          </span>
                          {item.name}
                        </div>
                        {item.badge && (
                          <Badge variant={item.variant} className="text-[10px] px-1.5 py-0.5">
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <div className="mt-auto px-3 py-4">
        <div className="rounded-lg bg-secondary/50 p-4">
          <div className="flex gap-3 items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatar.png" alt="Admin" />
              <AvatarFallback className="bg-primary/10 text-primary">SA</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">Super Admin</div>
              <div className="text-xs text-muted-foreground">admin@battlesphere.com</div>
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <Button asChild variant="outline" size="sm" className="w-full justify-start">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>Back to App</span>
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 h-14 sticky top-0 z-40 backdrop-blur">
        <ResponsiveLayout>
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="mr-2 lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  {renderSidebarContent()}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </SheetContent>
              </Sheet>

              <Link href="/admin/dashboard">
                <a className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold md:text-lg hidden md:inline-block">Admin Panel</span>
                </a>
              </Link>
              
              <nav className="hidden md:flex ml-8 gap-6">
                <Link href="/admin/dashboard">
                  <a className={cn(
                    "text-sm font-medium transition-colors",
                    location === "/admin/dashboard" 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                    Dashboard
                  </a>
                </Link>
                <Link href="/admin/user-management">
                  <a className={cn(
                    "text-sm font-medium transition-colors",
                    location === "/admin/user-management" 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                    Users
                  </a>
                </Link>
                <Link href="/admin/payment-management">
                  <a className={cn(
                    "text-sm font-medium transition-colors",
                    location === "/admin/payment-management" 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                    Payments
                  </a>
                </Link>
                <Link href="/admin/tournaments">
                  <a className={cn(
                    "text-sm font-medium transition-colors",
                    location === "/admin/tournaments" 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                    Tournaments
                  </a>
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="gap-2 hidden md:flex">
                <Link href="/">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>Back to App</span>
                  </div>
                </Link>
              </Button>
              
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" alt="Admin" />
                <AvatarFallback className="bg-primary/10 text-primary">SA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </ResponsiveLayout>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-64 border-r shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
          {renderSidebarContent()}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <ResponsiveLayout fullWidth>
            <div className="py-6">{children}</div>
          </ResponsiveLayout>
        </main>
      </div>
    </div>
  );
}