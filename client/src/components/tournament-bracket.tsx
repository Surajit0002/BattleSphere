import { useState, useEffect } from "react";
import { Match, Team } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TournamentBracketProps {
  matches: Match[];
  teams: Team[];
  tournamentId: number;
  gameMode: string;
}

export default function TournamentBracket({ matches, teams, tournamentId, gameMode }: TournamentBracketProps) {
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [rounds, setRounds] = useState<Match[][]>([]);
  
  useEffect(() => {
    // Group matches by round
    if (matches?.length) {
      const maxRound = Math.max(...matches.map(match => match.round));
      const groupedMatches = [];
      
      for (let i = 1; i <= maxRound; i++) {
        const roundMatches = matches.filter(match => match.round === i);
        groupedMatches.push(roundMatches);
      }
      
      setRounds(groupedMatches);
      
      // Set selected round to the current active round or the latest round
      const currentRound = findCurrentRound(groupedMatches);
      if (currentRound > 0) {
        setSelectedRound(currentRound);
      }
    }
  }, [matches]);
  
  // Find the current active round (with in_progress matches) or the latest round with matches
  const findCurrentRound = (groupedMatches: Match[][]): number => {
    for (let i = 0; i < groupedMatches.length; i++) {
      const inProgressMatches = groupedMatches[i].filter(match => match.status === "in_progress");
      if (inProgressMatches.length > 0) {
        return i + 1;
      }
    }
    
    // If no in-progress matches, find the first round with scheduled matches
    for (let i = 0; i < groupedMatches.length; i++) {
      const scheduledMatches = groupedMatches[i].filter(match => match.status === "scheduled");
      if (scheduledMatches.length > 0) {
        return i + 1;
      }
    }
    
    // Default to last round if all completed
    return groupedMatches.length;
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };
  
  // Get team name
  const getTeamName = (teamId: number | null) => {
    if (!teamId) return "TBD";
    const team = teams?.find(t => t.id === teamId);
    return team?.name || "Unknown Team";
  };
  
  // Get team logo
  const getTeamLogo = (teamId: number | null) => {
    if (!teamId) return null;
    const team = teams?.find(t => t.id === teamId);
    return team?.logoUrl;
  };
  
  // Get match status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "text-accent-yellow bg-accent-yellow/20 border-accent-yellow/30";
      case "completed":
        return "text-accent-green bg-accent-green/20 border-accent-green/30";
      case "cancelled":
        return "text-destructive bg-destructive/20 border-destructive/30";
      default:
        return "text-primary bg-primary/20 border-primary/30";
    }
  };
  
  // Get match status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "in_progress":
        return "LIVE NOW";
      case "completed":
        return "COMPLETED";
      case "cancelled":
        return "CANCELLED";
      default:
        return "UPCOMING";
    }
  };
  
  // Get round name based on round number and total rounds
  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) {
      return "Finals";
    } else if (round === totalRounds - 1) {
      return "Semi-Finals";
    } else if (round === totalRounds - 2) {
      return "Quarter-Finals";
    } else {
      return `Round ${round}`;
    }
  };
  
  if (!matches || matches.length === 0) {
    return (
      <Card className="p-6 text-center bg-secondary-bg border-gray-800">
        <div className="text-lg text-gray-400 mb-4">
          Tournament bracket will be available once matches are scheduled.
        </div>
        <div className="text-sm text-gray-500">
          Check back after the registration period ends.
        </div>
      </Card>
    );
  }
  
  return (
    <div className="w-full">
      {/* Round selector */}
      <Tabs value={selectedRound.toString()} onValueChange={(value) => setSelectedRound(parseInt(value))}>
        <TabsList className="bg-secondary-bg border border-gray-800 p-1 mb-6 w-full overflow-x-auto flex-nowrap">
          {rounds.map((_, index) => (
            <TabsTrigger 
              key={index + 1}
              value={(index + 1).toString()}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {getRoundName(index + 1, rounds.length)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {rounds.map((roundMatches, index) => (
          <TabsContent key={index + 1} value={(index + 1).toString()} className="animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {roundMatches.map((match) => (
                <Card key={match.id} className="bg-gradient-to-b from-gray-900/50 to-black/70 border border-gray-800 overflow-hidden">
                  {/* Match header */}
                  <div className="flex items-center justify-between bg-secondary-bg/40 p-4 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(match.status)}>
                        {getStatusText(match.status)}
                      </Badge>
                      <span className="text-sm text-gray-400">Match #{match.matchNumber}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      {match.status === "scheduled" && (
                        <>
                          <CalendarDays className="h-4 w-4 mr-1.5" /> 
                          <span>{formatDateTime(match.scheduledTime).date}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1.5" /> 
                          <span>{formatDateTime(match.scheduledTime).time}</span>
                        </>
                      )}
                      {match.status === "in_progress" && (
                        <Badge className="bg-accent-red animate-pulse">LIVE</Badge>
                      )}
                      {match.status === "completed" && (
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 mr-1.5 text-accent-gold" /> 
                          <span className="text-accent-gold font-medium">
                            {getTeamName(match.winnerId)} Won
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Match teams */}
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex-shrink-0 overflow-hidden mr-4 border border-gray-700">
                        {match.team1Logo || getTeamLogo(match.team1Id) ? (
                          <img 
                            src={match.team1Logo || getTeamLogo(match.team1Id) || ""} 
                            alt={match.team1Name || getTeamName(match.team1Id)} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {match.team1Name || getTeamName(match.team1Id) ? (match.team1Name || getTeamName(match.team1Id)).charAt(0) : "?"}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="text-xl font-bold text-white">
                          {match.team1Name || getTeamName(match.team1Id)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {gameMode === "solo" ? "Player" : "Team"} 1
                        </div>
                      </div>
                      
                      <div className={`text-2xl font-bold ${match.status === "completed" && match.winnerId === match.team1Id ? "text-accent-gold" : "text-white"}`}>
                        {match.team1Score !== null ? match.team1Score : "-"}
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-gray-800 my-4"></div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex-shrink-0 overflow-hidden mr-4 border border-gray-700">
                        {match.team2Logo || getTeamLogo(match.team2Id) ? (
                          <img 
                            src={match.team2Logo || getTeamLogo(match.team2Id) || ""} 
                            alt={match.team2Name || getTeamName(match.team2Id)} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {match.team2Name || getTeamName(match.team2Id) ? (match.team2Name || getTeamName(match.team2Id)).charAt(0) : "?"}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="text-xl font-bold text-white">
                          {match.team2Name || getTeamName(match.team2Id)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {gameMode === "solo" ? "Player" : "Team"} 2
                        </div>
                      </div>
                      
                      <div className={`text-2xl font-bold ${match.status === "completed" && match.winnerId === match.team2Id ? "text-accent-gold" : "text-white"}`}>
                        {match.team2Score !== null ? match.team2Score : "-"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Match actions */}
                  <div className="p-4 bg-secondary-bg/30 border-t border-gray-800 flex justify-between">
                    {match.streamUrl ? (
                      <Button variant="default" className="bg-accent-red hover:bg-accent-red/90 text-white">
                        Watch Stream
                      </Button>
                    ) : (
                      <Button variant="outline" disabled={match.status !== "in_progress"} className="border-gray-700 text-gray-400">
                        No Stream Available
                      </Button>
                    )}
                    
                    <Button variant="outline" className="border-primary/30 text-primary">
                      Match Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}