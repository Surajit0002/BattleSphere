import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { 
  Award, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Eye, 
  Gamepad2, 
  MessageSquare, 
  Smile, 
  Users, 
  Heart, 
  Send,
  Loader2,
  AlertTriangle,
  ThumbsUp,
  Play,
  ChevronDown,
  MenuIcon,
  Coins,
  Flag,
  LayoutGrid,
  ListVideo
} from "lucide-react";

// Define interfaces for data types
interface LiveStream {
  id: number;
  title: string;
  description: string;
  streamUrl: string;
  thumbnailUrl: string;
  gameId: number;
  gameName: string;
  tournamentId: number;
  tournamentName: string;
  streamerName: string;
  streamerAvatar: string;
  viewerCount: number;
  startTime: string;
  status: "live" | "upcoming" | "ended";
  featuring: string[];
}

interface ChatMessage {
  id: number;
  username: string;
  userAvatar: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
  isModerator: boolean;
}

interface ScheduledStream {
  id: number;
  title: string;
  thumbnailUrl: string;
  gameId: number;
  gameName: string;
  tournamentId: number;
  tournamentName: string;
  scheduledTime: string;
  streamerName: string;
}

export default function LiveMatchesEnhanced() {
  const [activeTab, setActiveTab] = useState("featured");
  const [selectedStream, setSelectedStream] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [layoutView, setLayoutView] = useState<"grid" | "list">("grid");

  // Fetch live streams
  const { data: liveStreams, isLoading: isLoadingLiveStreams } = useQuery({
    queryKey: ["/api/streams/live"],
    queryFn: () => 
      apiRequest("/api/streams/live").catch(() => {
        // Return mock data if API doesn't exist yet
        return [
          {
            id: 1,
            title: "Pro League Finals - Final Match",
            description: "Watch Team Alpha battle against Team Elite for the championship title with a prize pool of ₹500,000!",
            streamUrl: "https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID",
            thumbnailUrl: "https://i.imgur.com/QEGx1nR.jpg",
            gameId: 1,
            gameName: "Free Fire",
            tournamentId: 5,
            tournamentName: "Pro League Finals",
            streamerName: "BattleSphere Official",
            streamerAvatar: "https://i.imgur.com/JITClvm.png",
            viewerCount: 12458,
            startTime: "2024-03-27T15:00:00Z",
            status: "live",
            featuring: ["Team Alpha", "Team Elite"]
          },
          {
            id: 2,
            title: "Weekend Battle - Semifinals",
            description: "Don't miss the epic semifinal rounds of the Weekend Battle tournament!",
            streamUrl: "https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID2",
            thumbnailUrl: "https://i.imgur.com/9dJQEZU.jpg",
            gameId: 2,
            gameName: "PUBG Mobile",
            tournamentId: 3,
            tournamentName: "Weekend Battle",
            streamerName: "GameMaster Pro",
            streamerAvatar: "https://i.imgur.com/2k9T8UA.png",
            viewerCount: 5723,
            startTime: "2024-03-27T16:30:00Z",
            status: "live",
            featuring: ["Squad X", "Team Vortex", "Midnight Wolves"]
          },
          {
            id: 3,
            title: "Weekly Showdown - Quarterfinals",
            description: "The Weekly Showdown continues with these quarterfinal matches featuring the top 16 players!",
            streamUrl: "https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID3",
            thumbnailUrl: "https://i.imgur.com/bXvbE86.jpg",
            gameId: 1,
            gameName: "Free Fire",
            tournamentId: 1,
            tournamentName: "Weekly Showdown",
            streamerName: "FireStorm",
            streamerAvatar: "https://i.imgur.com/cAcaRRY.png",
            viewerCount: 3645,
            startTime: "2024-03-27T14:00:00Z",
            status: "live",
            featuring: ["Team Delta", "Phoenix Squad"]
          }
        ];
      }),
  });

  // Fetch upcoming streams
  const { data: upcomingStreams } = useQuery({
    queryKey: ["/api/streams/upcoming"],
    queryFn: () => 
      apiRequest("/api/streams/upcoming").catch(() => {
        // Return mock data if API doesn't exist yet
        return [
          {
            id: 101,
            title: "Monthly Championship - Opening Ceremony",
            thumbnailUrl: "https://i.imgur.com/kL9qoEM.jpg",
            gameId: 1,
            gameName: "Free Fire",
            tournamentId: 7,
            tournamentName: "Monthly Championship",
            scheduledTime: "2024-03-28T12:00:00Z",
            streamerName: "BattleSphere Official"
          },
          {
            id: 102,
            title: "Elite Tournament - Group Stage Draw",
            thumbnailUrl: "https://i.imgur.com/xLt7Lam.jpg",
            gameId: 2,
            gameName: "PUBG Mobile",
            tournamentId: 8,
            tournamentName: "Elite Tournament",
            scheduledTime: "2024-03-29T14:30:00Z",
            streamerName: "BattleSphere Official"
          }
        ];
      }),
  });

  // Fetch chat messages for a stream
  const { data: chatMessages } = useQuery({
    queryKey: ["/api/streams/chat", selectedStream],
    queryFn: () => 
      apiRequest(`/api/streams/chat/${selectedStream}`).catch(() => {
        // Return mock data if API doesn't exist yet
        return [
          {
            id: 1,
            username: "FireFan123",
            userAvatar: "https://i.imgur.com/5b7TLce.png",
            message: "This match is so intense!",
            timestamp: "2024-03-27T15:05:32Z",
            isAdmin: false,
            isModerator: false
          },
          {
            id: 2,
            username: "TournamentMod",
            userAvatar: "https://i.imgur.com/JITClvm.png",
            message: "Welcome everyone to the Pro League Finals! Enjoy the match and keep the chat respectful.",
            timestamp: "2024-03-27T15:01:10Z",
            isAdmin: false,
            isModerator: true
          },
          {
            id: 3,
            username: "GamingGuru",
            userAvatar: "https://i.imgur.com/2k9T8UA.png",
            message: "Team Alpha's strategy is amazing! That flank move was perfect.",
            timestamp: "2024-03-27T15:07:45Z",
            isAdmin: false,
            isModerator: false
          },
          {
            id: 4,
            username: "BattleSphereAdmin",
            userAvatar: "https://i.imgur.com/JITClvm.png",
            message: "Reminder: We'll be giving away exclusive rewards to 5 random viewers at the end of this stream!",
            timestamp: "2024-03-27T15:10:22Z",
            isAdmin: true,
            isModerator: false
          },
          {
            id: 5,
            username: "MobileGamer99",
            userAvatar: "https://i.imgur.com/cAcaRRY.png",
            message: "Did you see that triple kill?! 🔥🔥🔥",
            timestamp: "2024-03-27T15:12:55Z",
            isAdmin: false,
            isModerator: false
          }
        ];
      }),
    enabled: selectedStream !== null,
  });

  // Send a chat message
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Here you would typically send the message to your API
    // For now, we'll just clear the input
    console.log(`Sending message: ${chatMessage}`);
    setChatMessage("");
  };

  // Find the details of the currently selected stream
  const currentStream = liveStreams?.find(stream => stream.id === selectedStream) || liveStreams?.[0];

  return (
    <div className="container py-10 min-h-screen bg-black bg-dot-white/[0.2]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Live Matches
        </h1>
        <p className="text-gray-400">
          Watch tournaments, matches and featured gameplay in real-time
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full h-14 grid grid-cols-3 bg-gray-900/60">
          <TabsTrigger 
            value="featured" 
            className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none
              data-[state=active]:shadow-none data-[state=active]:border-b-0`}
          >
            Featured
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none
              data-[state=active]:shadow-none data-[state=active]:border-b-0`}
          >
            All Live
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming" 
            className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none
              data-[state=active]:shadow-none data-[state=active]:border-b-0`}
          >
            Upcoming
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Stream Video */}
        <div className="lg:col-span-2 space-y-4">
          {currentStream ? (
            <Card className="overflow-hidden border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <div className="aspect-video bg-black relative">
                {/* In a real scenario, replace with an actual video player */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-b from-gray-900/50 to-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-pulse flex items-center justify-center">
                        <Play className="h-16 w-16 text-primary" />
                      </div>
                      <p className="text-gray-300 mt-4">
                        Stream playback would appear here in production
                      </p>
                      <p className="text-sm text-gray-400">
                        Using actual streaming service like Agora.io or Twitch
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{currentStream.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {currentStream.description}
                    </CardDescription>
                  </div>
                  <Badge className="bg-red-600 hover:bg-red-700 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {currentStream.viewerCount.toLocaleString()} watching
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentStream.streamerAvatar} alt={currentStream.streamerName} />
                      <AvatarFallback>{currentStream.streamerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{currentStream.streamerName}</div>
                      <div className="text-xs text-gray-400">Broadcaster</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Tournament</div>
                    <div className="font-medium">{currentStream.tournamentName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Game</div>
                    <div className="font-medium">{currentStream.gameName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Started</div>
                    <div className="font-medium">
                      {new Date(currentStream.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
                <Separator className="my-4 bg-gray-800" />
                <div>
                  <h3 className="text-sm font-medium mb-2">Teams Playing</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentStream.featuring.map((team, index) => (
                      <Badge key={index} variant="outline" className="border-gray-700 bg-gray-900/40">
                        {team}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-gray-900/40 py-2 px-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Report
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Flag className="h-4 w-4 mr-1" />
                  Follow
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-96 flex items-center justify-center border border-primary/20 bg-black/60 backdrop-blur-lg">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Stream Selected</h3>
                <p className="text-gray-400 max-w-md">
                  Select a live stream from the list to start watching, or check back later for scheduled streams
                </p>
              </div>
            </Card>
          )}

          {/* Tournament Details */}
          {currentStream && (
            <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Tournament Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/40 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Prize Pool</div>
                    <div className="flex items-center text-xl font-bold">
                      <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                      ₹500,000
                    </div>
                  </div>
                  <div className="bg-gray-900/40 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Stage</div>
                    <div className="text-xl font-bold">Grand Finals</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      Team A
                    </h4>
                    <div className="bg-blue-950/40 border border-blue-800/30 rounded-lg p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="https://i.imgur.com/JITClvm.png" alt="Team Alpha" />
                          <AvatarFallback>TA</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">Team Alpha</div>
                      </div>
                      <div className="mb-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Score</span>
                          <span className="font-medium">12</span>
                        </div>
                      </div>
                      <Progress value={65} className="h-1.5 bg-gray-800" indicatorClassName="bg-blue-600" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Users className="h-4 w-4 text-red-500" />
                      Team B
                    </h4>
                    <div className="bg-red-950/40 border border-red-800/30 rounded-lg p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="https://i.imgur.com/5b7TLce.png" alt="Team Elite" />
                          <AvatarFallback>TE</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">Team Elite</div>
                      </div>
                      <div className="mb-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Score</span>
                          <span className="font-medium">7</span>
                        </div>
                      </div>
                      <Progress value={35} className="h-1.5 bg-gray-800" indicatorClassName="bg-red-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Live Chat and Stream List */}
        <div className="space-y-6">
          {/* Live Chat */}
          {currentStream && (
            <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Live Chat
                </CardTitle>
                <CardDescription>
                  {chatMessages?.length || 0} messages
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] px-4">
                  <div className="space-y-4 py-4">
                    {chatMessages?.map((message: ChatMessage) => (
                      <div key={message.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.userAvatar} alt={message.username} />
                          <AvatarFallback>{message.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              message.isAdmin ? "text-red-400" : 
                              message.isModerator ? "text-green-400" : ""
                            }`}>
                              {message.username}
                            </span>
                            {message.isAdmin && (
                              <Badge className="bg-red-600 hover:bg-red-700 text-xs">Admin</Badge>
                            )}
                            {message.isModerator && (
                              <Badge className="bg-green-600 hover:bg-green-700 text-xs">Mod</Badge>
                            )}
                          </div>
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t border-gray-800 p-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type a message..." 
                      value={chatMessage} 
                      onChange={(e) => setChatMessage(e.target.value)} 
                      className="bg-gray-900/60 border-gray-700"
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="border-gray-700">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stream List */}
          <Card className="border border-primary/20 bg-black/60 backdrop-blur-lg shadow-lg shadow-primary/10">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  {activeTab === "upcoming" ? (
                    <>
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming Streams
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5 text-primary" />
                      {activeTab === "featured" ? "Featured Streams" : "All Live Streams"}
                    </>
                  )}
                </CardTitle>
                <div className="flex gap-1">
                  <Button 
                    variant={layoutView === "grid" ? "default" : "outline"} 
                    size="icon" 
                    className={layoutView !== "grid" ? "border-gray-700" : ""}
                    onClick={() => setLayoutView("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={layoutView === "list" ? "default" : "outline"} 
                    size="icon" 
                    className={layoutView !== "list" ? "border-gray-700" : ""}
                    onClick={() => setLayoutView("list")}
                  >
                    <ListVideo className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLiveStreams ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : activeTab === "upcoming" ? (
                <div className={layoutView === "grid" ? "grid grid-cols-1 gap-4" : "space-y-3"}>
                  {upcomingStreams?.map((stream: ScheduledStream) => (
                    <div 
                      key={stream.id}
                      className={`
                        ${layoutView === "list" 
                          ? "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900/60 transition-colors" 
                          : "group relative overflow-hidden rounded-lg"
                        }
                      `}
                    >
                      {layoutView === "grid" ? (
                        <>
                          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                            <img 
                              src={stream.thumbnailUrl} 
                              alt={stream.title} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="font-medium text-sm line-clamp-1">{stream.title}</h3>
                              <div className="flex items-center text-xs text-gray-300 mt-1">
                                <Gamepad2 className="h-3 w-3 mr-1" />
                                <span>{stream.gameName}</span>
                              </div>
                            </div>
                            <Badge className="absolute top-2 right-2 bg-yellow-600 hover:bg-yellow-700">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(stream.scheduledTime).toLocaleDateString()}
                            </Badge>
                          </div>
                          <div className="p-2">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{stream.tournamentName}</span>
                              <span>
                                {new Date(stream.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="h-16 w-28 bg-gray-900 rounded flex-shrink-0 relative overflow-hidden">
                            <img 
                              src={stream.thumbnailUrl} 
                              alt={stream.title} 
                              className="w-full h-full object-cover" 
                            />
                            <Badge className="absolute bottom-1 right-1 text-[10px] px-1 py-0 h-4 bg-yellow-600 hover:bg-yellow-700">
                              <Clock className="h-2 w-2 mr-0.5" />
                              <span>Upcoming</span>
                            </Badge>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm truncate">{stream.title}</h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-400">
                                <Gamepad2 className="h-3 w-3 mr-1" />
                                <span className="truncate">{stream.gameName}</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(stream.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={layoutView === "grid" ? "grid grid-cols-1 gap-4" : "space-y-3"}>
                  {liveStreams?.map((stream: LiveStream) => (
                    <div 
                      key={stream.id}
                      className={`
                        ${layoutView === "list" 
                          ? "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900/60 transition-colors" 
                          : "group relative overflow-hidden rounded-lg"
                        }
                        ${selectedStream === stream.id ? "bg-primary/20 border border-primary/30" : ""}
                        cursor-pointer
                      `}
                      onClick={() => setSelectedStream(stream.id)}
                    >
                      {layoutView === "grid" ? (
                        <>
                          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                            <img 
                              src={stream.thumbnailUrl} 
                              alt={stream.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="font-medium text-sm line-clamp-1">{stream.title}</h3>
                              <div className="flex items-center text-xs text-gray-300 mt-1">
                                <Gamepad2 className="h-3 w-3 mr-1" />
                                <span>{stream.gameName}</span>
                              </div>
                            </div>
                            <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700">
                              <Eye className="h-3 w-3 mr-1" />
                              {stream.viewerCount.toLocaleString()}
                            </Badge>
                            <div className="absolute top-2 left-2">
                              <div className="flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-xs font-medium">LIVE</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{stream.streamerName}</span>
                              <span>{stream.tournamentName}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="h-16 w-28 bg-gray-900 rounded flex-shrink-0 relative overflow-hidden">
                            <img 
                              src={stream.thumbnailUrl} 
                              alt={stream.title} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute bottom-1 left-1">
                              <div className="flex items-center gap-1 bg-black/60 rounded-full px-1.5 py-0">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-[10px] font-medium">LIVE</span>
                              </div>
                            </div>
                            <Badge className="absolute bottom-1 right-1 text-[10px] px-1 py-0 h-4 bg-red-600 hover:bg-red-700">
                              <Eye className="h-2 w-2 mr-0.5" />
                              <span>{stream.viewerCount.toLocaleString()}</span>
                            </Badge>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm truncate">{stream.title}</h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-400">
                                <Gamepad2 className="h-3 w-3 mr-1" />
                                <span className="truncate">{stream.gameName}</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                {stream.streamerName}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-3 flex justify-center">
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800 w-full">
                {activeTab === "upcoming" ? "See More Upcoming Streams" : "Browse All Streams"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Share(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}