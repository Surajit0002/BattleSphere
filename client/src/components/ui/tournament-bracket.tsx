import { Match } from "@shared/schema";

interface TournamentBracketProps {
  matches: Match[];
  onMatchClick?: (match: Match) => void;
}

export function TournamentBracket({ matches, onMatchClick }: TournamentBracketProps) {
  // Group matches by round
  const roundMatches: Record<number, Match[]> = {};
  
  matches.forEach(match => {
    if (!roundMatches[match.round]) {
      roundMatches[match.round] = [];
    }
    roundMatches[match.round].push(match);
  });
  
  const rounds = Object.keys(roundMatches).map(Number).sort((a, b) => a - b);
  const maxRound = Math.max(...rounds);
  
  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[800px]">
        <div className="flex justify-between">
          {rounds.map((round, index) => (
            <div key={round} className="flex flex-col space-y-4 w-[22%]">
              <div className="text-xs text-gray-400 mb-2 font-medium">
                {round === 1 ? 'QUARTER FINALS' : round === 2 ? 'SEMI FINALS' : round === 3 ? 'FINALS' : `ROUND ${round}`}
              </div>
              
              {roundMatches[round].map((match, matchIndex) => {
                const isFinal = round === maxRound;
                const marginTop = round > 1 ? (matchIndex === 0 ? 16 : 24) : 0;
                
                return (
                  <div key={match.id}>
                    <div 
                      className={`bg-gray-800 rounded border ${isFinal ? 'border-accent-blue neon-border' : 'border-gray-700'} p-2 ${marginTop > 0 ? `mt-${marginTop}` : ''} cursor-pointer transition-all hover:border-accent-blue/70 hover:shadow-lg hover:shadow-accent-blue/10`}
                      onClick={() => onMatchClick?.(match)}
                    >
                      <div className="flex justify-between items-center mb-2 p-1 bg-gray-900 rounded">
                        <div className="flex items-center">
                          <span className="w-5 h-5 rounded bg-accent-blue/20 flex items-center justify-center text-xs mr-2">
                            {match.team1Id || "?"}
                          </span>
                          <span className="text-sm font-medium">
                            {match.team1Id ? `Team ${String.fromCharCode(64 + match.team1Id)}` : "TBD"}
                          </span>
                        </div>
                        <span className={`font-medium ${match.winnerId === match.team1Id ? 'text-accent-green' : 'text-gray-400'}`}>
                          {match.team1Score || "?"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-1 bg-gray-900 rounded">
                        <div className="flex items-center">
                          <span className="w-5 h-5 rounded bg-accent-blue/20 flex items-center justify-center text-xs mr-2">
                            {match.team2Id || "?"}
                          </span>
                          <span className="text-sm font-medium">
                            {match.team2Id ? `Team ${String.fromCharCode(64 + match.team2Id)}` : "TBD"}
                          </span>
                        </div>
                        <span className={`font-medium ${match.winnerId === match.team2Id ? 'text-accent-green' : 'text-gray-400'}`}>
                          {match.team2Score || "?"}
                        </span>
                      </div>
                    </div>
                    
                    {isFinal && match.winnerId && (
                      <div className="text-center bg-accent-blue/20 p-2 rounded mt-4 border border-accent-blue">
                        <div className="text-xs text-gray-300 mb-1">CHAMPION</div>
                        <div className="font-rajdhani font-bold text-accent-pink">
                          {match.winnerId ? `TEAM ${String.fromCharCode(64 + match.winnerId)}` : "TBD"}
                        </div>
                        <div className="text-xs text-accent-green mt-1">₹25,000 Prize</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Prize Distribution */}
          <div className="w-[22%] flex flex-col">
            <div className="text-xs text-gray-400 mb-2 font-medium">PRIZE DISTRIBUTION</div>
            <div className="bg-gray-800 rounded border border-gray-700 p-4 space-y-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">1st Place</div>
                <div className="flex justify-between">
                  <span className="font-medium">Team Golf</span>
                  <span className="text-accent-green">₹25,000</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">2nd Place</div>
                <div className="flex justify-between">
                  <span className="font-medium">Team Alpha</span>
                  <span className="text-accent-green">₹15,000</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">3rd-4th Place</div>
                <div className="flex justify-between">
                  <span className="font-medium">Teams Charlie & Foxtrot</span>
                  <span className="text-accent-green">₹5,000 each</span>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-gray-700">
                <div className="text-xs text-accent-yellow mb-1">MVP Award</div>
                <div className="flex justify-between">
                  <span className="font-medium">GhostSniper (Team Golf)</span>
                  <span className="text-accent-green">₹2,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
