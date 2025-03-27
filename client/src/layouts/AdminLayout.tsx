import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  Trophy,
  DollarSign,
  BarChart3,
  History,
  Settings,
  Shield,
  Bell,
  LogOut,
  Menu,
  X,
  Home,
  Wallet,
  ShieldAlert,
  MessageSquare,
  AlertTriangle,
  Calendar,
  FileText,
  Megaphone
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mock admin user data - in a real app, this would come from authentication state
  const adminUser = {
    id: 1,
    name: "Super Admin",
    username: "admin_supreme",
    role: "Super Admin",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    lastLogin: "Today at 10:30 AM"
  };
  
  // Navigation items with nested structure
  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
      badge: ""
    },
    {
      title: "User Management",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/user-management",
      badge: ""
    },
    {
      title: "Tournaments",
      icon: <Trophy className="h-5 w-5" />,
      href: "/admin/tournaments",
      subitems: [
        {
          title: "All Tournaments",
          href: "/admin/tournaments"
        },
        {
          title: "Create Tournament",
          href: "/admin/tournaments/create"
        },
        {
          title: "Pending Approvals",
          href: "/admin/tournaments/pending",
          badge: "3"
        }
      ]
    },
    {
      title: "Payments",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/admin/payment-management",
      badge: "5",
      subitems: [
        {
          title: "Transactions",
          href: "/admin/payment-management"
        },
        {
          title: "Pending Withdrawals",
          href: "/admin/payment-management?tab=withdrawals",
          badge: "5"
        },
        {
          title: "Payment Settings",
          href: "/admin/payment-management?settings=true"
        }
      ]
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/analytics",
      subitems: [
        {
          title: "User Metrics",
          href: "/admin/analytics/users"
        },
        {
          title: "Revenue",
          href: "/admin/analytics/revenue"
        },
        {
          title: "Tournament Stats",
          href: "/admin/analytics/tournaments"
        }
      ]
    },
    {
      title: "Audit Logs",
      icon: <History className="h-5 w-5" />,
      href: "/admin/audit-logs",
      badge: ""
    },
    {
      title: "Anti-Cheat",
      icon: <ShieldAlert className="h-5 w-5" />,
      href: "/admin/anti-cheat",
      badge: "12"
    },
    {
      title: "Notifications",
      icon: <Megaphone className="h-5 w-5" />,
      href: "/admin/notifications",
      badge: ""
    },
    {
      title: "Support Tickets",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/support",
      badge: "8"
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      badge: ""
    }
  ];
  
  // Expanded state for navigation items
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>(() => {
    // Initialize with current section expanded
    const initialState: { [key: string]: boolean } = {};
    navItems.forEach(item => {
      if (item.subitems && location.startsWith(item.href)) {
        initialState[item.title] = true;
      }
    });
    return initialState;
  });
  
  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };
  
  const NavItem = ({ 
    item, 
    onClick 
  }: { 
    item: typeof navItems[0], 
    onClick?: () => void 
  }) => {
    const isActive = location === item.href || location.startsWith(item.href + '/');
    const isExpanded = expandedItems[item.title];
    
    return (
      <div key={item.title}>
        <div
          className={cn(
            "flex items-center justify-between py-2 px-3 rounded-lg mb-1 cursor-pointer",
            isActive 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-secondary/80 text-gray-100 hover:text-white"
          )}
          onClick={() => {
            if (item.subitems) {
              toggleExpanded(item.title);
            } else {
              setLocation(item.href);
              if (onClick) onClick();
            }
          }}
        >
          <div className="flex items-center">
            <div className="mr-3 text-current">
              {item.icon}
            </div>
            <span className="text-sm font-medium">{item.title}</span>
          </div>
          <div className="flex items-center">
            {item.badge && (
              <Badge 
                className={cn(
                  "mr-2", 
                  isActive ? "bg-white text-primary" : "bg-primary text-primary-foreground"
                )}
              >
                {item.badge}
              </Badge>
            )}
            {item.subitems && (
              isExpanded 
                ? <ChevronDown className="h-4 w-4" /> 
                : <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
        
        {item.subitems && isExpanded && (
          <div className="ml-10 mb-2 space-y-1">
            {item.subitems.map((subitem) => (
              <Link 
                key={subitem.title} 
                href={subitem.href}
                onClick={onClick}
              >
                <a 
                  className={cn(
                    "flex items-center justify-between py-1.5 px-2 rounded-md text-sm",
                    location === subitem.href 
                      ? "bg-primary/20 text-primary-foreground font-medium" 
                      : "text-gray-300 hover:text-white hover:bg-secondary/50"
                  )}
                >
                  <span>{subitem.title}</span>
                  {subitem.badge && (
                    <Badge className="bg-primary/80 text-primary-foreground">
                      {subitem.badge}
                    </Badge>
                  )}
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-secondary/5">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-secondary border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin/dashboard">
            <a className="flex items-center">
              <Shield className="h-8 w-8 text-primary mr-2" />
              <div>
                <h1 className="text-xl font-bold text-white">BattleSphere</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </a>
          </Link>
        </div>
        
        <ScrollArea className="flex-1 py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={adminUser.profileImage || ""} alt={adminUser.name} />
              <AvatarFallback>{adminUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{adminUser.name}</p>
              <p className="text-xs text-gray-500">{adminUser.role}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="mr-2 h-4 w-4" />
                  <span>Login History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Back to Main Site</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-secondary">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-primary mr-2" />
                <div>
                  <h1 className="text-xl font-bold text-white">BattleSphere</h1>
                  <p className="text-xs text-gray-400">Admin Dashboard</p>
                </div>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-180px)] py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem 
                  key={item.title} 
                  item={item} 
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>
          </ScrollArea>
          
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={adminUser.profileImage || ""} alt={adminUser.name} />
                <AvatarFallback>{adminUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{adminUser.name}</p>
                <p className="text-xs text-gray-500">{adminUser.role}</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-secondary h-16 border-b border-gray-800 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <h1 className="text-xl font-bold text-white ml-2 md:hidden">Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  <DropdownMenuItem className="flex items-start p-3 cursor-pointer">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Withdrawal Request</p>
                      <p className="text-sm text-gray-500">New withdrawal request of ₹5,000 pending approval</p>
                      <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start p-3 cursor-pointer">
                    <Shield className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Suspicious Activity</p>
                      <p className="text-sm text-gray-500">User "rahul_sniper" reported for potential cheating</p>
                      <p className="text-xs text-gray-500 mt-1">20 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start p-3 cursor-pointer">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Tournament Starting</p>
                      <p className="text-sm text-gray-500">BGMI Pro League Season 4 starts in 30 minutes</p>
                      <p className="text-xs text-gray-500 mt-1">25 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Wallet className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Financial Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Pending Withdrawals:</span>
                      <span className="font-medium">₹12,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Today's Revenue:</span>
                      <span className="font-medium text-green-500">₹8,750</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Platform Fee Collected:</span>
                      <span className="font-medium text-green-500">₹950</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center cursor-pointer">
                  View Financial Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/">
              <a className="hidden md:block text-sm text-gray-400 hover:text-white">
                Back to Main Site
              </a>
            </Link>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-card">
          {children}
        </main>
      </div>
    </div>
  );
}