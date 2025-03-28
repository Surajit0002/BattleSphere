
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Users, Star, Calendar, Gamepad2, Trending } from "lucide-react";
import { Game, Tournament, LeaderboardEntry, Team, Match } from "@shared/schema";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  const { data: featuredGames } = useQuery<Game[]>({
    queryKey: ['/api/games/featured'],
  });
  
  const { data: upcomingTournaments } = useQuery<Tournament[]>({
    queryKey: ['/api/tournaments/upcoming'],
  });
  
  const { data: featuredTournamentData } = useQuery<{ 
    matches: Match[] 
  } & Tournament>({
    queryKey: ['/api/tournaments/featured'],
  });
  
  const { data: leaderboardEntries } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard'],
  });
  
  const { data: topTeams } = useQuery<Team[]>({
    queryKey: ['/api/teams/top'],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-blue">
              Welcome to BattleSphere
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Your gateway to competitive mobile gaming tournaments and community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Featured Games Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              Featured Games
            </h2>
            <Link href="/games">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredGames?.map((game) => (
              <motion.div
                key={game.id}
                className="group relative aspect-square rounded-lg overflow-hidden hover-scale"
                {...fadeInUp}
              >
                <img 
                  src={game.imageUrl} 
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                  <div>
                    <h3 className="text-white font-semibold">{game.name}</h3>
                    <Badge variant="secondary" className="mt-1">Popular</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tournaments and Teams Tabs */}
        <section>
          <Tabs defaultValue="tournaments" className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="tournaments" className="flex-1">
                <Trophy className="h-4 w-4 mr-2" /> Tournaments
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex-1">
                <Users className="h-4 w-4 mr-2" /> Teams
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tournaments">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTournaments?.map((tournament) => (
                  <motion.div key={tournament.id} {...fadeInUp}>
                    <Card className="bg-card/50 backdrop-blur border-primary/10 hover:border-primary/30 transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{tournament.name}</span>
                          <Badge>{tournament.status}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{tournament.currentPlayers}/{tournament.maxPlayers} Players</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Trophy className="h-4 w-4 mr-2 text-accent-gold" />
                            <span className="text-accent-gold">₹{tournament.prizePool.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="teams">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {topTeams?.map((team) => (
                  <motion.div key={team.id} {...fadeInUp}>
                    <Card className="bg-card/50 backdrop-blur">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                            {team.logoUrl ? (
                              <img src={team.logoUrl} alt={team.name} className="w-full h-full rounded-full" />
                            ) : (
                              <Users className="h-8 w-8 text-primary" />
                            )}
                          </div>
                          <h3 className="font-semibold">{team.name}</h3>
                          <Badge variant="secondary" className="mt-2">Top Team</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Leaderboard Section */}
        <section>
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent-gold" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {leaderboardEntries?.map((entry, index) => (
                    <motion.div 
                      key={entry.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                      {...fadeInUp}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-2xl font-bold text-muted-foreground w-8">
                        #{index + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="font-semibold">{entry.playerName}</div>
                        <div className="text-sm text-muted-foreground">{entry.gameName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{entry.score} pts</div>
                        <div className="text-sm text-accent-green flex items-center gap-1">
                          <Trending className="h-4 w-4" />
                          +{entry.rankChange}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
