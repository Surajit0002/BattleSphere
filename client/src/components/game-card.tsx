import { Game } from "@shared/schema";
import { Link } from "wouter";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="game-card bg-secondary-bg rounded-lg overflow-hidden border border-gray-800 hover:border-accent-blue/50 transition-all">
      <div className="relative">
        <img
          src={game.imageUrl}
          alt={game.name}
          className="w-full h-32 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          {game.badge && (
            <span className={`
              text-xs font-medium rounded px-2 py-0.5
              ${game.badge === 'POPULAR' ? 'bg-accent-pink/90' : 
                game.badge === 'TRENDING' ? 'bg-accent-yellow/90' : 
                game.badge === 'NEW' ? 'bg-accent-blue/90' : 
                'bg-accent-green/90'}
            `}>
              {game.badge}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-rajdhani font-bold text-white">{game.name}</h3>
          <span className="text-xs bg-gray-800 rounded px-2 py-0.5 text-accent-green flex items-center">
            <i className="ri-user-line mr-1"></i> {game.playerCount.toLocaleString()}+ Players
          </span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-400">Tournaments Available: {game.tournamentCount}</span>
          <Link href={`/tournaments?game=${game.id}`}>
            <a className="text-accent-blue hover:text-white text-sm border border-accent-blue hover:bg-accent-blue/20 rounded px-2 py-1 transition-colors">
              PLAY
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
