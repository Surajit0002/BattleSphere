import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  Play
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
}

// Define match interface
interface Match {
  id: number;
  tournamentId: number;
  round: number;
  matchNumber: number;
  team1Id: number | null;
  team2Id: null;
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
}

// Define bracket interface
interface Bracket {
  id: number;
  tournamentId: number;
  round: number;
  matches: Match[];
}

export default function TournamentDetailsEnhanced() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const tournamentId = parseInt(id || "0");
  const [activeTab, setActiveTab] = useState("overview");
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
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

  // Calculate time remaining for registration or tournament start
  const getTimeRemaining = () => {
    if (!tournament) return { days: 0, hours: 0, minutes: 0, type: "" };

    const now = new Date();
    const registrationEndDate = tournament.registrationEndDate ? new Date(tournament.registrationEndDate) : null;
    const startDate = new Date(tournament.startDate);

    let targetDate;
    let type;

    if (registrationEndDate && now < registrationEndDate) {
      targetDate = registrationEndDate;
      type = "registration";
    } else if (now < startDate) {
      targetDate = startDate;
      type = "tournament";
    } else {
      return { days: 0, hours: 0, minutes: 0, type: "" };
    }

    const diff = targetDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, type };
  };

  const timeRemaining = getTimeRemaining();

  // Group matches by round
  const getBracketData = () => {
    if (!matches) return [];

    const rounds: { [key: number]: Match[] } = {};
    matches.forEach((match: Match) => {
      if (!rounds[match.round]) rounds[match.round] = [];
      rounds[match.round].push(match);
    });

    return Object.keys(rounds).map((round) => ({
      round: parseInt(round),
      matches: rounds[parseInt(round)],
    }));
  };

  const bracketData = getBracketData();

  if (isLoadingTournament) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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

  return (
    <div className="container py-10 min-h-screen bg-black bg-dot-white/[0.2]">
      {/* Tournament Hero Section */}
      <div className="relative rounded-lg overflow-hidden mb-8">
        <div className="h-64 bg-gradient-to-r from-purple-900 to-blue-900 relative">
          {game && (
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center" 
              style={{ backgroundImage: `url(${game.imageUrl})` }}
            ></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getTournamentStatusBadge(tournament.status)}
                  {tournament.isFeatured && (
                    <Badge className="bg-yellow-600 hover:bg-yellow-700">
                      <Trophy className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tournament.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
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
                    <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-green-500" />
                    <span>{registrations?.length || 0}/{tournament.maxParticipants} Participants</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-300">Prize Pool:</span>
                  <span className="font-bold text-white">₹{tournament.prizePool.toLocaleString()}</span>
                </div>
                {tournament.entryFee > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-300">Entry Fee:</span>
                    <span className="font-bold text-white">₹{tournament.entryFee}</span>
                  </div>
                )}
                
                {isRegistrationOpen ? (
                  <Button 
                    className="mt-2 bg-primary hover:bg-primary/90"
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
                  <Button variant="outline" className="mt-2 border-red-700 text-red-400" disabled>
                    Registration Closed
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Remaining */}
      {timeRemaining.type && (
        <Card className="mb-8 border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <div>
                  <span className="font-medium">
                    {timeRemaining.type === "registration" 
                      ? "Registration Ends In" 
                      : "Tournament Starts In"}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-gray-900/60 rounded-lg py-2 px-3 sm:px-6 text-center">
                  <div className="text-2xl font-bold">{timeRemaining.days}</div>
                  <div className="text-xs text-gray-400">Days</div>
                </div>
                <div className="bg-gray-900/60 rounded-lg py-2 px-3 sm:px-6 text-center">
                  <div className="text-2xl font-bold">{timeRemaining.hours}</div>
                  <div className="text-xs text-gray-400">Hours</div>
                </div>
                <div className="bg-gray-900/60 rounded-lg py-2 px-3 sm:px-6 text-center">
                  <div className="text-2xl font-bold">{timeRemaining.minutes}</div>
                  <div className="text-xs text-gray-400">Minutes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
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
            <Card className="md:col-span-2 border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Tournament Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <p>{tournament.description}</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                  <div className="bg-gray-900/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Tournament Type</div>
                    <div className="font-medium capitalize">{tournament.tournamentType}</div>
                  </div>
                  <div className="bg-gray-900/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Game Mode</div>
                    <div className="font-medium capitalize">{tournament.gameMode}</div>
                  </div>
                  <div className="bg-gray-900/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Start Date</div>
                    <div className="font-medium">{new Date(tournament.startDate).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-gray-900/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">
                      {tournament.endDate ? "End Date" : "Estimated End"}
                    </div>
                    <div className="font-medium">
                      {tournament.endDate 
                        ? new Date(tournament.endDate).toLocaleDateString() 
                        : "TBD"
                      }
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Prize Distribution */}
                  <div className="flex-1 bg-gray-900/20 border border-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Prize Distribution
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold">1</div>
                          <span>1st Place</span>
                        </div>
                        <div className="font-bold">₹{Math.floor(tournament.prizePool * 0.5)}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold">2</div>
                          <span>2nd Place</span>
                        </div>
                        <div className="font-bold">₹{Math.floor(tournament.prizePool * 0.3)}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-amber-700 flex items-center justify-center text-xs font-bold">3</div>
                          <span>3rd Place</span>
                        </div>
                        <div className="font-bold">₹{Math.floor(tournament.prizePool * 0.2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Game Information */}
                  {game && (
                    <div className="flex-1 bg-gray-900/20 border border-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Gamepad2 className="h-5 w-5 text-blue-500" />
                        Game Information
                      </h3>
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                          <img 
                            src={game.imageUrl} 
                            alt={game.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{game.name}</h4>
                          <p className="text-sm text-gray-400 line-clamp-2 mb-2">{game.description}</p>
                          <div className="flex gap-2">
                            {game.androidUrl && (
                              <Button variant="outline" size="sm" className="h-8 border-gray-700 hover:bg-gray-800" asChild>
                                <a href={game.androidUrl} target="_blank" rel="noopener noreferrer">
                                  <Link2 className="h-3 w-3 mr-1" />
                                  Android
                                </a>
                              </Button>
                            )}
                            {game.iosUrl && (
                              <Button variant="outline" size="sm" className="h-8 border-gray-700 hover:bg-gray-800" asChild>
                                <a href={game.iosUrl} target="_blank" rel="noopener noreferrer">
                                  <Link2 className="h-3 w-3 mr-1" />
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

            {/* Registration Status & Stats */}
            <div className="space-y-6">
              {/* Registration Status */}
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
                      {isUserRegistered ? "Already Registered" : "Register for Tournament"}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full mt-2 border-red-700 text-red-400" disabled>
                      Registration Closed
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Tournament Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/40 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Total Prize</div>
                      <div className="font-medium text-lg text-yellow-500">₹{tournament.prizePool.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-900/40 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Matches</div>
                      <div className="font-medium text-lg">{matches?.length || 0}</div>
                    </div>
                    <div className="bg-gray-900/40 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Teams</div>
                      <div className="font-medium text-lg">{
                        tournament.gameMode !== 'solo' ? registrations?.filter(
                          (reg: Registration) => reg.teamId !== null
                        ).length : '-'
                      }</div>
                    </div>
                    <div className="bg-gray-900/40 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Solo Players</div>
                      <div className="font-medium text-lg">{
                        tournament.gameMode === 'solo' ? registrations?.length || 0 : '-'
                      }</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tournament Actions */}
              <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Share & Follow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      Watch Tournament Stream
                    </Button>
                    <Button variant="outline" className="w-full gap-2 border-gray-700 hover:bg-gray-800">
                      <Flag className="h-4 w-4" />
                      Follow Tournament
                    </Button>
                    <Button variant="outline" className="w-full gap-2 border-gray-700 hover:bg-gray-800">
                      <Share2 className="h-4 w-4" />
                      Share Tournament
                    </Button>
                    <Button variant="outline" className="w-full gap-2 border-gray-700 hover:bg-gray-800">
                      <MessageSquare className="h-4 w-4" />
                      Tournament Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="mt-0">
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
                  <li>First Place: ₹{Math.floor(tournament.prizePool * 0.5)}</li>
                  <li>Second Place: ₹{Math.floor(tournament.prizePool * 0.3)}</li>
                  <li>Third Place: ₹{Math.floor(tournament.prizePool * 0.2)}</li>
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
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="mt-0">
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
                
                <div>
                  <Progress 
                    value={(registrations?.length || 0) / tournament.maxParticipants * 100} 
                    className="h-2 w-40" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {registrations && registrations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {registrations.map((registration: Registration) => (
                    <div key={registration.id} className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={registration.userAvatar || ""} alt={registration.userName} />
                        <AvatarFallback>{registration.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{registration.userName}</div>
                        {registration.teamName && (
                          <div className="text-sm text-gray-400 truncate">
                            Team: {registration.teamName}
                          </div>
                        )}
                      </div>
                      <Badge className={`${
                        registration.status === "accepted" ? "bg-green-600 hover:bg-green-700" :
                        registration.status === "pending" ? "bg-yellow-600 hover:bg-yellow-700" :
                        "bg-red-600 hover:bg-red-700"
                      }`}>
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
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
        </TabsContent>

        {/* Brackets Tab */}
        <TabsContent value="brackets" className="mt-0">
          <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                Tournament Brackets
              </CardTitle>
              <CardDescription>
                View match schedule and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matches && matches.length > 0 ? (
                <div className="space-y-6">
                  {/* Bracket Visualization */}
                  <div className="overflow-auto pb-6">
                    <div className="min-w-[800px]">
                      <div className="grid grid-cols-4 gap-4">
                        {bracketData.map((round, index) => (
                          <div key={index} className="space-y-4">
                            <h3 className="text-center font-medium py-2 bg-gray-900/60 rounded-md">
                              Round {round.round}
                            </h3>
                            
                            {round.matches.map((match) => (
                              <div key={match.id} className="bg-gray-900/40 border border-gray-800 rounded-lg p-3">
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
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={match.team1Logo || ""} alt={match.team1Name} />
                                        <AvatarFallback>{match.team1Name?.substring(0, 2).toUpperCase() || "T1"}</AvatarFallback>
                                      </Avatar>
                                      <span className="font-medium truncate">{match.team1Name || "TBD"}</span>
                                    </div>
                                    <span className="font-bold">{match.team1Score !== null ? match.team1Score : "-"}</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
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
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{new Date(match.scheduledTime).toLocaleDateString()}</span>
                                  </div>
                                  {match.status === "in_progress" && match.streamUrl && (
                                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-primary">
                                      <Eye className="h-3 w-3 mr-1" />
                                      Watch
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Upcoming Matches */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Upcoming Matches</h3>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {matches
                          .filter((match: Match) => match.status === "scheduled")
                          .sort((a: Match, b: Match) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                          .map((match: Match) => (
                            <div key={match.id} className="bg-gray-900/40 border border-gray-800 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-blue-600 hover:bg-blue-700">Round {match.round}</Badge>
                                  <span className="text-sm text-gray-400">Match #{match.matchNumber}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-400">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{new Date(match.scheduledTime).toLocaleDateString()}</span>
                                  <span className="mx-1">•</span>
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{new Date(match.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                              </div>
                              
                              <div className="bg-gray-900/60 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={match.team1Logo || ""} alt={match.team1Name} />
                                    <AvatarFallback>{match.team1Name?.substring(0, 2).toUpperCase() || "T1"}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{match.team1Name || "TBD"}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <span className="mx-4 text-gray-400">VS</span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{match.team2Name || "TBD"}</span>
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={match.team2Logo || ""} alt={match.team2Name} />
                                    <AvatarFallback>{match.team2Name?.substring(0, 2).toUpperCase() || "T2"}</AvatarFallback>
                                  </Avatar>
                                </div>
                              </div>
                            </div>
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </div>

      {/* Team Selection Modal would be here in a real implementation */}
    </div>
  );
}