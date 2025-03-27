import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LeaderboardEntry, Game } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<string>("weekly");
  const [gameId, setGameId] = useState<string>("all");
  
  // Fetch leaderboard entries
  const { data: leaderboardEntries, isLoading: loadingLeaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: [`/api/leaderboard?period=${period}${gameId !== 'all' ? `&gameId=${gameId}` : ''}`],
  });
  
  // Fetch all games
  const { data: games, isLoading: loadingGames } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });
  
  const isLoading = loadingLeaderboard || loadingGames;
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-rajdhani text-white mb-2">LEADERBOARD</h1>
        <p className="text-gray-400">
          Track the top performers across all games and tournaments
        </p>
      </div>
      
      <Card className="bg-secondary-bg border-gray-800 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-rajdhani text-white">Leaderboard Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Game</label>
              <Select value={gameId} onValueChange={setGameId}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select Game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  {!loadingGames && games?.map(game => (
                    <SelectItem key={game.id} value={game.id.toString()}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 block mb-2">Time Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-secondary-bg rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-rajdhani font-semibold text-white">
            {gameId === 'all' ? 'All Games' : games?.find(g => g.id.toString() === gameId)?.name} - 
            {period === 'weekly' ? ' Weekly' : period === 'monthly' ? ' Monthly' : ' All Time'} Rankings
          </h2>
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
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Points</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading ? (
                // Loading placeholder rows
                Array(10).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4">&nbsp;</td>
                    <td className="py-4 px-4">&nbsp;</td>
                    <td className="py-4 px-4">&nbsp;</td>
                    <td className="py-4 px-4">&nbsp;</td>
                    <td className="py-4 px-4">&nbsp;</td>
                    <td className="py-4 px-4">&nbsp;</td>
                    <td className="py-4 px-4">&nbsp;</td>
                  </tr>
                ))
              ) : leaderboardEntries?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    No leaderboard data available for the selected filters
                  </td>
                </tr>
              ) : (
                leaderboardEntries?.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap">
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
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {entry.user?.profileImage ? (
                          <img 
                            className="h-10 w-10 rounded-full mr-3" 
                            src={entry.user.profileImage} 
                            alt={entry.user?.displayName || "Player"} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full mr-3 bg-gray-700 flex items-center justify-center">
                            <span className="text-xs text-gray-300">
                              {entry.user?.displayName?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{entry.user?.displayName}</div>
                          <div className="text-xs text-gray-400">
                            {entry.teamId ? `Team ${String.fromCharCode(64 + entry.teamId)}` : "No Team"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">{entry.totalMatches}</td>
                    <td className="py-4 px-4 whitespace-nowrap">{entry.wins}</td>
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-accent-green">{entry.kdRatio}</td>
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-accent-blue">{entry.points}</td>
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-accent-yellow">₹{entry.earnings.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="bg-secondary-bg border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-rajdhani text-white">Most Tournament Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboardEntries?.slice(0, 5)
                .sort((a, b) => b.wins - a.wins)
                .map((entry, index) => (
                  <div key={entry.id} className="flex justify-between items-center p-2 rounded bg-gray-800">
                    <div className="flex items-center">
                      <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-2">
                        {index + 1}
                      </span>
                      <span className="font-medium text-white">{entry.user?.displayName}</span>
                    </div>
                    <span className="text-accent-green">{entry.wins} Wins</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary-bg border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-rajdhani text-white">Highest K/D Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboardEntries?.slice(0, 5)
                .sort((a, b) => parseFloat(b.kdRatio) - parseFloat(a.kdRatio))
                .map((entry, index) => (
                  <div key={entry.id} className="flex justify-between items-center p-2 rounded bg-gray-800">
                    <div className="flex items-center">
                      <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-2">
                        {index + 1}
                      </span>
                      <span className="font-medium text-white">{entry.user?.displayName}</span>
                    </div>
                    <span className="text-accent-yellow">{entry.kdRatio} K/D</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary-bg border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-rajdhani text-white">Top Earners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboardEntries?.slice(0, 5)
                .sort((a, b) => b.earnings - a.earnings)
                .map((entry, index) => (
                  <div key={entry.id} className="flex justify-between items-center p-2 rounded bg-gray-800">
                    <div className="flex items-center">
                      <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-2">
                        {index + 1}
                      </span>
                      <span className="font-medium text-white">{entry.user?.displayName}</span>
                    </div>
                    <span className="text-accent-pink">₹{entry.earnings.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
