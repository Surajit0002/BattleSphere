import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart, MessageSquare, Share2, Users, ThumbsUp, Gift, Eye, Calendar, MoreVertical, Send, PictureInPicture, Fullscreen, Volume2, Settings, Crown, Clipboard, ExternalLink, Play } from "lucide-react";

// Define the interface for a team in a tournament
interface StreamTeam {
  id: number;
  name: string;
  logo: string;
  score: number;
}

// Define the stream interface
interface Stream {
  id: number;
  title: string;
  description: string;
  game: string;
  gameId: number;
  streamer: string;
  streamerId: number;
  streamerImage: string;
  thumbnail: string;
  viewers: number;
  likes: number;
  featured: boolean;
  type: string;
  live: boolean;
  started: string;
  tournamentId?: number;
  tournamentName?: string;
  tournamentStage?: string;
  teams?: StreamTeam[];
}

// Chat message interface
interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  isPremium: boolean;
  isModerator?: boolean;
  isYou?: boolean;
}

// Recommended stream interface
interface RecommendedStream {
  id: number;
  title: string;
  game: string;
  streamer: string;
  thumbnail: string;
  viewers: number;
}

export default function StreamDetails() {
  const [_, params] = useRoute("/stream/:id");
  const streamId = params?.id ? parseInt(params.id) : 1;
  const [isFollowing, setIsFollowing] = useState(false);
  const [message, setMessage] = useState("");
  const [volumeLevel, setVolumeLevel] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  // Fetch stream details
  const { data: stream, isLoading } = useQuery<Stream>({
    queryKey: [`/api/streams/${streamId}`],
    enabled: !!streamId,
  });
  
  useEffect(() => {
    // Hide controls after 3 seconds of inactivity
    const timer = setTimeout(() => setShowControls(false), 3000);
    
    return () => clearTimeout(timer);
  }, [showControls]);
  
  // Mock data for demo
  const mockStream: Stream = stream || {
    id: 1,
    title: "Pro League Finals - Team Alpha vs Fearless Fighters",
    description: "Watch the biggest mobile esports event of the year! Team Alpha battles Fearless Fighters for the championship title and ₹5,00,000 prize pool.",
    game: "Free Fire",
    gameId: 1,
    streamer: "BattleSphere Official",
    streamerId: 1,
    streamerImage: "https://i.imgur.com/p8iUFop.png",
    thumbnail: "https://i.imgur.com/VdxQbYs.jpg",
    viewers: 12853,
    likes: 3241,
    featured: true,
    type: "tournament",
    live: true,
    started: "2025-03-27T10:30:00Z",
    tournamentId: 5,
    tournamentName: "Pro League Finals",
    tournamentStage: "Finals",
    teams: [
      { id: 1, name: "Team Alpha", logo: "https://i.imgur.com/nX7qZ1V.png", score: 24 },
      { id: 2, name: "Fearless Fighters", logo: "https://i.imgur.com/vLpVxey.png", score: 18 }
    ]
  };
  
  // Mock chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, user: "ProGamer2023", message: "Team Alpha is dominating!", timestamp: "2025-03-27T10:35:22Z", isPremium: true },
    { id: 2, user: "GamingQueen", message: "Fearless Fighters need to step up their game!", timestamp: "2025-03-27T10:36:05Z", isPremium: false },
    { id: 3, user: "Sniper456", message: "That was an amazing play by Ghost!", timestamp: "2025-03-27T10:37:30Z", isPremium: false },
    { id: 4, user: "TournamentFan", message: "The zone is closing in!", timestamp: "2025-03-27T10:38:15Z", isPremium: false },
    { id: 5, user: "StreamModerator", message: "Welcome everyone to the Pro League Finals!", timestamp: "2025-03-27T10:39:00Z", isPremium: true, isModerator: true },
    { id: 6, user: "EsportsExpert", message: "Team Alpha's strategy is working perfectly", timestamp: "2025-03-27T10:40:12Z", isPremium: false },
    { id: 7, user: "MobileGamer", message: "What a clutch play!", timestamp: "2025-03-27T10:41:35Z", isPremium: false },
    { id: 8, user: "BattleRoyaleFan", message: "Fearless Fighters coming back now!", timestamp: "2025-03-27T10:42:20Z", isPremium: true },
    { id: 9, user: "TacticalPlayer", message: "Smart zone positioning by both teams", timestamp: "2025-03-27T10:43:45Z", isPremium: false },
    { id: 10, user: "StreamModerator", message: "Remember to follow the channel for more tournaments!", timestamp: "2025-03-27T10:44:30Z", isPremium: true, isModerator: true },
    { id: 11, user: "GamingLegend", message: "This is such an intense final!", timestamp: "2025-03-27T10:45:22Z", isPremium: false },
    { id: 12, user: "ESportsFanatic", message: "Team Alpha with another elimination!", timestamp: "2025-03-27T10:46:15Z", isPremium: false }
  ]);
  
  // Mock recommended streams
  const recommendedStreams: RecommendedStream[] = [
    { id: 2, title: "Solo vs Squad Challenge", game: "PUBG Mobile", streamer: "GhostSniper", thumbnail: "https://i.imgur.com/EB98N5A.jpg", viewers: 4521 },
    { id: 3, title: "Weekend Warriors Tournament", game: "COD Mobile", streamer: "BattleSphere Official", thumbnail: "https://i.imgur.com/iO7j3v6.jpg", viewers: 8947 },
    { id: 4, title: "Team Practice Session", game: "BGMI", streamer: "ProPlayer123", thumbnail: "https://i.imgur.com/ydJJJnb.jpg", viewers: 2156 }
  ];
  
  // Function to send a chat message
  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      user: "You",
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isPremium: false,
      isYou: true
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessage("");
    
    // Scroll to bottom of chat
    if (chatScrollRef.current) {
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoContainerRef.current) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
  
  // Format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  // Get time ago
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="aspect-video bg-muted rounded-lg"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content - Stream and Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Video Player */}
          <div 
            className="relative aspect-video bg-black rounded-lg overflow-hidden" 
            ref={videoContainerRef}
            onMouseMove={() => setShowControls(true)}
          >
            <img 
              src={mockStream.thumbnail} 
              alt={mockStream.title}
              className="w-full h-full object-cover"
            />
            
            {/* Live Indicator */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Badge variant="destructive" className="uppercase">Live</Badge>
              <div className="bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {formatNumber(mockStream.viewers)} viewers
              </div>
            </div>
            
            {/* Tournament Info Overlay */}
            {mockStream.type === "tournament" && (
              <div className="absolute top-4 right-4 bg-black/70 rounded-lg p-3">
                <div className="text-center mb-2">
                  <Badge variant="outline" className="mb-1">{mockStream.tournamentStage}</Badge>
                  <p className="text-xs text-white">{mockStream.tournamentName}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <Avatar className="h-10 w-10 mx-auto bg-background">
                      <AvatarImage src={mockStream.teams?.[0]?.logo} alt={mockStream.teams?.[0]?.name} />
                      <AvatarFallback>{mockStream.teams?.[0]?.name?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-white mt-1 text-center">{mockStream.teams?.[0]?.name}</p>
                    <p className="text-lg font-bold text-white">{mockStream.teams?.[0]?.score}</p>
                  </div>
                  <div className="text-white font-bold">VS</div>
                  <div className="text-center">
                    <Avatar className="h-10 w-10 mx-auto bg-background">
                      <AvatarImage src={mockStream.teams?.[1]?.logo} alt={mockStream.teams?.[1]?.name} />
                      <AvatarFallback>{mockStream.teams?.[1]?.name?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-white mt-1 text-center">{mockStream.teams?.[1]?.name}</p>
                    <p className="text-lg font-bold text-white">{mockStream.teams?.[1]?.score}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Video Controls - show only when showControls is true */}
            {showControls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="w-full bg-white/30 rounded-full h-1 mb-4">
                  <div className="bg-primary h-1 rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                      <Play className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-4 w-4 text-white" />
                      <div className="w-24 bg-white/30 rounded-full h-1">
                        <div 
                          className="bg-white h-1 rounded-full" 
                          style={{ width: `${volumeLevel}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-white text-xs">LIVE</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                            <PictureInPicture className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Picture in Picture</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white h-8 w-8"
                            onClick={toggleFullscreen}
                          >
                            <Fullscreen className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fullscreen</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Stream Info */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{mockStream.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <Badge variant="outline">{mockStream.game}</Badge>
                  <span>•</span>
                  <span>Started {getTimeAgo(mockStream.started)}</span>
                  <span>•</span>
                  <span>{formatNumber(mockStream.viewers)} viewers</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Clip
                </Button>
              </div>
            </div>
            
            <div className="flex items-start justify-between mt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={mockStream.streamerImage} alt={mockStream.streamer} />
                  <AvatarFallback>{mockStream.streamer.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{mockStream.streamer}</h2>
                  <p className="text-sm text-muted-foreground">254K followers</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline">
                  <Heart className={`h-4 w-4 mr-2 ${isFollowing ? "text-red-500 fill-red-500" : ""}`} />
                  {formatNumber(mockStream.likes)}
                </Button>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <Tabs defaultValue="about">
              <TabsList className="mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="tournament">Tournament Info</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <p>{mockStream.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Game</p>
                    <div className="flex items-center">
                      <img src="https://i.imgur.com/rQB4ATC.png" alt={mockStream.game} className="h-5 w-5 mr-2" />
                      <span>{mockStream.game}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Stream Type</p>
                    <div className="flex items-center">
                      <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                      <span>Official Tournament</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Started At</p>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{new Date(mockStream.started).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Language</p>
                    <span>English</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copy Stream Link
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch on Mobile App
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="tournament" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tournament Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{mockStream.tournamentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stage:</span>
                        <span className="font-medium">{mockStream.tournamentStage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prize Pool:</span>
                        <span className="font-medium">₹5,00,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="font-medium">Bo3 Finals</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teams:</span>
                        <span className="font-medium">2 Finalists</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Prize Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-yellow-500">1st</Badge>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        <span className="ml-2 font-medium">₹3,00,000</span>
                      </div>
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-gray-400">2nd</Badge>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gray-400" style={{ width: '30%' }}></div>
                          </div>
                        </div>
                        <span className="ml-2 font-medium">₹1,50,000</span>
                      </div>
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-amber-700">MVP</Badge>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-700" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                        <span className="ml-2 font-medium">₹50,000</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button variant="outline" className="mt-4" asChild>
                  <Link href={`/tournaments/${mockStream.tournamentId}`}>
                    View Full Tournament Details
                  </Link>
                </Button>
              </TabsContent>
              
              <TabsContent value="teams" className="space-y-4">
                {mockStream.teams && mockStream.teams.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {mockStream.teams.map((team, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={team.logo} alt={team.name} />
                              <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-bold">{team.name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge>{team.score} points</Badge>
                                <Badge variant="outline">Top Fragger: Player1</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Team Members</h4>
                            <div className="grid grid-cols-5 gap-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="text-center">
                                  <Avatar className="h-10 w-10 mx-auto">
                                    <AvatarFallback>{`P${i+1}`}</AvatarFallback>
                                  </Avatar>
                                  <p className="text-xs mt-1">Player {i+1}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">View Team</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No team information available for this stream.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Sidebar - Chat and Recommendations */}
        <div className="space-y-6">
          {/* Chat Box */}
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg">Live Chat</CardTitle>
            </CardHeader>
            
            <ScrollArea className="flex-1 px-4" ref={chatScrollRef}>
              <div className="space-y-3 pb-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-2">
                    <Badge 
                      variant="outline"
                      className={`h-6 flex-shrink-0 ${
                        msg.isPremium 
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/50" 
                          : ""
                      } ${
                        'isYou' in msg && msg.isYou
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/50"
                          : ""
                      }`}
                    >
                      {msg.user}
                    </Badge>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <CardContent className="pt-2 pb-4 mt-auto">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Send a message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button size="icon" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>Be respectful in chat</span>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <Gift className="h-3 w-3 mr-1" /> Send Gift
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Viewers Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Viewer Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Current Viewers</span>
                </div>
                <Badge variant="secondary">{formatNumber(mockStream.viewers)}</Badge>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-green-500" />
                  <span>Unique Viewers</span>
                </div>
                <Badge variant="secondary">{formatNumber(mockStream.viewers * 1.3)}</Badge>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>Likes</span>
                </div>
                <Badge variant="secondary">{formatNumber(mockStream.likes)}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  <span>New Followers</span>
                </div>
                <Badge variant="secondary">+{formatNumber(Math.floor(mockStream.viewers * 0.05))}</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Recommended Streams */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recommended Streams</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div>
                {recommendedStreams.map((stream) => (
                  <Link key={stream.id} href={`/stream/${stream.id}`}>
                    <div className="flex p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden mr-3">
                        <img 
                          src={stream.thumbnail} 
                          alt={stream.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/70 px-1 text-white text-xs rounded">
                          {formatNumber(stream.viewers)}
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{stream.title}</p>
                        <p className="text-xs text-muted-foreground">{stream.streamer}</p>
                        <p className="text-xs text-muted-foreground">{stream.game}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}