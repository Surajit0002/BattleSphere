
import React, { useState, useEffect, useRef } from "react";
import { Match, Team, Tournament } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Trophy, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  ArrowUpRight, 
  Zap,
  Shield,
  Medal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdvancedBracketProps {
  matches: Match[];
  teams: Team[];
  tournament: Tournament;
  className?: string;
}

type ProcessedMatch = Match & {
  team1Name?: string;
  team2Name?: string;
  team1Logo?: string;
  team2Logo?: string;
  winnerName?: string;
  isHighlighted?: boolean;
  progression?: {
    nextMatchId?: number;
    position?: 'top' | 'bottom';
  };
};

type Round = {
  name: string;
  round: number;
  matches: ProcessedMatch[];
};

// Custom hook for bracket animations
const useBracketAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animateIn = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  };
  
  return { isAnimating, animateIn };
};

export default function AdvancedBracket({ 
  matches, 
  teams, 
  tournament, 
  className 
}: AdvancedBracketProps) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [viewType, setViewType] = useState<'horizontal' | 'vertical' | 'compact'>('horizontal');
  const [highlightedPath, setHighlightedPath] = useState<number[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const bracketRef = useRef<HTMLDivElement>(null);
  const { isAnimating, animateIn } = useBracketAnimation();

  // Process matches into rounds with team information
  useEffect(() => {
    if (!matches.length || !teams.length) return;
    
    // Helper function to get team name
    const getTeamName = (teamId: number | null): string => {
      if (!teamId) return "TBD";
      const team = teams.find(t => t.id === teamId);
      return team?.name || "Unknown Team";
    };
    
    // Helper function to get team logo
    const getTeamLogo = (teamId: number | null): string | undefined => {
      if (!teamId) return undefined;
      const team = teams.find(t => t.id === teamId);
      return team?.logoUrl || undefined;
    };
    
    // Group matches by round
    const matchesByRound: { [key: number]: ProcessedMatch[] } = {};
    matches.forEach(match => {
      if (!matchesByRound[match.round]) {
        matchesByRound[match.round] = [];
      }
      
      const processedMatch: ProcessedMatch = {
        ...match,
        team1Name: getTeamName(match.team1Id),
        team2Name: getTeamName(match.team2Id),
        team1Logo: getTeamLogo(match.team1Id),
        team2Logo: getTeamLogo(match.team2Id),
        winnerName: match.winnerId ? getTeamName(match.winnerId) : undefined
      };
      
      matchesByRound[match.round].push(processedMatch);
    });
    
    // Calculate progression paths
    Object.keys(matchesByRound).forEach(roundKey => {
      const roundNum = parseInt(roundKey);
      if (roundNum === Math.max(...Object.keys(matchesByRound).map(Number))) return;
      
      matchesByRound[roundNum].forEach((match, index) => {
        const nextRoundMatches = matchesByRound[roundNum + 1];
        if (!nextRoundMatches) return;
        
        // In a traditional bracket, match progression follows this pattern:
        // Matches 1 & 2 feed into next round's match 1, positions top & bottom
        // Matches 3 & 4 feed into next round's match 2, and so on
        const nextMatchIndex = Math.floor(index / 2);
        if (nextRoundMatches[nextMatchIndex]) {
          match.progression = {
            nextMatchId: nextRoundMatches[nextMatchIndex].id,
            position: index % 2 === 0 ? 'top' : 'bottom'
          };
        }
      });
    });
    
    // Convert to rounds array
    const processedRounds: Round[] = Object.keys(matchesByRound)
      .map(Number)
      .sort((a, b) => a - b)
      .map(roundNum => {
        // Create appropriate round name based on position
        let roundName;
        const totalRounds = Object.keys(matchesByRound).length;
        
        if (roundNum === totalRounds) {
          roundName = "Finals";
        } else if (roundNum === totalRounds - 1) {
          roundName = "Semi-Finals";
        } else if (roundNum === totalRounds - 2) {
          roundName = "Quarter-Finals";
        } else {
          roundName = `Round ${roundNum}`;
        }
        
        return {
          name: roundName,
          round: roundNum,
          matches: matchesByRound[roundNum].sort((a, b) => 
            (a.matchNumber || 0) - (b.matchNumber || 0)
          )
        };
      });
    
    setRounds(processedRounds);
  }, [matches, teams]);

  // Calculate path highlighting when a team is selected
  useEffect(() => {
    if (!selectedTeam || !rounds.length) {
      setHighlightedPath([]);
      return;
    }
    
    const path: number[] = [];
    let currentTeamId = selectedTeam;
    
    // Find all matches involving this team
    rounds.forEach(round => {
      const teamMatch = round.matches.find(match => 
        match.team1Id === currentTeamId || match.team2Id === currentTeamId
      );
      
      if (teamMatch) {
        path.push(teamMatch.id);
        // If this team won, update currentTeamId for next rounds
        if (teamMatch.winnerId === currentTeamId) {
          currentTeamId = teamMatch.winnerId;
        } else {
          // Team lost or match not played yet
          currentTeamId = -1; // Use invalid ID to avoid further matches
        }
      }
    });
    
    setHighlightedPath(path);
    animateIn();
  }, [selectedTeam, rounds]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };

  // Handle team selection
  const handleTeamSelect = (teamId: number | null) => {
    setSelectedTeam(teamId === selectedTeam ? null : teamId);
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.6));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  // Get match status styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30";
      case "completed":
        return "bg-accent-green/20 text-accent-green border-accent-green/30";
      case "scheduled":
        return "bg-primary/20 text-primary border-primary/30";
      default:
        return "bg-gray-700/20 text-gray-400 border-gray-700/30";
    }
  };

  // Render an individual match card
  const renderMatchCard = (match: ProcessedMatch, roundIndex: number) => {
    const isHighlighted = highlightedPath.includes(match.id);
    const isLive = match.status === "in_progress";
    const isCompleted = match.status === "completed";
    
    return (
      <motion.div
        key={match.id}
        className={cn(
          "rounded-lg overflow-hidden border transition-all duration-200",
          isHighlighted 
            ? "border-primary/50 shadow-[0_0_10px_rgba(0,128,255,0.3)]" 
            : "border-gray-800 shadow-md",
          isAnimating && isHighlighted ? "animate-pulse" : ""
        )}
        layoutId={`match-${match.id}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Match header */}
        <div className={cn(
          "px-3 py-2 text-xs font-medium",
          isHighlighted ? "bg-primary-900/50" : "bg-gray-900/50"
        )}>
          <div className="flex justify-between items-center">
            <span>Match #{match.matchNumber || "?"}</span>
            <Badge variant="outline" className={cn(
              "text-xs font-normal", 
              getStatusStyles(match.status || "")
            )}>
              {match.status === "in_progress" && 
                <span className="mr-1 inline-block w-2 h-2 rounded-full bg-accent-yellow animate-pulse"></span>
              }
              {match.status === "in_progress" ? "LIVE" : 
               match.status === "completed" ? "COMPLETED" : "SCHEDULED"}
            </Badge>
          </div>
        </div>
        
        {/* Match content */}
        <div className="p-3 bg-gradient-to-b from-gray-900/30 to-black/10">
          {/* Team 1 */}
          <div 
            className={cn(
              "flex items-center justify-between p-2 rounded-md hover:bg-gray-800/30 cursor-pointer transition-colors",
              match.winnerId === match.team1Id ? "bg-accent-green/10 border-l-2 border-accent-green" : "",
              match.team1Id === selectedTeam ? "bg-primary/10 border-l-2 border-primary" : "",
              !match.team1Id ? "opacity-60" : ""
            )}
            onClick={() => match.team1Id && handleTeamSelect(match.team1Id)}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden mr-2 border border-gray-700">
                {match.team1Logo ? (
                  <img src={match.team1Logo} alt={match.team1Name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-medium text-gray-400">
                    {match.team1Name ? match.team1Name.substring(0, 2).toUpperCase() : "?"}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium truncate max-w-[120px]">
                {match.team1Name}
              </span>
            </div>
            <div className="text-sm font-bold">
              {match.team1Score !== null ? match.team1Score : "-"}
            </div>
          </div>
          
          <div className="flex items-center justify-center my-2">
            <div className="h-px w-1/3 bg-gray-800"></div>
            <span className="mx-2 text-xs text-gray-500">VS</span>
            <div className="h-px w-1/3 bg-gray-800"></div>
          </div>
          
          {/* Team 2 */}
          <div 
            className={cn(
              "flex items-center justify-between p-2 rounded-md hover:bg-gray-800/30 cursor-pointer transition-colors",
              match.winnerId === match.team2Id ? "bg-accent-green/10 border-l-2 border-accent-green" : "",
              match.team2Id === selectedTeam ? "bg-primary/10 border-l-2 border-primary" : "",
              !match.team2Id ? "opacity-60" : ""
            )}
            onClick={() => match.team2Id && handleTeamSelect(match.team2Id)}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden mr-2 border border-gray-700">
                {match.team2Logo ? (
                  <img src={match.team2Logo} alt={match.team2Name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-medium text-gray-400">
                    {match.team2Name ? match.team2Name.substring(0, 2).toUpperCase() : "?"}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium truncate max-w-[120px]">
                {match.team2Name}
              </span>
            </div>
            <div className="text-sm font-bold">
              {match.team2Score !== null ? match.team2Score : "-"}
            </div>
          </div>
          
          {/* Match details */}
          {match.status !== "completed" && (
            <div className="mt-3 flex items-center justify-center text-xs text-gray-400">
              {match.scheduledTime && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="mr-2">{formatDate(match.scheduledTime).date}</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDate(match.scheduledTime).time}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Winner indicator */}
          {match.status === "completed" && match.winnerId && (
            <div className="mt-3 flex items-center justify-center text-xs">
              <div className="flex items-center bg-accent-gold/20 text-accent-gold px-2 py-1 rounded-full">
                <Trophy className="h-3 w-3 mr-1" />
                <span className="font-medium">{match.winnerName || "Winner"}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Render horizontal bracket view
  const renderHorizontalBracket = () => {
    return (
      <div className="flex overflow-x-auto pb-6 pt-2" style={{ minWidth: `${rounds.length * 280}px` }}>
        {rounds.map((round, roundIndex) => (
          <div key={round.round} className="px-3" style={{ width: `${100 / rounds.length}%` }}>
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold">{round.name}</h3>
              <div className="text-xs text-gray-400 mt-1">{round.matches.length} matches</div>
            </div>
            
            <div className="space-y-6">
              {round.matches.map(match => renderMatchCard(match, roundIndex))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render vertical bracket view
  const renderVerticalBracket = () => {
    return (
      <div className="flex flex-col space-y-8">
        {rounds.map((round, roundIndex) => (
          <div key={round.round}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{round.name}</h3>
              <div className="text-xs text-gray-400 mt-1">{round.matches.length} matches</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {round.matches.map(match => renderMatchCard(match, roundIndex))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render compact bracket view
  const renderCompactBracket = () => {
    return (
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="mb-4 bg-gray-900/50 p-1 w-full overflow-x-auto flex flex-nowrap whitespace-nowrap">
          {rounds.map(round => (
            <TabsTrigger key={round.round} value={round.round.toString()}>
              {round.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {rounds.map(round => (
          <TabsContent key={round.round} value={round.round.toString()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {round.matches.map((match, index) => renderMatchCard(match, rounds.indexOf(round)))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  // Tournament progress calculation
  const getTournamentProgress = () => {
    if (!matches.length) return 0;
    const completedMatches = matches.filter(m => m.status === "completed").length;
    return (completedMatches / matches.length) * 100;
  };

  if (!rounds.length) {
    return (
      <Card className="p-6 text-center bg-secondary-bg border-gray-800">
        <div className="text-lg text-gray-400 mb-4">
          Tournament bracket is being setup...
        </div>
        <div className="text-sm text-gray-500">
          Check back once matches are scheduled.
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Tournament bracket header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent-gold" />
                Tournament Bracket
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                {tournament?.name} • {matches.length} Matches • {teams.length} Teams
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* View mode toggle */}
              <div className="flex bg-gray-900/50 rounded-lg p-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={viewType === 'horizontal' ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => setViewType('horizontal')}
                        className="h-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="ml-1">Horizontal</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Horizontal bracket view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={viewType === 'vertical' ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => setViewType('vertical')}
                        className="h-8"
                      >
                        <ChevronLeft className="h-4 w-4 rotate-90" />
                        <span className="ml-1">Vertical</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Vertical bracket view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={viewType === 'compact' ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => setViewType('compact')}
                        className="h-8"
                      >
                        <Zap className="h-4 w-4" />
                        <span className="ml-1">Compact</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Compact tab view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Zoom controls for horizontal view */}
              {viewType === 'horizontal' && (
                <div className="flex bg-gray-900/50 rounded-lg p-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleZoomOut}
                    className="h-8 w-8"
                    disabled={zoomLevel <= 0.6}
                  >
                    <span className="text-lg font-bold">−</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleZoomReset}
                    className="h-8 px-2"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleZoomIn}
                    className="h-8 w-8"
                    disabled={zoomLevel >= 1.5}
                  >
                    <span className="text-lg font-bold">+</span>
                  </Button>
                </div>
              )}
              
              {/* Reset selection button */}
              {selectedTeam && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedTeam(null)}
                  className="h-8"
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Reset Selection
                </Button>
              )}
            </div>
          </div>
          
          {/* Tournament progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Tournament Progress</span>
              <span>
                {matches.filter(m => m.status === "completed").length}/{matches.length} matches completed
              </span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-900 to-primary transition-all duration-500 ease-in-out"
                style={{ width: `${getTournamentProgress()}%` }}
              ></div>
            </div>
          </div>
          
          {/* Team filtering/search could be added here */}
        </CardHeader>
        
        <CardContent ref={bracketRef}>
          <div 
            className="transition-all duration-300 ease-in-out"
            style={{ 
              transform: viewType === 'horizontal' ? `scale(${zoomLevel})` : 'scale(1)',
              transformOrigin: 'top left'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={viewType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {viewType === 'horizontal' && renderHorizontalBracket()}
                {viewType === 'vertical' && renderVerticalBracket()}
                {viewType === 'compact' && renderCompactBracket()}
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-accent-green/30 border border-accent-green rounded-sm mr-1"></div>
          <span className="text-gray-400">Winner</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary/30 border border-primary rounded-sm mr-1"></div>
          <span className="text-gray-400">Selected Team</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-accent-yellow/30 border border-accent-yellow rounded-sm mr-1"></div>
          <span className="text-gray-400">Live Match</span>
        </div>
      </div>
    </div>
  );
}
