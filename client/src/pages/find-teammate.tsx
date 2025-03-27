import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Game } from "@shared/schema";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Filter,
  User as UserIcon,
  Trophy,
  ArrowUpRight,
  Star,
  Calendar,
  Gamepad,
  Clock,
  Heart,
  MessageSquare,
  ThumbsUp,
  UserPlus,
  Shield,
  X,
  CheckCheck,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Extended user type with additional properties
interface UserProfile extends User {
  skillLevel: number;
  winRate: number;
  totalMatches: number;
  kdRatio: number;
  languages: string[];
  playStyle: string;
  availability: string[];
  lookingFor: string;
  bio: string;
  skills: {
    strategy: number;
    communication: number;
    teamwork: number;
    mechanics: number;
    gameKnowledge: number;
  };
  achievements: string[];
  preferredRoles: string[];
  gameStats: {
    gameId: number;
    gameName: string;
    rank: string;
    level: number;
    hoursPlayed: number;
    mainCharacter?: string;
  }[];
  badges: {
    id: number;
    name: string;
    description: string;
    iconUrl: string;
  }[];
}

export default function FindTeammate() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [skillRange, setSkillRange] = useState<number[]>([0, 100]);
  const [onlineOnly, setOnlineOnly] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const { toast } = useToast();

  // Fetch games
  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  // Fetch users - in a real app this would be filtered by the backend
  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Mock data for extended user profiles
  const extendedUsers: UserProfile[] = [
    {
      id: 1,
      username: "ProSniper",
      displayName: "Ghost Sniper",
      email: "ghost@example.com",
      createdAt: new Date("2023-01-15"),
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Professional esports player with 5+ years of competitive experience. Looking for serious teammates for tournament play.",
      walletBalance: 1250,
      isVerified: true,
      skillLevel: 95,
      winRate: 78,
      totalMatches: 1548,
      kdRatio: 3.2,
      languages: ["English", "Spanish"],
      playStyle: "Aggressive",
      availability: ["Weekends", "Evenings"],
      lookingFor: "Competitive Team",
      skills: {
        strategy: 90,
        communication: 85,
        teamwork: 80,
        mechanics: 95,
        gameKnowledge: 92,
      },
      achievements: ["Regional Champion 2023", "50+ Tournament Wins", "MVP Award x3"],
      preferredRoles: ["Sniper", "Entry Fragger"],
      gameStats: [
        {
          gameId: 1,
          gameName: "Free Fire",
          rank: "Heroic",
          level: 75,
          hoursPlayed: 2500,
        },
        {
          gameId: 2,
          gameName: "PUBG Mobile",
          rank: "Ace",
          level: 80,
          hoursPlayed: 1800,
        }
      ],
      badges: [
        {
          id: 1,
          name: "Tournament Champion",
          description: "Won a major tournament",
          iconUrl: "🏆",
        },
        {
          id: 2,
          name: "Veteran",
          description: "Been playing for over 3 years",
          iconUrl: "⭐",
        }
      ]
    },
    {
      id: 2,
      username: "TacticalQueen",
      displayName: "Tactical Queen",
      email: "tactical@example.com",
      createdAt: new Date("2023-02-20"),
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Strategic player specializing in team coordination and macro play. Looking for skilled teammates who communicate well.",
      walletBalance: 820,
      isVerified: true,
      skillLevel: 88,
      winRate: 72,
      totalMatches: 1245,
      kdRatio: 2.7,
      languages: ["English", "French"],
      playStyle: "Strategic",
      availability: ["Weekday Evenings", "Late Nights"],
      lookingFor: "Long-term Team",
      skills: {
        strategy: 96,
        communication: 92,
        teamwork: 90,
        mechanics: 82,
        gameKnowledge: 94,
      },
      achievements: ["Tactical Player Award", "Top 100 Leaderboard"],
      preferredRoles: ["In-Game Leader", "Support"],
      gameStats: [
        {
          gameId: 1,
          gameName: "Free Fire",
          rank: "Heroic",
          level: 68,
          hoursPlayed: 1850,
        }
      ],
      badges: [
        {
          id: 3,
          name: "Strategist",
          description: "Known for exceptional strategic gameplay",
          iconUrl: "🧠",
        }
      ]
    },
    {
      id: 3,
      username: "RapidShot",
      displayName: "Rapid Shot",
      email: "rapid@example.com",
      createdAt: new Date("2022-11-10"),
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      bio: "Fast-paced aggressive player looking for duo partner. I have great mechanical skills and quick reflexes.",
      walletBalance: 540,
      isVerified: false,
      skillLevel: 82,
      winRate: 65,
      totalMatches: 987,
      kdRatio: 3.5,
      languages: ["English"],
      playStyle: "Rush",
      availability: ["24/7"],
      lookingFor: "Duo Partner",
      skills: {
        strategy: 70,
        communication: 75,
        teamwork: 65,
        mechanics: 92,
        gameKnowledge: 78,
      },
      achievements: ["Fastest Kill Record", "Clutch King"],
      preferredRoles: ["Entry Fragger", "Flanker"],
      gameStats: [
        {
          gameId: 2,
          gameName: "PUBG Mobile",
          rank: "Crown",
          level: 62,
          hoursPlayed: 1200,
        }
      ],
      badges: [
        {
          id: 4,
          name: "Speedster",
          description: "Known for lightning-fast reflexes",
          iconUrl: "⚡",
        }
      ]
    },
    {
      id: 4,
      username: "SupportMaster",
      displayName: "Support Master",
      email: "support@example.com",
      createdAt: new Date("2023-03-05"),
      avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
      bio: "Support specialist with excellent communication. I prioritize team play and coordination. Looking for competitive squad.",
      walletBalance: 1050,
      isVerified: true,
      skillLevel: 85,
      winRate: 70,
      totalMatches: 1120,
      kdRatio: 2.1,
      languages: ["English", "Hindi", "Tamil"],
      playStyle: "Support",
      availability: ["Evenings", "Weekends"],
      lookingFor: "Competitive Squad",
      skills: {
        strategy: 88,
        communication: 95,
        teamwork: 96,
        mechanics: 78,
        gameKnowledge: 90,
      },
      achievements: ["Best Support Player Award", "Shot Caller"],
      preferredRoles: ["Support", "Healer"],
      gameStats: [
        {
          gameId: 1,
          gameName: "Free Fire",
          rank: "Platinum",
          level: 65,
          hoursPlayed: 1420,
        },
        {
          gameId: 3,
          gameName: "Fortnite",
          rank: "Diamond",
          level: 70,
          hoursPlayed: 950,
        }
      ],
      badges: [
        {
          id: 5,
          name: "Team Player",
          description: "Exceptional teamwork skills",
          iconUrl: "🤝",
        }
      ]
    },
    {
      id: 5,
      username: "SniperElite",
      displayName: "Sniper Elite",
      email: "sniper@example.com",
      createdAt: new Date("2022-09-15"),
      avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
      bio: "Long-range specialist with precision aiming. Looking for a team that needs a dedicated sniper. Always hitting headshots!",
      walletBalance: 780,
      isVerified: true,
      skillLevel: 90,
      winRate: 68,
      totalMatches: 1350,
      kdRatio: 4.2,
      languages: ["English", "Portuguese"],
      playStyle: "Tactical",
      availability: ["Afternoons", "Late Nights"],
      lookingFor: "Pro Team",
      skills: {
        strategy: 82,
        communication: 78,
        teamwork: 75,
        mechanics: 94,
        gameKnowledge: 86,
      },
      achievements: ["Headshot King", "1000+ Sniper Kills"],
      preferredRoles: ["Sniper", "Marksman"],
      gameStats: [
        {
          gameId: 2,
          gameName: "PUBG Mobile",
          rank: "Ace Master",
          level: 75,
          hoursPlayed: 2200,
        }
      ],
      badges: [
        {
          id: 6,
          name: "Sharpshooter",
          description: "Exceptional accuracy with long-range weapons",
          iconUrl: "🎯",
        }
      ]
    }
  ];

  // Merge with fetched users
  const mergedUsers = extendedUsers.map(extendedUser => {
    const matchingUser = users?.find(user => user.id === extendedUser.id);
    return { ...extendedUser, ...(matchingUser || {}) };
  });

  // Filter users based on search and filters
  const filteredUsers = mergedUsers.filter(user => {
    // Filter by search query
    if (searchQuery && 
        !user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by game
    if (selectedGame !== "all" && !user.gameStats.some(stat => stat.gameId.toString() === selectedGame)) {
      return false;
    }
    
    // Filter by role
    if (selectedRole !== "all" && !user.preferredRoles.some(role => role.toLowerCase() === selectedRole.toLowerCase())) {
      return false;
    }
    
    // Filter by skill range
    if (user.skillLevel < skillRange[0] || user.skillLevel > skillRange[1]) {
      return false;
    }
    
    // Filter online only
    if (onlineOnly && Math.random() < 0.5) { // Mock online status
      return false;
    }
    
    return true;
  });

  // Handle send invite
  const handleSendInvite = (userId: number) => {
    if (sentRequests.includes(userId)) {
      toast({
        title: "Request Already Sent",
        description: "You've already sent a team request to this player.",
        variant: "default",
      });
      return;
    }
    
    setSentRequests([...sentRequests, userId]);
    toast({
      title: "Team Request Sent!",
      description: "Your request has been sent successfully.",
      variant: "default",
    });
  };

  // Handle message user
  const handleMessageUser = (userId: number) => {
    toast({
      title: "Chat Started",
      description: "A new chat has been initiated with this player.",
      variant: "default",
    });
  };

  // View user profile
  const viewUserProfile = (user: UserProfile) => {
    setSelectedUser(user);
  };

  // Get game name by ID
  const getGameName = (gameId: number) => {
    const game = games?.find(g => g.id === gameId);
    return game?.name || "Unknown Game";
  };

  // Calculate skill rating text
  const getSkillRating = (level: number) => {
    if (level >= 90) return "Elite";
    if (level >= 80) return "Expert";
    if (level >= 70) return "Veteran";
    if (level >= 60) return "Advanced";
    if (level >= 50) return "Intermediate";
    return "Beginner";
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-rajdhani text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-green to-primary">FIND TEAMMATES</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mt-2">
              Connect with players who match your skill level, play style, and goals. Build your dream team or find the perfect duo partner.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button className="bg-accent-green hover:bg-accent-green/90 text-white">
              <UserPlus className="mr-2 h-4 w-4" /> Create Looking-For-Team Post
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <Card className="bg-secondary-bg border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-grow min-w-[240px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search by username or display name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Select value={selectedGame} onValueChange={setSelectedGame}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 w-[180px]">
                    <SelectValue placeholder="Select Game" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Games</SelectItem>
                    {games?.map(game => (
                      <SelectItem key={game.id} value={game.id.toString()}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 w-[180px]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Sniper">Sniper</SelectItem>
                    <SelectItem value="Entry Fragger">Entry Fragger</SelectItem>
                    <SelectItem value="In-Game Leader">In-Game Leader</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Flanker">Flanker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="online-only" className="text-gray-300">Online Only</Label>
                <Switch
                  id="online-only"
                  checked={onlineOnly}
                  onCheckedChange={setOnlineOnly}
                />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <label className="text-sm text-gray-400 block mb-2">Skill Level</label>
              <div className="px-2">
                <Slider
                  value={skillRange}
                  onValueChange={setSkillRange}
                  min={0}
                  max={100}
                  step={5}
                  className="my-5"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Expert</span>
                <span>Elite</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* View Options */}
        <Tabs defaultValue="grid" className="mb-6">
          <TabsList className="bg-secondary-bg border border-gray-800 p-1">
            <TabsTrigger 
              value="grid" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Grid View
            </TabsTrigger>
            <TabsTrigger 
              value="detailed" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Detailed View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map(user => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gradient-to-b from-gray-900/50 to-black/70 border border-gray-800 overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="p-0">
                      {/* User header with avatar */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                        <div className="h-32 bg-gradient-to-r from-primary/20 to-accent-green/20"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-4 z-20 flex items-end">
                          <div className="mr-3">
                            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                              <img
                                src={user.avatarUrl || "https://via.placeholder.com/100"}
                                alt={user.displayName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex items-center">
                              <h3 className="text-white font-bold text-lg mr-2">{user.displayName}</h3>
                              {user.isVerified && (
                                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                                  <CheckCheck className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                              )}
                            </div>
                            <div className="text-gray-400 text-sm">@{user.username}</div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${Math.random() > 0.5 ? 'bg-accent-green' : 'bg-gray-600'} mr-1`}></div>
                            <span className="text-xs text-gray-400">{Math.random() > 0.5 ? 'Online' : 'Offline'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* User stats */}
                      <div className="p-4 pt-2">
                        <div className="my-3 flex flex-wrap justify-between">
                          <div className="text-center px-2 mb-2">
                            <div className="text-accent-yellow font-semibold">{user.winRate}%</div>
                            <div className="text-xs text-gray-500">Win Rate</div>
                          </div>
                          <div className="text-center px-2 mb-2">
                            <div className="text-accent-green font-semibold">{user.kdRatio}</div>
                            <div className="text-xs text-gray-500">K/D Ratio</div>
                          </div>
                          <div className="text-center px-2 mb-2">
                            <div className="text-accent-blue font-semibold">{user.totalMatches}</div>
                            <div className="text-xs text-gray-500">Matches</div>
                          </div>
                          <div className="text-center px-2 mb-2">
                            <div className="text-primary font-semibold">{getSkillRating(user.skillLevel)}</div>
                            <div className="text-xs text-gray-500">Skill</div>
                          </div>
                        </div>
                        
                        {/* Games */}
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">Games:</div>
                          <div className="flex flex-wrap gap-1">
                            {user.gameStats.map(stat => (
                              <Badge key={stat.gameId} variant="outline" className="bg-gray-800/50 text-white border-gray-700">
                                <Gamepad className="h-3 w-3 mr-1" />
                                {stat.gameName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Roles */}
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">Roles:</div>
                          <div className="flex flex-wrap gap-1">
                            {user.preferredRoles.map((role, idx) => (
                              <Badge key={idx} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Looking for */}
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 mb-1">Looking for:</div>
                          <div className="text-white text-sm">{user.lookingFor}</div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex justify-between mt-2 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-gray-700 hover:bg-gray-800"
                            onClick={() => viewUserProfile(user)}
                          >
                            <UserIcon className="h-4 w-4 mr-1" /> Profile
                          </Button>
                          <Button
                            variant={sentRequests.includes(user.id) ? "outline" : "default"}
                            size="sm"
                            className={`flex-1 ${sentRequests.includes(user.id) ? 'border-accent-green text-accent-green' : 'bg-accent-green hover:bg-accent-green/90'}`}
                            onClick={() => handleSendInvite(user.id)}
                            disabled={sentRequests.includes(user.id)}
                          >
                            {sentRequests.includes(user.id) ? (
                              <>
                                <CheckCheck className="h-4 w-4 mr-1" /> Sent
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-1" /> Invite
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-6">
            <div className="space-y-4">
              {filteredUsers.map(user => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gradient-to-r from-gray-900/50 to-black/70 border border-gray-800 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* User avatar and basic info */}
                        <div className="w-full md:w-60 bg-gradient-to-b from-primary/20 to-black/40 p-5 flex flex-col items-center justify-center text-center">
                          <div className="mb-3 relative">
                            <div className="w-24 h-24 rounded-full border-2 border-white overflow-hidden">
                              <img
                                src={user.avatarUrl || "https://via.placeholder.com/100"}
                                alt={user.displayName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${Math.random() > 0.5 ? 'bg-accent-green' : 'bg-gray-600'} border border-black`}></div>
                          </div>
                          
                          <h3 className="text-white font-bold text-xl mb-1">{user.displayName}</h3>
                          <div className="text-gray-400 text-sm mb-3">@{user.username}</div>
                          
                          {/* Verificaton and membership badge */}
                          <div className="flex flex-col gap-2">
                            {user.isVerified && (
                              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                                <Shield className="h-3 w-3 mr-1" /> Verified Player
                              </Badge>
                            )}
                            <Badge variant="outline" className="bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30">
                              <Star className="h-3 w-3 mr-1" /> Pro Member
                            </Badge>
                          </div>
                          
                          <div className="mt-4 text-sm">
                            <div className="text-gray-400">Member since</div>
                            <div className="text-white">{user.createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</div>
                          </div>
                        </div>
                        
                        {/* User details */}
                        <div className="flex-grow p-5">
                          <div className="flex flex-wrap justify-between items-start mb-4">
                            <div>
                              <h3 className="text-white font-bold text-xl flex items-center">
                                Player Profile
                                {user.isVerified && <CheckCheck className="ml-2 h-4 w-4 text-primary" />}
                              </h3>
                              <p className="text-gray-400 mt-1 line-clamp-2">{user.bio}</p>
                            </div>
                            
                            <div className="flex mt-2 md:mt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2 border-gray-700 hover:bg-gray-800"
                                onClick={() => handleMessageUser(user.id)}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" /> Message
                              </Button>
                              <Button
                                variant={sentRequests.includes(user.id) ? "outline" : "default"}
                                size="sm"
                                className={sentRequests.includes(user.id) ? 'border-accent-green text-accent-green' : 'bg-accent-green hover:bg-accent-green/90'}
                                onClick={() => handleSendInvite(user.id)}
                                disabled={sentRequests.includes(user.id)}
                              >
                                {sentRequests.includes(user.id) ? (
                                  <>
                                    <CheckCheck className="h-4 w-4 mr-1" /> Request Sent
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="h-4 w-4 mr-1" /> Invite to Team
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          {/* User stats grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                              <div className="text-accent-yellow font-bold text-xl">{user.winRate}%</div>
                              <div className="text-xs text-gray-400">Win Rate</div>
                            </div>
                            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                              <div className="text-accent-green font-bold text-xl">{user.kdRatio}</div>
                              <div className="text-xs text-gray-400">K/D Ratio</div>
                            </div>
                            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                              <div className="text-accent-blue font-bold text-xl">{user.totalMatches}</div>
                              <div className="text-xs text-gray-400">Total Matches</div>
                            </div>
                            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                              <div className="text-white font-bold text-xl">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-blue">
                                  {getSkillRating(user.skillLevel)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400">Skill Rating</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row gap-5">
                            <div className="flex-1">
                              {/* Games */}
                              <div className="mb-4">
                                <h4 className="text-white font-medium mb-2 flex items-center">
                                  <Gamepad className="h-4 w-4 mr-2 text-primary" /> Games & Stats
                                </h4>
                                <div className="space-y-2">
                                  {user.gameStats.map(stat => (
                                    <div key={stat.gameId} className="bg-gray-800/20 rounded-lg p-3 border border-gray-800">
                                      <div className="flex justify-between items-center">
                                        <div className="font-medium text-white">{stat.gameName}</div>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/10">
                                          {stat.rank}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-xs text-gray-400">Level: <span className="text-gray-300">{stat.level}</span></div>
                                        <div className="text-xs text-gray-400">Hours: <span className="text-gray-300">{stat.hoursPlayed}</span></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Achievements */}
                              <div className="mb-4">
                                <h4 className="text-white font-medium mb-2 flex items-center">
                                  <Trophy className="h-4 w-4 mr-2 text-accent-yellow" /> Achievements
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {user.achievements.map((achievement, idx) => (
                                    <Badge key={idx} className="bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30">
                                      {achievement}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              {/* Playstyle and preferences */}
                              <div className="mb-4">
                                <h4 className="text-white font-medium mb-2 flex items-center">
                                  <Target className="h-4 w-4 mr-2 text-accent-green" /> Play Style & Preferences
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-gray-800/20 p-2 rounded-lg">
                                    <div className="text-xs text-gray-400">Play Style</div>
                                    <div className="text-sm text-white">{user.playStyle}</div>
                                  </div>
                                  <div className="bg-gray-800/20 p-2 rounded-lg">
                                    <div className="text-xs text-gray-400">Looking For</div>
                                    <div className="text-sm text-white">{user.lookingFor}</div>
                                  </div>
                                  <div className="bg-gray-800/20 p-2 rounded-lg">
                                    <div className="text-xs text-gray-400">Roles</div>
                                    <div className="text-sm text-white">{user.preferredRoles.join(", ")}</div>
                                  </div>
                                  <div className="bg-gray-800/20 p-2 rounded-lg">
                                    <div className="text-xs text-gray-400">Languages</div>
                                    <div className="text-sm text-white">{user.languages.join(", ")}</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Availability */}
                              <div className="mb-4">
                                <h4 className="text-white font-medium mb-2 flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-accent-blue" /> Availability
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {user.availability.map((time, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700">
                                      {time}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Skill ratings */}
                              <div>
                                <h4 className="text-white font-medium mb-2 flex items-center">
                                  <Star className="h-4 w-4 mr-2 text-accent-yellow" /> Skill Ratings
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(user.skills).map(([skill, rating]) => (
                                    <div key={skill} className="flex items-center">
                                      <div className="w-24 text-xs text-gray-400 capitalize">{skill}</div>
                                      <div className="flex-grow h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-primary"
                                          style={{ width: `${rating}%` }}
                                        ></div>
                                      </div>
                                      <div className="w-8 text-xs text-right text-gray-300">{rating}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* User Profile Dialog */}
      {selectedUser && (
        <Dialog defaultOpen={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                Player Profile
                <Badge className="ml-2" variant="outline">
                  <Star className="h-3 w-3 mr-1 text-accent-yellow" />
                  {getSkillRating(selectedUser.skillLevel)}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                View detailed player statistics and information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-2 border-white overflow-hidden mb-4">
                  <img
                    src={selectedUser.avatarUrl || "https://via.placeholder.com/100"}
                    alt={selectedUser.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-white font-bold text-xl mb-1">{selectedUser.displayName}</h3>
                <div className="text-gray-400 text-sm mb-3">@{selectedUser.username}</div>
                
                <div className="flex flex-col gap-2 w-full">
                  {selectedUser.isVerified && (
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 w-full justify-center">
                      <Shield className="h-3 w-3 mr-1" /> Verified Player
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30 w-full justify-center">
                    <Star className="h-3 w-3 mr-1" /> Pro Member
                  </Badge>
                </div>
                
                <div className="mt-4 w-full">
                  <h4 className="text-sm font-medium text-white mb-2">Badges</h4>
                  <div className="space-y-2">
                    {selectedUser.badges.map(badge => (
                      <div key={badge.id} className="flex items-center bg-gray-800/40 p-2 rounded-lg">
                        <div className="text-lg mr-2">{badge.iconUrl}</div>
                        <div>
                          <div className="text-white text-sm font-medium">{badge.name}</div>
                          <div className="text-gray-400 text-xs">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Bio</h4>
                  <p className="text-gray-300 bg-gray-800/40 p-3 rounded-lg">{selectedUser.bio}</p>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-gray-800/30 rounded-lg p-2 text-center">
                    <div className="text-accent-yellow font-bold text-xl">{selectedUser.winRate}%</div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-2 text-center">
                    <div className="text-accent-green font-bold text-xl">{selectedUser.kdRatio}</div>
                    <div className="text-xs text-gray-400">K/D Ratio</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-2 text-center">
                    <div className="text-accent-blue font-bold text-xl">{selectedUser.totalMatches}</div>
                    <div className="text-xs text-gray-400">Total Matches</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-2 text-center">
                    <div className="text-primary font-bold text-xl">{selectedUser.skillLevel}</div>
                    <div className="text-xs text-gray-400">Skill Rating</div>
                  </div>
                </div>
                
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-4">
                    {/* Games */}
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <Gamepad className="h-4 w-4 mr-2 text-primary" /> Games & Stats
                      </h4>
                      <div className="space-y-2">
                        {selectedUser.gameStats.map(stat => (
                          <div key={stat.gameId} className="bg-gray-800/20 rounded-lg p-3 border border-gray-800">
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-white">{stat.gameName}</div>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/10">
                                {stat.rank}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="text-xs text-gray-400">Level: <span className="text-gray-300">{stat.level}</span></div>
                              <div className="text-xs text-gray-400">Hours: <span className="text-gray-300">{stat.hoursPlayed}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Achievements */}
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <Trophy className="h-4 w-4 mr-2 text-accent-yellow" /> Achievements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.achievements.map((achievement, idx) => (
                          <Badge key={idx} className="bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Looking for */}
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <Search className="h-4 w-4 mr-2 text-accent-blue" /> Looking For
                      </h4>
                      <div className="bg-gray-800/20 p-3 rounded-lg">
                        <p className="text-gray-300">{selectedUser.lookingFor}</p>
                      </div>
                    </div>
                    
                    {/* Skill ratings */}
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <Star className="h-4 w-4 mr-2 text-accent-yellow" /> Skill Ratings
                      </h4>
                      <div className="bg-gray-800/20 p-3 rounded-lg">
                        <div className="space-y-3">
                          {Object.entries(selectedUser.skills).map(([skill, rating]) => (
                            <div key={skill}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300 capitalize">{skill}</span>
                                <span className="text-gray-400">{rating}/100</span>
                              </div>
                              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    rating >= 90 ? 'bg-accent-green' :
                                    rating >= 70 ? 'bg-accent-yellow' :
                                    rating >= 50 ? 'bg-primary' :
                                    'bg-gray-600'
                                  }`}
                                  style={{ width: `${rating}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-gray-800"
                onClick={() => handleMessageUser(selectedUser.id)}
              >
                <MessageSquare className="h-4 w-4 mr-2" /> Message Player
              </Button>
              <div>
                <Button
                  variant="outline"
                  className="mr-2 border-gray-700 hover:bg-gray-800"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </Button>
                <Button
                  variant={sentRequests.includes(selectedUser.id) ? "outline" : "default"}
                  className={sentRequests.includes(selectedUser.id) ? 'border-accent-green text-accent-green' : 'bg-accent-green hover:bg-accent-green/90'}
                  onClick={() => handleSendInvite(selectedUser.id)}
                  disabled={sentRequests.includes(selectedUser.id)}
                >
                  {sentRequests.includes(selectedUser.id) ? (
                    <>
                      <CheckCheck className="h-4 w-4 mr-2" /> Team Request Sent
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" /> Invite to Team
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}