import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Flame, Trophy, Users, Calendar, ArrowRight, Gamepad2, Award, Clock, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Game, Tournament, Match, Team, LeaderboardEntry } from "@shared/schema";

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
                Join Tournament <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline">
                Browse Games <Gamepad2 className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Games Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Games</h2>
          <Link href="/games">
            <Button variant="ghost">View All Games <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGames?.map((game) => (
            <motion.div
              key={game.id}
              className="group relative overflow-hidden rounded-lg hover-scale"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img src={game.imageUrl} alt={game.name} className="w-full h-64 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">Active Players: 1.2K</Badge>
                  <Badge variant="outline">Prize Pool: ₹50K</Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Tournaments */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Live Tournaments</h2>
          <Link href="/tournaments">
            <Button variant="ghost">View All <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTournaments?.slice(0, 3).map((tournament) => (
            <Card key={tournament.id} className="bg-secondary-bg/80 backdrop-blur border-gray-800">
              <div className="p-6">
                <Badge className="mb-4">{tournament.gameMode} Mode</Badge>
                <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
                <div className="space-y-2 text-gray-400">
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Prize Pool: ₹{tournament.prizePool.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {tournament.currentPlayers}/{tournament.maxPlayers} Players
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </div>
                </div>
                <Button className="w-full mt-4">Join Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Players Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Top Players</h2>
          <Link href="/leaderboard">
            <Button variant="ghost">View Leaderboard <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaderboardEntries?.slice(0, 4).map((entry, index) => (
            <Card key={entry.id} className="bg-secondary-bg/80 backdrop-blur border-gray-800">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Rank #{index + 1}</h3>
                    <p className="text-gray-400">{entry.points} Points</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Wins</span>
                    <Badge variant="outline">{entry.wins}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Earnings</span>
                    <Badge variant="outline">₹{entry.earnings}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Winners */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-accent/5 to-primary/5 rounded-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Winners</h2>
          <Button variant="ghost">View All <ArrowRight className="ml-2 w-4 h-4" /></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topTeams?.slice(0, 3).map((team) => (
            <Card key={team.id} className="bg-secondary-bg/80 backdrop-blur border-gray-800">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name} className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-xl">{team.name}</h3>
                    <p className="text-gray-400">{team.memberCount} Members</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Award className="w-4 h-4 mr-2" /> Tournament Wins
                    </span>
                    <Badge>{team.wins}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Coins className="w-4 h-4 mr-2" /> Total Earnings
                    </span>
                    <Badge>₹{team.totalEarnings.toLocaleString()}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of players competing in tournaments daily</p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Create Account <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline">
              Browse Tournaments <Trophy className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}