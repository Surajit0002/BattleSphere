import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Team, Tournament, Game } from "@shared/schema";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  Search,
  Filter,
  Trophy,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  UserPlus,
  Info,
  AlertCircle,
  ExternalLink,
  Check,
  X,
  ChevronDown,
  MessageSquare,
  UserCheck,
  Shield,
  Eye,
  Star,
  Zap,
  Crown,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced team interface with additional fields
interface EnhancedTeam extends Team {
  upcomingTournaments: number;
  openPositions: string[];
  requirements: string[];
  applicationRequired: boolean;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  winRate: number;
  matchHistory: {
    wins: number;
    losses: number;
    draws: number;
  };
  recentAchievements: string[];
  gameId: number;
  gameName: string;
  primaryGame: string;
  currentlyRecruiting: boolean;
  preferredPlayTimes: string[];
  timezone: string;
  socialLinks: {
    discord?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  membersPics: string[]; // URLs of member avatars
}

export default function JoinTeam() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState("all");
  const [openPositionsOnly, setOpenPositionsOnly] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState<EnhancedTeam | null>(null);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    experience: "",
    availability: "",
    goals: "",
    preferredRole: "",
    links: "",
    message: ""
  });
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch games
  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  // Fetch teams - in a real app, this would be paginated and filtered by the backend
  const { data: teamsData } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Mock enhanced teams data
  const enhancedTeams: EnhancedTeam[] = [
    {
      id: 1,
      name: "Inferno Squad",
      description: "Professional esports team focused on competitive gameplay and tournament victories. We have a proven track record of success in multiple major tournaments.",
      logoUrl: "https://i.imgur.com/JyAzM6h.png",
      badge: "Elite",
      createdAt: new Date("2022-11-15"),
      captainId: 1,
      wins: 78,
      totalEarnings: 12500,
      memberCount: 5,
      upcomingTournaments: 3,
      openPositions: ["Entry Fragger", "Support"],
      requirements: ["Minimum 2 years competitive experience", "At least Diamond rank", "Active 5 days/week"],
      applicationRequired: true,
      skillLevel: "professional",
      winRate: 76,
      matchHistory: {
        wins: 78,
        losses: 25,
        draws: 3
      },
      recentAchievements: ["Regional Champions 2023", "Semifinalists World Tour"],
      gameId: 1,
      gameName: "Free Fire",
      primaryGame: "Free Fire",
      currentlyRecruiting: true,
      preferredPlayTimes: ["Evenings", "Weekends"],
      timezone: "IST",
      socialLinks: {
        discord: "https://discord.gg/infernosquad",
        twitter: "https://twitter.com/infernosquad",
        instagram: "https://instagram.com/infernosquad",
        youtube: "https://youtube.com/infernosquad"
      },
      membersPics: [
        "https://randomuser.me/api/portraits/men/32.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/22.jpg",
        "https://randomuser.me/api/portraits/women/28.jpg",
        "https://randomuser.me/api/portraits/men/42.jpg"
      ]
    },
    {
      id: 2,
      name: "Phantom Flux",
      description: "Semi-professional team looking for dedicated players to grow together. We focus on strategic gameplay and team coordination.",
      logoUrl: "https://i.imgur.com/DwYpM3E.png",
      badge: "Rising Star",
      createdAt: new Date("2023-01-10"),
      captainId: 2,
      wins: 45,
      totalEarnings: 5800,
      memberCount: 4,
      upcomingTournaments: 2,
      openPositions: ["Sniper", "In-Game Leader"],
      requirements: ["At least Platinum rank", "Good communication skills", "Team player"],
      applicationRequired: true,
      skillLevel: "advanced",
      winRate: 65,
      matchHistory: {
        wins: 45,
        losses: 24,
        draws: 1
      },
      recentAchievements: ["Quarterfinals Regional Cup", "Top 8 National Championship"],
      gameId: 2,
      gameName: "PUBG Mobile",
      primaryGame: "PUBG Mobile",
      currentlyRecruiting: true,
      preferredPlayTimes: ["Late Nights", "Early Mornings"],
      timezone: "EST",
      socialLinks: {
        discord: "https://discord.gg/phantomflux",
        twitter: "https://twitter.com/phantomflux"
      },
      membersPics: [
        "https://randomuser.me/api/portraits/men/53.jpg",
        "https://randomuser.me/api/portraits/women/62.jpg",
        "https://randomuser.me/api/portraits/men/17.jpg",
        "https://randomuser.me/api/portraits/women/9.jpg"
      ]
    },
    {
      id: 3,
      name: "Nexus Legends",
      description: "Casual team with competitive ambitions. We value skill development and consistent practice schedules. Looking for players who want to grow together.",
      logoUrl: "https://i.imgur.com/T0YyvNM.png",
      badge: "Contender",
      createdAt: new Date("2023-03-05"),
      captainId: 3,
      wins: 28,
      totalEarnings: 2200,
      memberCount: 3,
      upcomingTournaments: 1,
      openPositions: ["Support", "Fragger", "Flex Player"],
      requirements: ["Gold rank or higher", "Available for practice 3 times/week", "Positive attitude"],
      applicationRequired: false,
      skillLevel: "intermediate",
      winRate: 58,
      matchHistory: {
        wins: 28,
        losses: 20,
        draws: 4
      },
      recentAchievements: ["Top 16 Regional Tournament", "Community Cup Winners"],
      gameId: 1,
      gameName: "Free Fire",
      primaryGame: "Free Fire",
      currentlyRecruiting: true,
      preferredPlayTimes: ["Weekends", "Friday Nights"],
      timezone: "PST",
      socialLinks: {
        discord: "https://discord.gg/nexuslegends",
        instagram: "https://instagram.com/nexuslegends"
      },
      membersPics: [
        "https://randomuser.me/api/portraits/men/47.jpg",
        "https://randomuser.me/api/portraits/women/31.jpg",
        "https://randomuser.me/api/portraits/men/19.jpg"
      ]
    },
    {
      id: 4,
      name: "Velocity Vipers",
      description: "Fast-paced aggressive team looking for skilled players to dominate the competitive scene. We prioritize mechanical skills and quick decision making.",
      logoUrl: "https://i.imgur.com/ZwLMfyQ.png",
      badge: "Elite",
      createdAt: new Date("2022-09-22"),
      captainId: 4,
      wins: 62,
      totalEarnings: 9300,
      memberCount: 5,
      upcomingTournaments: 4,
      openPositions: [],
      requirements: ["Minimum Diamond rank", "Aggressive playstyle", "Previous tournament experience"],
      applicationRequired: true,
      skillLevel: "professional",
      winRate: 71,
      matchHistory: {
        wins: 62,
        losses: 25,
        draws: 0
      },
      recentAchievements: ["National Champions 2023", "Invitational Cup Winners"],
      gameId: 3,
      gameName: "Fortnite",
      primaryGame: "Fortnite",
      currentlyRecruiting: false,
      preferredPlayTimes: ["Daily Evenings", "Late Nights"],
      timezone: "GMT",
      socialLinks: {
        discord: "https://discord.gg/velocityvipers",
        twitter: "https://twitter.com/velocityvipers",
        youtube: "https://youtube.com/velocityvipers"
      },
      membersPics: [
        "https://randomuser.me/api/portraits/men/75.jpg",
        "https://randomuser.me/api/portraits/women/54.jpg",
        "https://randomuser.me/api/portraits/men/26.jpg",
        "https://randomuser.me/api/portraits/women/36.jpg",
        "https://randomuser.me/api/portraits/men/82.jpg"
      ]
    },
    {
      id: 5,
      name: "Titan Gaming",
      description: "Professional organization with multiple competitive teams. We have a structured training program and coaching staff to help players reach their potential.",
      logoUrl: "https://i.imgur.com/EhuhYVN.png",
      badge: "Premium",
      createdAt: new Date("2022-05-14"),
      captainId: 5,
      wins: 93,
      totalEarnings: 27500,
      memberCount: 5,
      upcomingTournaments: 5,
      openPositions: ["Sniper", "Tactician"],
      requirements: ["Minimum Master rank", "Tournament experience required", "Full-time commitment"],
      applicationRequired: true,
      skillLevel: "professional",
      winRate: 82,
      matchHistory: {
        wins: 93,
        losses: 20,
        draws: 2
      },
      recentAchievements: ["International Champions 2023", "3x National Title Winners"],
      gameId: 2,
      gameName: "PUBG Mobile",
      primaryGame: "PUBG Mobile",
      currentlyRecruiting: true,
      preferredPlayTimes: ["Full-time schedule", "Professional hours"],
      timezone: "Global team",
      socialLinks: {
        discord: "https://discord.gg/titangaming",
        twitter: "https://twitter.com/titangaming",
        instagram: "https://instagram.com/titangaming",
        youtube: "https://youtube.com/titangaming"
      },
      membersPics: [
        "https://randomuser.me/api/portraits/men/92.jpg",
        "https://randomuser.me/api/portraits/women/74.jpg",
        "https://randomuser.me/api/portraits/men/36.jpg",
        "https://randomuser.me/api/portraits/women/48.jpg",
        "https://randomuser.me/api/portraits/men/52.jpg"
      ]
    }
  ];

  // Filtered teams based on search term, game filter, and open positions filter
  const filteredTeams = enhancedTeams.filter(team => {
    // Filter by search term
    if (searchTerm && !team.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !(team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filter by game
    if (selectedGame !== "all" && team.gameId.toString() !== selectedGame) {
      return false;
    }
    
    // Filter by recruitment status
    if (openPositionsOnly && !team.currentlyRecruiting) {
      return false;
    }
    
    // Filter by skill level tab
    if (activeTab !== "all" && team.skillLevel !== activeTab) {
      return false;
    }
    
    return true;
  });

  const handleApplyToTeam = (team: EnhancedTeam) => {
    setSelectedTeam(team);
    if (team.applicationRequired) {
      setApplicationDialogOpen(true);
    } else {
      toast({
        title: "Join Request Sent!",
        description: `Your request to join ${team.name} has been sent successfully.`,
        variant: "default",
      });
    }
  };

  const handleSubmitApplication = () => {
    setApplicationDialogOpen(false);
    if (selectedTeam) {
      toast({
        title: "Application Submitted!",
        description: `Your application to join ${selectedTeam.name} has been submitted successfully.`,
        variant: "default",
      });
    }
  };

  const getSkillLevelBadge = (level: string) => {
    switch (level) {
      case "beginner":
        return <Badge className="bg-blue-500">Beginner</Badge>;
      case "intermediate":
        return <Badge className="bg-green-500">Intermediate</Badge>;
      case "advanced":
        return <Badge className="bg-amber-500">Advanced</Badge>;
      case "professional":
        return <Badge className="bg-primary">Professional</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 75) return "text-accent-green";
    if (winRate >= 60) return "text-accent-yellow";
    if (winRate >= 45) return "text-accent-blue";
    return "text-accent-red";
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-blue">JOIN A TEAM</span>
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Browse and apply to join teams that match your play style, skill level, and goals. Connect with like-minded players and compete together in tournaments.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/80 text-white"
              onClick={() => setLocation("/find-teammate")}
            >
              <Users className="mr-2 h-4 w-4" /> Find Players
            </Button>
            <Button
              className="bg-accent-green hover:bg-accent-green/90 text-white"
              onClick={() => setLocation("/teams/create")}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Create New Team
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="bg-secondary-bg border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-grow min-w-[240px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search by team name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="open-positions"
                  checked={openPositionsOnly}
                  onCheckedChange={(checked) => setOpenPositionsOnly(!!checked)}
                />
                <Label htmlFor="open-positions" className="text-gray-300">
                  Teams with open positions only
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Skill Level Tabs */}
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="bg-secondary-bg border border-gray-800 p-1">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              All Teams
            </TabsTrigger>
            <TabsTrigger 
              value="beginner" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Beginner
            </TabsTrigger>
            <TabsTrigger 
              value="intermediate" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Intermediate
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              Advanced
            </TabsTrigger>
            <TabsTrigger 
              value="professional" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Professional
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Team Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeams.map(team => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Team Logo and Basic Info */}
                  <div className="md:col-span-1 bg-gradient-to-b from-gray-800/50 to-black/50 p-5 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-3">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center">
                        {team.logoUrl ? (
                          <img 
                            src={team.logoUrl} 
                            alt={team.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-3xl font-bold text-primary">
                            {team.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {team.badge && (
                        <Badge className="absolute -top-2 -right-2 bg-accent-yellow text-black">
                          {team.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-white font-bold text-xl mb-1">{team.name}</h3>
                    
                    <div className="mb-3 flex justify-center">
                      {getSkillLevelBadge(team.skillLevel)}
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-4">{team.primaryGame}</div>
                    
                    <div className="flex mt-2 space-x-2">
                      <TooltipProvider>
                        {Object.entries(team.socialLinks).map(([platform, url], idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(url, '_blank');
                                }}
                              >
                                {platform === 'discord' && <i className="ri-discord-fill"></i>}
                                {platform === 'twitter' && <i className="ri-twitter-fill"></i>}
                                {platform === 'instagram' && <i className="ri-instagram-fill"></i>}
                                {platform === 'youtube' && <i className="ri-youtube-fill"></i>}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{platform.charAt(0).toUpperCase() + platform.slice(1)}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                    
                    <div className="mt-4 flex space-x-1">
                      {team.membersPics.slice(0, 5).map((pic, idx) => (
                        <Avatar key={idx} className="w-8 h-8 border border-gray-800">
                          <AvatarImage src={pic} />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                      ))}
                      {team.memberCount > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                          +{team.memberCount - 5}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Team Details and Stats */}
                  <div className="md:col-span-2 p-5">
                    <div className="flex flex-wrap justify-between items-center mb-3">
                      <div className="flex items-center">
                        <Trophy className="text-accent-yellow h-5 w-5 mr-2" />
                        <span className="text-white font-medium">
                          {team.wins} Wins
                        </span>
                        <span className="mx-2 text-gray-600">•</span>
                        <span className={`font-medium ${getWinRateColor(team.winRate)}`}>
                          {team.winRate}% Win Rate
                        </span>
                      </div>
                      
                      <div className="text-gray-400 text-sm">
                        Est. {team.createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4 line-clamp-2">{team.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-800/20 p-3 rounded-lg border border-gray-800/50">
                        <h4 className="text-sm font-medium text-gray-300 flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          Upcoming Tournaments
                        </h4>
                        {team.upcomingTournaments > 0 ? (
                          <Badge className="bg-primary/20 text-primary border-primary/10">
                            {team.upcomingTournaments} tournaments
                          </Badge>
                        ) : (
                          <span className="text-gray-500 text-sm">No upcoming tournaments</span>
                        )}
                      </div>
                      
                      <div className="bg-gray-800/20 p-3 rounded-lg border border-gray-800/50">
                        <h4 className="text-sm font-medium text-gray-300 flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-accent-blue" />
                          Practice Schedule
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {team.preferredPlayTimes.map((time, idx) => (
                            <Badge key={idx} variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/20 p-3 rounded-lg border border-gray-800/50 mb-4">
                      <h4 className="text-sm font-medium text-gray-300 flex items-center mb-2">
                        <Award className="h-4 w-4 mr-2 text-accent-yellow" />
                        Recent Achievements
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {team.recentAchievements.map((achievement, idx) => (
                          <Badge key={idx} variant="outline" className="bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 flex items-center mb-2">
                        <UserPlus className="h-4 w-4 mr-2 text-accent-green" />
                        {team.currentlyRecruiting ? 'Recruiting Positions' : 'No Open Positions'}
                      </h4>
                      
                      {team.currentlyRecruiting && team.openPositions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {team.openPositions.map((position, idx) => (
                            <Badge key={idx} className="bg-accent-green/10 text-accent-green border-accent-green/30">
                              {position}
                            </Badge>
                          ))}
                        </div>
                      ) : team.currentlyRecruiting ? (
                        <span className="text-gray-400 text-sm">Contact team for position details</span>
                      ) : (
                        <span className="text-gray-500 text-sm">This team is not recruiting at the moment</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-3 mt-4">
                      <Button
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-800"
                        onClick={() => setLocation(`/teams/${team.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" /> Contact
                      </Button>
                      <Button
                        className={`${team.currentlyRecruiting ? 'bg-primary hover:bg-primary/90' : 'bg-gray-700 hover:bg-gray-700 cursor-not-allowed'}`}
                        disabled={!team.currentlyRecruiting}
                        onClick={() => team.currentlyRecruiting && handleApplyToTeam(team)}
                      >
                        <UserCheck className="h-4 w-4 mr-2" /> 
                        {team.applicationRequired ? 'Apply' : 'Join'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* No Results */}
      {filteredTeams.length === 0 && (
        <div className="text-center py-12 bg-gray-900/30 border border-gray-800 rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No teams found</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            We couldn't find any teams matching your filters. Try adjusting your search criteria or create a new team.
          </p>
          <Button 
            className="bg-accent-green hover:bg-accent-green/90 text-white"
            onClick={() => setLocation("/teams/create")}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Create New Team
          </Button>
        </div>
      )}
      
      {/* Application Dialog */}
      <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Apply to {selectedTeam?.name}
            </DialogTitle>
            <DialogDescription>
              Submit your application to join this team. Make sure to highlight your experience and skills.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 flex items-center mb-2">
                <Info className="h-4 w-4 mr-2 text-accent-blue" />
                Team Requirements
              </h4>
              <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-800/50">
                <ul className="space-y-1 text-sm text-gray-400">
                  {selectedTeam?.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-gray-300">
                  Gaming Experience
                </Label>
                <Input
                  id="experience"
                  placeholder="Describe your competitive experience..."
                  className="bg-gray-800 border-gray-700"
                  value={applicationForm.experience}
                  onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability" className="text-gray-300">
                  Availability
                </Label>
                <Input
                  id="availability"
                  placeholder="When are you available to play?"
                  className="bg-gray-800 border-gray-700"
                  value={applicationForm.availability}
                  onChange={(e) => setApplicationForm({...applicationForm, availability: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="goals" className="text-gray-300">
                  Your Goals
                </Label>
                <Input
                  id="goals"
                  placeholder="What are your goals as a player?"
                  className="bg-gray-800 border-gray-700"
                  value={applicationForm.goals}
                  onChange={(e) => setApplicationForm({...applicationForm, goals: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredRole" className="text-gray-300">
                  Preferred Role
                </Label>
                <Select 
                  value={applicationForm.preferredRole}
                  onValueChange={(value) => setApplicationForm({...applicationForm, preferredRole: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select your preferred role" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTeam?.openPositions.map((position, idx) => (
                      <SelectItem key={idx} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Label htmlFor="links" className="text-gray-300">
                Social Media / Showcase Links (Optional)
              </Label>
              <Input
                id="links"
                placeholder="Links to your gameplay videos, profiles, etc."
                className="bg-gray-800 border-gray-700"
                value={applicationForm.links}
                onChange={(e) => setApplicationForm({...applicationForm, links: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300">
                Message to the Team
              </Label>
              <textarea
                id="message"
                rows={4}
                placeholder="Introduce yourself and explain why you want to join..."
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                value={applicationForm.message}
                onChange={(e) => setApplicationForm({...applicationForm, message: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-gray-700 hover:bg-gray-800"
              onClick={() => setApplicationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitApplication}
              disabled={!applicationForm.experience || !applicationForm.message}
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}