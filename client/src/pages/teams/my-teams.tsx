import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, ArrowRight } from "lucide-react";
import RootLayout from "@/layouts/RootLayout";

export default function MyTeams() {
  const [, navigate] = useLocation();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['/api/teams/user'],
  });

  if (isLoading) {
    return (
      <RootLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Teams</h1>
          <Button onClick={() => navigate("/teams/create")}>Create Team</Button>
        </div>

        {teams && teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="bg-gray-900/50 border-gray-800">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                      {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Users className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{team.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{team.memberCount} members</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>Wins: {team.wins}</span>
                    </div>
                    {team.badge && (
                      <Badge variant="outline" className="bg-primary/10">
                        {team.badge}
                      </Badge>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Teams Yet</h2>
            <p className="text-gray-400 mb-4">You haven't joined or created any teams yet.</p>
            <Button onClick={() => navigate("/teams/create")}>Create Your First Team</Button>
          </div>
        )}
      </div>
    </RootLayout>
  );
}