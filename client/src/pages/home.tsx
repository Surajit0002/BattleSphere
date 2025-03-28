
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Game, Tournament, Match, LeaderboardEntry, Team } from "@shared/schema";
import { Gamepad2, Trophy, Users, ArrowRight, Flame, Sparkles, TrendingUp, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      {/* Hero Section with Parallax */}
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
            
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Join Tournament
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                View Schedule
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 bg-black/30 backdrop-blur border-y border-primary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Trophy, label: "Active Tournaments", value: "24+" },
              { icon: Users, label: "Active Players", value: "10K+" },
              { icon: Award, label: "Prize Pool", value: "₹500K+" },
              { icon: TrendingUp, label: "Daily Matches", value: "100+" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center"
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Featured Games */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                <Gamepad2 className="h-8 w-8 text-primary" />
                Featured Games
              </h2>
              <p className="text-gray-400">Top competitive titles with active tournaments</p>
            </div>
            <Link href="/games">
              <Button variant="outline" size="lg" className="gap-2">
                Browse All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredGames?.map((game) => (
              <motion.div
                key={game.id}
                className="group relative aspect-square rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
                {...fadeInUp}
              >
                <img 
                  src={game.imageUrl} 
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{game.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-primary/20">Popular</Badge>
                    <Badge variant="outline" className="border-primary/30">{game.genre}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live Tournaments */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-2xl" />
          <div className="relative p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                  <Trophy className="h-8 w-8 text-primary" />
                  Live Tournaments
                </h2>
                <p className="text-gray-400">Ongoing battles and upcoming challenges</p>
              </div>
              <Link href="/tournaments">
                <Button variant="outline" size="lg" className="gap-2">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTournaments?.slice(0, 3).map((tournament) => (
                <Card key={tournament.id} className="bg-black/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-accent-red/90">{tournament.status}</Badge>
                    <CardTitle>{tournament.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{tournament.currentPlayers}/{tournament.maxPlayers}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="border-accent-gold text-accent-gold">
                          Prize: ₹{tournament.prizePool.toLocaleString()}
                        </Badge>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Join Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
