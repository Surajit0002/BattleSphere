import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { 
  AlertCircle, 
  Award, 
  Calendar, 
  CheckCircle, 
  ChevronRight,
  Clock, 
  Coins, 
  Eye, 
  Flag, 
  Gamepad2, 
  Info, 
  Link2, 
  MapPin, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Swords, 
  Trophy, 
  Users,
  XCircle,
  Play,
  Bell,
  Heart,
  BarChart,
  Download,
  Copy,
  CheckCheck,
  ThumbsUp,
  Share,
  RefreshCw,
  ArrowUpRight,
  Crown,
  Star,
  Sparkles,
  Gift,
  Zap,
  Flame
} from "lucide-react";

// Define tournament interface
interface Tournament {
  id: number;
  name: string;
  description: string;
  gameId: number;
  startDate: string;
  endDate: string | null;
  registrationEndDate: string | null;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  minParticipants: number;
  status: string;
  gameMode: string;
  tournamentType: string;
  rules: string;
  eligibilityCriteria: string | null;
  isFeatured: boolean;
}

// Define game interface
interface Game {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  androidUrl: string | null;
  iosUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
}

// Define registration interface
interface Registration {
  id: number;
  tournamentId: number;
  userId: number;
  teamId: number | null;
  registeredAt: string;
  status: string;
  userName: string;
  userAvatar: string | null;
  teamName: string | null;
  rank?: number;
  skill?: number;
  previousTournaments?: number;
  wins?: number;
}

// Define match interface
interface Match {
  id: number;
  tournamentId: number;
  round: number;
  matchNumber: number;
  team1Id: number | null;
  team2Id: number | null;
  team1Score: number | null;
  team2Score: number | null;
  winnerId: number | null;
  scheduledTime: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  streamUrl: string | null;
  team1Name: string | null;
  team2Name: string | null;
  team1Logo: string | null;
  team2Logo: string | null;
  highlights?: Highlight[];
}

// Define team interface
interface Team {
  id: number;
  name: string;
  logoUrl: string | null;
  description: string | null;
  createdAt: string;
  captainId: number;
  winRate?: number;
  totalMatches?: number;
  wins?: number;
  members?: TeamMember[];
}

// Define team member interface
interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
  joinedAt: string;
  userName: string;
  userAvatar: string | null;
  role?: string;
}

// Define prize distribution
interface PrizeDistribution {
  position: number;
  amount: number;
  percentage: number;
}

// Define highlight
interface Highlight {
  id: number;
  matchId: number;
  title: string;
  description: string;
  timestamp: string;
  clipUrl: string | null;
  thumbnailUrl: string | null;
  playerName: string;
  type: "kill" | "objective" | "teamfight" | "other";
}

// Define countdown timer component
const CountdownTimer: React.FC<{ targetDate: Date, onComplete?: () => void }> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number}>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };
    
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timerId);
  }, [targetDate, onComplete]);
  
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      <div className="bg-gray-900/60 rounded-lg py-2 px-3 sm:px-6 text-center">
        <div className="text-2xl font-bold">{timeLeft.days}</div>
        <div className="text-xs text-gray-400">Days</div>
      </div>
      <div className="bg-gray-900/60 rounded-lg py-2 px-3 sm:px-6 text-center">
        <div className="text-2xl font-bold">{timeLeft.hours}</div>
        <div className="text-xs text-gray-400">Hours</div>
      </div>
      <div className="bg-gray-900/60 rounded-lg py-2 px-3 sm:px-6 text-center">
        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
        <div className="text-xs text-gray-400">Minutes</div>
      </div>
      <div className="bg-gray-900/60 rounded-lg py-2 px-3 sm:px-6 text-center">
        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
        <div className="text-xs text-gray-400">Seconds</div>
      </div>
    </div>
  );
};

// Define animated stat card component
const AnimatedStatCard: React.FC<{ 
  title: string, 
  value: string | number, 
  icon: React.ReactNode, 
  color: string,
  delay?: number
}> = ({ title, value, icon, color, delay = 0 }) => {
  return (
    <motion.div 
      className={`bg-gray-900/40 rounded-lg p-3 border border-${color}-900/40`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-400 mb-1">{title}</div>
          <div className={`font-medium text-lg text-${color}-500`}>{value}</div>
        </div>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-${color}-500/20 text-${color}-500`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

// Define tournament bracket component
const TournamentBracket: React.FC<{ rounds: any[] }> = ({ rounds }) => {
  return (
    <div className="overflow-auto pb-6">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-4 gap-4">
          {rounds.map((round, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-center font-medium py-2 bg-gray-900/60 rounded-md">
                {round.name || `Round ${round.round}`}
              </h3>
              
              {round.matches.map((match: Match) => (
                <motion.div
                  key={match.id}
                  className="bg-gray-900/40 border border-gray-800 rounded-lg p-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xs text-gray-400 mb-2 flex items-center justify-between">
                    <span>Match #{match.matchNumber}</span>
                    <Badge className={`${
                      match.status === "completed" ? "bg-green-600 hover:bg-green-700" :
                      match.status === "in_progress" ? "bg-yellow-600 hover:bg-yellow-700" :
                      "bg-blue-600 hover:bg-blue-700"
                    }`}>
                      {match.status === "in_progress" ? "Live" :
                       match.status === "completed" ? "Completed" :
                       "Scheduled"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-1.5 rounded ${
                      match.winnerId === match.team1Id ? "bg-green-900/20 border border-green-900/40" : ""
                    }`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={match.team1Logo || ""} alt={match.team1Name} />
                          <AvatarFallback>{match.team1Name?.substring(0, 2).toUpperCase() || "T1"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate">{match.team1Name || "TBD"}</span>
                      </div>
                      <span className="font-bold">{match.team1Score !== null ? match.team1Score : "-"}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-1.5 rounded ${
                      match.winnerId === match.team2Id ? "bg-green-900/20 border border-green-900/40" : ""
                    }`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={match.team2Logo || ""} alt={match.team2Name} />
                          <AvatarFallback>{match.team2Name?.substring(0, 2).toUpperCase() || "T2"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate">{match.team2Name || "TBD"}</span>
                      </div>
                      <span className="font-bold">{match.team2Score !== null ? match.team2Score : "-"}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(match.scheduledTime).toLocaleDateString()} {new Date(match.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    {match.status === "in_progress" && match.streamUrl && (
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-red-500">
                        <Play className="h-3 w-3 mr-1" />
                        Watch Live
                      </Button>
                    )}
                  </div>
                  
                  {match.highlights && match.highlights.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-800">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="highlights" className="border-b-0">
                          <AccordionTrigger className="py-1 text-xs text-primary hover:no-underline">
                            <Sparkles className="h-3 w-3 mr-1" /> {match.highlights.length} Highlights
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 mt-1">
                              {match.highlights.map((highlight) => (
                                <div key={highlight.id} className="flex items-center gap-2 text-xs">
                                  <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                    highlight.type === "kill" ? "bg-red-500/20 text-red-500" :
                                    highlight.type === "objective" ? "bg-blue-500/20 text-blue-500" :
                                    highlight.type === "teamfight" ? "bg-yellow-500/20 text-yellow-500" :
                                    "bg-purple-500/20 text-purple-500"
                                  }`}>
                                    {highlight.type === "kill" ? <Swords className="h-2 w-2" /> :
                                     highlight.type === "objective" ? <Flag className="h-2 w-2" /> :
                                     highlight.type === "teamfight" ? <Users className="h-2 w-2" /> :
                                     <Star className="h-2 w-2" />}
                                  </div>
                                  <span>{highlight.title}</span>
                                  <span className="text-gray-500">{highlight.playerName}</span>
                                  {highlight.clipUrl && (
                                    <Button size="sm" variant="ghost" className="h-5 px-1 py-0 text-[10px] text-primary ml-auto">
                                      <Eye className="h-2 w-2 mr-1" /> Watch
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Define team registration modal component
const TeamSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  onRegister: (teamId: number | null) => void;
  loading: boolean;
  gameMode: string;
}> = ({ isOpen, onClose, teams, onRegister, loading, gameMode }) => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [registrationOption, setRegistrationOption] = useState<"existing" | "new">("existing");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-950 border-gray-800">
        <DialogHeader>
          <DialogTitle>Tournament Registration</DialogTitle>
          <DialogDescription>
            {gameMode === "solo" ? 
              "Register as a solo player for this tournament." :
              "Choose a team to participate in this tournament or create a new one."}
          </DialogDescription>
        </DialogHeader>
        
        {gameMode !== "solo" && (
          <RadioGroup 
            defaultValue="existing" 
            value={registrationOption}
            onValueChange={(value) => setRegistrationOption(value as "existing" | "new")}
            className="mb-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing">Use an existing team</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">Create a new team</Label>
            </div>
          </RadioGroup>
        )}
        
        {registrationOption === "existing" ? (
          <>
            {gameMode !== "solo" && teams.length > 0 ? (
              <div className="space-y-3 my-3">
                <h3 className="text-sm font-medium">Select a team</h3>
                <div className="grid gap-2">
                  {teams.map((team) => (
                    <div 
                      key={team.id} 
                      className={`flex items-center gap-3 p-2 border rounded-md cursor-pointer transition-colors ${
                        selectedTeam === team.id ? "bg-primary/20 border-primary" : "border-gray-800 hover:border-gray-700"
                      }`}
                      onClick={() => setSelectedTeam(team.id)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={team.logoUrl || ""} alt={team.name} />
                        <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-xs text-gray-400">{team.members?.length || 0} members</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : gameMode !== "solo" ? (
              <div className="text-center py-4">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                <h3 className="text-lg font-medium mb-1">No Teams Available</h3>
                <p className="text-sm text-gray-400 mb-3">You haven't created any teams yet.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setRegistrationOption("new")}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  Create a New Team
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="space-y-3 my-3">
            <h3 className="text-sm font-medium">New Team Details</h3>
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input id="team-name" placeholder="Enter your team name" className="bg-gray-900/60 border-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-description">Description (optional)</Label>
              <Input id="team-description" placeholder="Brief description of your team" className="bg-gray-900/60 border-gray-700" />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-700 hover:bg-gray-800">
            Cancel
          </Button>
          <Button 
            onClick={() => onRegister(selectedTeam)} 
            disabled={(registrationOption === "existing" && selectedTeam === null) || loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            Register{gameMode !== "solo" ? " Team" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main component
export default function TournamentDetailsPremium() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const tournamentId = parseInt(id || "0");
  const [activeTab, setActiveTab] = useState("overview");
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [isShareLinkCopied, setIsShareLinkCopied] = useState(false);
  const [followingTournament, setFollowingTournament] = useState(false);
  const { toast } = useToast();

  // Fetch tournament data
  const { data: tournament, isLoading: isLoadingTournament } = useQuery({
    queryKey: [`/api/tournaments/${tournamentId}`],
    enabled: !!tournamentId,
  });

  // Fetch game data
  const { data: game } = useQuery({
    queryKey: [`/api/games/${tournament?.gameId}`],
    enabled: !!tournament?.gameId,
  });

  // Fetch registrations
  const { data: registrations } = useQuery({
    queryKey: [`/api/tournaments/${tournamentId}/registrations`],
    enabled: !!tournamentId,
  });

  // Fetch team data
  const { data: userTeams } = useQuery({
    queryKey: ["/api/teams/user"],
  });

  // Fetch matches
  const { data: matches } = useQuery({
    queryKey: [`/api/tournaments/${tournamentId}/matches`],
    enabled: !!tournamentId,
  });

  // Fetch user data to check if registered
  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  // Mock prize distribution calculation
  const getPrizeDistribution = (): PrizeDistribution[] => {
    if (!tournament) return [];
    
    const prizePool = tournament.prizePool;
    return [
      { position: 1, amount: Math.floor(prizePool * 0.5), percentage: 50 },
      { position: 2, amount: Math.floor(prizePool * 0.25), percentage: 25 },
      { position: 3, amount: Math.floor(prizePool * 0.15), percentage: 15 },
      { position: 4, amount: Math.floor(prizePool * 0.10), percentage: 10 },
    ];
  };

  // Mock highlights data
  const getMatchHighlights = (): Match[] => {
    if (!matches) return [];
    
    const matchesWithHighlights = [...(matches as Match[])];
    
    // Add highlights to some matches
    if (matchesWithHighlights.length > 0) {
      matchesWithHighlights[0].highlights = [
        {
          id: 1,
          matchId: matchesWithHighlights[0].id,
          title: "Amazing Triple Kill",
          description: "Player secured a triple kill in the final moments",
          timestamp: new Date().toISOString(),
          clipUrl: "#",
          thumbnailUrl: "https://i.imgur.com/QEGx1nR.jpg",
          playerName: "GhostSniper",
          type: "kill"
        },
        {
          id: 2,
          matchId: matchesWithHighlights[0].id,
          title: "Final Flag Capture",
          description: "Team secured the objective with only seconds left",
          timestamp: new Date().toISOString(),
          clipUrl: "#",
          thumbnailUrl: "https://i.imgur.com/9dJQEZU.jpg",
          playerName: "Vortex",
          type: "objective"
        }
      ];
    }
    
    if (matchesWithHighlights.length > 1) {
      matchesWithHighlights[1].highlights = [
        {
          id: 3,
          matchId: matchesWithHighlights[1].id,
          title: "Epic Team Fight",
          description: "Both teams clashed in an intense battle",
          timestamp: new Date().toISOString(),
          clipUrl: "#",
          thumbnailUrl: "https://i.imgur.com/bXvbE86.jpg",
          playerName: "Team Alpha",
          type: "teamfight"
        }
      ];
    }
    
    return matchesWithHighlights;
  };

  // Add team data to registrations
  const getEnhancedRegistrations = () => {
    if (!registrations) return [];
    
    return registrations.map((reg: Registration, index: number) => {
      // Adding mock skill data
      return {
        ...reg,
        rank: index + 1,
        skill: Math.floor(Math.random() * 100) + 1,
        previousTournaments: Math.floor(Math.random() * 20),
        wins: Math.floor(Math.random() * 10)
      };
    });
  };

  // Generate tournament brackets data
  const getBracketData = () => {
    if (!matches) return [];

    const matchesWithHighlights = getMatchHighlights();
    
    const rounds: { [key: number]: Match[] } = {};
    matchesWithHighlights.forEach((match: Match) => {
      if (!rounds[match.round]) rounds[match.round] = [];
      rounds[match.round].push(match);
    });

    return Object.keys(rounds).map((round) => ({
      round: parseInt(round),
      name: getRoundName(parseInt(round), Object.keys(rounds).length),
      matches: rounds[parseInt(round)],
    }));
  };
  
  // Get round name based on position
  const getRoundName = (round: number, totalRounds: number): string => {
    if (round === totalRounds) return "Finals";
    if (round === totalRounds - 1) return "Semi-Finals";
    if (round === totalRounds - 2) return "Quarter-Finals";
    return `Round ${round}`;
  };

  // Check if user is registered for this tournament
  const isUserRegistered = registrations?.some(
    (reg: Registration) => reg.userId === user?.id
  );

  // Register for tournament
  const handleRegister = async (teamId: number | null = null) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for tournaments",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest(`/api/tournaments/${tournamentId}/register`, {
        method: "POST",
        data: {
          teamId,
        },
      });

      toast({
        title: "Registration Successful",
        description: "You have successfully registered for this tournament",
      });

      queryClient.invalidateQueries({ queryKey: [`/api/tournaments/${tournamentId}/registrations`] });
      setRegistrationModalOpen(false);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering for this tournament",
        variant: "destructive",
      });
    }
  };

  // Format game mode for display
  const formatGameMode = (mode: string) => {
    if (!mode) return "";
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  // Format tournament status for display
  const getTournamentStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        );
      case "ongoing":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <Play className="h-3 w-3 mr-1" />
            Live
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-600 hover:bg-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-600 hover:bg-gray-700">
            <Info className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  // Determine if registration is open
  const isRegistrationOpen = tournament && new Date() <= new Date(tournament.registrationEndDate || tournament.startDate);

  // Copy share link to clipboard
  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/tournaments/premium/${tournamentId}`;
    navigator.clipboard.writeText(shareUrl);
    setIsShareLinkCopied(true);
    
    toast({
      title: "Link Copied",
      description: "Tournament link copied to clipboard",
    });
    
    setTimeout(() => setIsShareLinkCopied(false), 2000);
  };
  
  // Toggle tournament following
  const toggleFollowTournament = () => {
    setFollowingTournament(!followingTournament);
    
    toast({
      title: followingTournament ? "Unfollowed" : "Following Tournament",
      description: followingTournament ? 
        "You will no longer receive notifications about this tournament" : 
        "You will receive updates and notifications about this tournament",
    });
  };

  // Loading state
  if (isLoadingTournament) {
    return (
      <div className="container py-10 min-h-screen bg-black bg-dot-white/[0.2]">
        <div className="space-y-8">
          {/* Loading hero section */}
          <div className="h-64 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg animate-pulse"></div>
          
          {/* Loading tabs */}
          <div className="h-14 bg-gray-900/60 rounded-lg animate-pulse"></div>
          
          {/* Loading content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-gray-900/40 rounded-lg animate-pulse"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-900/40 rounded-lg animate-pulse"></div>
              <div className="h-32 bg-gray-900/40 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container py-10 text-center">
        <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Tournament Not Found</h1>
        <p className="mb-6">The tournament you're looking for doesn't exist or has been removed</p>
        <Button onClick={() => navigate("/tournaments")}>View All Tournaments</Button>
      </div>
    );
  }

  // Tournament banner overlay
  const TournamentBanner = () => (
    <div className="absolute inset-0 opacity-80">
      <div className="w-full h-full relative">
        {/* Particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.25,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `-${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        {/* Hero gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-blue-900/70"></div>
        
        {/* Game image overlay */}
        {game && (
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay" 
            style={{ backgroundImage: `url(${game.imageUrl})` }}
          ></div>
        )}
        
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>
    </div>
  );

  // Calculate if tournament is happening now
  const isLive = tournament.status === "ongoing";
  
  // Prize distribution data
  const prizeDistribution = getPrizeDistribution();

  // Get bracket data
  const bracketData = getBracketData();
  
  // Get enhanced registrations
  const enhancedRegistrations = getEnhancedRegistrations();

  return (
    <div className="min-h-screen bg-black bg-dot-white/[0.2]">
      {/* Tournament Hero Section */}
      <div className="relative">
        <div className="h-80 relative">
          <TournamentBanner />
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="container px-6 mt-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {getTournamentStatusBadge(tournament.status)}
                    {tournament.isFeatured && (
                      <Badge className="bg-yellow-600 hover:bg-yellow-700">
                        <Trophy className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {isLive && (
                      <Badge className="bg-red-600 hover:bg-red-700 flex items-center">
                        <span className="h-2 w-2 rounded-full bg-white animate-pulse mr-1"></span>
                        Live Now
                      </Badge>
                    )}
                    <Badge className="bg-gray-800 hover:bg-gray-700">
                      <Eye className="h-3 w-3 mr-1" />
                      {Math.floor(Math.random() * 1000) + 100} Viewing
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                    {tournament.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                    <div className="flex items-center">
                      <Gamepad2 className="h-4 w-4 mr-1 text-primary" />
                      <span>{game?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-red-500" />
                      <span>{formatGameMode(tournament.gameMode)} Mode</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{new Date(tournament.startDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-green-500" />
                      <span>{registrations?.length || 0}/{tournament.maxParticipants} Participants</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex flex-col md:items-end gap-3"
                >
                  <div className="flex items-center bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
                    <Coins className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-300">Prize Pool</div>
                      <div className="text-2xl font-bold text-white">₹{tournament.prizePool.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isRegistrationOpen ? (
                      <Button 
                        className="bg-primary hover:bg-primary/90"
                        disabled={isUserRegistered}
                        onClick={() => {
                          if (tournament.gameMode === "solo") {
                            handleRegister(null);
                          } else {
                            setRegistrationModalOpen(true);
                          }
                        }}
                      >
                        {isUserRegistered ? "Already Registered" : "Register Now"}
                      </Button>
                    ) : (
                      <Button variant="outline" className="border-red-700 text-red-400" disabled>
                        Registration Closed
                      </Button>
                    )}
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-700 hover:bg-gray-800"
                            onClick={toggleFollowTournament}
                          >
                            {followingTournament ? 
                              <Bell className="h-4 w-4 text-primary" /> : 
                              <Bell className="h-4 w-4" />
                            }
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{followingTournament ? "Unfollow tournament" : "Follow tournament"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-700 hover:bg-gray-800"
                            onClick={copyShareLink}
                          >
                            {isShareLinkCopied ? 
                              <CheckCheck className="h-4 w-4 text-green-500" /> : 
                              <Copy className="h-4 w-4" />
                            }
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy tournament link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Info Ribbon */}
      {isRegistrationOpen || isLive ? (
        <div className="bg-gray-900 border-y border-gray-800 py-3">
          <div className="container px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-3 sm:mb-0">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <div>
                  <span className="font-medium">
                    {isLive ? "Tournament Live Now" : "Registration Closes In"}
                  </span>
                </div>
              </div>
              
              {isLive ? (
                <div className="flex gap-2">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Live Stream
                  </Button>
                  
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                    <Eye className="h-4 w-4 mr-2" />
                    View Matches
                  </Button>
                </div>
              ) : (
                <CountdownTimer
                  targetDate={new Date(tournament.registrationEndDate || tournament.startDate)}
                  onComplete={() => {
                    toast({
                      title: "Registration Closed",
                      description: "Registration period has ended for this tournament",
                    });
                    queryClient.invalidateQueries({ queryKey: [`/api/tournaments/${tournamentId}`] });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
      
      <div className="container px-6 py-8">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="w-full h-14 grid grid-cols-4 bg-gray-900/60">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="rules" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
            >
              Rules
            </TabsTrigger>
            <TabsTrigger 
              value="participants" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
            >
              Participants
            </TabsTrigger>
            <TabsTrigger 
              value="brackets" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
            >
              Matches & Brackets
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tournament Info */}
              <motion.div
                className="md:col-span-2 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10 overflow-hidden">
                  <CardHeader className="relative">
                    <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
                      <Trophy className="h-full w-full text-primary" />
                    </div>
                    <CardTitle className="text-xl flex items-center gap-2 z-10">
                      <Info className="h-5 w-5 text-primary" />
                      Tournament Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose prose-invert max-w-none">
                      <p>{tournament.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                      <AnimatedStatCard 
                        title="Tournament Type" 
                        value={tournament.tournamentType.charAt(0).toUpperCase() + tournament.tournamentType.slice(1)} 
                        icon={<Trophy className="h-5 w-5" />} 
                        color="yellow"
                        delay={0}
                      />
                      <AnimatedStatCard 
                        title="Game Mode" 
                        value={tournament.gameMode.charAt(0).toUpperCase() + tournament.gameMode.slice(1)} 
                        icon={<Gamepad2 className="h-5 w-5" />} 
                        color="blue"
                        delay={1}
                      />
                      <AnimatedStatCard 
                        title="Start Date" 
                        value={new Date(tournament.startDate).toLocaleDateString()} 
                        icon={<Calendar className="h-5 w-5" />} 
                        color="green"
                        delay={2}
                      />
                      <AnimatedStatCard 
                        title={tournament.endDate ? "End Date" : "Estimated End"} 
                        value={tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : "TBD"} 
                        icon={<Flag className="h-5 w-5" />} 
                        color="red"
                        delay={3}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Prize Distribution */}
                      <div className="flex-1 bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 border border-yellow-900/30 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          Prize Distribution
                        </h3>
                        <div className="space-y-3">
                          {prizeDistribution.map((prize) => (
                            <div key={prize.position} className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                  prize.position === 1 ? "bg-yellow-500 text-black" : 
                                  prize.position === 2 ? "bg-gray-400 text-black" : 
                                  prize.position === 3 ? "bg-amber-700 text-white" : 
                                  "bg-gray-700 text-white"
                                }`}>{prize.position}</div>
                                <div>
                                  <span className="font-medium">{getPositionName(prize.position)}</span>
                                  <div className="text-xs text-gray-400">{prize.percentage}% of prize pool</div>
                                </div>
                              </div>
                              <div className="font-bold text-yellow-500">₹{prize.amount.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Game Information */}
                      {game && (
                        <div className="flex-1 bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-900/30 rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <Gamepad2 className="h-5 w-5 text-blue-500" />
                            Game Information
                          </h3>
                          <div className="flex gap-4">
                            <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                              <img 
                                src={game.imageUrl} 
                                alt={game.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-lg">{game.name}</h4>
                              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{game.description}</p>
                              <div className="flex gap-2">
                                {game.androidUrl && (
                                  <Button variant="outline" size="sm" className="h-8 border-gray-700 hover:bg-gray-800" asChild>
                                    <a href={game.androidUrl} target="_blank" rel="noopener noreferrer">
                                      <ArrowUpRight className="h-3 w-3 mr-1" />
                                      Android
                                    </a>
                                  </Button>
                                )}
                                {game.iosUrl && (
                                  <Button variant="outline" size="sm" className="h-8 border-gray-700 hover:bg-gray-800" asChild>
                                    <a href={game.iosUrl} target="_blank" rel="noopener noreferrer">
                                      <ArrowUpRight className="h-3 w-3 mr-1" />
                                      iOS
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Match Schedule */}
                <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Upcoming Matches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {matches && matches.length > 0 ? (
                      <div className="space-y-4">
                        {matches
                          .filter((match: Match) => match.status === "scheduled")
                          .sort((a: Match, b: Match) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                          .slice(0, 3)
                          .map((match: Match) => (
                            <motion.div
                              key={match.id}
                              className="bg-gray-900/40 border border-gray-800 rounded-lg p-4"
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-blue-600 hover:bg-blue-700">Round {match.round}</Badge>
                                  <span className="text-sm text-gray-400">Match #{match.matchNumber}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                  <span className="text-gray-300">{formatDate(new Date(match.scheduledTime))}</span>
                                </div>
                              </div>
                              
                              <div className="bg-gray-900/60 p-4 rounded-lg">
                                <div className="grid grid-cols-3 items-center">
                                  <div className="flex flex-col items-center">
                                    <Avatar className="h-12 w-12 mb-2">
                                      <AvatarImage src={match.team1Logo || ""} alt={match.team1Name} />
                                      <AvatarFallback className="bg-blue-900/50">
                                        {match.team1Name?.substring(0, 2).toUpperCase() || "T1"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium text-center">{match.team1Name || "TBD"}</div>
                                  </div>
                                  
                                  <div className="flex flex-col items-center">
                                    <div className="text-2xl font-bold text-gray-400 mb-2">VS</div>
                                    <div className="bg-gray-800 px-3 py-1 rounded text-xs text-gray-300 flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>{formatTime(new Date(match.scheduledTime))}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col items-center">
                                    <Avatar className="h-12 w-12 mb-2">
                                      <AvatarImage src={match.team2Logo || ""} alt={match.team2Name} />
                                      <AvatarFallback className="bg-red-900/50">
                                        {match.team2Name?.substring(0, 2).toUpperCase() || "T2"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium text-center">{match.team2Name || "TBD"}</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex items-center justify-between">
                                <div className="text-sm text-gray-400">
                                  {getTimeUntilMatch(new Date(match.scheduledTime))}
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800">
                                    <Bell className="h-3 w-3 mr-1" />
                                    Remind me
                                  </Button>
                                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Add to Calendar
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        
                        {matches.filter((match: Match) => match.status === "scheduled").length > 3 && (
                          <Button 
                            variant="outline" 
                            className="w-full border-gray-700 hover:bg-gray-800"
                            onClick={() => setActiveTab("brackets")}
                          >
                            View All Matches
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                        <h3 className="text-lg font-medium mb-2">No Matches Scheduled Yet</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-4">
                          Match schedules will be published once the tournament begins.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Registration Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Registration Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-400">Participants</span>
                          <span className="font-medium">
                            {registrations?.length || 0}/{tournament.maxParticipants}
                          </span>
                        </div>
                        <Progress 
                          value={(registrations?.length || 0) / tournament.maxParticipants * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Registration Opens</span>
                          <span>
                            {new Date(tournament.startDate).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <Separator className="bg-gray-800" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Registration Closes</span>
                          <span>
                            {tournament.registrationEndDate 
                              ? new Date(tournament.registrationEndDate).toLocaleDateString(undefined, { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })
                              : "Tournament Start"
                            }
                          </span>
                        </div>
                        <Separator className="bg-gray-800" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Entry Fee</span>
                          <span>{tournament.entryFee > 0 ? `₹${tournament.entryFee}` : "Free"}</span>
                        </div>
                        <Separator className="bg-gray-800" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Min Participants</span>
                          <span>{tournament.minParticipants}</span>
                        </div>
                      </div>
                      
                      {isRegistrationOpen ? (
                        <Button 
                          className="w-full mt-2 bg-primary hover:bg-primary/90"
                          disabled={isUserRegistered}
                          onClick={() => {
                            if (tournament.gameMode === "solo") {
                              handleRegister(null);
                            } else {
                              setRegistrationModalOpen(true);
                            }
                          }}
                        >
                          {isUserRegistered ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Already Registered
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Register for Tournament
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full mt-2 border-red-700 text-red-400" disabled>
                          <XCircle className="h-4 w-4 mr-2" />
                          Registration Closed
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Top Players/Teams */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Crown className="h-5 w-5 text-primary" />
                        {tournament.gameMode === "solo" ? "Top Players" : "Top Teams"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {enhancedRegistrations && enhancedRegistrations.length > 0 ? (
                        <div className="space-y-3">
                          {enhancedRegistrations
                            .sort((a: any, b: any) => b.skill - a.skill)
                            .slice(0, 5)
                            .map((registration: any, index: number) => (
                              <div 
                                key={registration.id}
                                className="flex items-center gap-3 p-2 border border-gray-800 rounded-md bg-gray-900/40"
                              >
                                <div className={`h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                                  index === 0 ? "bg-yellow-500 text-black" : 
                                  index === 1 ? "bg-gray-400 text-black" : 
                                  index === 2 ? "bg-amber-700 text-white" : 
                                  "bg-gray-700 text-white"
                                }`}>{index + 1}</div>
                                
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={registration.userAvatar || ""} alt={registration.userName} />
                                  <AvatarFallback>{registration.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{registration.userName}</div>
                                  {registration.teamName && (
                                    <div className="text-xs text-gray-400 truncate">
                                      {registration.teamName}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col items-end text-xs">
                                  <div className="text-primary">{registration.skill} XP</div>
                                  <div className="text-gray-400">{registration.wins} wins</div>
                                </div>
                              </div>
                            ))}
                          
                          <Button 
                            variant="ghost" 
                            className="w-full text-primary hover:bg-gray-900/40 mt-2"
                            onClick={() => setActiveTab("participants")}
                          >
                            View All Participants
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Users className="h-10 w-10 mx-auto mb-2 text-gray-600" />
                          <h3 className="text-sm font-medium mb-1">No Participants Yet</h3>
                          <p className="text-xs text-gray-400 mb-3">
                            Be the first to register for this tournament!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-primary" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {isLive && (
                          <Button className="w-full gap-2 bg-red-600 hover:bg-red-700">
                            <Play className="h-4 w-4" />
                            Watch Live Stream
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          className={`w-full gap-2 ${followingTournament ? 
                            "bg-primary/10 border-primary text-primary hover:bg-primary/20" : 
                            "border-gray-700 hover:bg-gray-800"
                          }`}
                          onClick={toggleFollowTournament}
                        >
                          {followingTournament ? <Bell className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                          {followingTournament ? "Following Tournament" : "Follow Tournament"}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 border-gray-700 hover:bg-gray-800"
                          onClick={copyShareLink}
                        >
                          {isShareLinkCopied ? <CheckCheck className="h-4 w-4" /> : <Share className="h-4 w-4" />}
                          Share Tournament
                        </Button>
                        
                        <Button variant="outline" className="w-full gap-2 border-gray-700 hover:bg-gray-800">
                          <MessageSquare className="h-4 w-4" />
                          Tournament Chat
                        </Button>
                        
                        <Button variant="outline" className="w-full gap-2 border-gray-700 hover:bg-gray-800">
                          <BarChart className="h-4 w-4" />
                          View Statistics
                        </Button>
                        
                        <Button variant="outline" className="w-full gap-2 border-gray-700 hover:bg-gray-800">
                          <Download className="h-4 w-4" />
                          Download Rules PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Tournament Rules & Guidelines
                    </CardTitle>
                    <CardDescription>
                      Please read all rules carefully before participating
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      {tournament.rules.split('\n').map((rule, index) => (
                        <div key={index} className="mb-4">
                          <p>{rule}</p>
                        </div>
                      ))}
                      
                      {tournament.eligibilityCriteria && (
                        <>
                          <h3 className="text-xl font-medium mt-8 mb-4">Eligibility Criteria</h3>
                          {tournament.eligibilityCriteria.split('\n').map((criteria, index) => (
                            <div key={index} className="mb-4">
                              <p>{criteria}</p>
                            </div>
                          ))}
                        </>
                      )}
                      
                      <h3 className="text-xl font-medium mt-8 mb-4">General Rules</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Players must be registered with BattleSphere to participate.</li>
                        <li>All participants must follow fair play guidelines.</li>
                        <li>The use of hacks, cheats, or exploits is strictly prohibited and will result in immediate disqualification.</li>
                        <li>Tournament administrators' decisions are final.</li>
                        <li>Participants must be present and ready to play at the scheduled match times.</li>
                        <li>A 10-minute grace period will be provided after which the team/player may be disqualified.</li>
                        <li>Screen recording may be required for verification purposes in case of disputes.</li>
                        <li>Tournament format and rules may be modified at the discretion of the organizers.</li>
                      </ul>
                      
                      <h3 className="text-xl font-medium mt-8 mb-4">Prize Distribution</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {prizeDistribution.map((prize) => (
                          <li key={prize.position}>
                            {getPositionName(prize.position)}: ₹{prize.amount.toLocaleString()} ({prize.percentage}% of prize pool)
                          </li>
                        ))}
                        <li>Prize money will be credited to winners' BattleSphere wallet within 7 days of tournament completion.</li>
                        <li>Winners may be required to complete KYC verification before receiving prizes.</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-800 pt-4 flex justify-between">
                    <div className="flex items-center text-yellow-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>Violation of rules may result in disqualification</span>
                    </div>
                    
                    {isRegistrationOpen && !isUserRegistered && (
                      <Button 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => {
                          if (tournament.gameMode === "solo") {
                            handleRegister(null);
                          } else {
                            setRegistrationModalOpen(true);
                          }
                        }}
                      >
                        Accept Rules & Register
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                      Game Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-900/40 p-3 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Game Mode</div>
                        <div className="font-medium capitalize flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2 ${
                            tournament.gameMode === "solo" ? "bg-blue-500" : 
                            tournament.gameMode === "duo" ? "bg-green-500" : 
                            tournament.gameMode === "squad" ? "bg-purple-500" : 
                            "bg-yellow-500"
                          }`}></div>
                          {tournament.gameMode}
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/40 p-3 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Player Limits</div>
                        <div className="font-medium">
                          {tournament.gameMode === "solo" ? "1 player" : 
                           tournament.gameMode === "duo" ? "2 players" : 
                           tournament.gameMode === "squad" ? "4 players" : 
                           "Custom"}
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/40 p-3 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Match Format</div>
                        <div className="font-medium">
                          {tournament.tournamentType === "seasonal" ? "Best of 5" : "Best of 3"}
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/40 p-3 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Map Selection</div>
                        <div className="font-medium">Random from official map pool</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Penalties & Violations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 border border-red-900/30 bg-red-900/10 rounded-md">
                        <span>Cheating/Hacking</span>
                        <Badge className="bg-red-700">Permanent Ban</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border border-red-900/30 bg-red-900/10 rounded-md">
                        <span>No-show</span>
                        <Badge className="bg-yellow-700">Disqualification</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border border-red-900/30 bg-red-900/10 rounded-md">
                        <span>Unsportsmanlike conduct</span>
                        <Badge className="bg-yellow-700">Warning/Ban</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border border-red-900/30 bg-red-900/10 rounded-md">
                        <span>Account sharing</span>
                        <Badge className="bg-red-700">Disqualification</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border border-red-900/30 bg-red-900/10 rounded-md">
                        <span>Teaming in solo mode</span>
                        <Badge className="bg-red-700">Disqualification</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-between border-gray-700 hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          <span>Tournament Rulebook</span>
                        </div>
                        <Badge variant="outline">PDF</Badge>
                      </Button>
                      <Button variant="outline" className="w-full justify-between border-gray-700 hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          <span>Schedule &amp; Format</span>
                        </div>
                        <Badge variant="outline">PDF</Badge>
                      </Button>
                      <Button variant="outline" className="w-full justify-between border-gray-700 hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          <span>Map Selection Guide</span>
                        </div>
                        <Badge variant="outline">PDF</Badge>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Registered Participants
                        </CardTitle>
                        <CardDescription>
                          {registrations?.length || 0} out of {tournament.maxParticipants} spots filled
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(registrations?.length || 0) / tournament.maxParticipants * 100} 
                          className="h-2 w-40" 
                        />
                        <Select defaultValue="all">
                          <SelectTrigger className="w-36 h-8 text-xs bg-gray-900 border-gray-700">
                            <SelectValue placeholder="Filter" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="all">All Participants</SelectItem>
                            <SelectItem value="solo">Solo Players</SelectItem>
                            <SelectItem value="teams">Teams Only</SelectItem>
                            <SelectItem value="verified">Verified Players</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {enhancedRegistrations && enhancedRegistrations.length > 0 ? (
                      <div className="space-y-4">
                        <div className="overflow-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-xs text-gray-400 border-b border-gray-800">
                                <th className="pb-2 font-medium">Rank</th>
                                <th className="pb-2 font-medium">Player/Team</th>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 font-medium">Skill Rating</th>
                                <th className="pb-2 font-medium">Previous Tournaments</th>
                                <th className="pb-2 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {enhancedRegistrations.map((registration: any, index: number) => (
                                <tr 
                                  key={registration.id} 
                                  className="border-b border-gray-800/50 hover:bg-gray-900/40 transition-colors"
                                >
                                  <td className="py-3">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      index === 0 ? "bg-yellow-500 text-black" : 
                                      index === 1 ? "bg-gray-400 text-black" : 
                                      index === 2 ? "bg-amber-700 text-white" : 
                                      "bg-gray-700 text-white"
                                    }`}>{index + 1}</div>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={registration.userAvatar || ""} alt={registration.userName} />
                                        <AvatarFallback>{registration.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">{registration.userName}</div>
                                        {registration.teamName && (
                                          <div className="text-xs text-gray-400">
                                            Team: {registration.teamName}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <Badge className={`${
                                      registration.status === "accepted" ? "bg-green-600 hover:bg-green-700" :
                                      registration.status === "pending" ? "bg-yellow-600 hover:bg-yellow-700" :
                                      "bg-red-600 hover:bg-red-700"
                                    }`}>
                                      {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                    </Badge>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full ${
                                            registration.skill > 80 ? "bg-green-500" :
                                            registration.skill > 50 ? "bg-blue-500" :
                                            registration.skill > 30 ? "bg-yellow-500" :
                                            "bg-red-500"
                                          }`}
                                          style={{ width: `${registration.skill}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm">{registration.skill}</span>
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-1">
                                      <Flag className="h-3 w-3 text-gray-400" />
                                      <span>{registration.previousTournaments}</span>
                                      <span className="text-gray-400 ml-1">/</span>
                                      <Trophy className="h-3 w-3 text-yellow-500" />
                                      <span>{registration.wins}</span>
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                      <Eye className="h-3 w-3 mr-1" />
                                      View Profile
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">No Participants Yet</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                          Be the first to register for this tournament!
                        </p>
                        
                        {isRegistrationOpen && !isUserRegistered && (
                          <Button 
                            className="mt-4 bg-primary hover:bg-primary/90"
                            onClick={() => {
                              if (tournament.gameMode === "solo") {
                                handleRegister(null);
                              } else {
                                setRegistrationModalOpen(true);
                              }
                            }}
                          >
                            Register Now
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      Registration Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-400">Capacity</span>
                          <span className="font-medium">
                            {registrations?.length || 0}/{tournament.maxParticipants}
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${(registrations?.length || 0) / tournament.maxParticipants * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-800" />
                      
                      {tournament.gameMode !== "solo" && (
                        <div>
                          <h4 className="text-sm font-medium mb-3">Team Distribution</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Teams</span>
                              <span>{enhancedRegistrations?.filter((r: any) => r.teamName).length || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Solo Players</span>
                              <span>{enhancedRegistrations?.filter((r: any) => !r.teamName).length || 0}</span>
                            </div>
                            
                            <div className="w-full bg-gray-800 rounded-full h-2.5 mt-1">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-l-full" 
                                style={{ 
                                  width: `${enhancedRegistrations ? 
                                    (enhancedRegistrations.filter((r: any) => r.teamName).length / enhancedRegistrations.length * 100) : 0}%` 
                                }}
                              ></div>
                            </div>
                            <div className="flex text-xs text-gray-400 pt-1">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                                <span>Teams</span>
                              </div>
                              <div className="flex items-center ml-4">
                                <div className="w-2 h-2 bg-gray-600 rounded-full mr-1"></div>
                                <span>Solo Players</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <Separator className="bg-gray-800" />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Registration Trend</h4>
                        <div className="h-32 relative">
                          {/* This would be a real chart in a production app */}
                          <div className="absolute inset-0 flex items-end">
                            {Array.from({ length: 7 }).map((_, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center">
                                <div 
                                  className="w-full max-w-[12px] bg-primary/70 rounded-t-sm mx-auto"
                                  style={{ 
                                    height: `${Math.random() * 70 + 10}%`,
                                    opacity: i === 6 ? 1 : 0.6 + (i * 0.05)
                                  }}
                                ></div>
                                <div className="text-xs text-gray-500 mt-1">D-{7-i}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {isRegistrationOpen && !isUserRegistered && (
                  <Card className="border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-lg shadow-lg shadow-primary/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        Special Rewards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                          <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Flame className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Early Bird Bonus</div>
                            <div className="text-xs text-gray-400">Register within next 24 hours</div>
                          </div>
                          <div className="text-yellow-500 font-bold">+100 XP</div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Team Bonus</div>
                            <div className="text-xs text-gray-400">Register with a complete team</div>
                          </div>
                          <div className="text-green-500 font-bold">+50 XP</div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Share className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Referral Reward</div>
                            <div className="text-xs text-gray-400">Invite friends to register</div>
                          </div>
                          <div className="text-blue-500 font-bold">+25 XP each</div>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-4 bg-primary hover:bg-primary/90" onClick={() => {
                        if (tournament.gameMode === "solo") {
                          handleRegister(null);
                        } else {
                          setRegistrationModalOpen(true);
                        }
                      }}>
                        <Zap className="h-4 w-4 mr-2" />
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Brackets Tab */}
          <TabsContent value="brackets" className="mt-0">
            <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Swords className="h-5 w-5 text-primary" />
                      Tournament Brackets & Matches
                    </CardTitle>
                    <CardDescription>
                      View match schedule, results, and tournament progress
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-36 h-8 text-xs bg-gray-900 border-gray-700">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="all">All Matches</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="live">Live Now</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 border-gray-700"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refresh brackets</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {bracketData && bracketData.length > 0 ? (
                  <div className="space-y-8">
                    {/* Tournament Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-400">Tournament Progress</span>
                        <span>{getCompletedMatchesCount(matches)} / {matches?.length || 0} matches completed</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${getCompletedMatchesCount(matches) / (matches?.length || 1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Bracket Visualization */}
                    <TournamentBracket rounds={bracketData} />
                    
                    {/* Live Match */}
                    {getLiveMatches(matches).length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-white">Live Matches</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {getLiveMatches(matches).slice(0, 2).map((match: Match) => (
                            <div 
                              key={match.id} 
                              className="bg-gradient-to-br from-gray-900/80 to-gray-900/30 rounded-lg border border-red-900/30 overflow-hidden"
                            >
                              <div className="bg-red-900/20 px-4 py-2 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                  <span className="font-medium">Round {match.round} - Match #{match.matchNumber}</span>
                                </div>
                                <Badge className="bg-red-700">Live Now</Badge>
                              </div>
                              
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="text-sm text-gray-400">
                                    Started {getTimeAgo(new Date(match.scheduledTime))}
                                  </div>
                                  <Button size="sm" className="h-7 px-3 py-0 bg-red-600 hover:bg-red-700">
                                    <Play className="h-3 w-3 mr-1" />
                                    Watch Live
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-5 items-center mb-4">
                                  <div className="col-span-2 flex flex-col items-center">
                                    <Avatar className="h-16 w-16 mb-2">
                                      <AvatarImage src={match.team1Logo || ""} alt={match.team1Name} />
                                      <AvatarFallback className="bg-blue-900/50 text-lg">
                                        {match.team1Name?.substring(0, 2).toUpperCase() || "T1"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium text-center">{match.team1Name || "TBD"}</div>
                                  </div>
                                  
                                  <div className="flex flex-col items-center">
                                    <div className="text-3xl font-bold mb-2 flex items-center justify-center w-full">
                                      <span className="text-blue-500">{match.team1Score || 0}</span>
                                      <span className="mx-2 text-gray-600">-</span>
                                      <span className="text-red-500">{match.team2Score || 0}</span>
                                    </div>
                                    <Badge variant="outline" className="border-gray-700">
                                      In Progress
                                    </Badge>
                                  </div>
                                  
                                  <div className="col-span-2 flex flex-col items-center">
                                    <Avatar className="h-16 w-16 mb-2">
                                      <AvatarImage src={match.team2Logo || ""} alt={match.team2Name} />
                                      <AvatarFallback className="bg-red-900/50 text-lg">
                                        {match.team2Name?.substring(0, 2).toUpperCase() || "T2"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium text-center">{match.team2Name || "TBD"}</div>
                                  </div>
                                </div>
                                
                                <div className="border-t border-gray-800 pt-3 mt-2 flex items-center justify-between">
                                  <div className="text-sm text-gray-400 flex items-center">
                                    <Eye className="h-3 w-3 mr-1" />
                                    <span>{Math.floor(Math.random() * 500) + 100} watching</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                      <MessageSquare className="h-3 w-3 mr-1" />
                                      Live Chat
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                      <BarChart className="h-3 w-3 mr-1" />
                                      Stats
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Upcoming Matches */}
                    <div>
                      <h3 className="text-xl font-medium mb-4">Upcoming Matches</h3>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3">
                          {matches
                            ?.filter((match: Match) => match.status === "scheduled")
                            .sort((a: Match, b: Match) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                            .map((match: Match) => (
                              <motion.div
                                key={match.id}
                                className="bg-gray-900/40 border border-gray-800 rounded-lg p-4"
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-600 hover:bg-blue-700">Round {match.round}</Badge>
                                    <span className="text-sm text-gray-400">Match #{match.matchNumber}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                    <span className="text-gray-300">{formatDate(new Date(match.scheduledTime))}</span>
                                    <span className="mx-1">•</span>
                                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                    <span className="text-gray-300">{formatTime(new Date(match.scheduledTime))}</span>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-900/60 p-4 rounded-lg">
                                  <div className="grid grid-cols-3 items-center">
                                    <div className="flex flex-col items-center">
                                      <Avatar className="h-12 w-12 mb-2">
                                        <AvatarImage src={match.team1Logo || ""} alt={match.team1Name} />
                                        <AvatarFallback className="bg-blue-900/50">
                                          {match.team1Name?.substring(0, 2).toUpperCase() || "T1"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="font-medium text-center">{match.team1Name || "TBD"}</div>
                                    </div>
                                    
                                    <div className="flex flex-col items-center">
                                      <div className="text-2xl font-bold text-gray-400 mb-2">VS</div>
                                      <div className="bg-gray-800 px-3 py-1 rounded text-xs text-gray-300 flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>{formatTime(new Date(match.scheduledTime))}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-center">
                                      <Avatar className="h-12 w-12 mb-2">
                                        <AvatarImage src={match.team2Logo || ""} alt={match.team2Name} />
                                        <AvatarFallback className="bg-red-900/50">
                                          {match.team2Name?.substring(0, 2).toUpperCase() || "T2"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="font-medium text-center">{match.team2Name || "TBD"}</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-3 flex items-center justify-between">
                                  <div className="text-sm text-gray-400">
                                    {getTimeUntilMatch(new Date(match.scheduledTime))}
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800">
                                      <Bell className="h-3 w-3 mr-1" />
                                      Remind me
                                    </Button>
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Add to Calendar
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Swords className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Brackets Not Available</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Brackets and match schedules will be available once the tournament begins.
                    </p>
                    {isRegistrationOpen && (
                      <Button className="mt-6 bg-primary hover:bg-primary/90" onClick={() => {
                        if (tournament.gameMode === "solo") {
                          handleRegister(null);
                        } else {
                          setRegistrationModalOpen(true);
                        }
                      }}>
                        Register for Tournament
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>

      {/* Team Selection Modal */}
      <TeamSelectionModal
        isOpen={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        teams={userTeams || []}
        onRegister={handleRegister}
        loading={false}
        gameMode={tournament.gameMode}
      />
    </div>
  );
}

// Helper function to get position name
function getPositionName(position: number) {
  switch (position) {
    case 1: return "1st Place";
    case 2: return "2nd Place";
    case 3: return "3rd Place";
    default: return `${position}th Place`;
  }
}

// Helper function to format date
function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Helper function to format time
function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Helper function to get time until match
function getTimeUntilMatch(date: Date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff <= 0) return "Starting soon";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `Starts in ${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
  return `Starts in ${minutes} minute${minutes > 1 ? 's' : ''}`;
}

// Helper function to get time ago
function getTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${hours} hour${hours > 1 ? 's' : ''} ago`;
}

// Helper function to get completed matches count
function getCompletedMatchesCount(matches: Match[] | undefined) {
  if (!matches) return 0;
  return matches.filter(match => match.status === "completed").length;
}

// Helper function to get live matches
function getLiveMatches(matches: Match[] | undefined) {
  if (!matches) return [];
  return matches.filter(match => match.status === "in_progress");
}