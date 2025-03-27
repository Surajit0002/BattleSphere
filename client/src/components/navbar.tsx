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
import { Bell, Menu, Wallet, PlayCircle, User, LifeBuoy } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const linkClasses = (path: string) => {
    return `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
      isActive(path)
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
    }`;
  };

  const mobileLinkClasses = (path: string) => {
    return `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
      isActive(path)
        ? "bg-primary/10 border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
    }`;
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  BATTLESPHERE
                </div>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link href="/">
                <div className={linkClasses("/")}>
                  Home
                </div>
              </Link>
              <Link href="/tournaments">
                <div className={linkClasses("/tournaments")}>
                  Tournaments
                </div>
              </Link>
              <Link href="/tournaments-enhanced">
                <div className={`${linkClasses("/tournaments-enhanced")} flex items-center`}>
                  Enhanced <span className="ml-1 px-1 text-xs bg-primary/20 text-primary rounded">NEW</span>
                </div>
              </Link>
              <Link href="/streams">
                <div className={linkClasses("/streams")}>
                  Live Streams
                </div>
              </Link>
              <Link href="/leaderboard">
                <div className={linkClasses("/leaderboard")}>
                  Leaderboard
                </div>
              </Link>
              <Link href="/teams">
                <div className={linkClasses("/teams")}>
                  Teams
                </div>
              </Link>
              <Link href="/rewards">
                <div className={linkClasses("/rewards")}>
                  Rewards
                </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <Link href="/add-funds">
                  <Button variant="outline" size="sm" className="mr-2">
                    <Wallet className="h-4 w-4 mr-2" />
                    <span className="text-green-500 font-medium mr-1">₹1,250</span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:ml-4 md:flex md:items-center space-x-1">
              <Link href="/streams">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <PlayCircle className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/support">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <LifeBuoy className="h-5 w-5" />
                </Button>
              </Link>
              
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full ml-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User" 
                      />
                      <AvatarFallback>GS</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/user/1">
                    <DropdownMenuItem>
                      <User className="h-4 w-4 mr-2" />
                      Public Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/add-funds">
                    <DropdownMenuItem>
                      <Wallet className="h-4 w-4 mr-2" />
                      Add Funds
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/support">
                    <DropdownMenuItem>
                      <LifeBuoy className="h-4 w-4 mr-2" />
                      Support
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center md:hidden ml-4">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state (handled with state in a real implementation) */}
      <div className="hidden md:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <div className={mobileLinkClasses("/")}>
              Home
            </div>
          </Link>
          <Link href="/tournaments">
            <div className={mobileLinkClasses("/tournaments")}>
              Tournaments
            </div>
          </Link>
          <Link href="/tournaments-enhanced">
            <div className={mobileLinkClasses("/tournaments-enhanced")}>
              Enhanced Tournaments <span className="ml-1 px-1 text-xs bg-primary/20 text-primary rounded">NEW</span>
            </div>
          </Link>
          <Link href="/streams">
            <div className={mobileLinkClasses("/streams")}>
              Live Streams
            </div>
          </Link>
          <Link href="/leaderboard">
            <div className={mobileLinkClasses("/leaderboard")}>
              Leaderboard
            </div>
          </Link>
          <Link href="/teams">
            <div className={mobileLinkClasses("/teams")}>
              Teams
            </div>
          </Link>
          <Link href="/rewards">
            <div className={mobileLinkClasses("/rewards")}>
              Rewards
            </div>
          </Link>
          <Link href="/profile">
            <div className={mobileLinkClasses("/profile")}>
              Profile
            </div>
          </Link>
          <Link href="/support">
            <div className={mobileLinkClasses("/support")}>
              Support
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
