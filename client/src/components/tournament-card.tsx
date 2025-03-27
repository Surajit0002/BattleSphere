import { Tournament, Game } from "@shared/schema";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

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
  
  const getGameModeClass = (mode: string) => {
    switch (mode) {
      case 'solo': return 'bg-accent-pink/20 text-accent-pink';
      case 'duo': return 'bg-accent-yellow/20 text-accent-yellow';
      case 'squad': return 'bg-accent-green/20 text-accent-green';
      case 'custom': return 'bg-accent-blue/20 text-accent-blue';
      default: return 'bg-gray-700/20 text-gray-300';
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
      case 'solo': return 'ri-trophy-line';
      case 'duo': return 'ri-user-add-line';
      case 'squad': return 'ri-team-line';
      default: return 'ri-trophy-line';
    }
  };

  return (
    <div className="bg-secondary-bg rounded-lg border border-gray-800 hover:border-accent-blue/50 transition-all overflow-hidden">
      <div className="p-4 flex justify-between border-b border-gray-800">
        <div className="flex items-center">
          <img
            src={game.imageUrl}
            alt={game.name}
            className="w-10 h-10 rounded object-cover mr-3"
          />
          <div>
            <h3 className="font-rajdhani font-bold text-white">{tournament.name}</h3>
            <span className="text-xs text-gray-400">
              {game.name} - {tournament.maxPlayers} Players
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xs ${getGameModeClass(tournament.gameMode)} rounded px-2 py-0.5 mb-1`}>
            {getGameModeDisplay(tournament.gameMode)}
          </span>
          <div className="text-xs text-gray-400">{getTimeDisplay(tournament.startDate)}</div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-400">Entry Fee</div>
            <div className="font-medium text-white">
              {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : "FREE"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Prize Pool</div>
            <div className="font-medium text-accent-green">₹{tournament.prizePool.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">
              {tournament.gameMode === 'squad' || tournament.gameMode === 'duo' ? 'Teams' : 'Players'}
            </div>
            <div className="font-medium text-white">
              {tournament.currentPlayers}/{tournament.maxPlayers}
            </div>
          </div>
        </div>
        <Link href={`/tournaments/${tournament.id}`}>
          <a className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white py-2 rounded font-rajdhani font-medium flex items-center justify-center">
            <i className={`${getButtonIcon(tournament.gameMode)} mr-2`}></i> {getButtonText(tournament.gameMode)}
          </a>
        </Link>
      </div>
    </div>
  );
}
