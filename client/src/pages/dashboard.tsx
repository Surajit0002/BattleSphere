import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import RootLayout from "@/layouts/RootLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { 
  Trophy, 
  Users, 
  Gamepad2, 
  Calendar, 
  Zap, 
  BarChart3, 
  Clock, 
  DollarSign, 
  Medal, 
  ChevronRight, 
  Gift,
  Star,
  AlertCircle,
  Calendar as CalendarIcon,
  Bell,
  Flame 
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, trend = null, color = "primary" }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend?: { value: number; isPositive: boolean } | null;
  color?: "primary" | "secondary" | "destructive" | "accent" | string;
}) => {
  return (
    <Card className="overflow-hidden">
      <div className={`bg-${color === "primary" ? "primary" : color}/10 absolute top-0 right-0 w-16 h-16 rounded-bl-full flex items-start justify-end p-2`}>
        <div className={`text-${color === "primary" ? "primary" : color}`}>
          {icon}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            <span className="text-muted-foreground ml-1">vs. last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TournamentCard = ({ tournament }: { tournament: any }) => {
  return (
    <Card className="overflow-hidden relative">
      {tournament.featured && (
        <div className="absolute top-0 right-0">
          <Badge variant="destructive" className="rounded-none rounded-bl-lg z-10">
            <Star className="h-3 w-3 mr-1" /> Featured
          </Badge>
        </div>
      )}
      <div 
        className="h-36 bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${tournament.imageUrl || 'https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Tournament'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="font-bold text-lg">{tournament.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Gamepad2 className="h-3 w-3 mr-1" /> {tournament.gameName}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {new Date(tournament.startDate).toLocaleDateString()}
            </Badge>
            <Badge variant={tournament.status === 'active' ? 'secondary' : 'outline'} className="flex items-center gap-1">
              {tournament.status === 'active' ? <Zap className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {tournament.status === 'active' ? 'Live' : 'Upcoming'}
            </Badge>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="font-semibold">${tournament.prizePool}</span>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {tournament.currentPlayers}/{tournament.maxPlayers} Players
            </span>
          </div>
          <Button size="sm" asChild>
            <Link href={`/tournaments/${tournament.id}`}>
              <div className="flex items-center">
                <span>Details</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const TeamCard = ({ team }: { team: any }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={team.logoUrl} alt={team.name} />
              <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{team.name}</CardTitle>
          </div>
          {team.badge && (
            <Badge variant="secondary">
              {team.badge}
            </Badge>
          )}
        </div>
        <CardDescription>
          {team.description || "Team description not available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Members</span>
            <span className="font-semibold">{team.memberCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Wins</span>
            <span className="font-semibold">{team.wins}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Earnings</span>
            <span className="font-semibold">${team.totalEarnings}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/teams/${team.id}`}>
            View Team
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const AchievementCard = ({ achievement }: { achievement: any }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-card border rounded-md p-3 flex flex-col items-center"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${achievement.unlocked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {achievement.icon}
            </div>
            <span className={`text-xs font-medium ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
              {achievement.name}
            </span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{achievement.name}</p>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
            {!achievement.unlocked && (
              <div className="pt-1">
                <div className="text-xs mb-1">Progress</div>
                <div className="flex items-center gap-2">
                  <Progress value={achievement.progress} className="h-2" />
                  <span className="text-xs">{achievement.progress}%</span>
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MatchHistoryItem = ({ match }: { match: any }) => {
  const isWin = match.result === 'win';
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-card">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${isWin ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {isWin ? <Trophy className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        </div>
        <div>
          <div className="font-medium">{match.tournamentName}</div>
          <div className="text-xs text-muted-foreground">{new Date(match.date).toLocaleDateString()}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-medium">{match.score}</div>
          <div className="text-xs text-muted-foreground">{match.placement}</div>
        </div>
        <Badge variant={isWin ? 'secondary' : 'outline'} className="ml-2">
          {isWin ? 'WIN' : 'LOSS'}
        </Badge>
      </div>
    </div>
  );
};

// Mock data - this could come from an API in production
const mockData = {
  stats: {
    totalMatches: 78,
    winRate: "67%",
    totalEarnings: "$1,245",
    rank: "Gold III",
  },
  achievements: [
    { 
      id: 1, 
      name: "First Victory", 
      description: "Win your first tournament match", 
      icon: <Trophy className="h-6 w-6" />, 
      unlocked: true,
      progress: 100 
    },
    { 
      id: 2, 
      name: "Team Leader", 
      description: "Create a team and recruit 5 members", 
      icon: <Users className="h-6 w-6" />, 
      unlocked: true,
      progress: 100 
    },
    { 
      id: 3, 
      name: "Rising Star", 
      description: "Win 3 tournaments in a single month", 
      icon: <Star className="h-6 w-6" />, 
      unlocked: false,
      progress: 66 
    },
    { 
      id: 4, 
      name: "Winning Streak", 
      description: "Win 5 matches in a row", 
      icon: <Flame className="h-6 w-6" />, 
      unlocked: false,
      progress: 40 
    },
  ],
  recentMatches: [
    { 
      id: 1, 
      tournamentName: "Weekly Showdown", 
      date: "2025-03-27", 
      result: "win", 
      score: "3 - 1", 
      placement: "1st Place" 
    },
    { 
      id: 2, 
      tournamentName: "BattleSphere Finals", 
      date: "2025-03-25", 
      result: "loss", 
      score: "1 - 3", 
      placement: "4th Place" 
    },
    { 
      id: 3, 
      tournamentName: "Team Domination", 
      date: "2025-03-20", 
      result: "win", 
      score: "5 - 2", 
      placement: "1st Place" 
    },
  ],
  notifications: [
    {
      id: 1,
      title: "Tournament Reminder",
      message: "Your tournament 'Weekly Showdown' starts in 2 hours",
      date: "2025-03-28",
      read: false,
      type: "tournament"
    },
    {
      id: 2,
      title: "Team Invite",
      message: "You have been invited to join 'Team Alpha'",
      date: "2025-03-27",
      read: true,
      type: "team"
    },
    {
      id: 3,
      title: "Reward Claimed",
      message: "You have successfully claimed 500 Coins reward",
      date: "2025-03-25",
      read: true,
      type: "reward"
    }
  ]
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    retry: false,
  });
  
  // Fetch teams (replace with actual team id)
  const { data: userTeams, isLoading: teamsLoading } = useQuery({
    queryKey: ["/api/teams/user"],
    retry: false,
  });
  
  // Fetch upcoming tournaments
  const { data: upcomingTournaments, isLoading: tournamentsLoading } = useQuery({
    queryKey: ["/api/tournaments/upcoming"],
    retry: false,
  });
  
  const isLoading = profileLoading || teamsLoading || tournamentsLoading;
  
  return (
    <RootLayout>
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {profileLoading ? 'Loading...' : profile?.displayName || 'Your Dashboard'}
            </h1>
            <p className="text-muted-foreground">Welcome back, here's what's happening with your tournaments and teams.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/tournaments">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-4 w-4" />
                  Find Tournaments
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/teams/create">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Create Team
                </div>
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Matches" 
                value={mockData.stats.totalMatches.toString()} 
                icon={<Gamepad2 className="h-6 w-6" />} 
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard 
                title="Win Rate" 
                value={mockData.stats.winRate} 
                icon={<BarChart3 className="h-6 w-6" />} 
                trend={{ value: 5, isPositive: true }}
                color="secondary"
              />
              <StatCard 
                title="Total Earnings" 
                value={mockData.stats.totalEarnings} 
                icon={<DollarSign className="h-6 w-6" />} 
                trend={{ value: 20, isPositive: true }}
                color="green-500"
              />
              <StatCard 
                title="Current Rank" 
                value={mockData.stats.rank} 
                icon={<Medal className="h-6 w-6" />} 
                color="yellow-500"
              />
            </div>
            
            {/* Upcoming Tournaments & Recent Matches */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Upcoming Tournaments</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/tournaments">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                {tournamentsLoading ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : upcomingTournaments && upcomingTournaments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingTournaments.slice(0, 4).map((tournament: any) => (
                      <TournamentCard key={tournament.id} tournament={tournament} />
                    ))}
                  </div>
                ) : (
                  <Card className="h-48">
                    <CardContent className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-medium">No Upcoming Tournaments</h3>
                        <p className="text-sm text-muted-foreground">
                          Check back later or browse all tournaments.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Matches</h2>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {mockData.recentMatches.map((match) => (
                    <MatchHistoryItem key={match.id} match={match} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Teams & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Teams</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/teams">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                {teamsLoading ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : userTeams && userTeams.length > 0 ? (
                  <div className="space-y-4">
                    {userTeams.map((team: any) => (
                      <TeamCard key={team.id} team={team} />
                    ))}
                  </div>
                ) : (
                  <Card className="h-48">
                    <CardContent className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-medium">No Teams Yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Create a team or join an existing one.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4" asChild>
                          <Link href="/teams/create">
                            Create Team
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Notifications</h2>
                  <Button variant="ghost" size="sm">
                    Mark All as Read
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="px-0 py-0">
                    {mockData.notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        <div className={`py-3 px-4 flex items-start justify-between ${notification.read ? '' : 'bg-secondary/20'}`}>
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              notification.type === 'tournament' ? 'bg-primary/10 text-primary' :
                              notification.type === 'team' ? 'bg-orange-500/10 text-orange-500' :
                              'bg-green-500/10 text-green-500'
                            }`}>
                              {notification.type === 'tournament' ? <Calendar className="h-5 w-5" /> :
                               notification.type === 'team' ? <Users className="h-5 w-5" /> :
                               <Gift className="h-5 w-5" />}
                            </div>
                            <div>
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-sm text-muted-foreground">{notification.message}</div>
                              <div className="text-xs text-muted-foreground mt-1">{new Date(notification.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          {!notification.read && (
                            <Badge variant="secondary" className="ml-2">New</Badge>
                          )}
                        </div>
                        {index < mockData.notifications.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tournaments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournamentsLoading ? (
                <div className="col-span-full h-48 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : upcomingTournaments && upcomingTournaments.length > 0 ? (
                upcomingTournaments.map((tournament: any) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))
              ) : (
                <div className="col-span-full h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-medium">No tournaments found</h3>
                    <p className="text-sm text-muted-foreground">
                      Check back later or browse all tournaments.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamsLoading ? (
                <div className="col-span-full h-48 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : userTeams && userTeams.length > 0 ? (
                userTeams.map((team: any) => (
                  <TeamCard key={team.id} team={team} />
                ))
              ) : (
                <div className="col-span-full h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-medium">No Teams Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a team or join an existing one.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link href="/teams/create">
                        Create Team
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mockData.achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
}