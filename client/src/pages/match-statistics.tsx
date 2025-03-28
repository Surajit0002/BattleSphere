import React, { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import RootLayout from "@/layouts/RootLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  Share2,
  Download,
  Clock,
  Target,
  BarChart2,
  Heart,
  Shield,
  Skull,
  Zap,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Crosshair,
  Map
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for the match statistics
const mockData = {
  match: {
    id: 1,
    tournament: "BattleSphere Pro League",
    gameId: 1,
    gameName: "Fortnite",
    gameMode: "squad",
    map: "Olympus Arena",
    date: "2025-03-25T15:30:00Z",
    duration: "32:47",
    status: "completed",
    team1: {
      id: 1,
      name: "Team Alpha",
      logo: null,
      score: 75,
      isWinner: true,
      members: [
        { id: 1, name: "Shadow", avatar: null, role: "Leader", kills: 12, deaths: 2, assists: 5, damage: 4280, healing: 230 },
        { id: 2, name: "Viper", avatar: null, role: "Support", kills: 8, deaths: 3, assists: 10, damage: 2830, healing: 1450 },
        { id: 3, name: "Blaze", avatar: null, role: "Assault", kills: 9, deaths: 4, assists: 2, damage: 3640, healing: 120 },
        { id: 4, name: "Ghost", avatar: null, role: "Sniper", kills: 10, deaths: 1, assists: 3, damage: 3950, healing: 0 }
      ]
    },
    team2: {
      id: 2,
      name: "Team Omega",
      logo: null,
      score: 58,
      isWinner: false,
      members: [
        { id: 5, name: "Thunder", avatar: null, role: "Leader", kills: 7, deaths: 6, assists: 8, damage: 2950, healing: 180 },
        { id: 6, name: "Storm", avatar: null, role: "Support", kills: 5, deaths: 9, assists: 12, damage: 1830, healing: 1900 },
        { id: 7, name: "Lightning", avatar: null, role: "Assault", kills: 9, deaths: 8, assists: 3, damage: 3120, healing: 0 },
        { id: 8, name: "Cyclone", avatar: null, role: "Sniper", kills: 7, deaths: 10, assists: 4, damage: 2650, healing: 0 }
      ]
    },
    highlights: [
      { time: "04:15", description: "Shadow gets First Blood", type: "firstblood", playerId: 1 },
      { time: "12:30", description: "Ghost takes down 3 players in succession", type: "multikill", playerId: 4 },
      { time: "18:45", description: "Team Alpha captures Zone B", type: "objective", teamId: 1 },
      { time: "25:10", description: "Lightning eliminates Blaze with a headshot", type: "elimination", playerId: 7, targetId: 3 },
      { time: "29:30", description: "Team Alpha secures final objective", type: "objective", teamId: 1 }
    ],
    gameStats: {
      totalKills: 60,
      totalDeaths: 43,
      totalAssists: 47,
      totalDamage: 19400,
      totalHealing: 3880,
      objectivesCaptured: {
        team1: 4,
        team2: 2
      },
      powerupsClaimed: {
        team1: 7,
        team2: 5
      }
    }
  }
};

// Component for the match scorecard at the top
const MatchScoreCard = ({ match }: { match: any }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative bg-primary h-12">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container h-full flex items-center justify-between text-primary-foreground">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <span className="font-medium">{match.tournament}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary-foreground/10 text-primary-foreground">
              <Map className="h-3 w-3 mr-1" /> {match.map}
            </Badge>
            <Badge variant="secondary" className="bg-primary-foreground/10 text-primary-foreground">
              <Clock className="h-3 w-3 mr-1" /> {match.duration}
            </Badge>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Team 1 */}
          <div className="md:col-span-5">
            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{match.team1.name}</h3>
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src={match.team1.logo} />
                  <AvatarFallback>{match.team1.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center gap-2">
                {match.team1.isWinner && (
                  <Badge className="bg-green-500 text-white">WINNER</Badge>
                )}
                <span className="text-sm text-muted-foreground">{match.gameMode.toUpperCase()} Mode</span>
              </div>
            </div>
          </div>
          
          {/* Score */}
          <div className="md:col-span-1 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-1 flex items-center">
                <span className={match.team1.isWinner ? "text-primary" : ""}>{match.team1.score}</span>
                <span className="mx-2">-</span>
                <span className={match.team2.isWinner ? "text-primary" : ""}>{match.team2.score}</span>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(match.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* Team 2 */}
          <div className="md:col-span-5">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src={match.team2.logo} />
                  <AvatarFallback>{match.team2.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{match.team2.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                {match.team2.isWinner && (
                  <Badge className="bg-green-500 text-white">WINNER</Badge>
                )}
                <span className="text-sm text-muted-foreground">{match.gameName}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for team performance
const TeamPerformance = ({ team1, team2 }: { team1: any; team2: any }) => {
  const compareStats = (team1Stat: number, team2Stat: number) => {
    const total = team1Stat + team2Stat;
    return total === 0 ? 50 : (team1Stat / total) * 100;
  };
  
  const stats = [
    {
      name: "Total Kills",
      team1Value: team1.members.reduce((acc: number, member: any) => acc + member.kills, 0),
      team2Value: team2.members.reduce((acc: number, member: any) => acc + member.kills, 0),
      icon: <Skull className="h-4 w-4" />,
    },
    {
      name: "Total Deaths",
      team1Value: team1.members.reduce((acc: number, member: any) => acc + member.deaths, 0),
      team2Value: team2.members.reduce((acc: number, member: any) => acc + member.deaths, 0),
      icon: <Crosshair className="h-4 w-4" />,
      invert: true,
    },
    {
      name: "Total Assists",
      team1Value: team1.members.reduce((acc: number, member: any) => acc + member.assists, 0),
      team2Value: team2.members.reduce((acc: number, member: any) => acc + member.assists, 0),
      icon: <Users className="h-4 w-4" />,
    },
    {
      name: "Total Damage",
      team1Value: team1.members.reduce((acc: number, member: any) => acc + member.damage, 0),
      team2Value: team2.members.reduce((acc: number, member: any) => acc + member.damage, 0),
      icon: <Zap className="h-4 w-4" />,
    },
    {
      name: "Total Healing",
      team1Value: team1.members.reduce((acc: number, member: any) => acc + member.healing, 0),
      team2Value: team2.members.reduce((acc: number, member: any) => acc + member.healing, 0),
      icon: <Heart className="h-4 w-4" />,
    },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          Team Performance
        </CardTitle>
        <CardDescription>
          Comparative analysis of team statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stats.map((stat, index) => {
            const team1Percentage = compareStats(stat.team1Value, stat.team2Value);
            const team1Better = stat.invert 
              ? team1Percentage < 50 
              : team1Percentage > 50;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium flex items-center gap-1">
                    {stat.icon}
                    {stat.name}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={team1Better ? "font-bold text-primary" : ""}>{stat.team1Value}</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className={!team1Better ? "font-bold text-primary" : ""}>{stat.team2Value}</span>
                  </div>
                </div>
                <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${team1Better ? 'bg-primary' : 'bg-muted-foreground'}`}
                    style={{ width: `${team1Percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{team1.name}</span>
                  <span>{team2.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for player performance in a team
const PlayerPerformanceCard = ({ player, index, isWinner }: { player: any; index: number; isWinner: boolean }) => {
  const getBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'leader': return 'bg-blue-500 text-white';
      case 'support': return 'bg-green-500 text-white';
      case 'assault': return 'bg-red-500 text-white';
      case 'sniper': return 'bg-violet-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  const getKdaRatio = () => {
    if (player.deaths === 0) return (player.kills + player.assists).toFixed(1);
    return ((player.kills + player.assists) / player.deaths).toFixed(1);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`p-4 border rounded-lg ${isWinner ? 'border-primary/50' : 'border-muted'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className={`h-10 w-10 ${isWinner ? 'border-2 border-primary' : ''}`}>
            <AvatarImage src={player.avatar} />
            <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{player.name}</h3>
            <Badge className={getBadgeColor(player.role)}>{player.role}</Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl">{getKdaRatio()}</div>
          <div className="text-xs text-muted-foreground">KDA Ratio</div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground">Kills</div>
          <div className="font-semibold">{player.kills}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground">Deaths</div>
          <div className="font-semibold">{player.deaths}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground">Assists</div>
          <div className="font-semibold">{player.assists}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground">Damage</div>
          <div className="font-semibold">{player.damage.toLocaleString()}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground">Healing</div>
          <div className="font-semibold">{player.healing.toLocaleString()}</div>
        </div>
      </div>
    </motion.div>
  );
};

// Component for match highlights
const MatchHighlights = ({ highlights, team1, team2 }: { highlights: any[]; team1: any; team2: any }) => {
  const allPlayers = [...team1.members, ...team2.members];
  
  const getPlayerById = (id: number) => {
    return allPlayers.find(player => player.id === id);
  };
  
  const getTeamById = (id: number) => {
    return id === team1.id ? team1 : team2;
  };
  
  const getHighlightIcon = (type: string) => {
    switch (type) {
      case 'firstblood': return <Skull className="h-4 w-4 text-red-500" />;
      case 'multikill': return <Sparkles className="h-4 w-4 text-yellow-500" />;
      case 'objective': return <Target className="h-4 w-4 text-blue-500" />;
      case 'elimination': return <Crosshair className="h-4 w-4 text-violet-500" />;
      default: return <Trophy className="h-4 w-4 text-primary" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Match Highlights
        </CardTitle>
        <CardDescription>
          Key moments from the match
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {highlights.map((highlight, index) => {
            const player = highlight.playerId ? getPlayerById(highlight.playerId) : null;
            const targetPlayer = highlight.targetId ? getPlayerById(highlight.targetId) : null;
            const team = highlight.teamId ? getTeamById(highlight.teamId) : null;
            
            return (
              <div key={index} className="relative pl-10 pb-5">
                {/* Timeline connector */}
                {index < highlights.length - 1 && (
                  <div className="absolute left-4 top-5 bottom-0 w-0.5 bg-border"></div>
                )}
                
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  {getHighlightIcon(highlight.type)}
                </div>
                
                {/* Content */}
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{highlight.time}</div>
                  <div className="font-medium">{highlight.description}</div>
                  {player && (
                    <div className="flex items-center mt-1 text-sm">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarFallback className="text-[10px]">{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{player.name}</span>
                      {targetPlayer && (
                        <>
                          <span className="mx-1">→</span>
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarFallback className="text-[10px]">{targetPlayer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span>{targetPlayer.name}</span>
                        </>
                      )}
                    </div>
                  )}
                  {team && !player && (
                    <div className="flex items-center mt-1 text-sm">
                      <span className={team.id === team1.id ? "text-primary" : ""}>{team.name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
export default function MatchStatistics() {
  const { id } = useParams();
  const matchId = parseInt(id || "1");
  
  // In a real application, we would fetch the match data from an API
  const { data: match, isLoading } = useQuery({
    queryKey: [`/api/matches/${matchId}`],
    // This is mocked for demo purposes
    initialData: mockData.match,
    enabled: false
  });
  
  const [activeTab, setActiveTab] = useState("overview");
  
  if (isLoading) {
    return (
      <RootLayout>
        <div className="container py-8 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </RootLayout>
    );
  }
  
  if (!match) {
    return (
      <RootLayout>
        <div className="container py-8">
          <div className="bg-muted p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Match Not Found</h2>
            <p className="text-muted-foreground">The match you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </RootLayout>
    );
  }
  
  return (
    <RootLayout>
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Match Statistics</h1>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share Match</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download Stats</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <MatchScoreCard match={match} />
          
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team1">Team 1 Details</TabsTrigger>
              <TabsTrigger value="team2">Team 2 Details</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="overview" className="space-y-6">
                <TeamPerformance team1={match.team1} team2={match.team2} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Match Objectives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">Objectives Captured</div>
                            <div className="flex items-center gap-2">
                              <span className={match.team1.isWinner ? "font-bold text-primary" : ""}>
                                {match.gameStats.objectivesCaptured.team1}
                              </span>
                              <span className="text-muted-foreground">vs</span>
                              <span className={match.team2.isWinner ? "font-bold text-primary" : ""}>
                                {match.gameStats.objectivesCaptured.team2}
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={(match.gameStats.objectivesCaptured.team1 / (match.gameStats.objectivesCaptured.team1 + match.gameStats.objectivesCaptured.team2)) * 100} 
                            className="h-2" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{match.team1.name}</span>
                            <span>{match.team2.name}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">Powerups Claimed</div>
                            <div className="flex items-center gap-2">
                              <span className={match.team1.isWinner ? "font-bold text-primary" : ""}>
                                {match.gameStats.powerupsClaimed.team1}
                              </span>
                              <span className="text-muted-foreground">vs</span>
                              <span className={match.team2.isWinner ? "font-bold text-primary" : ""}>
                                {match.gameStats.powerupsClaimed.team2}
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={(match.gameStats.powerupsClaimed.team1 / (match.gameStats.powerupsClaimed.team1 + match.gameStats.powerupsClaimed.team2)) * 100} 
                            className="h-2" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{match.team1.name}</span>
                            <span>{match.team2.name}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Top Performers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Most Kills */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium flex items-center gap-1">
                              <Skull className="h-4 w-4" /> Most Kills
                            </div>
                          </div>
                          
                          {(() => {
                            const allPlayers = [...match.team1.members, ...match.team2.members];
                            const topKiller = [...allPlayers].sort((a, b) => b.kills - a.kills)[0];
                            
                            return (
                              <div className="flex items-center gap-3 bg-muted p-2 rounded-md">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={topKiller.avatar} />
                                  <AvatarFallback>{topKiller.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold">{topKiller.name}</div>
                                  <div className="text-xs text-muted-foreground">{
                                    match.team1.members.some((m: any) => m.id === topKiller.id) 
                                      ? match.team1.name 
                                      : match.team2.name
                                  }</div>
                                </div>
                                <div className="ml-auto font-bold">{topKiller.kills} kills</div>
                              </div>
                            );
                          })()}
                        </div>
                        
                        {/* Most Damage */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium flex items-center gap-1">
                              <Zap className="h-4 w-4" /> Most Damage
                            </div>
                          </div>
                          
                          {(() => {
                            const allPlayers = [...match.team1.members, ...match.team2.members];
                            const topDamage = [...allPlayers].sort((a, b) => b.damage - a.damage)[0];
                            
                            return (
                              <div className="flex items-center gap-3 bg-muted p-2 rounded-md">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={topDamage.avatar} />
                                  <AvatarFallback>{topDamage.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold">{topDamage.name}</div>
                                  <div className="text-xs text-muted-foreground">{
                                    match.team1.members.some((m: any) => m.id === topDamage.id) 
                                      ? match.team1.name 
                                      : match.team2.name
                                  }</div>
                                </div>
                                <div className="ml-auto font-bold">{topDamage.damage.toLocaleString()} damage</div>
                              </div>
                            );
                          })()}
                        </div>
                        
                        {/* Most Healing */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium flex items-center gap-1">
                              <Heart className="h-4 w-4" /> Most Healing
                            </div>
                          </div>
                          
                          {(() => {
                            const allPlayers = [...match.team1.members, ...match.team2.members];
                            const topHealing = [...allPlayers].sort((a, b) => b.healing - a.healing)[0];
                            
                            if (topHealing.healing === 0) {
                              return (
                                <div className="flex items-center justify-center bg-muted p-2 rounded-md text-muted-foreground text-sm">
                                  No healing performed in this match
                                </div>
                              );
                            }
                            
                            return (
                              <div className="flex items-center gap-3 bg-muted p-2 rounded-md">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={topHealing.avatar} />
                                  <AvatarFallback>{topHealing.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold">{topHealing.name}</div>
                                  <div className="text-xs text-muted-foreground">{
                                    match.team1.members.some((m: any) => m.id === topHealing.id) 
                                      ? match.team1.name 
                                      : match.team2.name
                                  }</div>
                                </div>
                                <div className="ml-auto font-bold">{topHealing.healing.toLocaleString()} healing</div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="team1" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src={match.team1.logo} />
                      <AvatarFallback>{match.team1.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{match.team1.name}</h2>
                      <div className="flex items-center gap-2">
                        {match.team1.isWinner && (
                          <Badge className="bg-green-500 text-white">WINNER</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">Score: {match.team1.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {match.team1.members.map((player: any, index: number) => (
                    <PlayerPerformanceCard 
                      key={player.id} 
                      player={player} 
                      index={index} 
                      isWinner={match.team1.isWinner} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="team2" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src={match.team2.logo} />
                      <AvatarFallback>{match.team2.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{match.team2.name}</h2>
                      <div className="flex items-center gap-2">
                        {match.team2.isWinner && (
                          <Badge className="bg-green-500 text-white">WINNER</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">Score: {match.team2.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {match.team2.members.map((player: any, index: number) => (
                    <PlayerPerformanceCard 
                      key={player.id} 
                      player={player} 
                      index={index} 
                      isWinner={match.team2.isWinner} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="highlights" className="space-y-6">
                <MatchHighlights 
                  highlights={match.highlights} 
                  team1={match.team1} 
                  team2={match.team2} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </RootLayout>
  );
}