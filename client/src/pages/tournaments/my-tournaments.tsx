
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Users, Calendar, ArrowRight } from "lucide-react";
import RootLayout from "@/layouts/RootLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tournament } from "@shared/schema";
import { useNavigate } from "@tanstack/react-router";

export default function MyTournaments() {
  const navigate = useNavigate();
  
  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const { data: registrations } = useQuery({
    queryKey: [`/api/tournaments/registrations/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: tournaments } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const myTournaments = tournaments?.filter(tournament => 
    registrations?.some(reg => reg.tournamentId === tournament.id)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-400";
      case "in_progress":
        return "bg-green-500/20 text-green-400";
      case "completed":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <RootLayout>
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Tournaments</h1>
            <p className="text-muted-foreground">
              Track your tournament participation and progress
            </p>
          </div>
          <Button onClick={() => navigate({ to: "/tournaments" })}>
            Browse Tournaments
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myTournaments?.map((tournament) => (
            <Card 
              key={tournament.id} 
              className="bg-secondary-bg/50 border-gray-800 hover:bg-secondary-bg/70 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{tournament.name}</h3>
                  <Badge className={getStatusColor(tournament.status)}>
                    {tournament.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-400">
                    <Trophy className="h-4 w-4 mr-2" />
                    Prize Pool: ₹{tournament.prizePool.toLocaleString()}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    {tournament.currentPlayers}/{tournament.maxPlayers} Players
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate({ to: `/tournaments/${tournament.id}` })}
                >
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}

          {(!myTournaments || myTournaments.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 mb-4">You haven't joined any tournaments yet.</p>
              <Button onClick={() => navigate({ to: "/tournaments" })}>
                Browse Tournaments
              </Button>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
