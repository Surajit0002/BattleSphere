import { Team } from "@shared/schema";
import { Link } from "wouter";

interface TeamListProps {
  teams: Team[];
  title?: string;
  showViewAll?: boolean;
}

export default function TeamList({ teams, title = "TOP TEAMS", showViewAll = true }: TeamListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-rajdhani text-white">{title}</h2>
        {showViewAll && (
          <Link href="/teams">
            <a className="text-accent-blue hover:text-accent-blue/80 flex items-center font-medium">
              View All <i className="ri-arrow-right-line ml-1"></i>
            </a>
          </Link>
        )}
      </div>
      
      <div className="bg-secondary-bg rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Based on tournament wins</div>
            <select className="bg-gray-800 text-white text-xs p-1 rounded border border-gray-700">
              <option>Monthly</option>
              <option>All Time</option>
            </select>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {teams.map((team, index) => (
            <div key={team.id} className="flex items-center justify-between p-3 bg-gray-800 rounded hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <span 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 font-semibold
                    ${index === 0 ? 'bg-accent-pink' : 
                      index === 1 ? 'bg-accent-blue' : 
                      index === 2 ? 'bg-accent-green' : 'bg-gray-700'}`}
                >
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-center">
                    <span className="font-rajdhani font-semibold text-white">{team.name}</span>
                    {team.badge && (
                      <div className={`ml-2 px-1 text-xs rounded
                        ${team.badge === 'PRO' ? 'bg-accent-pink/20 text-accent-pink' : 
                          team.badge === 'ELITE' ? 'bg-accent-blue/20 text-accent-blue' : 
                          'bg-gray-700/20 text-gray-300'}
                      `}>
                        {team.badge}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{team.wins} Wins - {team.memberCount} Members</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-accent-yellow font-medium">₹{team.totalEarnings.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total Earnings</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <Link href="/teams/create">
            <a className="w-full block py-2 text-center bg-gray-800 rounded text-white font-rajdhani hover:bg-gray-700 transition-colors">
              CREATE YOUR TEAM
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
