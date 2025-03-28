
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Users, Star, Shield } from "lucide-react";
import RootLayout from "@/layouts/RootLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Team } from "@shared/schema";
import { useNavigate } from "@tanstack/react-router";

export default function MyTeams() {
  const navigate = useNavigate();

  const { data: userTeams } = useQuery<Team[]>({
    queryKey: ["/api/teams/user"],
  });

  return (
    <RootLayout>
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Teams</h1>
            <p className="text-muted-foreground">
              Manage your teams and track their performance
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate({ to: "/join-team" })}>
              Join Team
            </Button>
            <Button onClick={() => navigate({ to: "/teams/create" })}>
              Create Team
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTeams?.map((team) => (
            <Card 
              key={team.id} 
              className="bg-secondary-bg/50 border-gray-800 hover:bg-secondary-bg/70 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                    {team.logoUrl ? (
                      <img 
                        src={team.logoUrl} 
                        alt={team.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Shield className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{team.name}</h3>
                    {team.badge && (
                      <Badge variant="outline" className="mt-1">
                        {team.badge}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      Wins
                    </div>
                    <span>{team.wins}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Earnings
                    </div>
                    <span>₹{team.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Members
                    </div>
                    <span>{team.memberCount}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate({ to: `/teams/${team.id}` })}
                >
                  View Team Details
                </Button>
              </CardFooter>
            </Card>
          ))}

          {(!userTeams || userTeams.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 mb-4">You're not part of any teams yet.</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate({ to: "/join-team" })}>
                  Join a Team
                </Button>
                <Button onClick={() => navigate({ to: "/teams/create" })}>
                  Create a Team
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
