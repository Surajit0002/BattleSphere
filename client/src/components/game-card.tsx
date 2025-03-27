import { Game } from "@shared/schema";
import { Link } from "wouter";
import { Trophy, Users, Gamepad2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  // Calculate the color scheme based on game id
  const getGameColor = (id: number) => {
    const colorSchemes = [
      { bgFrom: 'from-primary/20', bgTo: 'to-primary/10', accent: 'border-primary/40', hoverBg: 'hover:bg-primary/20' },
      { bgFrom: 'from-destructive/20', bgTo: 'to-destructive/10', accent: 'border-destructive/40', hoverBg: 'hover:bg-destructive/20' },
      { bgFrom: 'from-accent-green/20', bgTo: 'to-accent-green/10', accent: 'border-accent-green/40', hoverBg: 'hover:bg-accent-green/20' },
      { bgFrom: 'from-accent-yellow/20', bgTo: 'to-accent-yellow/10', accent: 'border-accent-yellow/40', hoverBg: 'hover:bg-accent-yellow/20' }
    ];
    
    return colorSchemes[(id - 1) % colorSchemes.length];
  };
  
  const colors = getGameColor(game.id);
  
  // Badge styles
  const getBadgeStyles = (badge: string) => {
    switch(badge) {
      case 'POPULAR':
        return 'bg-destructive/90 text-white';
      case 'TRENDING':
        return 'bg-accent-yellow/90 text-black';
      case 'NEW':
        return 'bg-primary/90 text-white';
      default:
        return 'bg-accent-green/90 text-white';
    }
  };
  
  return (
    <div className={`game-card rounded-xl overflow-hidden border ${colors.accent} bg-gradient-to-b ${colors.bgFrom} ${colors.bgTo} backdrop-blur-sm transition-all duration-300`}>
      <div className="relative">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img
          src={game.imageUrl}
          alt={game.name}
          className="w-full h-40 object-cover z-0 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 z-20">
          {game.badge && (
            <Badge className={`${getBadgeStyles(game.badge)} px-2 py-1 text-xs font-medium animate-pulse-glow`}>
              {game.badge === 'NEW' && <Star className="h-3 w-3 mr-1" />}
              {game.badge}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 z-20">
          <h3 className="font-rajdhani font-bold text-lg text-white tracking-wide">{game.name}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-accent-green" />
              <span className="text-sm font-medium text-accent-green">
                {game.playerCount.toLocaleString()}+ Players
              </span>
            </div>
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-accent-yellow" />
              <span className="text-sm font-medium text-accent-yellow">
                {game.tournamentCount}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Game Mode</span>
              <div className="flex space-x-1">
                <Badge variant="outline" className="text-xs px-1.5">
                  {game.name.includes('Mobile') ? 'Mobile' : 'All Platforms'}
                </Badge>
              </div>
            </div>
            
            <Link href={`/tournaments?game=${game.id}`}>
              <a className={`text-white ${colors.hoverBg} text-sm rounded-lg px-4 py-1.5 font-medium transition-all flex items-center shadow-sm border ${colors.accent}`}>
                <Gamepad2 className="h-4 w-4 mr-1.5" />
                PLAY
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
