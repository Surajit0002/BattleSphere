import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch, Link } from "wouter";
import { Tournament, Game } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { 
  Search, 
  CalendarRange, 
  Filter, 
  TrendingUp, 
  Trophy, 
  Users, 
  Coins, 
  Gamepad2, 
  Flame,
  ListFilter, 
  CheckCheck, 
  X, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

interface ViewMode {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface FilterOption {
  type: string;
  value: string | number[] | boolean | null;
}

export default function TournamentsEnhanced() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const urlParams = new URLSearchParams(search || "");
  const gameIdParam = urlParams.get("game");
  
  // States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<string>("grid");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(gameIdParam || "all");
  const [sortBy, setSortBy] = useState<string>("startDate");
  const [pageSize, setPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Filter states
  const [filters, setFilters] = useState<Record<string, FilterOption>>({
    gameMode: { type: "select", value: "all" },
    tournamentType: { type: "select", value: "all" },
    entryFee: { type: "range", value: [0, 5000] },
    prizePool: { type: "range", value: [0, 100000] },
    playersCount: { type: "range", value: [0, 200] },
    status: { type: "select", value: "all" },
    dateRange: { type: "dateRange", value: null },
    onlyFeatured: { type: "boolean", value: false },
    isVerified: { type: "boolean", value: false },
  });
  
  // Fetch data
  const { data: tournaments, isLoading: loadingTournaments } = useQuery<Tournament[]>({
    queryKey: ['/api/tournaments'],
  });
  
  const { data: games, isLoading: loadingGames } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });
  
  // Initialize activeTab when games load
  useEffect(() => {
    if (games?.length && gameIdParam) {
      const gameExists = games.some(game => game.id.toString() === gameIdParam);
      if (gameExists) {
        setActiveTab(gameIdParam);
      }
    }
  }, [games, gameIdParam]);
  
  // View modes
  const viewModes: ViewMode[] = [
    { id: "grid", name: "Grid View", icon: <Gamepad2 className="h-4 w-4" /> },
    { id: "list", name: "List View", icon: <ListFilter className="h-4 w-4" /> },
    { id: "compact", name: "Compact", icon: <CheckCheck className="h-4 w-4" /> },
  ];
  
  // Apply filters to tournaments
  const getFilteredTournaments = () => {
    if (!tournaments) return [];
    
    return tournaments.filter(tournament => {
      // Game filter from tab
      if (activeTab !== "all" && tournament.gameId.toString() !== activeTab) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !tournament.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Game mode filter
      if (filters.gameMode.value !== "all" && tournament.gameMode !== filters.gameMode.value) {
        return false;
      }
      
      // Tournament type filter
      if (filters.tournamentType.value !== "all" && tournament.tournamentType !== filters.tournamentType.value) {
        return false;
      }
      
      // Entry fee filter
      const [minFee, maxFee] = filters.entryFee.value as number[];
      if (tournament.entryFee < minFee || tournament.entryFee > maxFee) {
        return false;
      }
      
      // Prize pool filter
      const [minPrize, maxPrize] = filters.prizePool.value as number[];
      if (tournament.prizePool < minPrize || tournament.prizePool > maxPrize) {
        return false;
      }
      
      // Status filter
      if (filters.status.value !== "all" && tournament.status !== filters.status.value) {
        return false;
      }
      
      // Featured filter
      if (filters.onlyFeatured.value === true && !tournament.isFeatured) {
        return false;
      }
      
      return true;
    });
  };
  
  // Sort tournaments
  const getSortedTournaments = () => {
    const filtered = getFilteredTournaments();
    
    switch (sortBy) {
      case "startDate":
        return filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      case "prizePoolDesc":
        return filtered.sort((a, b) => b.prizePool - a.prizePool);
      case "prizePoolAsc":
        return filtered.sort((a, b) => a.prizePool - b.prizePool);
      case "entryFeeDesc":
        return filtered.sort((a, b) => b.entryFee - a.entryFee);
      case "entryFeeAsc":
        return filtered.sort((a, b) => a.entryFee - b.entryFee);
      case "popularity":
        // For demo purposes - would normally use registration count
        return filtered.sort((a, b) => (b.currentPlayers / b.maxPlayers) - (a.currentPlayers / a.maxPlayers));
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  };
  
  // Paginate tournaments
  const getPaginatedTournaments = () => {
    const sorted = getSortedTournaments();
    const startIndex = (currentPage - 1) * pageSize;
    return sorted.slice(startIndex, startIndex + pageSize);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      gameMode: { type: "select", value: "all" },
      tournamentType: { type: "select", value: "all" },
      entryFee: { type: "range", value: [0, 5000] },
      prizePool: { type: "range", value: [0, 100000] },
      playersCount: { type: "range", value: [0, 200] },
      status: { type: "select", value: "all" },
      dateRange: { type: "dateRange", value: null },
      onlyFeatured: { type: "boolean", value: false },
      isVerified: { type: "boolean", value: false },
    });
    setSearchQuery("");
    setActiveTab("all");
    setLocation("/tournaments-enhanced");
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    
    if (value === "all") {
      setLocation("/tournaments-enhanced");
    } else {
      setLocation(`/tournaments-enhanced?game=${value}`);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (key: string, value: string | number[] | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
    setCurrentPage(1);
  };
  
  // Get tournament status label and color
  const getTournamentStatus = (status: string, startDate: string, endDate: string | null) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    if (status === "cancelled") {
      return { label: "CANCELLED", color: "destructive" };
    }
    
    if (now < start) {
      return { label: "UPCOMING", color: "primary" };
    }
    
    if (!end || now <= end) {
      return { label: "ONGOING", color: "accent-yellow" };
    }
    
    return { label: "COMPLETED", color: "accent-green" };
  };
  
  // Format date range
  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const startMonth = start.toLocaleString('en-US', { month: 'short' });
    const startDay = start.getDate();
    
    if (!end) {
      return `${startMonth} ${startDay}`;
    }
    
    const endMonth = end.toLocaleString('en-US', { month: 'short' });
    const endDay = end.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}`;
    }
    
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };
  
  // Time until tournament starts
  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return "Started";
    }
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    }
    
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    
    return `${diffMinutes}m`;
  };
  
  // Get game name
  const getGameName = (gameId: number) => {
    const game = games?.find(g => g.id === gameId);
    return game?.name || "Unknown Game";
  };
  
  // Get game image
  const getGameImage = (gameId: number) => {
    const game = games?.find(g => g.id === gameId);
    return game?.imageUrl || "https://via.placeholder.com/150";
  };
  
  // Result counts
  const filteredCount = getFilteredTournaments().length;
  const totalCount = tournaments?.length || 0;
  const pagesCount = Math.ceil(filteredCount / pageSize);
  
  // Loading state
  const isLoading = loadingTournaments || loadingGames;
  
  // Get current page items
  const currentItems = getPaginatedTournaments();
  
  return (
    <div className="pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-rajdhani text-white mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-blue">TOURNAMENTS</span>
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Find and join competitive gaming tournaments. Filter by game, entry fee, prize pool and more to find your perfect match.
        </p>
      </div>
      
      {/* Search and filter bar */}
      <div className="bg-secondary-bg rounded-lg border border-gray-800 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-grow min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-700 pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800 border-gray-700 w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDate">Start Date (Soonest)</SelectItem>
                <SelectItem value="prizePoolDesc">Prize Pool (High to Low)</SelectItem>
                <SelectItem value="prizePoolAsc">Prize Pool (Low to High)</SelectItem>
                <SelectItem value="entryFeeDesc">Entry Fee (High to Low)</SelectItem>
                <SelectItem value="entryFeeAsc">Entry Fee (Low to High)</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-800 border-gray-700 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value)}
              className="hidden md:flex bg-gray-800 border border-gray-700 rounded-md"
            >
              {viewModes.map((mode) => (
                <ToggleGroupItem 
                  key={mode.id} 
                  value={mode.id}
                  aria-label={mode.name}
                  className="data-[state=on]:bg-primary data-[state=on]:text-white"
                >
                  {mode.icon}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        
        {/* Extended filters */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Game Mode</label>
                <Select 
                  value={filters.gameMode.value as string} 
                  onValueChange={(value) => handleFilterChange("gameMode", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="duo">Duo</SelectItem>
                    <SelectItem value="squad">Squad</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Tournament Type</label>
                <Select 
                  value={filters.tournamentType.value as string} 
                  onValueChange={(value) => handleFilterChange("tournamentType", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="free">Free Entry</SelectItem>
                    <SelectItem value="paid">Paid Entry</SelectItem>
                    <SelectItem value="sponsored">Sponsored</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Tournament Status</label>
                <Select 
                  value={filters.status.value as string} 
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Registration Open</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Entry Fee Range (₹)</label>
                <div className="px-2">
                  <Slider
                    value={filters.entryFee.value as number[]}
                    onValueChange={(value) => handleFilterChange("entryFee", value)}
                    min={0}
                    max={5000}
                    step={50}
                    className="my-5"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹{(filters.entryFee.value as number[])[0]}</span>
                  <span>₹{(filters.entryFee.value as number[])[1]}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Prize Pool Range (₹)</label>
                <div className="px-2">
                  <Slider
                    value={filters.prizePool.value as number[]}
                    onValueChange={(value) => handleFilterChange("prizePool", value)}
                    min={0}
                    max={100000}
                    step={1000}
                    className="my-5"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹{(filters.prizePool.value as number[])[0]}</span>
                  <span>₹{(filters.prizePool.value as number[])[1]}</span>
                </div>
              </div>
              
              <div className="flex items-center h-full">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={filters.onlyFeatured.value as boolean}
                    onCheckedChange={(checked) => handleFilterChange("onlyFeatured", checked)}
                  />
                  <Label htmlFor="featured" className="text-gray-300">Featured Tournaments Only</Label>
                </div>
              </div>
              
              <div className="flex items-center justify-end h-full md:col-span-2">
                <Button
                  variant="outline"
                  className="mr-2 bg-transparent border-gray-700 text-gray-400 hover:bg-gray-700"
                  onClick={clearAllFilters}
                >
                  <X className="h-4 w-4 mr-2" /> Clear Filters
                </Button>
                
                <Button onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Results summary */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="text-gray-400">
          Showing <span className="text-white font-medium">{filteredCount}</span> of <span className="text-white font-medium">{totalCount}</span> tournaments
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
            <SelectTrigger className="bg-gray-800 border-gray-700 w-[140px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="48">48 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Game tabs */}
      <div className="mb-6">
        <ScrollArea className="w-full">
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="bg-secondary-bg border border-gray-800 p-1 w-full inline-flex h-auto">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2"
              >
                All Games
              </TabsTrigger>
              
              {!loadingGames && games?.map(game => (
                <TabsTrigger 
                  key={game.id}
                  value={game.id.toString()}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={game.imageUrl} 
                      alt={game.name} 
                      className="w-6 h-6 rounded-sm object-cover" 
                    />
                    {game.name}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </ScrollArea>
      </div>
      
      {/* Tournaments Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-secondary-bg rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : filteredCount === 0 ? (
        <div className="bg-secondary-bg border border-gray-800 rounded-lg p-10 text-center">
          <div className="text-lg text-gray-400 mb-3">No tournaments match your filters</div>
          <Button 
            variant="outline" 
            onClick={clearAllFilters}
            className="border-gray-700 hover:bg-gray-700"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <>
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map(tournament => {
                const status = getTournamentStatus(tournament.status, tournament.startDate, tournament.endDate);
                return (
                  <Card key={tournament.id} className="bg-gradient-to-b from-gray-900/50 to-black/70 border border-gray-800 overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                    <div className="relative">
                      <div className="absolute inset-0 bg-black/50 z-10"></div>
                      <img
                        src={getGameImage(tournament.gameId)}
                        alt={getGameName(tournament.gameId)}
                        className="w-full h-36 object-cover"
                      />
                      
                      <div className="absolute top-0 left-0 w-full p-4 z-20">
                        <div className="flex justify-between">
                          <Badge className="bg-gray-900/80 text-white border-0 backdrop-blur-sm">
                            {getGameName(tournament.gameId)}
                          </Badge>
                          
                          <Badge variant="outline" className={`bg-${status.color}/20 text-${status.color} border-${status.color}/30`}>
                            {status.label}
                          </Badge>
                        </div>
                        
                        <h3 className="font-rajdhani font-bold text-xl text-white mt-2">
                          {tournament.name}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 flex items-center">
                            <CalendarRange className="h-3 w-3 mr-1" />
                            {formatDateRange(tournament.startDate, tournament.endDate)}
                          </Badge>
                          
                          <Badge variant="outline" className={
                            tournament.gameMode === "solo" ? "bg-destructive/20 text-destructive border-destructive/30" :
                            tournament.gameMode === "duo" ? "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30" :
                            tournament.gameMode === "squad" ? "bg-accent-green/20 text-accent-green border-accent-green/30" :
                            "bg-gray-700/20 text-gray-300 border-gray-500/30"
                          }>
                            {tournament.gameMode.charAt(0).toUpperCase() + tournament.gameMode.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="flex flex-col items-center">
                            <Coins className="h-4 w-4 mb-1 text-accent-yellow" />
                            <div className="text-lg font-medium text-white">
                              {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : "FREE"}
                            </div>
                            <div className="text-xs text-gray-400">Entry</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex flex-col items-center">
                            <Trophy className="h-4 w-4 mb-1 text-accent-green" />
                            <div className="text-lg font-medium text-white">₹{tournament.prizePool.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">Prize</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex flex-col items-center">
                            <Users className="h-4 w-4 mb-1 text-primary" />
                            <div className="text-lg font-medium text-white">
                              {tournament.currentPlayers}/{tournament.maxPlayers}
                            </div>
                            <div className="text-xs text-gray-400">Players</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 mr-1 text-accent-red" />
                          <span className="text-sm text-gray-400">
                            {status.label === "UPCOMING" 
                              ? `Starts in ${getTimeUntil(tournament.startDate)}` 
                              : status.label === "ONGOING" 
                                ? "Tournament in progress" 
                                : "Tournament ended"}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link href={`/tournaments/${tournament.id}`}>
                            <Button size="sm" variant="default">View</Button>
                          </Link>
                          <Link href={`/tournaments/premium/${tournament.id}`}>
                            <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:text-primary">
                              Premium
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {viewMode === "list" && (
            <div className="space-y-4">
              {currentItems.map(tournament => {
                const status = getTournamentStatus(tournament.status, tournament.startDate, tournament.endDate);
                return (
                  <Card key={tournament.id} className="bg-gradient-to-r from-gray-900/50 to-black/70 border border-gray-800">
                    <div className="p-4 flex flex-col md:flex-row gap-4">
                      <div className="relative w-full md:w-40 h-32 md:h-full flex-shrink-0">
                        <img
                          src={getGameImage(tournament.gameId)}
                          alt={getGameName(tournament.gameId)}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <Badge 
                          className={`absolute top-2 right-2 bg-${status.color}/90 text-white border-0`}
                        >
                          {status.label}
                        </Badge>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-gray-800 text-gray-300">
                            {getGameName(tournament.gameId)}
                          </Badge>
                          
                          <Badge variant="outline" className={
                            tournament.gameMode === "solo" ? "bg-destructive/20 text-destructive border-destructive/30" :
                            tournament.gameMode === "duo" ? "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30" :
                            tournament.gameMode === "squad" ? "bg-accent-green/20 text-accent-green border-accent-green/30" :
                            "bg-gray-700/20 text-gray-300 border-gray-500/30"
                          }>
                            {tournament.gameMode.charAt(0).toUpperCase() + tournament.gameMode.slice(1)}
                          </Badge>
                          
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 flex items-center">
                            <CalendarRange className="h-3 w-3 mr-1" />
                            {formatDateRange(tournament.startDate, tournament.endDate)}
                          </Badge>
                        </div>
                        
                        <h3 className="font-rajdhani font-bold text-xl text-white mb-2">
                          {tournament.name}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {tournament.description || "Join this exciting tournament to compete against the best players and win amazing prizes."}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-2">
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 mr-2 text-accent-yellow" />
                            <div>
                              <div className="text-white font-medium">
                                {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : "FREE"}
                              </div>
                              <div className="text-xs text-gray-500">Entry Fee</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 mr-2 text-accent-green" />
                            <div>
                              <div className="text-white font-medium">₹{tournament.prizePool.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">Prize Pool</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-primary" />
                            <div>
                              <div className="text-white font-medium">
                                {tournament.currentPlayers}/{tournament.maxPlayers}
                              </div>
                              <div className="text-xs text-gray-500">Players</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center ml-auto">
                            <div className="flex gap-2">
                              <Link href={`/tournaments/${tournament.id}`}>
                                <Button variant="default">View Details</Button>
                              </Link>
                              <Link href={`/tournaments/premium/${tournament.id}`}>
                                <Button variant="outline" className="border-primary/30 hover:bg-primary/10 hover:text-primary">
                                  Premium View
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
          
          {viewMode === "compact" && (
            <div className="rounded-lg border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary-bg">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">Tournament</th>
                    <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Game</th>
                    <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Prize</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Fee</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {currentItems.map((tournament, index) => {
                    const status = getTournamentStatus(tournament.status, tournament.startDate, tournament.endDate);
                    return (
                      <tr key={tournament.id} className={index % 2 === 0 ? "bg-secondary-bg/30" : "bg-secondary-bg/10"}>
                        <td className="p-4">
                          <div className="font-medium text-white">{tournament.name}</div>
                          <div className="text-xs text-gray-400 md:hidden">{getGameName(tournament.gameId)}</div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <img
                              src={getGameImage(tournament.gameId)}
                              alt={getGameName(tournament.gameId)}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-gray-300">{getGameName(tournament.gameId)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 hidden md:table-cell">
                          {formatDateRange(tournament.startDate, tournament.endDate)}
                        </td>
                        <td className="p-4">
                          <div className="text-accent-green font-medium">₹{tournament.prizePool.toLocaleString()}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-accent-yellow font-medium">
                            {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : "FREE"}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={`bg-${status.color}/20 text-${status.color} border-${status.color}/30`}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/tournaments/${tournament.id}`}>
                              <Button size="sm" variant="default">View</Button>
                            </Link>
                            <Link href={`/tournaments/premium/${tournament.id}`} className="hidden md:inline-block">
                              <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:text-primary">
                                Premium
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {pagesCount > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex">
                <Button
                  variant="outline"
                  className="rounded-r-none border-gray-700"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex">
                  {Array.from({ length: Math.min(5, pagesCount) }, (_, i) => {
                    let pageNum;
                    if (pagesCount <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagesCount - 2) {
                      pageNum = pagesCount - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={i}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className={`rounded-none border-l-0 border-gray-700 min-w-[40px] ${
                          currentPage === pageNum ? "bg-primary" : ""
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  className="rounded-l-none border-l-0 border-gray-700"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagesCount))}
                  disabled={currentPage === pagesCount}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}