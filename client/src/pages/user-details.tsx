import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { BarChart, Calendar, GameController, Medal, MessageSquare, Timer, Trophy, UserPlus, Users } from "lucide-react";

export default function UserDetails() {
  const [_, params] = useRoute("/user/:id");
  const userId = params?.id ? parseInt(params.id) : 1;
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch user details
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  // Fetch user's recent matches
  const { data: recentMatches } = useQuery({
    queryKey: [`/api/users/${userId}/matches`],
    enabled: !!userId,
    initialData: [],
  });

  // Fetch user's teams
  const { data: userTeams } = useQuery({
    queryKey: [`/api/teams/user/${userId}`],
    enabled: !!userId,
    initialData: [],
  });

  // Fetch user's tournaments
  const { data: userTournaments } = useQuery({
    queryKey: [`/api/users/${userId}/tournaments`],
    enabled: !!userId,
    initialData: [],
  });

  // Fetch user's achievements
  const { data: achievements } = useQuery({
    queryKey: [`/api/users/${userId}/achievements`],
    enabled: !!userId,
    initialData: [],
  });

  if (isLoadingUser) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center">
        <div className="w-full max-w-6xl grid gap-6">
          <div className="h-64 animate-pulse bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 animate-pulse bg-muted rounded-lg"></div>
            <div className="h-96 animate-pulse bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for demo
  const mockUser = user || {
    id: 1,
    username: "ProGamer2023",
    displayName: "Alex Thompson",
    profileImage: "https://i.imgur.com/6QRe8Zq.jpg",
    badge: "Verified Pro",
    role: "user",
    country: "United States",
    totalMatches: 345,
    winRate: 68,
    ranking: 23,
    bio: "Professional esports player with 5+ years of competitive experience. Specializing in FPS and Battle Royale games. Team captain for Fearless Fighters.",
    followersCount: 1254,
    followingCount: 187,
    totalEarnings: 12500,
    level: 42,
    experience: 7800,
    nextLevelExperience: 9000,
    joinedDate: "2022-06-15",
    lastActive: "2025-03-25T10:15:22Z",
    socialLinks: {
      twitter: "proGamer2023",
      twitch: "alexthompson_pro",
      youtube: "alexthompson_gaming",
      discord: "alex#1234"
    },
    kycVerified: true
  };

  const mockAchievements = achievements.length > 0 ? achievements : [
    { id: 1, title: "Tournament Champion", description: "Won a major tournament", date: "2025-02-15", icon: "trophy", rarity: "legendary" },
    { id: 2, title: "Sharpshooter", description: "Maintained a 3.0+ K/D ratio for 30 days", date: "2025-03-01", icon: "target", rarity: "epic" },
    { id: 3, title: "Team Player", description: "Participated in 100 team matches", date: "2025-01-20", icon: "users", rarity: "rare" },
    { id: 4, title: "Rising Star", description: "Reached level 25 in under 60 days", date: "2024-09-10", icon: "star", rarity: "uncommon" },
    { id: 5, title: "First Victory", description: "Won your first tournament match", date: "2024-07-05", icon: "award", rarity: "common" }
  ];

  const mockRecentMatches = recentMatches.length > 0 ? recentMatches : [
    { id: 1, game: "Free Fire", result: "win", kills: 14, placement: 1, date: "2025-03-24", score: 2750 },
    { id: 2, game: "COD Mobile", result: "loss", kills: 6, placement: 8, date: "2025-03-22", score: 1450 },
    { id: 3, game: "PUBG Mobile", result: "win", kills: 11, placement: 1, date: "2025-03-20", score: 2300 },
    { id: 4, game: "Free Fire", result: "loss", kills: 5, placement: 12, date: "2025-03-18", score: 980 },
    { id: 5, game: "BGMI", result: "win", kills: 9, placement: 3, date: "2025-03-16", score: 1850 }
  ];

  const mockTeams = userTeams.length > 0 ? userTeams : [
    { id: 1, name: "Fearless Fighters", role: "Captain", logoUrl: "https://i.imgur.com/vLpVxey.png", memberCount: 5, wins: 28 },
    { id: 2, name: "Elite Squad", role: "Member", logoUrl: "https://i.imgur.com/2KjCvKk.png", memberCount: 4, wins: 15 }
  ];

  const mockTournaments = userTournaments.length > 0 ? userTournaments : [
    { id: 1, name: "Pro League Finals", placement: 1, prize: 5000, date: "2025-03-10" },
    { id: 2, name: "Weekend Warriors", placement: 3, prize: 1200, date: "2025-02-28" },
    { id: 3, name: "Season Qualifier", placement: 5, prize: 500, date: "2025-02-15" },
    { id: 4, name: "Weekly Showdown", placement: 2, prize: 2000, date: "2025-01-25" }
  ];

  const calculateLevel = (xp: number) => {
    return Math.floor(Math.sqrt(xp / 100));
  };

  const calculateProgress = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const progressPercent = calculateProgress(mockUser.experience, mockUser.nextLevelExperience);
  const formattedJoinDate = new Date(mockUser.joinedDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  const lastActiveDate = new Date(mockUser.lastActive);
  const timeAgo = getTimeAgo(lastActiveDate);

  function getTimeAgo(date: Date) {
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return "Just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  }

  function handleFollow() {
    setIsFollowing(!isFollowing);
  }
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/50";
      case "epic": return "bg-purple-500/10 text-purple-500 border-purple-500/50";
      case "rare": return "bg-blue-500/10 text-blue-500 border-blue-500/50";
      case "uncommon": return "bg-green-500/10 text-green-500 border-green-500/50";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/50";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* User Profile Header */}
        <div className="relative rounded-xl overflow-hidden mb-6">
          <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="absolute -bottom-12 left-8 flex items-end">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={mockUser.profileImage} alt={mockUser.displayName} />
              <AvatarFallback>{mockUser.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="absolute bottom-4 right-8 flex space-x-2">
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={handleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
              {!isFollowing && <UserPlus className="ml-2 h-4 w-4" />}
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
        
        <div className="mt-16 md:mt-12 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{mockUser.displayName}</h1>
            <span className="text-muted-foreground">@{mockUser.username}</span>
            {mockUser.badge && (
              <Badge className="ml-2" variant="secondary">
                {mockUser.badge}
              </Badge>
            )}
            {mockUser.kycVerified && (
              <Badge variant="outline" className="border-blue-500 text-blue-500">
                Verified
              </Badge>
            )}
          </div>
          
          <p className="mt-2 text-muted-foreground">{mockUser.bio}</p>
          
          <div className="mt-4 flex flex-wrap gap-6">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Rank #{mockUser.ranking}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              <span>{mockUser.followersCount.toLocaleString()} Followers</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-500" />
              <span>Joined {formattedJoinDate}</span>
            </div>
            <div className="flex items-center">
              <Timer className="h-5 w-5 mr-2 text-orange-500" />
              <span>Last active {timeAgo}</span>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{mockUser.totalMatches}</p>
                <p className="text-sm text-muted-foreground">Total Matches</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{mockUser.winRate}%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">₹{mockUser.totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <p className="text-3xl font-bold">{mockUser.level}</p>
                  <Badge className="ml-2" variant="outline">LVL</Badge>
                </div>
                <div className="mt-2">
                  <Progress value={progressPercent} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockUser.experience}/{mockUser.nextLevelExperience} XP
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Player Content Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="matches">Recent Matches</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Game Performance</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Free Fire</span>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">PUBG Mobile</span>
                          <span className="text-sm font-medium">82%</span>
                        </div>
                        <Progress value={82} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">COD Mobile</span>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent Highlights</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Highest kill streak</span>
                        </div>
                        <span className="font-medium">17 kills</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Tournament MVP awards</span>
                        </div>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Average survival time</span>
                        </div>
                        <span className="font-medium">18:45 min</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Player Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Sniper</Badge>
                      <Badge variant="outline">Assault</Badge>
                      <Badge variant="outline">Team Leader</Badge>
                      <Badge variant="outline">Strategist</Badge>
                      <Badge variant="outline">Close Combat</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAchievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getRarityColor(achievement.rarity)} border`}>
                          <Trophy className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-4 text-xs">
                    View All Achievements
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GameController className="h-5 w-5 mr-2" />
                    Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTeams.slice(0, 2).map((team) => (
                      <div key={team.id} className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={team.logoUrl} alt={team.name} />
                          <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">{team.name}</h4>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{team.role}</span>
                            <span>•</span>
                            <span>{team.wins} wins</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-4 text-xs">
                    View All Teams
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockAchievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${getRarityColor(achievement.rarity)} border`}>
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Recent Match History</CardTitle>
                <CardDescription>View your recent competitive matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3">Game</th>
                        <th scope="col" className="px-6 py-3">Result</th>
                        <th scope="col" className="px-6 py-3">Kills</th>
                        <th scope="col" className="px-6 py-3">Placement</th>
                        <th scope="col" className="px-6 py-3">Score</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRecentMatches.map((match) => (
                        <tr key={match.id} className="border-b">
                          <td className="px-6 py-4 font-medium">{match.game}</td>
                          <td className="px-6 py-4">
                            <Badge 
                              variant={match.result === "win" ? "default" : "destructive"}
                              className="uppercase"
                            >
                              {match.result}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">{match.kills}</td>
                          <td className="px-6 py-4">#{match.placement}</td>
                          <td className="px-6 py-4">{match.score.toLocaleString()}</td>
                          <td className="px-6 py-4">{match.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button variant="outline">Load More Matches</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teams">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTeams.map((team) => (
                <Card key={team.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={team.logoUrl} alt={team.name} />
                        <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{team.name}</h3>
                        <Badge variant="outline" className="mt-1">{team.role}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold">{team.memberCount}</p>
                        <p className="text-xs text-muted-foreground">Members</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold">{team.wins}</p>
                        <p className="text-xs text-muted-foreground">Total Wins</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-2">
                      <Button variant="outline" size="sm">View Team</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tournaments">
            <Card>
              <CardHeader>
                <CardTitle>Tournament History</CardTitle>
                <CardDescription>Past tournament performances and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3">Tournament</th>
                        <th scope="col" className="px-6 py-3">Placement</th>
                        <th scope="col" className="px-6 py-3">Prize</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTournaments.map((tournament) => (
                        <tr key={tournament.id} className="border-b">
                          <td className="px-6 py-4 font-medium">{tournament.name}</td>
                          <td className="px-6 py-4">
                            <Badge 
                              variant={tournament.placement === 1 ? "default" : "secondary"}
                            >
                              {tournament.placement === 1 ? "Champion" : `#${tournament.placement}`}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">₹{tournament.prize.toLocaleString()}</td>
                          <td className="px-6 py-4">{tournament.date}</td>
                          <td className="px-6 py-4">
                            <Button variant="outline" size="sm">Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button variant="outline">View All Tournaments</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Social Links */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Social Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {mockUser.socialLinks.twitter && (
                <Button variant="outline" className="h-10">
                  <svg className="h-4 w-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  @{mockUser.socialLinks.twitter}
                </Button>
              )}
              {mockUser.socialLinks.twitch && (
                <Button variant="outline" className="h-10">
                  <svg className="h-4 w-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                  {mockUser.socialLinks.twitch}
                </Button>
              )}
              {mockUser.socialLinks.youtube && (
                <Button variant="outline" className="h-10">
                  <svg className="h-4 w-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  {mockUser.socialLinks.youtube}
                </Button>
              )}
              {mockUser.socialLinks.discord && (
                <Button variant="outline" className="h-10">
                  <svg className="h-4 w-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  {mockUser.socialLinks.discord}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}