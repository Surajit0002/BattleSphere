import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleUser, Eye, Filter, Heart, MoreVertical, Play, Search, Users } from "lucide-react";

export default function LiveStreams() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch live streams
  const { data: streams } = useQuery({
    queryKey: ['/api/streams'],
    initialData: [],
  });
  
  // Mock data for demo
  const mockStreams = streams.length > 0 ? streams : [
    {
      id: 1,
      title: "Pro League Finals - Team Alpha vs Fearless Fighters",
      game: "Free Fire",
      streamer: "BattleSphere Official",
      streamerImage: "https://i.imgur.com/p8iUFop.png",
      thumbnail: "https://i.imgur.com/VdxQbYs.jpg",
      viewers: 12853,
      featured: true,
      type: "tournament",
      live: true,
      started: "2025-03-27T10:30:00Z"
    },
    {
      id: 2,
      title: "Solo vs Squad Challenge - Road to Champion",
      game: "PUBG Mobile",
      streamer: "GhostSniper",
      streamerImage: "https://i.imgur.com/6QRe8Zq.jpg",
      thumbnail: "https://i.imgur.com/EB98N5A.jpg",
      viewers: 4521,
      featured: false,
      type: "player",
      live: true,
      started: "2025-03-27T11:15:00Z"
    },
    {
      id: 3,
      title: "Weekend Warriors Tournament - Semifinals",
      game: "COD Mobile",
      streamer: "BattleSphere Official",
      streamerImage: "https://i.imgur.com/p8iUFop.png",
      thumbnail: "https://i.imgur.com/iO7j3v6.jpg",
      viewers: 8947,
      featured: true,
      type: "tournament",
      live: true,
      started: "2025-03-27T09:45:00Z"
    },
    {
      id: 4,
      title: "Team Practice Session - Scrims with Elite Squad",
      game: "BGMI",
      streamer: "ProPlayer123",
      streamerImage: "https://i.imgur.com/pSZM5Nu.jpg",
      thumbnail: "https://i.imgur.com/ydJJJnb.jpg",
      viewers: 2156,
      featured: false,
      type: "team",
      live: true,
      started: "2025-03-27T12:30:00Z"
    },
    {
      id: 5,
      title: "Tournament Analysis & Strategy Breakdown",
      game: "Free Fire",
      streamer: "StrategyMaster",
      streamerImage: "https://i.imgur.com/xvfTsOa.jpg",
      thumbnail: "https://i.imgur.com/92LGd8z.jpg",
      viewers: 3287,
      featured: false,
      type: "analysis",
      live: true,
      started: "2025-03-27T13:15:00Z"
    },
    {
      id: 6,
      title: "Weekly Showdown - Group Stage Matches",
      game: "PUBG Mobile",
      streamer: "BattleSphere Official",
      streamerImage: "https://i.imgur.com/p8iUFop.png",
      thumbnail: "https://i.imgur.com/zDCi6LQ.jpg",
      viewers: 5632,
      featured: false,
      type: "tournament",
      live: true,
      started: "2025-03-27T14:00:00Z"
    }
  ];
  
  // Mock recommended channels
  const recommendedChannels = [
    { id: 1, name: "BattleSphere Official", image: "https://i.imgur.com/p8iUFop.png", followers: 254862 },
    { id: 2, name: "GhostSniper", image: "https://i.imgur.com/6QRe8Zq.jpg", followers: 142578 },
    { id: 3, name: "ProPlayer123", image: "https://i.imgur.com/pSZM5Nu.jpg", followers: 98472 },
    { id: 4, name: "StrategyMaster", image: "https://i.imgur.com/xvfTsOa.jpg", followers: 65321 },
    { id: 5, name: "GameQueen", image: "https://i.imgur.com/nX8bVy9.jpg", followers: 124753 }
  ];
  
  // Mock upcoming streams
  const upcomingStreams = [
    { id: 1, title: "Season Finale - Elite League", game: "Free Fire", time: "Tomorrow, 3:00 PM" },
    { id: 2, title: "Pro vs Amateur Challenge", game: "COD Mobile", time: "Tomorrow, 6:30 PM" },
    { id: 3, title: "Monthly Tournament Finals", game: "PUBG Mobile", time: "March 29, 2:00 PM" }
  ];
  
  const filteredStreams = mockStreams.filter(stream => {
    if (filter !== "all" && stream.type !== filter) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        stream.title.toLowerCase().includes(query) ||
        stream.game.toLowerCase().includes(query) ||
        stream.streamer.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const sortedStreams = [...filteredStreams].sort((a, b) => {
    // Featured streams first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then sort by viewers
    return b.viewers - a.viewers;
  });
  
  function formatViewerCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }
  
  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString();
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="md:w-3/4 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Live Streams</h1>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search streams..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    All Streams
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("tournament")}>
                    Tournament Streams
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("player")}>
                    Player Streams
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("team")}>
                    Team Streams
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("analysis")}>
                    Analysis Streams
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Featured Stream */}
          {sortedStreams.length > 0 && sortedStreams[0].featured && (
            <div className="mb-8">
              <div className="group relative rounded-lg overflow-hidden aspect-video">
                <img 
                  src={sortedStreams[0].thumbnail} 
                  alt={sortedStreams[0].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="uppercase font-bold px-3 py-1">
                    Live
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={sortedStreams[0].streamerImage} alt={sortedStreams[0].streamer} />
                      <AvatarFallback>{sortedStreams[0].streamer.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-white">{sortedStreams[0].streamer}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{sortedStreams[0].title}</h2>
                  <div className="flex items-center space-x-4 text-white">
                    <Badge variant="secondary">{sortedStreams[0].game}</Badge>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{formatViewerCount(sortedStreams[0].viewers)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                      <span>Started {getTimeAgo(sortedStreams[0].started)}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  size="lg"
                >
                  <Play className="mr-2 h-5 w-5" /> Watch Now
                </Button>
              </div>
            </div>
          )}
          
          {/* Stream Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStreams.slice(sortedStreams[0]?.featured ? 1 : 0).map((stream) => (
              <Link key={stream.id} href={`/stream/${stream.id}`}>
                <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300">
                  <div className="relative aspect-video">
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="destructive" className="uppercase">Live</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {formatViewerCount(stream.viewers)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={stream.streamerImage} alt={stream.streamer} />
                        <AvatarFallback>{stream.streamer.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{stream.title}</p>
                        <p className="text-xs text-muted-foreground">{stream.streamer}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant="outline" className="text-xs px-1.5">{stream.game}</Badge>
                          <span className="text-xs text-muted-foreground">{getTimeAgo(stream.started)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {filteredStreams.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No streams found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          )}
          
          {filteredStreams.length > 0 && (
            <div className="flex justify-center mt-6">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Channels</CardTitle>
              <CardDescription>Popular streamers to follow</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                <div className="space-y-2 p-4">
                  {recommendedChannels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={channel.image} alt={channel.name} />
                          <AvatarFallback>{channel.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{channel.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(channel.followers / 1000).toFixed(1)}K followers
                          </p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Streams</CardTitle>
              <CardDescription>Don't miss these events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingStreams.map((stream) => (
                  <div key={stream.id} className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <div className="h-10 w-1 bg-primary rounded-full"></div>
                      <div>
                        <h4 className="font-medium">{stream.title}</h4>
                        <p className="text-sm text-muted-foreground">{stream.game}</p>
                        <p className="text-xs flex items-center mt-1">
                          <Play className="h-3 w-3 mr-1 text-primary" />
                          {stream.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="link" className="text-xs h-auto p-0">Set reminder</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                      <img src="https://i.imgur.com/rQB4ATC.png" alt="Free Fire" className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Free Fire</p>
                      <p className="text-xs text-muted-foreground">32K viewers</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs h-8">Browse</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                      <img src="https://i.imgur.com/92yjEem.png" alt="PUBG Mobile" className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">PUBG Mobile</p>
                      <p className="text-xs text-muted-foreground">24K viewers</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs h-8">Browse</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                      <img src="https://i.imgur.com/9RFzHeO.png" alt="COD Mobile" className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">COD Mobile</p>
                      <p className="text-xs text-muted-foreground">18K viewers</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs h-8">Browse</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Go Live</CardTitle>
              <CardDescription>Start streaming your gameplay</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <CircleUser className="mr-2 h-4 w-4" />
                Start Streaming
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Share your gameplay with the BattleSphere community. Stream tournaments, practice sessions, or casual gaming.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Categories */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        
        <Tabs defaultValue="games">
          <TabsList className="mb-6">
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>
          
          <TabsContent value="games">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {["Free Fire", "PUBG Mobile", "COD Mobile", "BGMI", "Clash Royale", "Mobile Legends"].map((game, index) => (
                <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-square relative">
                    <img 
                      src={`https://i.imgur.com/rQB4ATC.png`} 
                      alt={game}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Button variant="secondary" size="sm">
                        Browse
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3 text-center">
                    <p className="font-medium">{game}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 40) + 5}K viewers
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tournaments">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {["Pro League Finals", "Weekend Warriors", "Weekly Showdown", "Season Qualifier", "Amateur Cup", "Elite League"].map((tournament, index) => (
                <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-video relative">
                    <img 
                      src={`https://i.imgur.com/VdxQbYs.jpg`} 
                      alt={tournament}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-medium">{tournament}</h3>
                      <div className="flex items-center mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {["Free Fire", "PUBG Mobile", "COD Mobile"][index % 3]}
                        </Badge>
                        <span className="text-xs text-white/80 ml-2">
                          {Math.floor(Math.random() * 20) + 2}K viewers
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="teams">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {["Fearless Fighters", "Elite Squad", "Dragon Warriors", "Phoenix Rise", "Team Inferno", "Shadow Wolves", "Thunder Tribe", "Ninja Network", "Galaxy Guards", "Titan Troop"].map((team, index) => (
                <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-square relative bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-2xl">
                      {team.split(' ').map(word => word[0]).join('')}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Button variant="secondary" size="sm">
                        View Team
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3 text-center">
                    <p className="font-medium">{team}</p>
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{Math.floor(Math.random() * 5) + 3} members</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}