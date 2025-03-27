import { useState } from "react";
import { LeaderboardEntry } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  showViewAll?: boolean;
}

export default function Leaderboard({ entries, title = "TOP PLAYERS", showViewAll = true }: LeaderboardProps) {
  const [period, setPeriod] = useState<string>("weekly");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-rajdhani text-white">{title}</h2>
        {showViewAll && (
          <a href="/leaderboard" className="text-accent-blue hover:text-accent-blue/80 flex items-center font-medium">
            View Full Leaderboard <i className="ri-arrow-right-line ml-1"></i>
          </a>
        )}
      </div>
      
      <div className="bg-secondary-bg rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              className={`px-3 py-1 text-sm rounded ${selectedGame === 'all' ? 'bg-accent-blue text-white' : 'bg-gray-800 text-white'}`}
              onClick={() => setSelectedGame('all')}
            >
              All Games
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${selectedGame === 'free-fire' ? 'bg-accent-blue text-white' : 'bg-gray-800 text-white'}`}
              onClick={() => setSelectedGame('free-fire')}
            >
              Free Fire
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${selectedGame === 'pubg' ? 'bg-accent-blue text-white' : 'bg-gray-800 text-white'}`}
              onClick={() => setSelectedGame('pubg')}
            >
              PUBG Mobile
            </button>
          </div>
          <div>
            <select 
              className="bg-gray-800 text-white text-sm p-1 rounded border border-gray-700"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tournaments</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Wins</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">K/D</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-1 font-semibold
                          ${entry.rank === 1 ? 'bg-accent-pink' : 
                            entry.rank === 2 ? 'bg-accent-blue' : 
                            entry.rank === 3 ? 'bg-accent-green' : 'bg-gray-700'}`}
                      >
                        {entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {entry.user?.profileImage ? (
                        <img 
                          className="h-8 w-8 rounded-full mr-3" 
                          src={entry.user.profileImage} 
                          alt={entry.user?.displayName || "Player"} 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full mr-3 bg-gray-700 flex items-center justify-center">
                          <span className="text-xs text-gray-300">
                            {entry.user?.displayName?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{entry.user?.displayName}</div>
                        <div className="text-xs text-gray-400">Team {String.fromCharCode(64 + entry.teamId!)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap text-sm">{entry.totalMatches}</td>
                  <td className="py-2 px-4 whitespace-nowrap text-sm">{entry.wins}</td>
                  <td className="py-2 px-4 whitespace-nowrap text-sm font-medium text-accent-green">{entry.kdRatio}</td>
                  <td className="py-2 px-4 whitespace-nowrap text-sm font-medium text-accent-yellow">₹{entry.earnings.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
