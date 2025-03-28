import React from "react";
import { Link } from "wouter";
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
import { useLocation } from "wouter";
import { 
  Shield, 
  Menu, 
  X,
  Home, 
  Trophy, 
  User, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Teams", href: "/teams" },
    { name: "Streams", href: "/streams" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="border-r pr-0 sm:max-w-xs">
                <div className="px-2">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <a className="flex items-center gap-2 py-4">
                      <Shield className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">BattleSphere</span>
                    </a>
                  </Link>
                </div>
                <nav className="flex flex-col gap-4 px-2 py-6">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <a className={`flex items-center gap-2 rounded-md py-2 px-3 text-sm font-medium ${
                        location === item.href 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-secondary"
                      }`}>
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  <div className="mt-6 border-t pt-6">
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <a className="flex items-center gap-2 rounded-md py-2 px-3 text-sm font-medium hover:bg-secondary">
                        <User className="h-4 w-4" />
                        Profile
                      </a>
                    </Link>
                    <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <a className="flex items-center gap-2 rounded-md py-2 px-3 text-sm font-medium hover:bg-secondary">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </a>
                    </Link>
                  </div>
                </nav>
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
                <Shield className="h-6 w-6 text-primary" />
                <span className="hidden font-bold md:inline-block">BattleSphere</span>
              </a>
            </Link>
            
            <nav className="hidden gap-6 md:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className={`text-sm font-medium ${
                    location === item.href 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}>
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/teams">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>My Teams</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/tournaments">
                    <div className="flex items-center">
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>My Tournaments</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </div>
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
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">{children}</main>
      
      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold">BattleSphere</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The premier platform for competitive mobile gaming tournaments.
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Platform</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/tournaments">
                  <a className="hover:text-foreground">Tournaments</a>
                </Link>
                <Link href="/leaderboard">
                  <a className="hover:text-foreground">Leaderboard</a>
                </Link>
                <Link href="/teams">
                  <a className="hover:text-foreground">Teams</a>
                </Link>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Support</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/support">
                  <a className="hover:text-foreground">Help Center</a>
                </Link>
                <Link href="/faq">
                  <a className="hover:text-foreground">FAQ</a>
                </Link>
                <Link href="/contact">
                  <a className="hover:text-foreground">Contact Us</a>
                </Link>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/terms">
                  <a className="hover:text-foreground">Terms of Service</a>
                </Link>
                <Link href="/privacy">
                  <a className="hover:text-foreground">Privacy Policy</a>
                </Link>
                <Link href="/cookies">
                  <a className="hover:text-foreground">Cookies</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mt-6 border-t pt-6">
          <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 BattleSphere. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Discord</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}