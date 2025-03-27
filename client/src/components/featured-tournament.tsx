import { Tournament, Match } from "@shared/schema";
import { TournamentBracket } from "@/components/ui/tournament-bracket";
import { Link } from "wouter";
import { format } from "date-fns";

interface FeaturedTournamentProps {
  tournament: Tournament;
  matches: Match[];
}

export default function FeaturedTournament({ tournament, matches }: FeaturedTournamentProps) {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-rajdhani text-white">FEATURED TOURNAMENT</h2>
      </div>
      
      <div className="bg-secondary-bg rounded-lg border border-gray-800 overflow-hidden">
        <div className="relative">
          <img 
            src={tournament.imageUrl || "https://images.unsplash.com/photo-1511882150382-421056c89033"}
            alt={tournament.name} 
            className="w-full h-48 lg:h-64 object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-bg/90 to-primary-bg/50"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <span className="bg-accent-pink/90 text-white text-xs px-2 py-1 rounded mb-2 inline-block">OFFICIAL</span>
                <h3 className="text-2xl font-bold font-rajdhani text-white mb-1">{tournament.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{tournament.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-800 text-xs px-2 py-1 rounded flex items-center">
                    <i className="ri-calendar-line mr-1"></i> {format(new Date(tournament.startDate), 'MMMM dd, yyyy')}
                  </span>
                  <span className="bg-gray-800 text-xs px-2 py-1 rounded flex items-center">
                    <i className="ri-time-line mr-1"></i> {format(new Date(tournament.startDate), 'h:mm a')} IST
                  </span>
                  <span className="bg-gray-800 text-xs px-2 py-1 rounded flex items-center">
                    <i className="ri-team-line mr-1"></i> {tournament.gameMode === 'squad' ? 'Squad (4 Players)' : 
                      tournament.gameMode === 'duo' ? 'Duo (2 Players)' : 'Solo'}
                  </span>
                  <span className="bg-accent-green/90 text-xs px-2 py-1 rounded flex items-center">
                    <i className="ri-money-dollar-circle-line mr-1"></i> ₹{tournament.prizePool.toLocaleString()} Prize
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/tournaments/${tournament.id}`}>
                  <a className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded font-medium font-rajdhani">
                    REGISTER TEAM
                  </a>
                </Link>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium font-rajdhani border border-accent-blue/30">
                  DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-rajdhani font-semibold text-white mb-4">TOURNAMENT BRACKET</h4>
            
            {/* Tournament Bracket Component */}
            <TournamentBracket matches={matches} />
          </div>
        </div>
      </div>
    </section>
  );
}
