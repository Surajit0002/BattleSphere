import React, { useState } from "react";
import { useParams, Link as WouterLink } from "wouter";
import { useQuery } from "@tanstack/react-query";
import RootLayout from "@/layouts/RootLayout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  Gamepad2,
  MapPin,
  DollarSign,
  Share2,
  ThumbsUp,
  MessageSquare,
  Eye,
  Star,
  ChevronRight,
  Info,
  AlertTriangle,
  Check,
  Link,
  ExternalLink,
  User,
  Swords,
  Rocket,
  ArrowRight,
  Timer,
  Flame,
  Mail,
  CalendarDays,
  Gift,
  Broadcast,
  ArrowUpRight,
  Flag,
  Milestone,
  Bell,
  BellOff,
  Heart,
  Copy,
  CheckCheck,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedBracket from "@/components/tournament-bracket/enhanced-bracket";

// Mock data for tournament details
const mockTournamentDetails = {
  id: 1,
  name: "Pro League Finals 2025",
  description: "The ultimate battle to crown the champion of BattleSphere's Pro League. Top teams from around the world compete for glory and a massive prize pool.",
  gameId: 1,
  gameName: "Call of Duty: Modern Warfare",
  gameMode: "squad",
  imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
  status: "active",
  startDate: "2025-04-15T14:00:00Z",
  endDate: "2025-04-17T22:00:00Z",
  registrationEndDate: "2025-04-10T23:59:59Z",
  entryFee: 50,
  prizePool: 25000,
  prizeBreakdown: [
    { place: 1, amount: 12500, label: "1st Place" },
    { place: 2, amount: 6000, label: "2nd Place" },
    { place: 3, amount: 3500, label: "3rd Place" },
    { place: 4, amount: 2000, label: "4th Place" },
    { place: "5-8", amount: 250, label: "5th-8th Place" },
  ],
  maxPlayers: 32,
  currentPlayers: 24,
  location: "Online",
  streamUrl: "https://twitch.tv/battlesphere",
  featured: true,
  sponsors: [
    { id: 1, name: "GameFuel", logo: null },
    { id: 2, name: "TechPro", logo: null },
    { id: 3, name: "HyperX", logo: null },
  ],
  rules: `### Tournament Format
- Double elimination bracket
- All matches are best of 3
- Finals are best of 5
- Maps are randomly selected from pool

### Rules
1. Players must join the tournament Discord server
2. All matches must be streamed by at least one player
3. Any form of cheating will result in immediate disqualification
4. Match disputes will be handled by tournament admins
5. Players must be ready 15 minutes before scheduled match time`,
  discordLink: "https://discord.gg/battlesphere",
  registrationStatus: "open", // open, closed, full
  userRegistered: true,
  userTeam: {
    id: 1,
    name: "Team Alpha",
    logo: null,
    members: [
      { id: 1, username: "ProGamer", displayName: "Alex Johnson", avatar: null, role: "Captain" },
      { id: 2, username: "NinjaPlayer", displayName: "Sarah Smith", avatar: null, role: "Member" },
      { id: 3, username: "Destroyer", displayName: "Mike Chen", avatar: null, role: "Member" },
      { id: 4, username: "Sniper42", displayName: "Chris Lee", avatar: null, role: "Member" },
    ]
  },
  brackets: {
    rounds: [
      {
        name: "Round 1",
        matches: [
          {
            id: 1,
            team1: { id: 1, name: "Team Alpha", logo: null },
            team2: { id: 2, name: "Team Beta", logo: null },
            winnerId: 1,
            team1Score: 3,
            team2Score: 1,
            status: "completed",
            scheduledTime: "2025-04-15T15:00:00Z",
          },
          {
            id: 2,
            team1: { id: 3, name: "Team Gamma", logo: null },
            team2: { id: 4, name: "Team Delta", logo: null },
            winnerId: 3,
            team1Score: 3,
            team2Score: 2,
            status: "completed",
            scheduledTime: "2025-04-15T17:00:00Z",
          },
          // Add more matches as needed
        ],
      },
      {
        name: "Semi-Finals",
        matches: [
          {
            id: 3,
            team1: { id: 1, name: "Team Alpha", logo: null },
            team2: { id: 3, name: "Team Gamma", logo: null },
            winnerId: null,
            team1Score: 1,
            team2Score: 1,
            status: "live",
            scheduledTime: "2025-04-16T15:00:00Z",
          },
          // Add more matches as needed
        ],
      },
      {
        name: "Finals",
        matches: [
          {
            id: 4,
            team1: null,
            team2: null,
            winnerId: null,
            team1Score: 0,
            team2Score: 0,
            status: "upcoming",
            scheduledTime: "2025-04-17T20:00:00Z",
          },
        ],
      },
    ],
  },
  participants: [
    { id: 1, type: "team", name: "Team Alpha", logo: null, rank: 5, wins: 12, seed: 1 },
    { id: 2, type: "team", name: "Team Beta", logo: null, rank: 8, wins: 9, seed: 2 },
    { id: 3, type: "team", name: "Team Gamma", logo: null, rank: 3, wins: 15, seed: 3 },
    { id: 4, type: "team", name: "Team Delta", logo: null, rank: 12, wins: 7, seed: 4 },
    { id: 5, type: "team", name: "Team Epsilon", logo: null, rank: 15, wins: 6, seed: 5 },
    // Add more teams as needed
  ],
  chatMessages: [
    { id: 1, userId: 1, username: "ProGamer", avatar: null, message: "Good luck to everyone in the tournament!", timestamp: "2025-04-14T18:30:00Z" },
    { id: 2, userId: 3, username: "Destroyer", avatar: null, message: "Our team has been practicing for weeks. We're ready to win this!", timestamp: "2025-04-14T19:15:00Z" },
    { id: 3, userId: 5, username: "Admin", avatar: null, message: "Remember to check in 15 minutes before your matches start.", timestamp: "2025-04-15T08:00:00Z", isAdmin: true },
    // Add more messages as needed
  ],
  stats: {
    viewCount: 2457,
    favoriteCount: 384,
    shareCount: 126,
  },
  schedule: [
    { 
      date: "2025-04-15", 
      events: [
        { time: "14:00", title: "Opening Ceremony", description: "Tournament kickoff and player introductions" },
        { time: "15:00", title: "Round 1 Matches", description: "First round of bracket matches" },
        { time: "20:00", title: "Day 1 Recap", description: "Summary of day's matches and highlights" },
      ]
    },
    { 
      date: "2025-04-16", 
      events: [
        { time: "15:00", title: "Semi-Finals", description: "Semi-final matches" },
        { time: "19:00", title: "Exhibition Match", description: "Special showcase match with pro players" },
      ]
    },
    { 
      date: "2025-04-17", 
      events: [
        { time: "18:00", title: "Pre-Final Show", description: "Analysis and predictions for the final" },
        { time: "20:00", title: "Grand Finals", description: "Championship match for the title" },
        { time: "22:00", title: "Awards Ceremony", description: "Prize distribution and closing remarks" },
      ]
    },
  ],
  updates: [
    { id: 1, title: "Schedule Update", content: "Due to high demand, we've extended the registration deadline by 24 hours.", date: "2025-04-08T10:00:00Z" },
    { id: 2, title: "Prize Pool Increase", content: "Thanks to our new sponsor TechPro, the prize pool has increased from $20,000 to $25,000!", date: "2025-04-10T14:30:00Z" },
    { id: 3, title: "Server Maintenance", content: "The tournament platform will be unavailable on April 14th from 2-4 AM for maintenance.", date: "2025-04-12T09:15:00Z" },
  ],
};

// Convert a date to a format like "Friday, April 15, 2025"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

// Calculate time until event
const getTimeUntil = (dateString: string) => {
  const now = new Date();
  const eventDate = new Date(dateString);
  const diffMs = eventDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Event has started";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h until tournament`;
  } else {
    return `${diffHours}h until tournament`;
  }
};

interface TournamentInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const TournamentInfoItem = ({ icon, label, value }: TournamentInfoItemProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-md text-primary">
        {icon}
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
};

interface RegistrationButtonProps {
  tournament: any;
}

const RegistrationButton = ({ tournament }: RegistrationButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  if (tournament.userRegistered) {
    return (
      <Button variant="outline" className="w-full md:w-auto gap-2">
        <Check className="h-4 w-4" />
        Registered
      </Button>
    );
  }
  
  if (tournament.registrationStatus === "closed") {
    return (
      <Button variant="outline" className="w-full md:w-auto gap-2" disabled>
        <AlertTriangle className="h-4 w-4" />
        Registration Closed
      </Button>
    );
  }
  
  if (tournament.registrationStatus === "full") {
    return (
      <Button variant="outline" className="w-full md:w-auto gap-2" disabled>
        <Users className="h-4 w-4" />
        Tournament Full
      </Button>
    );
  }
  
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto gap-2">
            <Trophy className="h-4 w-4" />
            Register Now
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register for Tournament</DialogTitle>
            <DialogDescription>
              {tournament.entryFee > 0 
                ? `Entry fee: $${tournament.entryFee}. Please confirm your registration.`
                : "This tournament is free to enter. Please confirm your registration."}
            </DialogDescription>
          </DialogHeader>
          
          {registrationComplete ? (
            <div className="py-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                <CheckCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Registration Complete!</h3>
              <p className="text-muted-foreground">
                You're all set for {tournament.name}. Good luck!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Tournament Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Start Date</div>
                      <div>{formatDate(tournament.startDate)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Game</div>
                      <div>{tournament.gameName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Format</div>
                      <div>{"Double elimination, BO3"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Mode</div>
                      <div>{tournament.gameMode.charAt(0).toUpperCase() + tournament.gameMode.slice(1)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Select Team</h3>
                  <div className="border rounded-lg p-3 bg-muted/40">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={tournament.userTeam.logo} />
                        <AvatarFallback>{tournament.userTeam.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{tournament.userTeam.name}</div>
                        <div className="text-xs text-muted-foreground">{tournament.userTeam.members.length} members</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {tournament.entryFee > 0 && (
                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertTitle>Entry Fee: ${tournament.entryFee}</AlertTitle>
                    <AlertDescription>
                      This amount will be deducted from your BattleSphere wallet upon registration.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setRegistrationComplete(true)}>Confirm Registration</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

interface ParticipantCardProps {
  participant: any;
  position: number;
}

const ParticipantCard = ({ participant, position }: ParticipantCardProps) => {
  return (
    <div className="border rounded-md p-3 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 flex items-center justify-center font-medium text-sm text-muted-foreground">
          #{position}
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage src={participant.logo} />
          <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{participant.name}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {participant.wins} Wins
            </span>
            <span className="flex items-center gap-1">
              <Milestone className="h-3 w-3" />
              Seed #{participant.seed}
            </span>
          </div>
        </div>
      </div>
      <div className="text-sm font-medium">
        Rank #{participant.rank}
      </div>
    </div>
  );
};

const ScheduleItem = ({ event, date }: { event: any; date: string }) => {
  return (
    <div className="flex gap-4 py-3">
      <div className="w-16 shrink-0 flex flex-col items-center">
        <div className="text-sm font-medium">{event.time}</div>
        <div className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
      </div>
      <div className="flex-1">
        <div className="font-medium">{event.title}</div>
        <div className="text-sm text-muted-foreground">{event.description}</div>
      </div>
    </div>
  );
};

interface PrizePoolItemProps {
  prize: any;
  isLast?: boolean;
}

const PrizePoolItem = ({ prize, isLast = false }: PrizePoolItemProps) => {
  return (
    <div className="flex justify-between items-center py-3">
      <div className="flex items-center gap-3">
        {typeof prize.place === 'number' && prize.place <= 3 ? (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold 
            ${prize.place === 1 ? 'bg-yellow-500' : prize.place === 2 ? 'bg-gray-400' : 'bg-amber-700'}`}
          >
            {prize.place}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium">
            {prize.place}
          </div>
        )}
        <div>
          <div className="font-medium">{prize.label}</div>
        </div>
      </div>
      <div className="font-bold text-primary">${prize.amount.toLocaleString()}</div>
    </div>
  );
};

interface ChatMessageProps {
  message: any;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className="flex gap-3 py-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.avatar} />
        <AvatarFallback>{message.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${message.isAdmin ? 'text-primary' : ''}`}>
            {message.username}
          </span>
          {message.isAdmin && (
            <Badge variant="outline" className="text-xs h-5">Admin</Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="text-sm mt-1">{message.message}</div>
      </div>
    </div>
  );
};

export default function TournamentDetailsEnhanced() {
  const { id } = useParams();
  const tournamentId = parseInt(id || "1");
  const [activeTab, setActiveTab] = useState("overview");
  const [favorite, setFavorite] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [shareTooltipOpen, setShareTooltipOpen] = useState(false);
  
  // In a real app, we would fetch the tournament data based on the ID
  const { data: tournament, isLoading } = useQuery({
    queryKey: [`/api/tournaments/${tournamentId}`],
    initialData: mockTournamentDetails,
    enabled: false
  });
  
  const copyTournamentLink = () => {
    navigator.clipboard.writeText(`https://battlesphere.com/tournaments/${tournamentId}`);
    setShareTooltipOpen(true);
    setTimeout(() => setShareTooltipOpen(false), 2000);
  };
  
  if (isLoading) {
    return (
      <RootLayout>
        <div className="container py-8 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </RootLayout>
    );
  }
  
  if (!tournament) {
    return (
      <RootLayout>
        <div className="container py-8">
          <div className="bg-muted p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Tournament Not Found</h2>
            <p className="text-muted-foreground">The tournament you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </RootLayout>
    );
  }
  
  const isPastStartDate = new Date(tournament.startDate) < new Date();
  const registrationOpen = tournament.registrationStatus === "open" && !isPastStartDate;
  
  return (
    <RootLayout>
      {/* Tournament Header Banner */}
      <div 
        className="h-64 md:h-80 bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${tournament.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="container absolute inset-x-0 bottom-0 pb-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {tournament.featured && (
                  <Badge variant="default" className="font-medium">
                    <Star className="h-3 w-3 mr-1" /> Featured
                  </Badge>
                )}
                <Badge variant="outline" className="font-medium">
                  <Gamepad2 className="h-3 w-3 mr-1" /> {tournament.gameName}
                </Badge>
                <Badge variant={tournament.status === "active" ? "secondary" : "outline"} className="font-medium">
                  {tournament.status === "active" ? (
                    <><Activity className="h-3 w-3 mr-1" /> Live Now</>
                  ) : (
                    <><Calendar className="h-3 w-3 mr-1" /> Upcoming</>
                  )}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{tournament.name}</h1>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(tournament.startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{tournament.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{tournament.currentPlayers}/{tournament.maxPlayers} Participants</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${tournament.prizePool.toLocaleString()} Prize Pool</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <RegistrationButton tournament={tournament} />
              
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip open={shareTooltipOpen} onOpenChange={setShareTooltipOpen}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={copyTournamentLink}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {shareTooltipOpen ? (
                        <p className="flex items-center gap-1">
                          <Check className="h-3 w-3" /> Copied to clipboard
                        </p>
                      ) : (
                        <p>Copy link</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setFavorite(!favorite)}
                  className={favorite ? "text-red-500" : ""}
                >
                  <Heart className="h-4 w-4" fill={favorite ? "currentColor" : "none"} />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  {notificationsEnabled ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:order-last space-y-6">
            {/* Registration Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Tournament Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isPastStartDate ? (
                  <Alert className="bg-primary/10 border-primary">
                    <Clock className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-base">{getTimeUntil(tournament.startDate)}</AlertTitle>
                    <AlertDescription>
                      {registrationOpen 
                        ? `Registration closes on ${new Date(tournament.registrationEndDate).toLocaleDateString()}` 
                        : "Registration is now closed"}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-secondary/10 border-secondary">
                    <Flame className="h-4 w-4 text-secondary" />
                    <AlertTitle className="text-base">Tournament In Progress</AlertTitle>
                    <AlertDescription>
                      Follow the brackets to see the latest results
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-3">
                  <TournamentInfoItem 
                    icon={<Users className="h-5 w-5" />} 
                    label="Registration" 
                    value={`${tournament.currentPlayers}/${tournament.maxPlayers} Teams`} 
                  />
                  
                  <Progress 
                    value={(tournament.currentPlayers / tournament.maxPlayers) * 100} 
                    className="h-2" 
                  />
                  
                  <TournamentInfoItem 
                    icon={<Calendar className="h-5 w-5" />} 
                    label="Tournament Dates" 
                    value={`${new Date(tournament.startDate).toLocaleDateString()} - ${new Date(tournament.endDate).toLocaleDateString()}`} 
                  />
                  
                  <TournamentInfoItem 
                    icon={<DollarSign className="h-5 w-5" />} 
                    label="Entry Fee" 
                    value={tournament.entryFee > 0 ? `$${tournament.entryFee}` : "Free"} 
                  />
                  
                  <TournamentInfoItem 
                    icon={<Trophy className="h-5 w-5" />} 
                    label="Prize Pool" 
                    value={`$${tournament.prizePool.toLocaleString()}`} 
                  />
                </div>
                
                {tournament.discordLink && (
                  <Button variant="outline" className="w-full mt-3" asChild>
                    <a href={tournament.discordLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      <span>Join Discord Server</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}
                
                {tournament.status === "active" && tournament.streamUrl && (
                  <Button className="w-full mt-1" asChild>
                    <a href={tournament.streamUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Broadcast className="h-4 w-4" />
                      <span>Watch Live Stream</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Prize Distribution */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Prize Distribution</CardTitle>
                <CardDescription>
                  Total Prize Pool: ${tournament.prizePool.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {tournament.prizeBreakdown.map((prize, index) => (
                    <PrizePoolItem 
                      key={index} 
                      prize={prize} 
                      isLast={index === tournament.prizeBreakdown.length - 1} 
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Sponsors */}
            {tournament.sponsors?.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Sponsors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 items-center justify-center">
                    {tournament.sponsors.map((sponsor) => (
                      <div key={sponsor.id} className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                          {sponsor.logo ? (
                            <img src={sponsor.logo} alt={sponsor.name} className="max-w-full max-h-full p-2" />
                          ) : (
                            <span className="text-xl font-bold text-muted-foreground">{sponsor.name.substring(0, 2)}</span>
                          )}
                        </div>
                        <div className="text-sm font-medium mt-1">{sponsor.name}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Tournament Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tournament.stats.viewCount.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tournament.stats.favoriteCount.toLocaleString()} favorites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tournament.stats.shareCount.toLocaleString()} shares</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList className="grid w-full md:w-fit grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="brackets">Brackets</TabsTrigger>
                <TabsTrigger value="participants">Participants</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Tournament</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tournament.description}</p>
                    
                    {tournament.userRegistered && (
                      <Alert className="mt-6">
                        <CheckCheck className="h-4 w-4" />
                        <AlertTitle>You are registered for this tournament</AlertTitle>
                        <AlertDescription>
                          Playing with Team: {tournament.userTeam.name}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Tournament Updates */}
                    {tournament.updates?.length > 0 && (
                      <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Tournament Updates</h3>
                        <div className="space-y-4">
                          {tournament.updates.map((update) => (
                            <div key={update.id} className="border-l-4 border-primary pl-4 py-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{update.title}</h4>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(update.date).toLocaleDateString()}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{update.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Tournament Rules */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rules & Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: tournament.rules.replace(/\n/g, '<br>') }} />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tournament Chat */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span>Tournament Chat</span>
                      <Badge variant="outline">{tournament.chatMessages.length} messages</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                      {tournament.chatMessages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                    </div>
                    
                    <div className="mt-4 relative">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                      />
                      <Button size="sm" className="absolute right-1 top-1">Send</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="brackets" className="space-y-6">
                {tournament.status === "upcoming" ? (
                  <Card className="p-10">
                    <div className="text-center space-y-4">
                      <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">Brackets Not Available Yet</h3>
                      <p className="text-muted-foreground">
                        Brackets will be available once the tournament starts on {formatDate(tournament.startDate)}.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tournament Brackets</CardTitle>
                      <CardDescription>
                        {tournament.brackets?.rounds?.length} rounds, {tournament.currentPlayers} participants
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnhancedBracket 
                        tournament={tournament}
                        matches={tournament.brackets.matches || []}
                        teams={tournament.participants || []}
                      />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="participants" className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Participating Teams</CardTitle>
                    <CardDescription>
                      {tournament.currentPlayers} of {tournament.maxPlayers} spots filled
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tournament.participants
                        .sort((a: any, b: any) => a.seed - b.seed)
                        .map((participant: any, index: number) => (
                          <ParticipantCard 
                            key={participant.id} 
                            participant={participant} 
                            position={index + 1} 
                          />
                        ))
                      }
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Tournament Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tournament.schedule.map((day, index) => (
                        <div key={index}>
                          <h3 className="font-semibold mb-2">{formatDate(day.date)}</h3>
                          <div className="border-l pl-4 space-y-1">
                            {day.events.map((event, eventIndex) => (
                              <ScheduleItem 
                                key={eventIndex} 
                                event={event} 
                                date={day.date} 
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}