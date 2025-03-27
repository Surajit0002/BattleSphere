import React, { useEffect, useState } from "react";
import { Match, Team } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

// Helper function to convert round number to round name
function getRoundName(round: number): string {
  if (round === 100) return 'FINAL';
  if (round === 99) return 'SEMI-FINAL';
  if (round === 98) return 'QUARTER-FINAL';
  return `ROUND ${round}`;
}

interface MatchProps {
  match: Match;
  className?: string;
}

const MatchCard = ({ match, className }: MatchProps) => {
  const { data: team1 } = useQuery<Team>({
    queryKey: ['/api/teams', match.team1Id],
    enabled: !!match.team1Id,
  });

  const { data: team2 } = useQuery<Team>({
    queryKey: ['/api/teams', match.team2Id],
    enabled: !!match.team2Id,
  });

  return (
    <div className={cn("bg-secondary-bg/80 backdrop-blur rounded-lg overflow-hidden", className)}>
      <div className="px-3 py-2 bg-primary-700/30 text-xs text-gray-400">
        {getRoundName(match.round)}
        {match.matchNumber !== null && <span> - Match {match.matchNumber}</span>}
      </div>
      
      <div className="p-3">
        <div className={cn(
          "flex items-center justify-between p-2 rounded-md", 
          match.winnerId === match.team1Id ? "bg-accent-green/10 border-l-2 border-accent-green" : "",
          !match.team1Id ? "opacity-60" : ""
        )}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-2">
              {team1?.logoUrl ? (
                <img src={team1.logoUrl} alt={team1.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-gray-300">
                  {team1?.name ? team1.name.substring(0, 2).toUpperCase() : "TBD"}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-200">{team1?.name || "TBD"}</span>
          </div>
          <div className="text-sm font-bold">
            {match.team1Score !== null ? match.team1Score : "-"}
          </div>
        </div>
        
        <div className="my-2 text-xs text-center text-gray-500">VS</div>
        
        <div className={cn(
          "flex items-center justify-between p-2 rounded-md", 
          match.winnerId === match.team2Id ? "bg-accent-green/10 border-l-2 border-accent-green" : "",
          !match.team2Id ? "opacity-60" : ""
        )}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-2">
              {team2?.logoUrl ? (
                <img src={team2.logoUrl} alt={team2.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-gray-300">
                  {team2?.name ? team2.name.substring(0, 2).toUpperCase() : "TBD"}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-200">{team2?.name || "TBD"}</span>
          </div>
          <div className="text-sm font-bold">
            {match.team2Score !== null ? match.team2Score : "-"}
          </div>
        </div>
        
        {match.status === 'scheduled' && (
          <div className="mt-2 text-center">
            <Badge variant="outline" className="text-xs">
              {new Date(match.scheduledTime).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </Badge>
          </div>
        )}
        
        {match.status === 'live' && (
          <div className="mt-2 text-center">
            <Badge className="bg-red-500 text-white text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse mr-1"></span>
              LIVE NOW
            </Badge>
          </div>
        )}
        
        {match.status === 'completed' && match.winnerId && (
          <div className="mt-2 text-center">
            <Badge variant="secondary" className="text-xs">
              COMPLETED
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

interface TournamentBracketProps {
  matches: Match[];
}

export const TournamentBracket = ({ matches }: TournamentBracketProps) => {
  const [rounds, setRounds] = useState<{[key: string]: Match[]}>({});
  
  useEffect(() => {
    // Group matches by round
    const groupedMatches: {[key: string]: Match[]} = {};
    
    for (const match of matches) {
      if (!groupedMatches[match.round]) {
        groupedMatches[match.round] = [];
      }
      groupedMatches[match.round].push(match);
    }
    
    // Sort matches within each round
    for (const round in groupedMatches) {
      groupedMatches[round].sort((a, b) => {
        if (a.matchNumber === null) return 1;
        if (b.matchNumber === null) return -1;
        return a.matchNumber - b.matchNumber;
      });
    }
    
    // Sort rounds in progression order
    const orderedRounds: {[key: string]: Match[]} = {};
    const roundOrder = ['1', '2', '3', '4', '5', '6', '98', '99', '100']; // 98 = quarter, 99 = semi, 100 = final
    
    for (const round of roundOrder) {
      if (groupedMatches[round]) {
        orderedRounds[round] = groupedMatches[round];
      }
    }
    
    setRounds(orderedRounds);
  }, [matches]);
  
  const numRounds = Object.keys(rounds).length;
  
  if (numRounds === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No matches have been scheduled yet.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex" style={{ minWidth: `${numRounds * 300}px` }}>
        {Object.entries(rounds).map(([round, roundMatches], roundIndex) => (
          <div key={round} className="flex-1 px-3">
            <div className="mb-4 text-center">
              <h4 className="text-lg font-semibold text-white">
                {Number(round) === 100 ? 'Final' : 
                 Number(round) === 99 ? 'Semi-Finals' : 
                 Number(round) === 98 ? 'Quarter-Finals' : 
                 `Round ${round}`}
              </h4>
            </div>
            
            <div className="space-y-6">
              {roundMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  className={cn(
                    "mx-auto",
                    roundIndex === numRounds - 1 ? "w-full max-w-xs" : "w-full max-w-xs"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};