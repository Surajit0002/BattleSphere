import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Medal, 
  Calendar, 
  Users, 
  ChevronRight, 
  Zap,
  Swords,
  Star,
  Flag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Team, Match, Tournament } from "@shared/schema";

interface EnhancedBracketProps {
  matches: Match[];
  tournament: Tournament;
  teams?: Team[];
  className?: string;
}

type BracketMatch = {
  id: number;
  round: number;
  position: number;
  team1Id: number | null;
  team2Id: number | null;
  team1Score: number | null;
  team2Score: number | null;
  winnerId: number | null;
  team1?: Team;
  team2?: Team;
  winner?: Team;
  matchTime?: string;
  isLive?: boolean;
};

type RoundWithMatches = {
  name: string;
  matches: BracketMatch[];
};

function processBracketData(matches: Match[], teams?: Team[]): RoundWithMatches[] {
  // Group matches by round
  const matchesByRound: Record<number, BracketMatch[]> = {};
  
  // Process matches and add team details
  matches.forEach((match) => {
    const round = Math.floor(Math.log2(match.matchNumber || 1)) + 1;
    const position = (match.matchNumber || 1) % Math.pow(2, round - 1);
    
    if (!matchesByRound[round]) {
      matchesByRound[round] = [];
    }
    
    const team1 = teams?.find((team) => team.id === match.team1Id);
    const team2 = teams?.find((team) => team.id === match.team2Id);
    const winner = teams?.find((team) => team.id === match.winnerId);
    
    matchesByRound[round].push({
      id: match.id,
      round,
      position,
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      team1Score: match.team1Score,
      team2Score: match.team2Score,
      winnerId: match.winnerId,
      team1,
      team2,
      winner,
      matchTime: match.scheduledTime ? new Date(match.scheduledTime).toLocaleString() : undefined,
      isLive: match.status === 'live',
    });
  });
  
  // Define round names based on the total number of rounds
  const rounds: RoundWithMatches[] = [];
  const totalRounds = Math.max(...Object.keys(matchesByRound).map(Number));
  
  for (let i = 1; i <= totalRounds; i++) {
    let roundName = '';
    
    if (i === totalRounds) {
      roundName = 'Final';
    } else if (i === totalRounds - 1) {
      roundName = 'Semi-Finals';
    } else if (i === totalRounds - 2) {
      roundName = 'Quarter-Finals';
    } else {
      roundName = `Round ${i}`;
    }
    
    rounds.push({
      name: roundName,
      matches: matchesByRound[i] || [],
    });
  }
  
  return rounds;
}

const MatchCard: React.FC<{ 
  match: BracketMatch; 
  isFocused: boolean;
  onClick: () => void;
}> = ({ match, isFocused, onClick }) => {
  const isCompleted = match.winnerId !== null;
  const isPending = !match.team1Id || !match.team2Id;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isFocused ? 1.05 : 1,
        boxShadow: isFocused ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "none"
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative rounded-lg border p-4 transition-all cursor-pointer",
        isFocused ? "border-primary bg-primary/5" : "border-border bg-card",
        isCompleted && "shadow-md",
        match.isLive && "animate-pulse border-red-500"
      )}
      onClick={onClick}
    >
      {/* Match Status Badge */}
      <div className="absolute -top-2 -right-2 z-10">
        {match.isLive && (
          <Badge variant="destructive" className="animate-pulse flex gap-1">
            <Zap className="h-3 w-3" /> LIVE
          </Badge>
        )}
        {isCompleted && !match.isLive && (
          <Badge variant="outline" className="bg-background flex gap-1">
            <Flag className="h-3 w-3" /> Completed
          </Badge>
        )}
        {isPending && !match.isLive && (
          <Badge variant="secondary" className="flex gap-1">
            <Calendar className="h-3 w-3" /> Upcoming
          </Badge>
        )}
      </div>
      
      {/* Match Time */}
      {match.matchTime && (
        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {match.matchTime}
        </div>
      )}
      
      {/* Team 1 */}
      <div className={cn(
        "flex items-center justify-between p-2 rounded-md mb-2",
        match.winnerId === match.team1Id && "bg-primary/10 border border-primary/20"
      )}>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border bg-primary/10">
            <AvatarImage src={match.team1?.logoUrl || undefined} alt={match.team1?.name || "TBD"} />
            <AvatarFallback className="text-xs">{match.team1?.name?.substring(0, 2) || "?"}</AvatarFallback>
          </Avatar>
          <span className={cn(
            "font-medium text-sm", 
            match.winnerId === match.team1Id && "text-primary"
          )}>
            {match.team1?.name || "TBD"}
          </span>
        </div>
        <div className={cn(
          "font-bold text-sm",
          match.winnerId === match.team1Id && "text-primary"
        )}>
          {match.team1Score !== null ? match.team1Score : "-"}
        </div>
      </div>
      
      {/* Team 2 */}
      <div className={cn(
        "flex items-center justify-between p-2 rounded-md",
        match.winnerId === match.team2Id && "bg-primary/10 border border-primary/20"
      )}>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border bg-primary/10">
            <AvatarImage src={match.team2?.logoUrl || undefined} alt={match.team2?.name || "TBD"} />
            <AvatarFallback className="text-xs">{match.team2?.name?.substring(0, 2) || "?"}</AvatarFallback>
          </Avatar>
          <span className={cn(
            "font-medium text-sm", 
            match.winnerId === match.team2Id && "text-primary"
          )}>
            {match.team2?.name || "TBD"}
          </span>
        </div>
        <div className={cn(
          "font-bold text-sm",
          match.winnerId === match.team2Id && "text-primary"
        )}>
          {match.team2Score !== null ? match.team2Score : "-"}
        </div>
      </div>

      {/* Winner Indicator */}
      {isCompleted && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 flex items-center justify-center gap-1 text-xs text-primary border-t pt-2 border-border"
        >
          <Trophy className="h-3 w-3" />
          <span>Winner: {match.winner?.name || "Unknown"}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

function renderConnectors(roundIdx: number, matchIdx: number, totalRounds: number, isFocused: boolean) {
  if (roundIdx === totalRounds - 1) return null; // No connectors for the final round
  
  const isEven = matchIdx % 2 === 0;
  const height = `${Math.pow(2, roundIdx + 1) * 2.5}rem`;
  
  return (
    <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 flex items-center">
      <div className={cn(
        "w-8 border-t transition-colors duration-300",
        isFocused ? "border-primary" : "border-border"
      )} />
      <div className={cn(
        "h-full border-r transition-colors duration-300",
        isFocused ? "border-primary" : "border-border",
        isEven ? "border-b-0" : "border-t-0"
      )} style={{ height }} />
    </div>
  );
}

export default function EnhancedBracket({ 
  matches, 
  tournament, 
  teams = [], 
  className 
}: EnhancedBracketProps) {
  const [bracketData, setBracketData] = useState<RoundWithMatches[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('horizontal');
  const [isAnimating, setIsAnimating] = useState(false);
  const bracketRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const processedData = processBracketData(matches, teams);
    setBracketData(processedData);
  }, [matches, teams]);
  
  const toggleViewMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setViewMode(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
      setIsAnimating(false);
    }, 300);
  };
  
  const handleMatchClick = (matchId: number) => {
    setSelectedMatch(prevSelected => prevSelected === matchId ? null : matchId);
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Tournament Bracket
          </h2>
          <p className="text-muted-foreground">
            {tournament.name} - {tournament.maxPlayers} Teams
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleViewMode}
                  disabled={isAnimating}
                >
                  Toggle View
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Switch between horizontal and vertical view
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-xs rounded-md bg-background border px-2 py-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live Matches
            </div>
            <div className="flex items-center gap-1 text-xs rounded-md bg-background border px-2 py-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Completed
            </div>
            <div className="flex items-center gap-1 text-xs rounded-md bg-background border px-2 py-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              Upcoming
            </div>
          </div>
        </div>
      </div>
      
      <div 
        ref={bracketRef}
        className={cn(
          "relative",
          viewMode === 'horizontal' ? "overflow-x-auto" : "overflow-y-auto max-h-[800px]"
        )}
      >
        <motion.div
          layout
          initial={false}
          animate={{ opacity: isAnimating ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex p-6 gap-16",
            viewMode === 'horizontal' 
              ? "flex-row min-w-fit" 
              : "flex-col min-h-fit"
          )}
        >
          {bracketData.map((round, roundIdx) => (
            <div 
              key={round.name} 
              className={cn(
                viewMode === 'horizontal' 
                  ? "flex flex-col"
                  : "flex flex-row gap-8"
              )}
            >
              <div className={cn(
                "mb-4 font-semibold text-sm border-b pb-2",
                viewMode === 'horizontal' 
                  ? "text-center" 
                  : "min-w-[120px] flex items-center"
              )}>
                {round.name}
                {roundIdx === bracketData.length - 1 && (
                  <Trophy className="ml-1 h-4 w-4 text-yellow-500" />
                )}
              </div>
              
              <div 
                className={cn(
                  "flex gap-8",
                  viewMode === 'horizontal' 
                    ? "flex-col justify-around h-full" 
                    : "flex-row flex-wrap"
                )}
                style={{
                  ...(viewMode === 'horizontal' && {
                    height: `${Math.pow(2, bracketData.length - roundIdx) * 10}rem`
                  })
                }}
              >
                {round.matches.map((match, matchIdx) => (
                  <div 
                    key={match.id} 
                    className="relative"
                    style={{
                      ...(viewMode === 'horizontal' && {
                        marginTop: matchIdx % 2 !== 0 && roundIdx > 0 
                          ? `${Math.pow(2, roundIdx) * 5}rem` 
                          : 0
                      })
                    }}
                  >
                    <MatchCard 
                      match={match} 
                      isFocused={selectedMatch === match.id}
                      onClick={() => handleMatchClick(match.id)} 
                    />
                    
                    {viewMode === 'horizontal' && renderConnectors(
                      roundIdx, 
                      matchIdx, 
                      bracketData.length, 
                      selectedMatch === match.id
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Match Details Panel */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border rounded-lg p-4 bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-1">
                  <Swords className="h-4 w-4" />
                  Match Details
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedMatch(null)}
                >
                  Close
                </Button>
              </div>
              
              {matches.find(m => m.id === selectedMatch) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Match Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {matches.find(m => m.id === selectedMatch)?.scheduledTime 
                            ? new Date(matches.find(m => m.id === selectedMatch)?.scheduledTime || '').toLocaleString() 
                            : 'Time not set'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span>Status: {matches.find(m => m.id === selectedMatch)?.status || 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Actions</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Stream</Button>
                      <Button size="sm" variant="outline">Match Statistics</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}