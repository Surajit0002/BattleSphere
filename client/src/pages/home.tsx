
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Game, Tournament, Match, LeaderboardEntry, Team } from '@shared/schema';
import { Flame, Trophy, Users, Calendar, GamepadIcon, TrendingUp, Clock, MonitorPlay } from 'lucide-react';

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
            
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Join Tournament
              </Button>
              <Button size="lg" variant="outline">
                Browse Games
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Games</h2>
            <p className="text-muted-foreground">Popular titles with active tournaments</p>
          </div>
          <Button variant="outline">View All Games</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredGames?.map((game) => (
            <Card key={game.id} className="group hover:border-primary transition-colors overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={game.imageUrl} 
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Users className="h-4 w-4" />
                      <span>{Math.floor(Math.random() * 10000)} Players</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Live Streams Preview */}
      <section className="py-16 bg-gradient-to-r from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Live Now</h2>
              <p className="text-muted-foreground">Watch top players compete live</p>
            </div>
            <Button>
              <MonitorPlay className="mr-2 h-4 w-4" />
              View All Streams
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((stream) => (
              <Card key={stream} className="group cursor-pointer overflow-hidden">
                <div className="aspect-video relative">
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
                    LIVE
                  </div>
                  <img 
                    src={`https://picsum.photos/800/450?random=${stream}`}
                    alt="Stream thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Pro Tournament Finals - Match {stream}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>🏆 Prize Pool: $10,000</span>
                    <span>👥 {Math.floor(Math.random() * 5000)} watching</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Game Stats Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardContent className="p-6">
              <GamepadIcon className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-1">1.2M+</h3>
              <p className="text-muted-foreground">Active Players</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent-blue/10 to-transparent border-accent-blue/20">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 mb-4 text-accent-blue" />
              <h3 className="text-2xl font-bold mb-1">150+</h3>
              <p className="text-muted-foreground">Tournaments</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent-green/10 to-transparent border-accent-green/20">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 mb-4 text-accent-green" />
              <h3 className="text-2xl font-bold mb-1">₹50L+</h3>
              <p className="text-muted-foreground">Prize Pool</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/20">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 mb-4 text-accent-gold" />
              <h3 className="text-2xl font-bold mb-1">24/7</h3>
              <p className="text-muted-foreground">Support</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
