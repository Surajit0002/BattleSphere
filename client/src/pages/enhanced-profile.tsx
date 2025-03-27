import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Award, Calendar, CalendarClock, ChevronUp, Clock, CreditCard, Edit, Eye, Flag, GameController, Gamepad2, Goal, ListOrdered, Mail, MapPin, Medal, MessageSquare, ShieldCheck, Swords, Trophy, Users } from "lucide-react";

// Define achievement interface
interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlockedAt: string | null;
}

// Define match history interface
interface MatchHistory {
  id: number;
  tournamentName: string;
  gameId: number;
  gameName: string;
  date: string;
  result: "win" | "loss" | "draw";
  placement: number;
  score: number;
  kills: number;
  teamId?: number;
  teamName?: string;
}

export default function EnhancedProfile() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { toast } = useToast();

  // Fetch user profile data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  // Fetch user stats data
  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
    queryFn: () => 
      apiRequest("/api/user/stats").catch(() => {
        // Return mock data if API doesn't exist yet
        return {
          totalMatches: 87,
          wins: 29,
          topTenFinishes: 52,
          winRate: 33.3,
          avgPlacement: 8.2,
          totalKills: 346,
          kdRatio: 3.98,
          totalEarnings: 7800,
          tournamentCount: 21,
          experiencePoints: 12580,
          currentLevel: 34,
          nextLevelXp: 15000,
        };
      }),
  });

  // Fetch achievements data
  const { data: achievements } = useQuery({
    queryKey: ["/api/user/achievements"],
    queryFn: () => 
      apiRequest("/api/user/achievements").catch(() => {
        // Return mock data if API doesn't exist yet
        return [
          {
            id: 1,
            name: "First Victory",
            description: "Win your first match",
            icon: "trophy",
            rarity: "common",
            unlockedAt: "2023-11-15T08:32:41Z"
          },
          {
            id: 2,
            name: "Sharpshooter",
            description: "Achieve 10+ kills in a single match",
            icon: "target",
            rarity: "uncommon",
            unlockedAt: "2023-12-02T14:18:22Z"
          },
          {
            id: 3,
            name: "Tournament Champion",
            description: "Win a tournament",
            icon: "medal",
            rarity: "rare",
            unlockedAt: "2024-01-10T19:45:11Z"
          },
          {
            id: 4,
            name: "Kill Streak",
            description: "Get 5 kills in a row without dying",
            icon: "flame",
            rarity: "uncommon",
            unlockedAt: "2023-12-18T11:24:36Z"
          },
          {
            id: 5,
            name: "Squad Leader",
            description: "Win 5 matches as a team captain",
            icon: "users",
            rarity: "rare",
            unlockedAt: "2024-02-05T15:37:19Z"
          },
          {
            id: 6,
            name: "Season Master",
            description: "Reach the top 100 in any season",
            icon: "crown",
            rarity: "epic",
            unlockedAt: null
          },
          {
            id: 7,
            name: "Perfect Game",
            description: "Win a match without taking damage",
            icon: "shield",
            rarity: "legendary",
            unlockedAt: null
          },
          {
            id: 8,
            name: "Dedication",
            description: "Play 100 matches",
            icon: "clock",
            rarity: "common",
            unlockedAt: "2024-01-30T09:12:58Z"
          }
        ];
      }),
  });

  // Fetch match history data
  const { data: matchHistory } = useQuery({
    queryKey: ["/api/user/matches"],
    queryFn: () => 
      apiRequest("/api/user/matches").catch(() => {
        // Return mock data if API doesn't exist yet
        return [
          {
            id: 1,
            tournamentName: "Weekly Showdown",
            gameId: 1,
            gameName: "Free Fire",
            date: "2024-03-22T14:30:00Z",
            result: "win",
            placement: 1,
            score: 2850,
            kills: 12,
            teamId: 1,
            teamName: "Team Golf"
          },
          {
            id: 2,
            tournamentName: "Spring Championship",
            gameId: 2,
            gameName: "PUBG Mobile",
            date: "2024-03-20T18:15:00Z",
            result: "loss",
            placement: 7,
            score: 1250,
            kills: 5,
            teamId: 1,
            teamName: "Team Golf"
          },
          {
            id: 3,
            tournamentName: "Elite Tournament",
            gameId: 1,
            gameName: "Free Fire",
            date: "2024-03-18T16:00:00Z",
            result: "win",
            placement: 1,
            score: 3100,
            kills: 14,
            teamId: 1,
            teamName: "Team Golf"
          },
          {
            id: 4,
            tournamentName: "Weekend Battle",
            gameId: 3,
            gameName: "COD Mobile",
            date: "2024-03-16T20:30:00Z",
            result: "loss",
            placement: 4,
            score: 1850,
            kills: 8,
            teamId: 1,
            teamName: "Team Golf"
          },
          {
            id: 5,
            tournamentName: "Pro League Qualifier",
            gameId: 2,
            gameName: "PUBG Mobile",
            date: "2024-03-15T19:00:00Z",
            result: "win",
            placement: 1,
            score: 2500,
            kills: 11,
            teamId: 1,
            teamName: "Team Golf"
          }
        ];
      }),
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500";
      case "uncommon": return "bg-green-500";
      case "rare": return "bg-blue-500";
      case "epic": return "bg-purple-500";
      case "legendary": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "win": return "text-green-500";
      case "loss": return "text-red-500";
      case "draw": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "trophy": return <Trophy className="h-5 w-5" />;
      case "target": return <Goal className="h-5 w-5" />;
      case "medal": return <Medal className="h-5 w-5" />;
      case "flame": return <Swords className="h-5 w-5" />;
      case "users": return <Users className="h-5 w-5" />;
      case "crown": return <Award className="h-5 w-5" />;
      case "shield": return <ShieldCheck className="h-5 w-5" />;
      case "clock": return <Clock className="h-5 w-5" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  if (isLoadingUser) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p className="mb-6">Please log in to view your profile</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 min-h-screen bg-black bg-dot-white/[0.2]">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 rounded-lg bg-gradient-to-r from-purple-900 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Profile Details */}
        <div className="relative px-6 -mt-16">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.profileImage || ""} alt={user.displayName} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {user.displayName?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-3xl font-bold text-white">{user.displayName}</h1>
                {user.kycVerified && (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-400">@{user.username}</p>
              
              <div className="flex flex-wrap gap-4 mt-2 items-center text-sm text-gray-400">
                {stats && (
                  <>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                      <span>{stats.wins} Wins</span>
                    </div>
                    <div className="flex items-center">
                      <Gamepad2 className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{stats.totalMatches} Matches</span>
                    </div>
                    <div className="flex items-center">
                      <Swords className="h-4 w-4 mr-1 text-red-500" />
                      <span>{stats.totalKills} Kills</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1 text-purple-500" />
                      <span>Level {stats.currentLevel}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex gap-2">
              <Button size="sm" variant="outline" className="flex items-center gap-1 border-gray-700 hover:bg-gray-800">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
              <Button size="sm" className="flex items-center gap-1 bg-primary hover:bg-primary/90">
                <Mail className="h-4 w-4" />
                <span>Message</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-8">
        <TabsList className="grid grid-cols-4 h-14 bg-gray-900/60 mb-8">
          <TabsTrigger 
            value="overview"
            className={cn(
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none",
              "data-[state=active]:shadow-none data-[state=active]:border-b-0"
            )}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="achievements"
            className={cn(
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none",
              "data-[state=active]:shadow-none data-[state=active]:border-b-0"
            )}
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger 
            value="matches"
            className={cn(
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none",
              "data-[state=active]:shadow-none data-[state=active]:border-b-0"
            )}
          >
            Match History
          </TabsTrigger>
          <TabsTrigger 
            value="wallet"
            className={cn(
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none",
              "data-[state=active]:shadow-none data-[state=active]:border-b-0"
            )}
          >
            Wallet
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Summary */}
            <Card className="col-span-2 border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ListOrdered className="text-primary h-5 w-5" />
                  Player Statistics
                </CardTitle>
                <CardDescription>Your gaming performance</CardDescription>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">Win Rate</span>
                          <span className="text-sm font-medium">{stats.winRate}%</span>
                        </div>
                        <Progress value={stats.winRate} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">K/D Ratio</span>
                          <span className="text-sm font-medium">{stats.kdRatio}</span>
                        </div>
                        <Progress value={Math.min(stats.kdRatio * 20, 100)} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900/40 rounded-lg p-3">
                          <div className="text-gray-400 text-xs mb-1">Matches</div>
                          <div className="text-xl font-bold">{stats.totalMatches}</div>
                        </div>
                        <div className="bg-gray-900/40 rounded-lg p-3">
                          <div className="text-gray-400 text-xs mb-1">Wins</div>
                          <div className="text-xl font-bold text-green-500">{stats.wins}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900/40 rounded-lg p-3">
                          <div className="text-gray-400 text-xs mb-1">Avg Placement</div>
                          <div className="text-xl font-bold">{stats.avgPlacement}</div>
                        </div>
                        <div className="bg-gray-900/40 rounded-lg p-3">
                          <div className="text-gray-400 text-xs mb-1">Kills</div>
                          <div className="text-xl font-bold text-red-500">{stats.totalKills}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">Level Progress</span>
                          <span className="text-sm font-medium">
                            {stats.experiencePoints}/{stats.nextLevelXp} XP
                          </span>
                        </div>
                        <Progress 
                          value={(stats.experiencePoints / stats.nextLevelXp) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="bg-gray-900/40 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-gray-400 text-xs mb-1">Current Level</div>
                            <div className="text-2xl font-bold text-yellow-500">{stats.currentLevel}</div>
                          </div>
                          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-yellow-500/20 text-yellow-500">
                            <Award className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900/40 rounded-lg p-3">
                          <div className="text-gray-400 text-xs mb-1">Tournaments</div>
                          <div className="text-xl font-bold">{stats.tournamentCount}</div>
                        </div>
                        <div className="bg-gray-900/40 rounded-lg p-3">
                          <div className="text-gray-400 text-xs mb-1">Earnings</div>
                          <div className="text-xl font-bold text-green-500">₹{stats.totalEarnings}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Medal className="text-primary h-5 w-5" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest unlocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements && achievements
                    .filter((achievement: Achievement) => achievement.unlockedAt)
                    .sort((a: Achievement, b: Achievement) => {
                      return new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime();
                    })
                    .slice(0, 3)
                    .map((achievement: Achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-900/40 rounded-lg">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getRarityColor(achievement.rarity)}`}>
                          {getAchievementIcon(achievement.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{achievement.name}</h4>
                          <p className="text-xs text-gray-400 truncate">{achievement.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs border-gray-700">
                          {new Date(achievement.unlockedAt || "").toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}

                  <Button variant="outline" className="w-full mt-2 border-gray-700 hover:bg-gray-800" asChild>
                    <Link href="#" onClick={() => setSelectedTab("achievements")}>
                      View All Achievements
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Matches */}
            <Card className="col-span-2 border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Gamepad2 className="text-primary h-5 w-5" />
                    Recent Matches
                  </CardTitle>
                  <CardDescription>Your latest gameplay</CardDescription>
                </div>
                <Button variant="outline" className="border-gray-700 hover:bg-gray-800" size="sm" asChild>
                  <Link href="#" onClick={() => setSelectedTab("matches")}>
                    View All
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {matchHistory && matchHistory.slice(0, 3).map((match: MatchHistory) => (
                    <div key={match.id} className="p-3 bg-gray-900/40 rounded-lg flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        match.result === "win" ? "bg-green-500/20 text-green-500" : 
                        match.result === "loss" ? "bg-red-500/20 text-red-500" : 
                        "bg-yellow-500/20 text-yellow-500"
                      }`}>
                        {match.result === "win" ? <Trophy className="h-6 w-6" /> : 
                         match.result === "loss" ? <Flag className="h-6 w-6" /> : 
                         <Medal className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{match.tournamentName}</h4>
                        <div className="flex items-center text-sm text-gray-400">
                          <Gamepad2 className="h-3 w-3 mr-1" />
                          <span className="truncate">{match.gameName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getResultColor(match.result)}`}>
                          {match.result === "win" ? "Victory" : match.result === "loss" ? "Defeat" : "Draw"}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center justify-end gap-1">
                          <span>#{match.placement}</span>
                          <span>•</span>
                          <span>{match.kills} kills</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wallet Summary */}
            <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="text-primary h-5 w-5" />
                  Wallet Summary
                </CardTitle>
                <CardDescription>Your earnings & transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4 rounded-lg mb-4">
                  <div className="text-sm text-gray-400">Balance</div>
                  <div className="text-3xl font-bold">₹{user.walletBalance || 0}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                    Withdraw
                  </Button>
                  <Button asChild>
                    <Link href="/add-funds">Add Funds</Link>
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tournaments Won</span>
                    <span className="font-medium">₹{stats?.totalEarnings || 0}</span>
                  </div>
                  <Separator className="bg-gray-800" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Pending Withdrawals</span>
                    <span className="font-medium">₹0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="text-primary h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                Track your progress and unlock unique achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements && achievements.map((achievement: Achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 border rounded-lg ${
                      achievement.unlockedAt 
                        ? "bg-gray-900/40 border-gray-700" 
                        : "bg-gray-900/20 border-gray-800 opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        achievement.unlockedAt 
                          ? getRarityColor(achievement.rarity) 
                          : "bg-gray-700"
                      }`}>
                        {getAchievementIcon(achievement.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          {achievement.rarity === "legendary" && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">Legendary</Badge>
                          )}
                          {achievement.rarity === "epic" && (
                            <Badge className="bg-purple-500 hover:bg-purple-600">Epic</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                        {achievement.unlockedAt ? (
                          <div className="flex items-center text-xs text-green-500">
                            <CalendarClock className="h-3 w-3 mr-1" />
                            <span>Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-gray-500">
                            <Lock className="h-3 w-3 mr-1" />
                            <span>Not unlocked yet</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Match History Tab */}
        <TabsContent value="matches">
          <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Gamepad2 className="text-primary h-5 w-5" />
                Match History
              </CardTitle>
              <CardDescription>
                Review your past performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchHistory && matchHistory.map((match: MatchHistory) => (
                  <div key={match.id} className="bg-gray-900/40 border border-gray-800 rounded-lg overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-stretch">
                      <div className={`w-full sm:w-2 ${
                        match.result === "win" ? "bg-green-500" :
                        match.result === "loss" ? "bg-red-500" :
                        "bg-yellow-500"
                      }`}></div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{match.tournamentName}</h3>
                            <div className="flex items-center text-sm text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(match.date).toLocaleDateString()} at {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            match.result === "win" ? "bg-green-500/20 text-green-500" :
                            match.result === "loss" ? "bg-red-500/20 text-red-500" :
                            "bg-yellow-500/20 text-yellow-500"
                          }`}>
                            {match.result === "win" ? "Victory" : match.result === "loss" ? "Defeat" : "Draw"}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                          <div className="bg-gray-900 rounded p-2">
                            <div className="text-xs text-gray-400">Game</div>
                            <div className="font-medium">{match.gameName}</div>
                          </div>
                          <div className="bg-gray-900 rounded p-2">
                            <div className="text-xs text-gray-400">Team</div>
                            <div className="font-medium">{match.teamName || "Solo"}</div>
                          </div>
                          <div className="bg-gray-900 rounded p-2">
                            <div className="text-xs text-gray-400">Placement</div>
                            <div className="font-medium">#{match.placement}</div>
                          </div>
                          <div className="bg-gray-900 rounded p-2">
                            <div className="text-xs text-gray-400">Score</div>
                            <div className="font-medium">{match.score}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Swords className="h-4 w-4 mr-1 text-red-500" />
                            <span className="text-sm"><strong>{match.kills}</strong> Kills</span>
                          </div>
                          
                          <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800">
                            <Eye className="h-4 w-4 mr-1" />
                            Match Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2 border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="text-primary h-5 w-5" />
                  Wallet
                </CardTitle>
                <CardDescription>
                  Manage your earnings and transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="col-span-2">
                    <div className="bg-gradient-to-r from-primary to-blue-700 p-6 rounded-lg relative overflow-hidden h-48">
                      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-primary/20"></div>
                      
                      <div className="relative flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-white/80 text-sm mb-1">Available Balance</div>
                            <div className="text-white text-3xl font-bold">₹{user.walletBalance || 0}</div>
                          </div>
                          
                          <div className="rounded-full bg-white/20 backdrop-blur-sm p-2">
                            <Trophy className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-white/80 text-sm mb-1">Player</div>
                          <div className="text-white font-medium">{user.displayName}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                      <Link href="/add-funds">Add Funds</Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                      Withdraw
                    </Button>
                    
                    <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                      Transaction History
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recent Transactions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-500/20 text-green-500">
                            <ChevronUp className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">Tournament Winnings</div>
                            <div className="text-sm text-gray-400">Weekly Showdown</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-500 font-medium">+₹800</div>
                          <div className="text-xs text-gray-400">Mar 22, 2024</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-red-500/20 text-red-500">
                            <ChevronDown className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">Tournament Entry</div>
                            <div className="text-sm text-gray-400">Elite Tournament</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-500 font-medium">-₹200</div>
                          <div className="text-xs text-gray-400">Mar 18, 2024</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-500/20 text-green-500">
                            <ChevronUp className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">Tournament Winnings</div>
                            <div className="text-sm text-gray-400">Pro League Qualifier</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-500 font-medium">+₹500</div>
                          <div className="text-xs text-gray-400">Mar 15, 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="text-primary h-5 w-5" />
                    Earnings Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-900/40 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">Total Earned</div>
                      <div className="text-2xl font-bold text-green-500">₹{stats?.totalEarnings || 0}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tournament Winnings</span>
                        <span className="font-medium">₹{stats?.totalEarnings || 0}</span>
                      </div>
                      <Separator className="bg-gray-800" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Referral Bonus</span>
                        <span className="font-medium">₹0</span>
                      </div>
                      <Separator className="bg-gray-800" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Other Rewards</span>
                        <span className="font-medium">₹0</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MapPin className="text-primary h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-3">Add Payment Method</Button>
                  
                  <div className="text-center text-sm text-gray-400">
                    <p>No payment methods added yet</p>
                    <p>Add a method to withdraw your earnings</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}