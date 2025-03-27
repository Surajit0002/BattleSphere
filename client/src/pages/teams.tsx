import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Team, User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Fetch all teams
  const { data: teams, isLoading: loadingTeams } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });
  
  // Filter teams based on search query
  const filteredTeams = teams?.filter(team => 
    !searchQuery || team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Organize teams by ranking (based on total earnings)
  const rankedTeams = filteredTeams?.sort((a, b) => b.totalEarnings - a.totalEarnings);
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-rajdhani text-white mb-2">TEAMS & CLANS</h1>
        <p className="text-gray-400">
          Browse top teams, create your own, or join an existing one
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>
        <div>
          <Link href="/teams/create">
            <Button className="w-full bg-gradient-to-r from-accent-blue to-accent-pink text-white font-rajdhani">
              CREATE TEAM
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="top" className="mb-6">
        <TabsList className="bg-secondary-bg border border-gray-800 p-1">
          <TabsTrigger value="top" className="data-[state=active]:bg-accent-blue data-[state=active]:text-white">
            Top Teams
          </TabsTrigger>
          <TabsTrigger value="my" className="data-[state=active]:bg-accent-blue data-[state=active]:text-white">
            My Teams
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-accent-blue data-[state=active]:text-white">
            Recently Formed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="top" className="mt-4">
          {/* Top Teams Content */}
          {loadingTeams ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-secondary-bg rounded-lg h-48 animate-pulse"></div>
              ))}
            </div>
          ) : filteredTeams?.length === 0 ? (
            <div className="text-center py-10 bg-secondary-bg rounded-lg border border-gray-800">
              <div className="text-gray-400 mb-3">No teams match your search</div>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {rankedTeams?.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my" className="mt-4">
          <div className="text-center py-10 bg-secondary-bg rounded-lg border border-gray-800">
            <div className="text-gray-400 mb-3">You are not a member of any team yet</div>
            <Link href="/teams/create">
              <Button className="bg-accent-blue hover:bg-accent-blue/90">
                Create Your Team
              </Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Show teams sorted by createdAt instead of ranking */}
            {filteredTeams?.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Featured Team */}
      {!loadingTeams && teams && teams.length > 0 && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-rajdhani text-white">FEATURED TEAM</h2>
          </div>
          
          <div className="bg-secondary-bg rounded-lg border border-gray-800 overflow-hidden">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Featured Team" 
                className="w-full h-48 lg:h-64 object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-bg/90 to-primary-bg/50"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between">
                  <div>
                    <span className="bg-accent-pink/90 text-white text-xs px-2 py-1 rounded mb-2 inline-block">
                      {teams[0].badge || 'PRO'}
                    </span>
                    <h3 className="text-2xl font-bold font-rajdhani text-white mb-1">{teams[0].name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{teams[0].description || "Top competitive team with multiple tournament wins"}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gray-800 text-xs px-2 py-1 rounded flex items-center">
                        <i className="ri-trophy-line mr-1"></i> {teams[0].wins} Wins
                      </span>
                      <span className="bg-gray-800 text-xs px-2 py-1 rounded flex items-center">
                        <i className="ri-team-line mr-1"></i> {teams[0].memberCount} Members
                      </span>
                      <span className="bg-accent-green/90 text-xs px-2 py-1 rounded flex items-center">
                        <i className="ri-money-dollar-circle-line mr-1"></i> ₹{teams[0].totalEarnings.toLocaleString()} Earned
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-accent-blue hover:bg-accent-blue/90 text-white font-rajdhani">
                      VIEW TEAM
                    </Button>
                    <Button className="bg-gray-800 hover:bg-gray-700 text-white border border-accent-blue/30 font-rajdhani">
                      JOIN REQUEST
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="text-lg font-rajdhani font-semibold text-white mb-4">TEAM MEMBERS</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Sample team members - In a real implementation, you'd fetch and display actual team members */}
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded p-4 flex items-center">
                    <img 
                      className="h-12 w-12 rounded-full mr-3" 
                      src={`https://images.unsplash.com/photo-${1568602471122 + i * 1000}-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`} 
                      alt={`Team Member ${i+1}`} 
                    />
                    <div>
                      <div className="font-medium text-white">
                        {i === 0 ? "GhostSniper" : i === 1 ? "NinjaWarrior" : i === 2 ? "StealthQueen" : "ShadowFighter"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {i === 0 ? "Captain" : "Member"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

interface TeamCardProps {
  team: Team;
}

function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="bg-secondary-bg border-gray-800 overflow-hidden hover:border-accent-blue/50 transition-all">
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          {team.logoUrl ? (
            <img 
              src={team.logoUrl} 
              alt={team.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-accent-blue/20 mr-3 flex items-center justify-center text-xl font-bold">
              {team.name.charAt(0)}
            </div>
          )}
          <h3 className="font-rajdhani font-bold text-white">{team.name}</h3>
        </div>
        {team.badge && (
          <span className={`text-xs rounded px-2 py-0.5
            ${team.badge === 'PRO' ? 'bg-accent-pink/20 text-accent-pink' : 
              team.badge === 'ELITE' ? 'bg-accent-blue/20 text-accent-blue' : 
              'bg-gray-700/20 text-gray-300'}
          `}>
            {team.badge}
          </span>
        )}
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-400">Wins</div>
            <div className="font-medium text-white">{team.wins}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Members</div>
            <div className="font-medium text-white">{team.memberCount}/4</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Created</div>
            <div className="font-medium text-white">
              {new Date(team.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Earnings</div>
            <div className="font-medium text-accent-green">₹{team.totalEarnings.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white py-2 rounded font-rajdhani font-medium">
            VIEW
          </Button>
          <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded font-rajdhani font-medium border border-accent-blue/30">
            JOIN
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
