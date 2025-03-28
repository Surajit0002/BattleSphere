import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import RootLayout from "@/layouts/RootLayout";
import EnhancedBracket from "@/components/tournament-bracket/enhanced-bracket";
import { Team, Tournament, Match } from "@shared/schema";

export default function TournamentBracketDemo() {
  // Fetch tournament data
  const { data: tournament, isLoading: tournamentLoading } = useQuery({
    queryKey: ["/api/tournaments/10"],
    retry: false,
  });

  // Fetch matches for the tournament
  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["/api/tournaments/10/matches"],
    enabled: !!tournament,
    retry: false,
  });

  // Fetch teams
  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ["/api/teams"],
    retry: false,
  });

  const isLoading = tournamentLoading || matchesLoading || teamsLoading;

  return (
    <RootLayout>
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tournament Bracket Demo</h1>
            <p className="text-muted-foreground mt-2">
              Advanced interactive tournament bracket visualization
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading tournament data...</span>
            </div>
          ) : tournament && matches ? (
            <EnhancedBracket 
              tournament={tournament as Tournament} 
              matches={matches as Match[]} 
              teams={teams as Team[]} 
            />
          ) : (
            <div className="bg-muted p-8 rounded-lg text-center">
              <p>No tournament data available.</p>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}