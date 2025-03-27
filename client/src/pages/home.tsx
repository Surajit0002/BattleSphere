import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/hero-section";
import GameCard from "@/components/game-card";
import TournamentCard from "@/components/tournament-card";
import FeaturedTournament from "@/components/featured-tournament";
import Leaderboard from "@/components/leaderboard";
import TeamList from "@/components/team-list";
import { Game, Tournament, LeaderboardEntry, Team, Match } from "@shared/schema";

export default function Home() {
  // Fetch featured games
  const { data: featuredGames, isLoading: loadingGames } = useQuery<Game[]>({
    queryKey: ['/api/games/featured'],
  });
  
  // Fetch upcoming tournaments
  const { data: upcomingTournaments, isLoading: loadingTournaments } = useQuery<Tournament[]>({
    queryKey: ['/api/tournaments/upcoming'],
  });
  
  // Fetch featured tournament with matches
  const { data: featuredTournamentData, isLoading: loadingFeaturedTournament } = useQuery<{ 
    matches: Match[] 
  } & Tournament>({
    queryKey: ['/api/tournaments/featured'],
  });
  
  // Fetch leaderboard
  const { data: leaderboardEntries, isLoading: loadingLeaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard'],
  });
  
  // Fetch top teams
  const { data: topTeams, isLoading: loadingTeams } = useQuery<Team[]>({
    queryKey: ['/api/teams/top'],
  });

  // Hero section tournament date
  const heroTournamentDate = new Date();
  heroTournamentDate.setDate(heroTournamentDate.getDate() + 7); // One week from now
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="SEASON 3 CHAMPIONSHIP"
        description="Compete in the ultimate battle royale championship with a prize pool of ₹500,000"
        imageUrl="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        startDate={heroTournamentDate}
      />
      
      {/* Featured Games */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-rajdhani text-white">FEATURED GAMES</h2>
          <a href="/tournaments" className="text-accent-blue hover:text-accent-blue/80 flex items-center font-medium">
            View All <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingGames ? (
            // Loading placeholders
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-secondary-bg rounded-lg h-64 animate-pulse"></div>
            ))
          ) : (
            featuredGames?.map(game => (
              <GameCard key={game.id} game={game} />
            ))
          )}
        </div>
      </section>
      
      {/* Upcoming Tournaments */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-rajdhani text-white">UPCOMING TOURNAMENTS</h2>
          <div className="flex">
            <button className="mr-2 px-3 py-1 text-sm bg-secondary-bg text-white rounded border border-gray-700 hover:border-accent-blue transition">
              All Games
            </button>
            <button className="px-3 py-1 text-sm bg-secondary-bg text-white rounded border border-gray-700 hover:border-accent-blue transition">
              <i className="ri-filter-3-line mr-1"></i> Filter
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadingTournaments || loadingGames ? (
            // Loading placeholders
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-secondary-bg rounded-lg h-64 animate-pulse"></div>
            ))
          ) : (
            upcomingTournaments?.slice(0, 4).map(tournament => {
              const game = featuredGames?.find(g => g.id === tournament.gameId);
              return game && <TournamentCard key={tournament.id} tournament={tournament} game={game} />;
            })
          )}
        </div>
      </section>
      
      {/* Featured Tournament with Bracket */}
      {loadingFeaturedTournament ? (
        <div className="bg-secondary-bg rounded-lg h-[600px] animate-pulse mb-10"></div>
      ) : (
        featuredTournamentData && (
          <FeaturedTournament 
            tournament={featuredTournamentData} 
            matches={featuredTournamentData.matches} 
          />
        )
      )}
      
      {/* Leaderboard and Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          {loadingLeaderboard ? (
            <div className="bg-secondary-bg rounded-lg h-[500px] animate-pulse"></div>
          ) : (
            leaderboardEntries && <Leaderboard entries={leaderboardEntries} />
          )}
        </div>
        
        {/* Top Teams */}
        <div className="lg:col-span-1">
          {loadingTeams ? (
            <div className="bg-secondary-bg rounded-lg h-[500px] animate-pulse"></div>
          ) : (
            topTeams && <TeamList teams={topTeams} />
          )}
        </div>
      </div>
    </>
  );
}
