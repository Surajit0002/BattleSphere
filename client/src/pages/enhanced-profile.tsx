import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import RootLayout from "@/layouts/RootLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Trophy,
  Users,
  Medal,
  Star,
  Settings,
  User,
  Calendar,
  Shield,
  BookOpen,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Clock,
  DollarSign,
  Gamepad2,
  MapPin,
  Mail,
  Link2,
  Building,
  Edit,
  Heart,
  AlertCircle,
  ThumbsUp,
  Flag
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for the profile page
const mockUserProfile = {
  id: 1,
  username: "ProGamer",
  displayName: "Alex Johnson",
  avatar: null,
  banner: "https://images.unsplash.com/photo-1590422749897-47726e638d08?q=80&w=2070&auto=format&fit=crop",
  bio: "Professional esports player with 5+ years of competitive experience. Specialist in FPS and battle royale games.",
  country: "United States",
  joinDate: "2024-01-15",
  role: "Pro Player",
  verified: true,
  email: "alex@battlesphere.com",
  website: "alexjohnson.pro",
  organization: "Team Alpha",
  social: {
    twitter: "alexjpro",
    discord: "alexj#1234",
    twitch: "alexjpro",
    youtube: "AlexJohnsonGaming"
  },
  stats: {
    tournaments: 28,
    wins: 12,
    winRate: 42.8,
    totalMatches: 145,
    totalPrize: 8500,
    rank: {
      current: "Diamond",
      trend: "up",
      points: 1850
    }
  },
  achievements: [
    { id: 1, name: "First Victory", description: "Win your first tournament", icon: "🏆", date: "2024-01-20", rarity: "common" },
    { id: 2, name: "Rising Star", description: "Win 3 tournaments in a row", icon: "⭐", date: "2024-02-15", rarity: "rare" },
    { id: 3, name: "Community Leader", description: "Create a team with 10+ members", icon: "👥", date: "2024-02-28", rarity: "uncommon" },
    { id: 4, name: "Tournament Master", description: "Participate in 25+ tournaments", icon: "🎮", date: "2024-03-10", rarity: "rare" },
    { id: 5, name: "Prize Collector", description: "Earn over $5,000 in prize money", icon: "💰", date: "2024-03-15", rarity: "epic" }
  ],
  recentActivity: [
    { id: 1, type: "tournament_join", title: "Joined Weekly Showdown", date: "2025-03-27" },
    { id: 2, type: "match_win", title: "Won match against Team Beta", date: "2025-03-25" },
    { id: 3, type: "team_create", title: "Created a new team", date: "2025-03-20" },
    { id: 4, type: "achievement", title: "Earned 'Prize Collector' achievement", date: "2025-03-15" },
    { id: 5, type: "match_loss", title: "Lost match against Team Omega", date: "2025-03-10" }
  ],
  teams: [
    { id: 1, name: "Team Alpha", logo: null, role: "Captain", members: 5, wins: 10, active: true },
    { id: 2, name: "Fire Squad", logo: null, role: "Member", members: 4, wins: 3, active: false }
  ],
  tournaments: [
    { 
      id: 1, 
      name: "Pro League Finals", 
      date: "2025-03-20", 
      game: "Call of Duty", 
      placement: 1, 
      prize: 2500,
      teams: 16
    },
    { 
      id: 2, 
      name: "Weekly Showdown", 
      date: "2025-03-15",

      game: "Fortnite", 
      placement: 3, 
      prize: 500,
      teams: 32
    },
    { 
      id: 3, 
      name: "Regional Championship", 
      date: "2025-03-05", 
      game: "Apex Legends", 
      placement: 2, 
      prize: 1200,
      teams: 20
    },
    { 
      id: 4, 
      name: "Monthly Cup", 
      date: "2025-02-20", 
      game: "Valorant", 
      placement: 5, 
      prize: 300,
      teams: 24
    }
  ]
};

const ProfileHeader = ({ profile }: { profile: any }) => {
  return (
    <div className="relative">
      {/* Banner */}
      <div 
        className="h-40 md:h-60 w-full bg-cover bg-center rounded-lg overflow-hidden" 
        style={{ backgroundImage: `url(${profile.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>
      
      {/* Profile Info */}
      <div className="container max-w-7xl mx-auto px-4">
        <div className="relative -mt-20 md:-mt-24 flex flex-col md:flex-row md:items-end md:justify-between pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background rounded-full">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-4xl">{profile.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="pt-4 md:pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{profile.displayName}</h1>
                {profile.verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="ml-2">
                          <Shield className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        Verified Professional Player
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>@{profile.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
                {profile.organization && (
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{profile.organization}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap mt-4 md:mt-0 gap-2">
            <Button variant="secondary" className="gap-1">
              <Heart className="h-4 w-4" />
              <span>Follow</span>
            </Button>
            <Button variant="outline" className="gap-1">
              <Mail className="h-4 w-4" />
              <span>Message</span>
            </Button>
            <Button variant="outline" size="icon">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value?: number;
  };
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="text-muted-foreground">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div className={`text-xs flex items-center gap-1 ${
                trend.direction === 'up' ? 'text-green-500' :
                trend.direction === 'down' ? 'text-red-500' :
                'text-muted-foreground'
              }`}>
                {trend.direction === 'up' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : trend.direction === 'down' ? (
                  <ArrowDown className="h-3 w-3" />
                ) : null}
                {trend.value && `${trend.value}%`}
                {trend.direction === 'up' ? 'increase' : trend.direction === 'down' ? 'decrease' : 'no change'}
              </div>
            )}
          </div>
          <div className="bg-primary/10 p-2 rounded-md">
            <div className="text-primary">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AchievementCard = ({ achievement }: { achievement: any }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-500 text-white';
      case 'uncommon': return 'bg-green-500 text-white';
      case 'rare': return 'bg-blue-500 text-white';
      case 'epic': return 'bg-purple-500 text-white';
      case 'legendary': return 'bg-amber-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case '🏆': return <Trophy className="h-6 w-6" />;
      case '⭐': return <Star className="h-6 w-6" />;
      case '👥': return <Users className="h-6 w-6" />;
      case '🎮': return <Gamepad2 className="h-6 w-6" />;
      case '💰': return <DollarSign className="h-6 w-6" />;
      default: return <Medal className="h-6 w-6" />;
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="border rounded-lg p-4 flex flex-col items-center text-center gap-2"
    >
      <div className="bg-primary/10 p-4 rounded-full text-primary">
        {getAchievementIcon(achievement.icon)}
      </div>
      <div className="font-semibold mt-2">{achievement.name}</div>
      <div className="text-xs text-muted-foreground">{achievement.description}</div>
      <Badge className={getRarityColor(achievement.rarity)}>
        {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
      </Badge>
      <div className="text-xs text-muted-foreground mt-1">
        Earned {new Date(achievement.date).toLocaleDateString()}
      </div>
    </motion.div>
  );
};

const TournamentHistoryItem = ({ tournament }: { tournament: any }) => {
  const getPlacementBadge = (placement: number) => {
    if (placement === 1) return <Badge className="bg-amber-500 text-white">1st Place</Badge>;
    if (placement === 2) return <Badge className="bg-slate-400 text-white">2nd Place</Badge>;
    if (placement === 3) return <Badge className="bg-amber-700 text-white">3rd Place</Badge>;
    return <Badge variant="outline">{placement}th Place</Badge>;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold">{tournament.name}</div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Gamepad2 className="h-3.5 w-3.5" />
                <span>{tournament.game}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(tournament.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{tournament.teams} Teams</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getPlacementBadge(tournament.placement)}
            {tournament.prize > 0 && (
              <div className="text-sm font-medium flex items-center gap-1 text-green-500">
                <DollarSign className="h-3.5 w-3.5" />
                <span>${tournament.prize.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TeamCard = ({ team }: { team: any }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={team.logo} />
            <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{team.name}</div>
              {!team.active && <Badge variant="outline">Inactive</Badge>}
            </div>
            <div className="text-sm text-muted-foreground">Role: {team.role}</div>
            <div className="flex items-center gap-4 mt-1 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{team.members} Members</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{team.wins} Wins</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" asChild>
            <Link href={`/teams/${team.id}`}>
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivityFeed = ({ activities }: { activities: any[] }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tournament_join': return <Gamepad2 className="h-4 w-4" />;
      case 'match_win': return <Trophy className="h-4 w-4 text-amber-500" />;
      case 'match_loss': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'team_create': return <Users className="h-4 w-4 text-blue-500" />;
      case 'achievement': return <Medal className="h-4 w-4 text-purple-500" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          <div className="mt-0.5 bg-muted w-8 h-8 rounded-full flex items-center justify-center">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{activity.title}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(activity.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SocialLinks = ({ social }: { social: any }) => {
  const socialIcons: Record<string, JSX.Element> = {
    twitter: <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>,
    discord: <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0C9.095 3.88 8.852 3.4 8.641 3.03a.077.077 0 0 0-.079-.036 19.63 19.63 0 0 0-4.885 1.491c-.012.003-.022.01-.028.02C.533 8.917-.32 13.224.099 17.47c.004.031.021.057.048.073a19.782 19.782 0 0 0 5.9 2.967.08.08 0 0 0 .085-.026 14.67 14.67 0 0 0 1.257-2.034.075.075 0 0 0-.041-.105 12.96 12.96 0 0 1-1.872-.881.077.077 0 0 1-.008-.128c.126-.093.252-.191.371-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.372.292a.077.077 0 0 1-.006.127 12.104 12.104 0 0 1-1.873.882.077.077 0 0 0-.041.105c.36.698.772 1.362 1.256 2.033a.077.077 0 0 0 .086.028 19.712 19.712 0 0 0 5.906-2.968.076.076 0 0 0 .047-.073c.5-5.167-.838-9.538-3.549-13.438a.06.06 0 0 0-.026-.023ZM8.02 14.912c-1.161 0-2.123-1.066-2.123-2.38 0-1.314.94-2.38 2.124-2.38 1.194 0 2.147 1.079 2.123 2.38 0 1.314-.93 2.38-2.124 2.38Zm7.846 0c-1.162 0-2.124-1.066-2.124-2.38 0-1.314.94-2.38 2.123-2.38 1.193 0 2.147 1.079 2.123 2.38 0 1.314-.929 2.38-2.123 2.38Z"></path></svg>,
    twitch: <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg>,
    youtube: <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(social).map(([platform, username]) => (
        <TooltipProvider key={platform}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                {socialIcons[platform]}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{platform.charAt(0).toUpperCase() + platform.slice(1)}: {username}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default function EnhancedProfile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  // In a real app, we would fetch the user data based on the username parameter
  // For now, we'll use our mock data
  const { data: profile, isLoading } = useQuery({
    queryKey: [`/api/users/${username}`],
    initialData: mockUserProfile,
    enabled: false
  });
  
  if (isLoading) {
    return (
      <RootLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </RootLayout>
    );
  }
  
  return (
    <RootLayout>
      <ProfileHeader profile={profile} />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{profile.bio}</p>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.website}</span>
                    </div>
                  )}
                </div>
                
                {Object.keys(profile.social).length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Social Links</h3>
                      <SocialLinks social={profile.social} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Career Stats</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Career statistics across all tournaments</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-6">
                  {/* Rank Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Medal className="h-4 w-4 text-primary" />
                        <span className="font-medium">Rank: {profile.stats.rank.current}</span>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {profile.stats.rank.points} XP
                      </Badge>
                    </div>
                    <Progress value={70} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Current: {profile.stats.rank.current}</span>
                      <span>Next: Platinum</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Tournaments</div>
                      <div className="font-bold text-xl">{profile.stats.tournaments}</div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Wins</div>
                      <div className="font-bold text-xl">{profile.stats.wins}</div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                      <div className="font-bold text-xl">{profile.stats.winRate}%</div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Earnings</div>
                      <div className="font-bold text-xl">${profile.stats.totalPrize}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed activities={profile.recentActivity} />
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    title="Tournaments" 
                    value={profile.stats.tournaments} 
                    icon={<Trophy className="h-5 w-5" />}
                    trend={{ direction: 'up', value: 15 }}
                  />
                  <StatCard 
                    title="Win Rate" 
                    value={`${profile.stats.winRate}%`} 
                    icon={<BarChart3 className="h-5 w-5" />}
                    trend={{ direction: 'up', value: 5 }}
                  />
                  <StatCard 
                    title="Total Matches" 
                    value={profile.stats.totalMatches} 
                    icon={<Gamepad2 className="h-5 w-5" />}
                  />
                  <StatCard 
                    title="Total Prize" 
                    value={`$${profile.stats.totalPrize}`} 
                    icon={<DollarSign className="h-5 w-5" />}
                    trend={{ direction: 'up', value: 20 }}
                  />
                </div>
                
                {/* Recent Tournaments */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Tournaments</CardTitle>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/tournaments">View All</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {profile.tournaments.slice(0, 3).map((tournament: any) => (
                      <TournamentHistoryItem key={tournament.id} tournament={tournament} />
                    ))}
                  </CardContent>
                </Card>
                
                {/* Teams */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Teams</CardTitle>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/teams">View All</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {profile.teams.map((team: any) => (
                      <TeamCard key={team.id} team={team} />
                    ))}
                  </CardContent>
                </Card>
                
                {/* Featured Achievements */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Featured Achievements</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab("achievements")}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {profile.achievements.slice(0, 3).map((achievement: any) => (
                        <AchievementCard key={achievement.id} achievement={achievement} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tournaments" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Tournament History</h2>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" /> {profile.stats.tournaments} Tournaments
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {profile.tournaments.map((tournament: any) => (
                    <TournamentHistoryItem key={tournament.id} tournament={tournament} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="teams" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Teams</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/teams/create">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Create Team
                      </div>
                    </Link>
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {profile.teams.map((team: any) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="achievements" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Achievements</h2>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Medal className="h-3 w-3" /> {profile.achievements.length} Unlocked
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.achievements.map((achievement: any) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

const Info = ({ className, ...props }: React.ComponentProps<typeof Shield>) => (
  <Shield className={className} {...props} />
);