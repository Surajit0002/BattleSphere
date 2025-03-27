import { Tournament, Match } from "@shared/schema";
import { TournamentBracket } from "@/components/ui/tournament-bracket";
import { Link } from "wouter";
import { format } from "date-fns";

interface FeaturedTournamentProps {
  tournament: Tournament;
  matches: Match[];
}

export default function FeaturedTournament({ tournament, matches }: FeaturedTournamentProps) {
  // Calculate time remaining
  const calculateTimeRemaining = () => {
    const startDate = new Date(tournament.startDate);
    const now = new Date();
    const timeRemaining = startDate.getTime() - now.getTime();
    
    // If tournament has already started
    if (timeRemaining <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };
  
  const timeRemaining = calculateTimeRemaining();
  
  const getGameModeIcon = () => {
    switch (tournament.gameMode) {
      case 'squad':
        return 'ri-team-fill';
      case 'duo':
        return 'ri-user-2-fill';
      default:
        return 'ri-user-fill';
    }
  };
  
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold font-rajdhani text-white flex items-center">
          <span className="bg-primary py-1 px-3 mr-3 rounded-md">FEATURED</span>
          TOURNAMENT
        </h2>
        <Link href="/tournaments">
          <a className="text-primary hover:text-primary/90 text-sm font-medium flex items-center">
            View All Tournaments <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </Link>
      </div>
      
      <div className="bg-gradient-to-br from-black/80 to-gray-900/50 rounded-xl border border-primary/20 overflow-hidden shadow-lg shadow-primary/10 backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-300">
        <div className="relative">
          <img 
            src={tournament.imageUrl || "https://images.unsplash.com/photo-1511882150382-421056c89033"}
            alt={tournament.name} 
            className="w-full h-56 lg:h-80 object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90"></div>
          
          {/* Featured badge */}
          <div className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
            <i className="ri-fire-fill mr-1"></i> FEATURED
          </div>
          
          {/* Timer */}
          <div className="absolute top-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-white">
              <div className="text-xs text-gray-400 mb-1 text-center">Tournament Starts In</div>
              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="bg-primary/20 w-10 h-10 rounded flex items-center justify-center font-bold">{timeRemaining.days}</div>
                  <div className="text-xs mt-1">Days</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-primary/20 w-10 h-10 rounded flex items-center justify-center font-bold">{timeRemaining.hours}</div>
                  <div className="text-xs mt-1">Hours</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-primary/20 w-10 h-10 rounded flex items-center justify-center font-bold">{timeRemaining.minutes}</div>
                  <div className="text-xs mt-1">Mins</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div className="animate-fadeIn">
                <h3 className="text-3xl font-bold font-rajdhani text-white mb-2 tracking-wide">{tournament.name}</h3>
                <p className="text-gray-300 text-sm mb-4 max-w-2xl">{tournament.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-black/50 border border-white/10 text-xs px-3 py-1.5 rounded-full flex items-center backdrop-blur-sm">
                    <i className="ri-calendar-line mr-1.5"></i> {format(new Date(tournament.startDate), 'MMMM dd, yyyy')}
                  </span>
                  <span className="bg-black/50 border border-white/10 text-xs px-3 py-1.5 rounded-full flex items-center backdrop-blur-sm">
                    <i className="ri-time-line mr-1.5"></i> {format(new Date(tournament.startDate), 'h:mm a')} IST
                  </span>
                  <span className="bg-black/50 border border-white/10 text-xs px-3 py-1.5 rounded-full flex items-center backdrop-blur-sm">
                    <i className={`${getGameModeIcon()} mr-1.5`}></i> {tournament.gameMode === 'squad' ? 'Squad (4 Players)' : 
                      tournament.gameMode === 'duo' ? 'Duo (2 Players)' : 'Solo'}
                  </span>
                  <span className="bg-black/50 border border-primary/30 text-xs px-3 py-1.5 rounded-full flex items-center backdrop-blur-sm text-primary font-medium">
                    <i className="ri-coin-line mr-1.5"></i> ₹{tournament.prizePool.toLocaleString()} Prize Pool
                  </span>
                  <span className="bg-black/50 border border-white/10 text-xs px-3 py-1.5 rounded-full flex items-center backdrop-blur-sm">
                    <i className="ri-user-add-line mr-1.5"></i> {tournament.currentPlayers}/{tournament.maxPlayers} Registered
                  </span>
                </div>
              </div>
              <div className="flex gap-3 animate-slideUp">
                <Link href={`/tournaments/${tournament.id}`}>
                  <a className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold font-rajdhani flex items-center transition-all duration-300 shadow-lg shadow-primary/20">
                    <i className="ri-user-add-line mr-1.5"></i> REGISTER NOW
                  </a>
                </Link>
                <Link href={`/tournaments/${tournament.id}`}>
                  <a className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-white rounded-lg font-bold font-rajdhani border border-white/20 flex items-center transition-all duration-300">
                    VIEW DETAILS <i className="ri-arrow-right-line ml-1.5"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6 animate-fadeIn">
            <h4 className="text-xl font-rajdhani font-bold text-white mb-4 flex items-center">
              <i className="ri-trophy-line mr-2 text-primary"></i> TOURNAMENT BRACKET
            </h4>
            
            {/* Tournament Bracket Component */}
            <div className="overflow-x-auto">
              <TournamentBracket matches={matches} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
