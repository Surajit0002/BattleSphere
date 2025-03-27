import { Tournament, Game } from "@shared/schema";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarDays, 
  Trophy, 
  Users, 
  Gamepad2, 
  Flame, 
  Timer, 
  Coins, 
  UserPlus, 
  UsersRound 
} from "lucide-react";

interface TournamentCardProps {
  tournament: Tournament;
  game: Game;
}

export default function TournamentCard({ tournament, game }: TournamentCardProps) {
  const getGameModeDisplay = (mode: string) => {
    switch (mode) {
      case 'solo': return 'Solo Mode';
      case 'duo': return 'Duo Mode';
      case 'squad': return 'Squad Mode';
      case 'custom': return 'Custom Mode';
      default: return mode;
    }
  };
  
  const getGameModeIcon = (mode: string) => {
    switch (mode) {
      case 'solo': return <Gamepad2 className="h-3.5 w-3.5 mr-1" />;
      case 'duo': return <UserPlus className="h-3.5 w-3.5 mr-1" />;
      case 'squad': return <UsersRound className="h-3.5 w-3.5 mr-1" />;
      case 'custom': return <Flame className="h-3.5 w-3.5 mr-1" />;
      default: return <Gamepad2 className="h-3.5 w-3.5 mr-1" />;
    }
  };
  
  const getGameModeClass = (mode: string) => {
    switch (mode) {
      case 'solo': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'duo': return 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30';
      case 'squad': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'custom': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-gray-700/20 text-gray-300 border-gray-500/30';
    }
  };
  
  const getTimeDisplay = (dateInput: Date | string) => {
    // Ensure we have a Date object by converting string dates
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Date not available";
    }
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' }) + 
        ` at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
  };
  
  const getButtonText = (mode: string) => {
    switch (mode) {
      case 'solo': return 'JOIN TOURNAMENT';
      case 'duo': return 'FIND TEAMMATE';
      case 'squad': return 'JOIN WITH TEAM';
      default: return 'JOIN TOURNAMENT';
    }
  };
  
  const getButtonIcon = (mode: string) => {
    switch (mode) {
      case 'solo': return <Trophy className="h-4 w-4 mr-2" />;
      case 'duo': return <UserPlus className="h-4 w-4 mr-2" />;
      case 'squad': return <UsersRound className="h-4 w-4 mr-2" />;
      default: return <Trophy className="h-4 w-4 mr-2" />;
    }
  };
  
  const getRegistrationFillPercentage = () => {
    return (tournament.currentPlayers / tournament.maxPlayers) * 100;
  };
  
  // Get color scheme based on tournament type
  const getTournamentColors = (type: string) => {
    switch (type) {
      case 'sponsored':
        return {
          gradient: 'from-primary/10 to-primary/5',
          border: 'border-primary/30',
          shadow: 'shadow-primary/10',
          hover: 'hover:shadow-primary/20',
          badge: 'bg-primary/90'
        };
      case 'seasonal':
        return {
          gradient: 'from-destructive/10 to-destructive/5',
          border: 'border-destructive/30',
          shadow: 'shadow-destructive/10',
          hover: 'hover:shadow-destructive/20',
          badge: 'bg-destructive/90'
        };
      case 'paid':
        return {
          gradient: 'from-accent-yellow/10 to-accent-yellow/5',
          border: 'border-accent-yellow/30',
          shadow: 'shadow-accent-yellow/10',
          hover: 'hover:shadow-accent-yellow/20',
          badge: 'bg-accent-yellow/90'
        };
      default:
        return {
          gradient: 'from-accent-green/10 to-accent-green/5',
          border: 'border-accent-green/30',
          shadow: 'shadow-accent-green/10',
          hover: 'hover:shadow-accent-green/20',
          badge: 'bg-accent-green/90'
        };
    }
  };
  
  // Use tournamentType instead of type property
  const colors = getTournamentColors(tournament.tournamentType || 'free');
  
  return (
    <div className={`rounded-xl overflow-hidden border ${colors.border} bg-gradient-to-b ${colors.gradient} backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${colors.shadow} ${colors.hover} hover-scale`}>
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={game.imageUrl}
          alt={game.name}
          className="w-full h-32 object-cover z-0"
        />
        
        <div className="absolute top-0 left-0 w-full p-4 z-20">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-rajdhani font-bold text-xl text-white tracking-wide mb-1">{tournament.name}</h3>
              <div className="flex items-center">
                <Badge className={`${colors.badge} mr-2`}>
                  {tournament.entryFee > 0 ? "PAID" : "FREE"}
                </Badge>
                <Badge variant="outline" className={`${getGameModeClass(tournament.gameMode)} flex items-center`}>
                  {getGameModeIcon(tournament.gameMode)}
                  {getGameModeDisplay(tournament.gameMode)}
                </Badge>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-black/50 border-white/20 backdrop-blur-sm text-white">
              <Timer className="h-3.5 w-3.5 mr-1.5" />
              {getTimeDisplay(tournament.startDate)}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Details */}
      <div className="p-5">
        <div className="grid grid-cols-3 gap-6 mb-5">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center mb-1 text-accent-yellow">
              <Coins className="h-4 w-4 mr-1.5" />
              <span className="font-medium text-lg">
                {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : "FREE"}
              </span>
            </div>
            <div className="text-xs text-gray-400">Entry Fee</div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center mb-1 text-accent-green">
              <Trophy className="h-4 w-4 mr-1.5" />
              <span className="font-medium text-lg">₹{tournament.prizePool.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-400">Prize Pool</div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center mb-1 text-primary">
              <Users className="h-4 w-4 mr-1.5" />
              <span className="font-medium text-lg">
                {tournament.currentPlayers}/{tournament.maxPlayers}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {tournament.gameMode === 'squad' || tournament.gameMode === 'duo' ? 'Teams' : 'Players'}
            </div>
          </div>
        </div>
        
        {/* Registration progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Registration</span>
            <span className="text-gray-400">{Math.round(getRegistrationFillPercentage())}% Full</span>
          </div>
          <Progress 
            value={getRegistrationFillPercentage()} 
            className="h-1.5"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-400">
            <CalendarDays className="h-4 w-4 mr-1.5" /> 
            <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-2">
            <Link href={`/tournaments/${tournament.id}`} className="bg-primary text-white py-2 px-4 rounded-lg font-rajdhani font-medium flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                {getButtonIcon(tournament.gameMode)} {getButtonText(tournament.gameMode)}
            </Link>
            <Link href={`/tournaments/premium/${tournament.id}`} className="bg-transparent border border-primary/40 text-primary py-2 px-3 rounded-lg font-rajdhani font-medium flex items-center justify-center hover:bg-primary/10 transition-all">
                <Flame className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
