import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Users, Clock, AlarmClock, PlayCircle, Award, CheckCircle2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import RootLayout from "@/layouts/RootLayout";
import { Tournament, Match, Game, TournamentRegistration } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentDetail() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const tournamentId = id ? parseInt(id) : 0;

  // Query tournament data
  const { data: tournament, isLoading: tournamentLoading } = useQuery<Tournament>({
    queryKey: ['/api/tournaments', tournamentId],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${tournamentId}`);
      if (!response.ok) throw new Error('Failed to fetch tournament');
      return response.json();
    },
    enabled: !!tournamentId && !isNaN(tournamentId),
  });

  // Query game data
  const { data: game, isLoading: gameLoading } = useQuery<Game>({
    queryKey: ['/api/games', tournament?.gameId],
    queryFn: async () => {
      const response = await fetch(`/api/games/${tournament?.gameId}`);
      if (!response.ok) throw new Error('Failed to fetch game');
      return response.json();
    },
    enabled: !!tournament?.gameId,
  });

  // Query matches
  const { data: matches, isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: ['/api/tournaments', tournamentId, 'matches'],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${tournamentId}/matches`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      return response.json();
    },
    enabled: !!tournamentId && !isNaN(tournamentId),
  });

  // Query registrations
  const { data: registrations, isLoading: registrationsLoading } = useQuery<TournamentRegistration[]>({
    queryKey: ['/api/tournaments', tournamentId, 'registrations'],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${tournamentId}/registrations`);
      if (!response.ok) throw new Error('Failed to fetch registrations');
      return response.json();
    },
    enabled: !!tournamentId && !isNaN(tournamentId),
  });

  // Register current user for tournament
  const handleRegister = async () => {
    try {
      const response = await apiRequest(
        'POST',
        `/api/tournaments/${tournamentId}/register`
      );

      if (response.ok) {
        queryClient.invalidateQueries({
          queryKey: ['/api/tournaments', tournamentId, 'registrations']
        });
        toast({
          title: "Registration successful",
          description: "You have successfully registered for this tournament",
        });
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  if (tournamentLoading) {
    return (
      <RootLayout>
        <div className="container py-10">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (!tournament) {
    return (
      <RootLayout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold">Tournament not found</h1>
          <p className="mt-4">The tournament you're looking for doesn't exist or has been removed.</p>
          <Button 
            className="mt-6" 
            onClick={() => navigate('/tournaments')}
          >
            Back to Tournaments
          </Button>
        </div>
      </RootLayout>
    );
  }

  // Format dates for display
  const startDate = new Date(tournament.startDate);
  const endDate = tournament.endDate ? new Date(tournament.endDate) : null;

  // Calculate time status
  const now = new Date();
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && (!endDate || endDate > now);
  const isCompleted = endDate && endDate < now;

  return (
    <RootLayout>
      <div className="container py-10">
        {/* Tournament header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
              <Badge variant={
                tournament.status === "upcoming" ? "outline" :
                tournament.status === "ongoing" ? "default" :
                "secondary"
              }>
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </Badge>
              {tournament.featured && (
                <Badge variant="destructive">Featured</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              {!gameLoading && game && (
                <span className="flex items-center gap-1.5">
                  <PlayCircle size={16} />
                  {game.name}
                </span>
              )}
              <span className="flex items-center gap-1.5 ml-4">
                <Users size={16} />
                {tournament.currentPlayers}/{tournament.maxPlayers} Players
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {isUpcoming && (
              <Button onClick={handleRegister}>
                Register Now
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/tournaments")}>
              Back to Tournaments
            </Button>
          </div>
        </div>

        {/* Tournament details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar size={18} />
                Tournament Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">{format(startDate, 'PPP')}</span>
                </div>
                {endDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">{format(endDate, 'PPP')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">
                    {isUpcoming && `Starts ${formatDistanceToNow(startDate, { addSuffix: true })}`}
                    {isOngoing && 'Tournament is live'}
                    {isCompleted && 'Tournament completed'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Trophy size={18} />
                Prize & Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prize Pool:</span>
                  <span className="font-medium">${tournament.prizePool}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Game Mode:</span>
                  <span className="font-medium capitalize">{tournament.gameMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entry Type:</span>
                  <span className="font-medium capitalize">{tournament.tournamentType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users size={18} />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registered:</span>
                  <span className="font-medium">{tournament.currentPlayers} players</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Capacity:</span>
                  <span className="font-medium">{tournament.maxPlayers} players</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spots Left:</span>
                  <span className="font-medium">{Math.max(0, tournament.maxPlayers - tournament.currentPlayers)} spots</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tournament content tabs */}
        <Tabs defaultValue="overview" className="w-full mt-6">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Tournament Description</h3>
              <p className="text-muted-foreground">
                {tournament.description || "No description provided for this tournament."}
              </p>
            </div>
            
            {tournament.winnerTeamId && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Tournament Winner</h3>
                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <Trophy className="w-10 h-10 mr-4 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Team ID: {tournament.winnerTeamId}</p>
                    <p className="text-sm text-muted-foreground">Congratulations to the champions!</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="matches">
            {matchesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : matches && matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <Card key={match.id} className="overflow-hidden">
                    <div className="border-b p-4 bg-muted/50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={match.status === "completed" ? "default" : "outline"}
                          className="capitalize"
                        >
                          {match.status}
                        </Badge>
                        <span className="text-sm font-medium">
                          Round {match.round} • Match {match.matchNumber}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(match.scheduledTime), 'PPp')}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 text-center">
                          <p className="font-medium">Team 1 {match.team1Id ? `(ID: ${match.team1Id})` : "TBD"}</p>
                          {match.status === "completed" && (
                            <p className="text-2xl font-bold">{match.team1Score || 0}</p>
                          )}
                        </div>
                        <div className="mx-4 text-lg font-bold text-muted-foreground">VS</div>
                        <div className="flex-1 text-center">
                          <p className="font-medium">Team 2 {match.team2Id ? `(ID: ${match.team2Id})` : "TBD"}</p>
                          {match.status === "completed" && (
                            <p className="text-2xl font-bold">{match.team2Score || 0}</p>
                          )}
                        </div>
                      </div>
                      
                      {match.status === "completed" && match.winnerId && (
                        <div className="mt-4 p-2 bg-primary-foreground/30 rounded-md flex items-center justify-center">
                          <Trophy size={16} className="mr-2 text-yellow-500" />
                          <span className="font-medium">Winner: Team ID {match.winnerId}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No matches scheduled yet</h3>
                <p className="text-muted-foreground mt-1">
                  Match schedule will be available closer to the tournament start date.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="participants">
            {registrationsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : registrations && registrations.length > 0 ? (
              <div className="space-y-1 border rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-muted p-3 font-medium">
                  <div>User ID</div>
                  <div>Team ID</div>
                  <div>Registration Date</div>
                  <div>Status</div>
                </div>
                <Separator />
                {registrations.map((reg) => (
                  <div key={reg.id} className="grid grid-cols-4 p-3 hover:bg-muted/50">
                    <div>{reg.userId}</div>
                    <div>{reg.teamId || 'N/A'}</div>
                    <div>{new Date(reg.registeredAt).toLocaleDateString()}</div>
                    <div className="flex items-center">
                      <Badge 
                        variant={reg.status === "approved" ? "default" : 
                                reg.status === "pending" ? "outline" : "destructive"}
                        className="capitalize"
                      >
                        {reg.status}
                      </Badge>
                      {reg.status === "approved" && (
                        <CheckCircle2 size={14} className="ml-2 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No participants yet</h3>
                <p className="text-muted-foreground mt-1">
                  Be the first to register for this tournament!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rules">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Tournament Rules</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlarmClock size={18} /> Check-in Requirements
                    </h4>
                    <p className="mt-2 text-muted-foreground">
                      All players must check in 30 minutes before the tournament starts. 
                      Failure to check in will result in disqualification.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Users size={18} /> Team/Player Requirements
                    </h4>
                    <p className="mt-2 text-muted-foreground">
                      {tournament.gameMode === "solo" ? "This is a solo tournament, no teams allowed." :
                       tournament.gameMode === "duo" ? "Teams must consist of exactly 2 players." :
                       tournament.gameMode === "squad" ? "Teams must consist of exactly 4 players." :
                       "Teams must follow the custom player count requirements specified by the organizer."}
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <PlayCircle size={18} /> Game Rules
                    </h4>
                    <p className="mt-2 text-muted-foreground">
                      Standard competitive rules apply. Any form of hacking, exploiting, or unsportsmanlike 
                      conduct will result in immediate disqualification. Tournament admins have the final say 
                      in all disputes.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Award size={18} /> Prize Distribution
                    </h4>
                    <p className="mt-2 text-muted-foreground">
                      Prize pool: ${tournament.prizePool}
                      <br />
                      1st Place: 60% of prize pool
                      <br />
                      2nd Place: 30% of prize pool
                      <br />
                      3rd Place: 10% of prize pool
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
}