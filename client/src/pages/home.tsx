
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowRight, Award, Calendar, Flame, GamepadIcon, Trophy, TrendingUp, Users, Star, Medal } from "lucide-react";
import { Link } from "wouter";
import { Game, Tournament, Match, LeaderboardEntry, Team } from "@shared/schema";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
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
    <div className="min-h-screen bg-gradient-to-b from-background/95 to-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-primary/20 via-background to-background"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="container relative mx-auto px-4 h-full flex items-center">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-primary/90 hover:bg-primary px-4 py-2 text-lg font-bold uppercase animate-pulse">
              <Flame className="w-5 h-5 mr-2" /> LIVE Tournament
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-accent">
              Epic Gaming Tournaments Await
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join the ultimate gaming battleground. Compete in tournaments, climb the leaderboards, and win epic prizes.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Join Tournament <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30">
                View Schedule <Calendar className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Games Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Games</h2>
            <p className="text-gray-400">Popular titles with active tournaments</p>
          </div>
          <Button variant="outline">View All Games</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames?.map((game) => (
            <Link key={game.id} href={`/games/${game.id}`}>
              <Card className="group hover-scale cursor-pointer overflow-hidden border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/30">
                <div className="aspect-video relative overflow-hidden">
                  <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold">{game.name}</h3>
                    <p className="text-sm text-gray-300">{game.genre}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Tournaments & Streams */}
      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Live Now</h2>
              <p className="text-gray-400">Watch ongoing tournaments and streams</p>
            </div>
            <Button variant="outline">View All Live</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-2 border-gray-800 bg-gradient-to-br from-red-900/20 to-black/30">
              <CardHeader>
                <Badge variant="destructive" className="w-fit animate-pulse">LIVE</Badge>
                <CardTitle className="text-2xl">Pro League Finals</CardTitle>
                <CardDescription>Watch the intense battle for the championship</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-900/60 rounded-lg overflow-hidden">
                  {/* Placeholder for stream/tournament view */}
                  <div className="w-full h-full flex items-center justify-center">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      Watch Stream
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/30">
                <CardHeader>
                  <CardTitle>Top Streamers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-800" />
                        <div>
                          <p className="font-medium">Streamer {i}</p>
                          <p className="text-sm text-gray-400">Playing PUBG Mobile</p>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {Math.floor(Math.random() * 10 + 1)}K
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/30">
                <CardHeader>
                  <CardTitle>Upcoming Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTournaments?.slice(0, 3).map((tournament) => (
                      <div key={tournament.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center">
                          <GamepadIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{tournament.name}</p>
                          <p className="text-sm text-gray-400">In 2 hours</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Community Highlights</h2>
            <p className="text-gray-400">Celebrating our top players and achievements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/30">
            <CardHeader>
              <Trophy className="w-8 h-8 text-accent-gold mb-2" />
              <CardTitle>Tournament Winners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTeams?.slice(0, 3).map((team) => (
                  <div key={team.id} className="flex items-center gap-3">
                    <Medal className="w-5 h-5 text-accent-gold" />
                    <span>{team.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/30">
            <CardHeader>
              <Star className="w-8 h-8 text-accent-yellow mb-2" />
              <CardTitle>Top Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardEntries?.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-accent-green" />
                    <span>Player #{entry.userId}</span>
                    <Badge variant="outline" className="ml-auto">
                      {entry.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/30">
            <CardHeader>
              <Award className="w-8 h-8 text-accent-purple mb-2" />
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "First Blood Master",
                  "Tournament Champion",
                  "Community Leader"
                ].map((achievement, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-accent-purple" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/30">
            <CardHeader>
              <Users className="w-8 h-8 text-accent-blue mb-2" />
              <CardTitle>Active Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTeams?.slice(0, 3).map((team) => (
                  <div key={team.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center">
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-sm text-gray-400">5 members</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Battle?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create your account now and start competing in tournaments, earning rewards, and climbing the leaderboards.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="border-primary/30">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
