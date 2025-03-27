import {
  users, games, teams, teamMembers, tournaments, tournamentRegistrations, matches, leaderboard, walletTransactions,
  type User, type InsertUser, type Game, type InsertGame, type Team, type InsertTeam, 
  type TeamMember, type InsertTeamMember, type Tournament, type InsertTournament,
  type TournamentRegistration, type InsertTournamentRegistration, type Match, type InsertMatch,
  type LeaderboardEntry, type InsertLeaderboardEntry, type WalletTransaction, type InsertWalletTransaction
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserWallet(userId: number, amount: number): Promise<User>;
  
  // Game operations
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getFeaturedGames(): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Team operations
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getTopTeams(limit: number): Promise<Team[]>;
  getTeamsByUserId(userId: number): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  
  // Team member operations
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  
  // Tournament operations
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  getUpcomingTournaments(limit?: number): Promise<Tournament[]>;
  getFeaturedTournament(): Promise<Tournament | undefined>;
  getTournamentsByGameId(gameId: number): Promise<Tournament[]>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  
  // Tournament registration operations
  registerForTournament(registration: InsertTournamentRegistration): Promise<TournamentRegistration>;
  getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistration[]>;
  
  // Match operations
  getMatches(tournamentId: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatchResult(matchId: number, winnerId: number, team1Score: number, team2Score: number): Promise<Match>;
  
  // Leaderboard operations
  getLeaderboardEntries(gameId?: number, period?: string, limit?: number): Promise<LeaderboardEntry[]>;
  getLeaderboardEntry(userId: number, gameId?: number): Promise<LeaderboardEntry | undefined>;
  updateLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  
  // Wallet operations
  createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction>;
  getWalletTransactions(userId: number): Promise<WalletTransaction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  private tournaments: Map<number, Tournament>;
  private tournamentRegistrations: Map<number, TournamentRegistration>;
  private matches: Map<number, Match>;
  private leaderboardEntries: Map<number, LeaderboardEntry>;
  private walletTransactions: Map<number, WalletTransaction>;
  
  private currentUserId: number;
  private currentGameId: number;
  private currentTeamId: number;
  private currentTeamMemberId: number;
  private currentTournamentId: number;
  private currentRegistrationId: number;
  private currentMatchId: number;
  private currentLeaderboardId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.tournaments = new Map();
    this.tournamentRegistrations = new Map();
    this.matches = new Map();
    this.leaderboardEntries = new Map();
    this.walletTransactions = new Map();
    
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.currentTeamId = 1;
    this.currentTeamMemberId = 1;
    this.currentTournamentId = 1;
    this.currentRegistrationId = 1;
    this.currentMatchId = 1;
    this.currentLeaderboardId = 1;
    this.currentTransactionId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Initialize games
    const games: InsertGame[] = [
      {
        name: "Free Fire",
        imageUrl: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "Garena Free Fire is a battle royale game",
        status: "active",
        playerCount: 10000,
        tournamentCount: 24,
        featured: true,
        badge: "POPULAR"
      },
      {
        name: "PUBG Mobile",
        imageUrl: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "PUBG Mobile is a battle royale game",
        status: "active",
        playerCount: 8000,
        tournamentCount: 18,
        featured: true,
        badge: "TRENDING"
      },
      {
        name: "COD Mobile",
        imageUrl: "https://images.unsplash.com/photo-1640565819215-6a0123982de7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "Call of Duty Mobile is a first-person shooter game",
        status: "active",
        playerCount: 5000,
        tournamentCount: 12,
        featured: true,
        badge: "NEW"
      },
      {
        name: "BGMI",
        imageUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
        description: "Battlegrounds Mobile India is a battle royale game",
        status: "active",
        playerCount: 7000,
        tournamentCount: 15,
        featured: true,
        badge: "FEATURED"
      }
    ];
    
    games.forEach(game => this.createGame(game));
    
    // Create some users
    const users: InsertUser[] = [
      {
        username: "ghostsniper",
        password: "password123",
        displayName: "GhostSniper",
        email: "ghostsniper@example.com",
        walletBalance: 45500,
        profileImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        username: "ninjawarrior",
        password: "password123",
        displayName: "NinjaWarrior",
        email: "ninjawarrior@example.com",
        walletBalance: 38200,
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        username: "stealthqueen",
        password: "password123",
        displayName: "StealthQueen",
        email: "stealthqueen@example.com",
        walletBalance: 32750,
        profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        username: "shadowfighter",
        password: "password123",
        displayName: "ShadowFighter",
        email: "shadowfighter@example.com",
        walletBalance: 28500,
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        username: "eagleeye",
        password: "password123",
        displayName: "EagleEye",
        email: "eagleeye@example.com",
        walletBalance: 25400,
        profileImage: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    ];
    
    users.forEach(user => this.createUser(user));
    
    // Create teams
    const teams: InsertTeam[] = [
      {
        name: "Team Golf",
        description: "Top ranked squad with multiple tournament wins",
        captainId: 1, // GhostSniper
        wins: 28,
        totalEarnings: 45500,
        memberCount: 4,
        badge: "PRO"
      },
      {
        name: "Team Alpha",
        description: "Rising stars in the competitive scene",
        captainId: 2, // NinjaWarrior
        wins: 25,
        totalEarnings: 38200,
        memberCount: 4,
        badge: "ELITE"
      },
      {
        name: "Team Delta",
        description: "Tactical experts specializing in objective play",
        captainId: 3, // StealthQueen
        wins: 22,
        totalEarnings: 32750,
        memberCount: 4
      },
      {
        name: "Team Charlie",
        description: "Veteran team with consistent performance",
        captainId: 4, // ShadowFighter
        wins: 20,
        totalEarnings: 28500,
        memberCount: 4
      },
      {
        name: "Team Foxtrot",
        description: "Aggressive playstyle with high kill counts",
        captainId: 5, // EagleEye
        wins: 18,
        totalEarnings: 25400,
        memberCount: 4
      }
    ];
    
    teams.forEach(team => this.createTeam(team));
    
    // Create tournaments
    const now = new Date();
    const today = new Date();
    const tomorrow = new Date(now.setDate(now.getDate() + 1));
    const saturday = new Date(now.setDate(now.getDate() + (6 - now.getDay()) % 7));
    const sunday = new Date(now.setDate(now.getDate() + (7 - now.getDay()) % 7));
    
    const tournaments: InsertTournament[] = [
      {
        name: "Weekly Showdown",
        gameId: 1, // Free Fire
        description: "Weekly tournament for solo players",
        startDate: new Date(today.setHours(19, 0, 0, 0)),
        maxPlayers: 64,
        currentPlayers: 42,
        entryFee: 50,
        prizePool: 5000,
        status: "upcoming",
        gameMode: "solo",
        tournamentType: "paid",
        imageUrl: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      },
      {
        name: "Pro League Qualifier",
        gameId: 2, // PUBG Mobile
        description: "Qualifier for the Pro League",
        startDate: new Date(tomorrow.setHours(16, 0, 0, 0)),
        maxPlayers: 100,
        currentPlayers: 72,
        entryFee: 100,
        prizePool: 15000,
        status: "upcoming",
        gameMode: "squad",
        tournamentType: "paid",
        imageUrl: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      },
      {
        name: "Weekend Warriors",
        gameId: 3, // COD Mobile
        description: "Weekend duo tournament",
        startDate: new Date(saturday.setHours(14, 0, 0, 0)),
        maxPlayers: 32,
        currentPlayers: 24,
        entryFee: 75,
        prizePool: 8000,
        status: "upcoming",
        gameMode: "duo",
        tournamentType: "paid",
        imageUrl: "https://images.unsplash.com/photo-1640565819215-6a0123982de7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      },
      {
        name: "Elite Showdown",
        gameId: 4, // BGMI
        description: "Free tournament for all players",
        startDate: new Date(sunday.setHours(20, 0, 0, 0)),
        maxPlayers: 100,
        currentPlayers: 67,
        entryFee: 0,
        prizePool: 3000,
        status: "upcoming",
        gameMode: "solo",
        tournamentType: "free",
        imageUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80"
      },
      {
        name: "Pro League Finals",
        gameId: 1, // Free Fire
        description: "The ultimate championship with the biggest prize pool",
        imageUrl: "https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
        startDate: new Date(now.setDate(now.getDate() + 14)),
        maxPlayers: 100,
        currentPlayers: 75,
        entryFee: 250,
        prizePool: 50000,
        status: "upcoming",
        gameMode: "squad",
        tournamentType: "paid",
        featured: true
      }
    ];
    
    tournaments.forEach(tournament => this.createTournament(tournament));
    
    // Create leaderboard entries
    const leaderboardEntries: InsertLeaderboardEntry[] = [
      {
        userId: 1, // GhostSniper
        gameId: 1, // Free Fire
        points: 3200,
        wins: 28,
        totalMatches: 42,
        kdRatio: "4.8",
        earnings: 45500,
        rank: 1,
        period: "weekly"
      },
      {
        userId: 2, // NinjaWarrior
        gameId: 1, // Free Fire
        points: 2900,
        wins: 25,
        totalMatches: 38,
        kdRatio: "4.5",
        earnings: 38200,
        rank: 2,
        period: "weekly"
      },
      {
        userId: 3, // StealthQueen
        gameId: 1, // Free Fire
        points: 2750,
        wins: 22,
        totalMatches: 35,
        kdRatio: "4.2",
        earnings: 32750,
        rank: 3,
        period: "weekly"
      },
      {
        userId: 4, // ShadowFighter
        gameId: 1, // Free Fire
        points: 2600,
        wins: 20,
        totalMatches: 40,
        kdRatio: "3.9",
        earnings: 28500,
        rank: 4,
        period: "weekly"
      },
      {
        userId: 5, // EagleEye
        gameId: 1, // Free Fire
        points: 2400,
        wins: 18,
        totalMatches: 33,
        kdRatio: "3.8",
        earnings: 25400,
        rank: 5,
        period: "weekly"
      }
    ];
    
    leaderboardEntries.forEach(entry => this.updateLeaderboardEntry(entry));
    
    // Create team members
    for (let i = 1; i <= 5; i++) {
      this.addTeamMember({
        teamId: i,
        userId: i,
        role: "captain"
      });
    }
    
    // Create tournament matches for featured tournament
    const featuredTournament = Array.from(this.tournaments.values()).find(t => t.featured);
    if (featuredTournament) {
      // Quarter Finals
      this.createMatch({
        tournamentId: featuredTournament.id,
        round: 1,
        matchNumber: 1,
        team1Id: 2, // Team Alpha
        team2Id: 3, // Team Delta
        team1Score: 15,
        team2Score: 8,
        winnerId: 2, // Team Alpha
        status: "completed",
        scheduledTime: new Date(featuredTournament.startDate.getTime() - 86400000 * 3) // 3 days before
      });
      
      this.createMatch({
        tournamentId: featuredTournament.id,
        round: 1,
        matchNumber: 2,
        team1Id: 4, // Team Charlie
        team2Id: 5, // Team Foxtrot
        team1Score: 12,
        team2Score: 10,
        winnerId: 4, // Team Charlie
        status: "completed",
        scheduledTime: new Date(featuredTournament.startDate.getTime() - 86400000 * 3) // 3 days before
      });
      
      this.createMatch({
        tournamentId: featuredTournament.id,
        round: 1,
        matchNumber: 3,
        team1Id: 1, // Team Golf
        team2Id: null,
        player1Id: null,
        player2Id: null,
        team1Score: 14,
        team2Score: 9,
        winnerId: 1, // Team Golf
        status: "completed",
        scheduledTime: new Date(featuredTournament.startDate.getTime() - 86400000 * 3) // 3 days before
      });
      
      this.createMatch({
        tournamentId: featuredTournament.id,
        round: 1,
        matchNumber: 4,
        team1Id: null,
        team2Id: null,
        player1Id: null,
        player2Id: null,
        team1Score: 16,
        team2Score: 7,
        winnerId: null,
        status: "scheduled",
        scheduledTime: new Date(featuredTournament.startDate.getTime() - 86400000 * 2) // 2 days before
      });
      
      // Semi Finals
      this.createMatch({
        tournamentId: featuredTournament.id,
        round: 2,
        matchNumber: 1,
        team1Id: 2, // Team Alpha
        team2Id: 4, // Team Charlie
        team1Score: 18,
        team2Score: 11,
        winnerId: 2, // Team Alpha
        status: "completed",
        scheduledTime: new Date(featuredTournament.startDate.getTime() - 86400000) // 1 day before
      });
      
      this.createMatch({
        tournamentId: featuredTournament.id,
        round: 2,
        matchNumber: 2,
        team1Id: 5, // Team Foxtrot
        team2Id: 1, // Team Golf
        team1Score: 13,
        team2Score: 17,
        winnerId: 1, // Team Golf
        status: "completed",
        scheduledTime: new Date(featuredTournament.startDate.getTime() - 86400000) // 1 day before
      });
      
      // Final
      this.createMatch({
        tournamentId: featuredTournament.id,
        round: 3,
        matchNumber: 1,
        team1Id: 2, // Team Alpha
        team2Id: 1, // Team Golf
        team1Score: 14,
        team2Score: 20,
        winnerId: 1, // Team Golf
        status: "completed",
        scheduledTime: featuredTournament.startDate // Tournament day
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const newUser: User = { ...user, id, createdAt };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUserWallet(userId: number, amount: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    user.walletBalance += amount;
    return user;
  }

  // Game operations
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async getFeaturedGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.featured);
  }
  
  async createGame(game: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const newGame: Game = { ...game, id };
    this.games.set(id, newGame);
    return newGame;
  }

  // Team operations
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }
  
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  async getTopTeams(limit: number): Promise<Team[]> {
    return Array.from(this.teams.values())
      .sort((a, b) => b.wins - a.wins)
      .slice(0, limit);
  }
  
  async getTeamsByUserId(userId: number): Promise<Team[]> {
    const memberships = Array.from(this.teamMembers.values()).filter(
      member => member.userId === userId
    );
    
    return memberships.map(
      membership => this.teams.get(membership.teamId)!
    );
  }
  
  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    const createdAt = new Date();
    const newTeam: Team = { ...team, id, createdAt };
    this.teams.set(id, newTeam);
    return newTeam;
  }

  // Team member operations
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(
      member => member.teamId === teamId
    );
  }
  
  async addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.currentTeamMemberId++;
    const joinedAt = new Date();
    const newTeamMember: TeamMember = { ...teamMember, id, joinedAt };
    this.teamMembers.set(id, newTeamMember);
    
    // Update team member count
    const team = await this.getTeam(teamMember.teamId);
    if (team) {
      team.memberCount = (await this.getTeamMembers(team.id)).length;
    }
    
    return newTeamMember;
  }

  // Tournament operations
  async getTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }
  
  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }
  
  async getUpcomingTournaments(limit?: number): Promise<Tournament[]> {
    const tournaments = Array.from(this.tournaments.values())
      .filter(tournament => tournament.status === "upcoming")
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    return limit ? tournaments.slice(0, limit) : tournaments;
  }
  
  async getFeaturedTournament(): Promise<Tournament | undefined> {
    return Array.from(this.tournaments.values()).find(
      tournament => tournament.featured
    );
  }
  
  async getTournamentsByGameId(gameId: number): Promise<Tournament[]> {
    return Array.from(this.tournaments.values()).filter(
      tournament => tournament.gameId === gameId
    );
  }
  
  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const id = this.currentTournamentId++;
    const createdAt = new Date();
    const newTournament: Tournament = { ...tournament, id, createdAt };
    this.tournaments.set(id, newTournament);
    
    // Update game tournament count
    const game = await this.getGame(tournament.gameId);
    if (game) {
      game.tournamentCount++;
    }
    
    return newTournament;
  }

  // Tournament registration operations
  async registerForTournament(registration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    const id = this.currentRegistrationId++;
    const registeredAt = new Date();
    const newRegistration: TournamentRegistration = { ...registration, id, registeredAt };
    this.tournamentRegistrations.set(id, newRegistration);
    
    // Update tournament player count
    const tournament = await this.getTournament(registration.tournamentId);
    if (tournament) {
      tournament.currentPlayers++;
    }
    
    return newRegistration;
  }
  
  async getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistration[]> {
    return Array.from(this.tournamentRegistrations.values()).filter(
      registration => registration.tournamentId === tournamentId
    );
  }

  // Match operations
  async getMatches(tournamentId: number): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => match.tournamentId === tournamentId)
      .sort((a, b) => {
        // Sort by round first
        if (a.round !== b.round) {
          return a.round - b.round;
        }
        // Then by match number
        return a.matchNumber - b.matchNumber;
      });
  }
  
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.currentMatchId++;
    const newMatch: Match = { ...match, id };
    this.matches.set(id, newMatch);
    return newMatch;
  }
  
  async updateMatchResult(matchId: number, winnerId: number, team1Score: number, team2Score: number): Promise<Match> {
    const match = this.matches.get(matchId);
    if (!match) {
      throw new Error(`Match with ID ${matchId} not found`);
    }
    
    match.winnerId = winnerId;
    match.team1Score = team1Score;
    match.team2Score = team2Score;
    match.status = "completed";
    
    return match;
  }

  // Leaderboard operations
  async getLeaderboardEntries(gameId?: number, period: string = "weekly", limit?: number): Promise<LeaderboardEntry[]> {
    let entries = Array.from(this.leaderboardEntries.values());
    
    if (gameId) {
      entries = entries.filter(entry => entry.gameId === gameId);
    }
    
    entries = entries.filter(entry => entry.period === period);
    
    // Sort by rank
    entries.sort((a, b) => {
      if (a.rank !== null && b.rank !== null) {
        return a.rank - b.rank;
      }
      if (a.rank === null) return 1;
      if (b.rank === null) return -1;
      return 0;
    });
    
    return limit ? entries.slice(0, limit) : entries;
  }
  
  async getLeaderboardEntry(userId: number, gameId?: number): Promise<LeaderboardEntry | undefined> {
    return Array.from(this.leaderboardEntries.values()).find(
      entry => entry.userId === userId && (!gameId || entry.gameId === gameId)
    );
  }
  
  async updateLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    // Check if entry already exists
    const existingEntry = Array.from(this.leaderboardEntries.values()).find(
      e => e.userId === entry.userId && e.gameId === entry.gameId && e.period === entry.period
    );
    
    if (existingEntry) {
      // Update existing entry
      Object.assign(existingEntry, entry);
      existingEntry.updatedAt = new Date();
      return existingEntry;
    } else {
      // Create new entry
      const id = this.currentLeaderboardId++;
      const updatedAt = new Date();
      const newEntry: LeaderboardEntry = { ...entry, id, updatedAt };
      this.leaderboardEntries.set(id, newEntry);
      return newEntry;
    }
  }

  // Wallet operations
  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const id = this.currentTransactionId++;
    const timestamp = new Date();
    const newTransaction: WalletTransaction = { ...transaction, id, timestamp };
    this.walletTransactions.set(id, newTransaction);
    
    // Update user wallet balance
    await this.updateUserWallet(transaction.userId, transaction.amount);
    
    return newTransaction;
  }
  
  async getWalletTransactions(userId: number): Promise<WalletTransaction[]> {
    return Array.from(this.walletTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
