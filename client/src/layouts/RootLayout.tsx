import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BellIcon } from "@/components/ui/bell-icon";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { 
  Shield, 
  Menu, 
  X,
  Home, 
  Trophy, 
  User, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Calendar,
  Wallet,
  Gamepad,
  Zap,
  BellOff,
  Search,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  highlight?: boolean;
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Monitor scroll position to add styling to header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navItems: NavItem[] = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Dashboard", href: "/dashboard", icon: <Gamepad className="h-4 w-4" /> },
    { 
      name: "Tournaments", 
      href: "/tournaments", 
      icon: <Trophy className="h-4 w-4" />,
      badge: "New",
      highlight: true
    },
    { name: "Leaderboard", href: "/leaderboard", icon: <Zap className="h-4 w-4" /> },
    { name: "Teams", href: "/teams", icon: <Users className="h-4 w-4" /> },
    { name: "Streams", href: "/streams", icon: <Sparkles className="h-4 w-4" /> },
  ];

  const accountItems = [
    { name: "Profile", href: "/profile", icon: <User className="h-4 w-4" /> },
    { name: "My Teams", href: "/teams/my-teams", icon: <Users className="h-4 w-4" /> },
    { name: "My Tournaments", href: "/tournaments/my-tournaments", icon: <Trophy className="h-4 w-4" /> },
    { name: "Wallet", href: "/add-funds", icon: <Wallet className="h-4 w-4" /> },
    { name: "Calendar", href: "/calendar", icon: <Calendar className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header 
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          scrolled 
            ? "border-b bg-background/95 backdrop-blur-md shadow-sm" 
            : "bg-background/80 backdrop-blur-sm"
        )}
      >
        <ResponsiveLayout>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 md:gap-6">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] max-w-xs border-r pr-0">
                  <div className="px-2">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                      <a className="flex items-center gap-2 py-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl">BattleSphere</span>
                      </a>
                    </Link>
                  </div>
                  <nav className="flex flex-col gap-1 px-2 py-6">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                        <a className={`group flex items-center gap-3 rounded-md py-2.5 px-3 text-sm font-medium transition-all ${
                          location === item.href 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}>
                          <span className={`${location === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                            {item.icon}
                          </span>
                          {item.name}
                          {item.badge && (
                            <span className="ml-auto bg-primary/20 text-primary text-xs py-0.5 px-1.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </a>
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="px-2 py-2">
                    <div className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-3 px-3">
                      My Account
                    </div>
                    <nav className="flex flex-col gap-1">
                      {accountItems.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                          <a className="flex items-center gap-3 rounded-md py-2 px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                            {item.icon}
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </nav>
                  </div>
                  
                  <div className="px-2 py-2 mt-4">
                    <div className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-3 px-3">
                      Admin
                    </div>
                    <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <a className="flex items-center gap-3 rounded-md py-2 px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </a>
                    </Link>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-4 top-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </SheetContent>
              </Sheet>
              
              <Link href="/">
                <a className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <span className="hidden font-bold text-lg md:inline-block">BattleSphere</span>
                </a>
              </Link>
              
              <nav className="hidden md:flex gap-1 ml-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      location === item.href 
                        ? "bg-secondary text-foreground" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}>
                      <span className={`${location === item.href ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {item.icon}
                      </span>
                      {item.name}
                      {item.badge && (
                        <span className={`${item.highlight ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"} text-xs py-0.5 px-1.5 rounded-full`}>
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" className="hidden md:flex gap-2 items-center p-2" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground hidden lg:inline-block">Search...</span>
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded hidden lg:inline-block">⌘K</span>
              </Button>

              <Button variant="ghost" size="icon" className="relative" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                {notificationsEnabled ? (
                  <Bell className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                )}
                {hasNotifications && notificationsEnabled && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></span>
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></span>
              </Button>
            
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full ml-1">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src="/avatar.png" alt="User" />
                      <AvatarFallback className="bg-primary/10 text-primary">BS</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.png" alt="User" />
                      <AvatarFallback>BS</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">ProGamer</p>
                      <p className="text-xs text-muted-foreground">Premium Member</p>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  {accountItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>
                        <div className="flex items-center cursor-pointer">
                          <span className="mr-2 text-muted-foreground">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <div className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Settings</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">
                      <div className="flex items-center cursor-pointer">
                        <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Admin Dashboard</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </ResponsiveLayout>
        
        {/* Search Modal */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              className="absolute inset-0 z-50 flex items-start justify-center bg-background/90 backdrop-blur-sm pt-[20vh]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div 
                className="w-full max-w-2xl bg-background rounded-lg shadow-lg border"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center px-4 py-2 border-b">
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search tournaments, teams, players..." 
                    className="flex-1 bg-transparent border-none outline-none" 
                  />
                  <kbd className="inline-flex items-center gap-1 rounded border px-1.5 text-[10px] font-medium text-muted-foreground">ESC</kbd>
                </div>
                <div className="p-2">
                  <div className="p-2 text-xs text-muted-foreground">Start typing to search...</div>
                </div>
                <div className="border-t p-2 flex justify-between text-xs text-muted-foreground">
                  <span>Search by: tournaments, teams, players, games</span>
                  <Button variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>Close</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Main content */}
      <main className="flex-1">{children}</main>
      
      {/* Footer */}
      <footer className="border-t bg-background py-10">
        <ResponsiveLayout>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <span className="font-bold text-xl">BattleSphere</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The premier platform for competitive mobile gaming tournaments. Join players worldwide in the ultimate gaming experience.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Discord</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/tournaments">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Tournaments</a>
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</a>
                  </Link>
                </li>
                <li>
                  <Link href="/teams">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Teams</a>
                  </Link>
                </li>
                <li>
                  <Link href="/streams">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Live Streams</a>
                  </Link>
                </li>
                <li>
                  <Link href="/rewards">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Rewards</a>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/support">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
                  </Link>
                </li>
                <li>
                  <Link href="/faq">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tickets">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Support Tickets</a>
                  </Link>
                </li>
                <li>
                  <Link href="/feedback">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Feedback</a>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/cookies">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/refund">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Refund Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/licenses">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Licenses</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                © 2025 BattleSphere. All rights reserved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="flex gap-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    English
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Careers
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Blog
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">
                  Designed with ❤️ for mobile gamers
                </p>
              </div>
            </div>
          </div>
        </ResponsiveLayout>
      </footer>
    </div>
  );
}