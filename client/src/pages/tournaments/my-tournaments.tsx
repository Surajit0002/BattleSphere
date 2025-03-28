import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Users, ArrowRight, GamepadIcon } from "lucide-react";
import RootLayout from "@/layouts/RootLayout";

export default function MyTournaments() {
  const [, navigate] = useLocation();

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ['/api/tournaments'],
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
          <h1 className="text-2xl font-bold">My Tournaments</h1>
          <Button onClick={() => navigate("/tournaments")}>Browse Tournaments</Button>
        </div>

        {tournaments && tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-gray-900/50 border-gray-800">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={`
                      ${tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                        tournament.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'}
                    `}>
                      {tournament.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>

                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{tournament.currentPlayers}/{tournament.maxPlayers} Players</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>Prize Pool: ₹{tournament.prizePool.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/tournaments/${tournament.id}`)}
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
            <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Tournaments Yet</h2>
            <p className="text-gray-400 mb-4">You haven't participated in any tournaments yet.</p>
            <Button onClick={() => navigate("/tournaments")}>Browse Tournaments</Button>
          </div>
        )}
      </div>
    </RootLayout>
  );
}