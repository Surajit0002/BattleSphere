import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import TournamentCard from "@/components/tournament-card";
import { Tournament, Game } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Tournaments() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const gameId = search ? new URLSearchParams(search).get("game") : null;
  
  const [mode, setMode] = useState<string>("all");
  const [tournamentType, setTournamentType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Fetch all tournaments
  const { data: tournaments, isLoading: loadingTournaments } = useQuery<Tournament[]>({
    queryKey: ['/api/tournaments'],
  });
  
  // Fetch all games
  const { data: games, isLoading: loadingGames } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });
  
  // Filter tournaments based on selected filters
  const filteredTournaments = tournaments?.filter(tournament => {
    // Filter by game if selected
    if (gameId && tournament.gameId !== parseInt(gameId)) {
      return false;
    }
    
    // Filter by game mode
    if (mode !== "all" && tournament.gameMode !== mode) {
      return false;
    }
    
    // Filter by tournament type
    if (tournamentType !== "all" && tournament.tournamentType !== tournamentType) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !tournament.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const isLoading = loadingTournaments || loadingGames;
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-rajdhani text-white mb-2">TOURNAMENTS</h1>
        <p className="text-gray-400">
          Browse and join upcoming tournaments for your favorite games
        </p>
      </div>
      
      {/* Filters */}
      <div className="bg-secondary-bg rounded-lg border border-gray-800 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Game Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="duo">Duo</SelectItem>
                <SelectItem value="squad">Squad</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={tournamentType} onValueChange={setTournamentType}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="free">Free Entry</SelectItem>
                <SelectItem value="paid">Paid Entry</SelectItem>
                <SelectItem value="sponsored">Sponsored</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button className="w-full bg-accent-blue hover:bg-accent-blue/90">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Game Tabs */}
      <Tabs defaultValue={gameId || "all"} className="mb-6">
        <TabsList className="bg-secondary-bg border border-gray-800 p-1 overflow-x-auto flex-nowrap">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-accent-blue data-[state=active]:text-white"
            onClick={() => setLocation("/tournaments")}
          >
            All Games
          </TabsTrigger>
          
          {!loadingGames && games?.map(game => (
            <TabsTrigger 
              key={game.id}
              value={game.id.toString()}
              className="data-[state=active]:bg-accent-blue data-[state=active]:text-white"
              onClick={() => setLocation(`/tournaments?game=${game.id}`)}
            >
              {game.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading placeholders
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-secondary-bg rounded-lg h-64 animate-pulse"></div>
          ))
        ) : filteredTournaments?.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <div className="text-gray-400 mb-3">No tournaments match your filters</div>
            <Button 
              variant="outline" 
              onClick={() => {
                setMode("all");
                setTournamentType("all");
                setSearchQuery("");
                setLocation("/tournaments");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          filteredTournaments?.map(tournament => {
            const game = games?.find(g => g.id === tournament.gameId);
            return game && <TournamentCard key={tournament.id} tournament={tournament} game={game} />;
          })
        )}
      </div>
      
      {/* Create Tournament Button - Visible only to admins in a real implementation */}
      <div className="mt-10 text-center">
        <Button className="bg-gradient-to-r from-accent-blue to-accent-pink text-white px-8 py-6 rounded font-rajdhani font-medium hover:opacity-90 transition">
          <i className="ri-add-line mr-2"></i> CREATE TOURNAMENT
        </Button>
      </div>
    </>
  );
}
