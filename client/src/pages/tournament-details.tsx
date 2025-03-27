import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TournamentBracket } from "@/components/ui/tournament-bracket";
import { Tournament, Game, Team, Match } from "@shared/schema";

export default function TournamentDetails() {
  // Get the tournament ID from the URL
  const { id } = useParams<{ id: string }>();
  const tournamentId = parseInt(id);

  // Fetch tournament data
  const { data: tournament, isLoading: tournamentLoading } = useQuery<Tournament>({
    queryKey: ['/api/tournaments', tournamentId],
    enabled: !isNaN(tournamentId)
  });

  // Fetch game data
  const { data: game, isLoading: gameLoading } = useQuery<Game>({
    queryKey: ['/api/games', tournament?.gameId],
    enabled: !!tournament?.gameId
  });

  // Fetch registered teams
  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['/api/tournaments', tournamentId, 'teams'],
    enabled: !isNaN(tournamentId)
  });

  // Fetch matches
  const { data: matches, isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: ['/api/tournaments', tournamentId, 'matches'],
    enabled: !isNaN(tournamentId)
  });

  const isLoading = tournamentLoading || gameLoading || teamsLoading || matchesLoading;

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
        </div>
      </div>
    );
  }

  if (!tournament || !game) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Tournament Not Found</h2>
          <p className="text-gray-400 mb-6">The tournament you're looking for doesn't exist or has been removed.</p>
          <Link href="/tournaments">
            <Button variant="default">Back to Tournaments</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Convert string dates to Date objects for proper formatting
  const startDate = new Date(tournament.startDate);
  const endDate = tournament.endDate ? new Date(tournament.endDate) : null;

  return (
    <div className="container py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/tournaments">
          <a className="flex items-center text-sm text-accent-blue hover:underline">
            <i className="ri-arrow-left-line mr-1"></i> Back to Tournaments
          </a>
        </Link>
      </div>

      {/* Tournament header */}
      <div className="relative mb-8">
        <div className="relative rounded-xl overflow-hidden">
          <img 
            src={tournament.imageUrl || "https://images.unsplash.com/photo-1511882150382-421056c89033"}
            alt={tournament.name} 
            className="w-full h-64 object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-primary-bg/80 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-accent-blue/80 text-white text-xs px-2 py-1 rounded">
                {tournament.tournamentType.toUpperCase()}
              </span>
              <span className={`text-white text-xs px-2 py-1 rounded ${
                tournament.gameMode === 'solo' ? 'bg-amber-600/80' : 
                tournament.gameMode === 'duo' ? 'bg-emerald-600/80' : 
                tournament.gameMode === 'squad' ? 'bg-violet-600/80' : 'bg-gray-600/80'
              }`}>
                {tournament.gameMode.toUpperCase()}
              </span>
              {tournament.featured && (
                <span className="bg-accent-pink/80 text-white text-xs px-2 py-1 rounded">
                  FEATURED
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-rajdhani">{tournament.name}</h1>
            
            <div className="flex items-center mb-4">
              <img src={game.imageUrl} alt={game.name} className="w-8 h-8 rounded object-cover mr-2" />
              <span className="text-white">{game.name}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <div>
                <div className="text-gray-400 text-xs">START DATE</div>
                <div className="font-medium">
                  {format(startDate, 'MMM dd, yyyy')} at {format(startDate, 'h:mm a')}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">STATUS</div>
                <div className="font-medium uppercase">
                  <span className={`inline-block rounded-full w-2 h-2 mr-1 ${
                    tournament.status === 'completed' ? 'bg-gray-400' :
                    tournament.status === 'ongoing' ? 'bg-accent-green' : 'bg-accent-yellow'
                  }`}></span>
                  {tournament.status}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">ENTRY FEE</div>
                <div className="font-medium">
                  {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : "FREE"}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">PRIZE POOL</div>
                <div className="font-medium text-accent-green">₹{tournament.prizePool.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bracket">Bracket</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="prizes">Prizes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="bg-secondary-bg p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4 font-rajdhani">TOURNAMENT DETAILS</h3>
              <p className="text-gray-300 mb-6">
                {tournament.description || `Join this exciting ${game.name} tournament and compete for a prize pool of ₹${tournament.prizePool.toLocaleString()}. Show your skills and climb to the top!`}
              </p>
              
              <h4 className="text-lg font-semibold text-white mb-3 font-rajdhani">FORMAT</h4>
              <ul className="list-disc pl-5 text-gray-300 mb-6 space-y-1">
                <li>Mode: {tournament.gameMode === 'solo' ? 'Solo' : tournament.gameMode === 'duo' ? 'Duo (2 Players per team)' : 'Squad (4 Players per team)'}</li>
                <li>Maximum Teams/Players: {tournament.maxPlayers}</li>
                <li>Current Registrations: {tournament.currentPlayers}</li>
                <li>Tournament Type: {tournament.tournamentType === 'free' ? 'Free-to-enter' : tournament.tournamentType === 'paid' ? 'Paid Entry' : tournament.tournamentType === 'sponsored' ? 'Sponsored' : 'Seasonal'}</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-white mb-3 font-rajdhani">SCHEDULE</h4>
              <ul className="list-disc pl-5 text-gray-300 mb-6 space-y-1">
                <li>Registration Closes: {format(new Date(startDate.getTime() - 3600000), 'MMM dd, yyyy hh:mm a')}</li>
                <li>Tournament Start: {format(startDate, 'MMM dd, yyyy hh:mm a')}</li>
                {endDate && <li>Expected End: {format(endDate, 'MMM dd, yyyy hh:mm a')}</li>}
              </ul>
            </TabsContent>
            
            <TabsContent value="bracket" className="bg-secondary-bg p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4 font-rajdhani">TOURNAMENT BRACKET</h3>
              
              {matches && matches.length > 0 ? (
                <TournamentBracket matches={matches} />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <i className="ri-trophy-line text-3xl mb-2"></i>
                  <p>Tournament bracket will be available once the tournament begins.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rules" className="bg-secondary-bg p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4 font-rajdhani">TOURNAMENT RULES</h3>
              
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 font-rajdhani">GENERAL RULES</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>All players must be registered with valid game accounts</li>
                    <li>Players/teams must be ready 15 minutes before their scheduled match</li>
                    <li>Substitutes are not allowed once the tournament begins</li>
                    <li>Tournament administrators have final say on all disputes</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 font-rajdhani">GAME SPECIFIC RULES</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>All matches will be played on the latest game version</li>
                    <li>Map selection will be predetermined by tournament organizers</li>
                    <li>Custom match settings will be provided before each round</li>
                    <li>Screenshot of final match results must be submitted by the winning team</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 font-rajdhani">CODE OF CONDUCT</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Respect all players, organizers, and spectators</li>
                    <li>No cheating, hacking, or exploiting game bugs</li>
                    <li>No offensive language or behavior</li>
                    <li>Violations may result in disqualification and potential ban from future tournaments</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="prizes" className="bg-secondary-bg p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4 font-rajdhani">PRIZE DISTRIBUTION</h3>
              
              <div className="space-y-6">
                <div className="flex items-center bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-white mr-4">
                    <i className="ri-trophy-line text-xl"></i>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-white font-medium">1st Place</h4>
                    <p className="text-accent-green">₹{Math.floor(tournament.prizePool * 0.6).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-400 rounded-full text-white mr-4">
                    <i className="ri-medal-line text-xl"></i>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-white font-medium">2nd Place</h4>
                    <p className="text-accent-green">₹{Math.floor(tournament.prizePool * 0.25).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-amber-700 to-amber-800 rounded-full text-white mr-4">
                    <i className="ri-medal-2-line text-xl"></i>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-white font-medium">3rd Place</h4>
                    <p className="text-accent-green">₹{Math.floor(tournament.prizePool * 0.15).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Join tournament button */}
          <div className="bg-secondary-bg p-6 rounded-lg">
            <Button className="w-full text-base py-6 mb-2 font-rajdhani font-semibold">
              {tournament.status === 'upcoming' ? (
                tournament.currentPlayers >= tournament.maxPlayers ? (
                  <span className="flex items-center"><i className="ri-close-circle-line mr-2"></i> TOURNAMENT FULL</span>
                ) : (
                  <span className="flex items-center"><i className="ri-trophy-line mr-2"></i> REGISTER NOW</span>
                )
              ) : tournament.status === 'ongoing' ? (
                <span className="flex items-center"><i className="ri-live-line mr-2"></i> VIEW LIVE MATCHES</span>
              ) : (
                <span className="flex items-center"><i className="ri-medal-line mr-2"></i> VIEW RESULTS</span>
              )}
            </Button>
            <p className="text-xs text-center text-gray-400">
              {tournament.status === 'upcoming' && tournament.currentPlayers < tournament.maxPlayers && (
                `${tournament.maxPlayers - tournament.currentPlayers} spots left | Registration closes soon`
              )}
            </p>
          </div>
          
          {/* Participating teams */}
          <div className="bg-secondary-bg p-6 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-4 font-rajdhani">REGISTERED TEAMS</h3>
            
            {teams && teams.length > 0 ? (
              <div className="space-y-3">
                {teams.slice(0, 5).map(team => (
                  <div key={team.id} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden mr-3">
                      {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white">
                          {team.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{team.name}</div>
                      <div className="text-xs text-gray-400">{team.memberCount} members</div>
                    </div>
                    {team.badge && (
                      <span className="ml-auto text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{team.badge}</span>
                    )}
                  </div>
                ))}
                
                {teams.length > 5 && (
                  <Button variant="outline" className="w-full mt-2 text-sm">
                    View All {teams.length} Teams
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                <p>No teams have registered yet.</p>
              </div>
            )}
          </div>
          
          {/* Additional tournament info */}
          <div className="bg-secondary-bg p-6 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-4 font-rajdhani">TOURNAMENT INFO</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Format</span>
                <span className="text-white capitalize">{tournament.gameMode}</span>
              </div>
              <Separator className="bg-gray-800" />
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Region</span>
                <span className="text-white">India</span>
              </div>
              <Separator className="bg-gray-800" />
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Platform</span>
                <span className="text-white">Mobile</span>
              </div>
              <Separator className="bg-gray-800" />
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Game</span>
                <span className="text-white">{game.name}</span>
              </div>
              <Separator className="bg-gray-800" />
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Organizer</span>
                <span className="text-white">BattleSphere</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}