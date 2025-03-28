import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowRight, Trophy, Users, Calendar } from "lucide-react";
import RootLayout from "@/layouts/RootLayout";
import EnhancedBracket from "@/components/tournament-bracket/enhanced-bracket";
import AdvancedBracket from "@/components/tournament-bracket/advanced-bracket";
import { Team, Tournament, Match } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TournamentBracketDemo() {
  const [selectedBracketType, setSelectedBracketType] = useState<'enhanced' | 'advanced'>('advanced');
  
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

  const renderTournamentInfo = () => {
    if (!tournament) return null;
    
    return (
      <Card className="bg-gradient-to-r from-gray-900/80 to-gray-800/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent-gold" />
            {tournament.name}
          </CardTitle>
          <CardDescription>
            Tournament #{tournament.id} • {tournament.gameMode === 'solo' ? 'Solo' : 'Team'} Play
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Status</span>
              <Badge className="w-fit capitalize">{tournament.status}</Badge>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Players</span>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span>{tournament.currentPlayers} / {tournament.maxPlayers}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Prize Pool</span>
              <div className="font-semibold text-accent-gold">₹{tournament.prizePool.toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Start Date</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Entry Fee</span>
              <div>{tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'Free'}</div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Tournament Type</span>
              <Badge variant="outline" className="w-fit capitalize">{tournament.tournamentType}</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-800 pt-4">
          <Button variant="default" size="sm" className="ml-auto">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

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
            <div className="space-y-6">
              {renderTournamentInfo()}
              
              <Tabs 
                defaultValue="advanced" 
                value={selectedBracketType}
                onValueChange={(value) => setSelectedBracketType(value as 'enhanced' | 'advanced')}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="enhanced">
                    Enhanced Bracket
                  </TabsTrigger>
                  <TabsTrigger value="advanced">
                    Advanced Dynamic Bracket
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="enhanced">
                  <EnhancedBracket 
                    tournament={tournament as Tournament} 
                    matches={matches as Match[]} 
                    teams={teams as Team[]} 
                  />
                </TabsContent>
                
                <TabsContent value="advanced">
                  <AdvancedBracket 
                    tournament={tournament as Tournament} 
                    matches={matches as Match[]} 
                    teams={teams as Team[]} 
                  />
                </TabsContent>
              </Tabs>
            </div>
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