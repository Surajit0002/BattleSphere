import {
  users, games, teams, teamMembers, tournaments, tournamentRegistrations, matches, leaderboard, walletTransactions, adminAuditLogs,
  type User, type InsertUser, type Game, type InsertGame, type Team, type InsertTeam, 
  type TeamMember, type InsertTeamMember, type Tournament, type InsertTournament,
  type TournamentRegistration, type InsertTournamentRegistration, type Match, type InsertMatch,
  type LeaderboardEntry, type InsertLeaderboardEntry, type WalletTransaction, type InsertWalletTransaction,
  type AdminAuditLog, type InsertAdminAuditLog
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, like, isNull, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: number, userData: Partial<InsertUser>): Promise<User>;
  updateUserWallet(userId: number, amount: number): Promise<User>;
  getUsers(limit?: number, offset?: number): Promise<User[]>;
  getUsersCount(): Promise<number>;
  
  // Game operations
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getFeaturedGames(): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(gameId: number, gameData: Partial<InsertGame>): Promise<Game>;
  deleteGame(gameId: number): Promise<boolean>;
  
  // Team operations
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getTopTeams(limit: number): Promise<Team[]>;
  getTeamsByUserId(userId: number): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(teamId: number, teamData: Partial<InsertTeam>): Promise<Team>;
  deleteTeam(teamId: number): Promise<boolean>;
  
  // Team member operations
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(teamId: number, userId: number): Promise<boolean>;
  
  // Tournament operations
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  getUpcomingTournaments(limit?: number): Promise<Tournament[]>;
  getFeaturedTournament(): Promise<Tournament | undefined>;
  getTournamentsByGameId(gameId: number): Promise<Tournament[]>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(tournamentId: number, tournamentData: Partial<InsertTournament>): Promise<Tournament>;
  deleteTournament(tournamentId: number): Promise<boolean>;
  
  // Tournament registration operations
  registerForTournament(registration: InsertTournamentRegistration): Promise<TournamentRegistration>;
  getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistration[]>;
  updateRegistrationStatus(registrationId: number, status: string): Promise<TournamentRegistration>;
  
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
  getPendingWithdrawals(): Promise<WalletTransaction[]>;
  approveWithdrawal(transactionId: number): Promise<WalletTransaction>;
  rejectWithdrawal(transactionId: number, reason: string): Promise<WalletTransaction>;
  
  // Admin audit logs
  createAuditLog(log: InsertAdminAuditLog): Promise<AdminAuditLog>;
  getAuditLogs(adminId?: number, limit?: number, offset?: number): Promise<AdminAuditLog[]>;
  
  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    pendingWithdrawals: number;
    ongoingTournaments: number;
    totalTransactions: number;
  }>;
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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(userId: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserWallet(userId: number, amount: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ walletBalance: sql`${users.walletBalance} + ${amount}` })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUsers(limit?: number, offset?: number): Promise<User[]> {
    let usersList = await db.select().from(users).orderBy(asc(users.id));
    
    if (limit !== undefined) {
      const start = offset !== undefined ? offset : 0;
      const end = start + limit;
      return usersList.slice(start, end);
    }
    
    if (offset !== undefined) {
      return usersList.slice(offset);
    }
    
    return usersList;
  }

  async getUsersCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result.count;
  }

  async getGames(): Promise<Game[]> {
    return db.select().from(games);
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async getFeaturedGames(): Promise<Game[]> {
    return db.select().from(games).where(eq(games.featured, true));
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values(insertGame).returning();
    return game;
  }
  
  async updateGame(gameId: number, gameData: Partial<InsertGame>): Promise<Game> {
    const [game] = await db
      .update(games)
      .set(gameData)
      .where(eq(games.id, gameId))
      .returning();
    return game;
  }
  
  async deleteGame(gameId: number): Promise<boolean> {
    await db.delete(games).where(eq(games.id, gameId));
    return true;
  }

  async getTeams(): Promise<Team[]> {
    return db.select().from(teams);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getTopTeams(limit: number): Promise<Team[]> {
    return db.select().from(teams).orderBy(desc(teams.wins)).limit(limit);
  }

  async getTeamsByUserId(userId: number): Promise<Team[]> {
    const memberTeams = await db
      .select({
        teamId: teamMembers.teamId,
      })
      .from(teamMembers)
      .where(eq(teamMembers.userId, userId));

    const teamIds = memberTeams.map(t => t.teamId);
    if (teamIds.length === 0) return [];

    return db
      .select()
      .from(teams)
      .where(sql`${teams.id} IN (${teamIds.join(",")})`);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(insertTeam).returning();
    return team;
  }
  
  async updateTeam(teamId: number, teamData: Partial<InsertTeam>): Promise<Team> {
    const [team] = await db
      .update(teams)
      .set(teamData)
      .where(eq(teams.id, teamId))
      .returning();
    return team;
  }
  
  async deleteTeam(teamId: number): Promise<boolean> {
    // Delete team members first due to foreign key constraint
    await db.delete(teamMembers).where(eq(teamMembers.teamId, teamId));
    await db.delete(teams).where(eq(teams.id, teamId));
    return true;
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
  }

  async addTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const [member] = await db.insert(teamMembers).values(insertTeamMember).returning();
    
    // Update team member count
    await db
      .update(teams)
      .set({ memberCount: sql`${teams.memberCount} + 1` })
      .where(eq(teams.id, insertTeamMember.teamId));
    
    return member;
  }
  
  async removeTeamMember(teamId: number, userId: number): Promise<boolean> {
    await db.delete(teamMembers)
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      ));
    
    // Update team member count
    await db
      .update(teams)
      .set({ memberCount: sql`${teams.memberCount} - 1` })
      .where(eq(teams.id, teamId));
    
    return true;
  }

  async getTournaments(): Promise<Tournament[]> {
    return db.select().from(tournaments);
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async getUpcomingTournaments(limit?: number): Promise<Tournament[]> {
    const upcomingTournaments = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.status, "upcoming"))
      .orderBy(asc(tournaments.startDate));
    
    if (limit !== undefined) {
      return upcomingTournaments.slice(0, limit);
    }
    
    return upcomingTournaments;
  }

  async getFeaturedTournament(): Promise<Tournament | undefined> {
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.featured, true));
    
    return tournament;
  }

  async getTournamentsByGameId(gameId: number): Promise<Tournament[]> {
    return db
      .select()
      .from(tournaments)
      .where(eq(tournaments.gameId, gameId))
      .orderBy(asc(tournaments.startDate));
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const [tournament] = await db.insert(tournaments).values(insertTournament).returning();
    
    // Update game tournament count
    await db
      .update(games)
      .set({ tournamentCount: sql`${games.tournamentCount} + 1` })
      .where(eq(games.id, insertTournament.gameId));
    
    return tournament;
  }
  
  async updateTournament(tournamentId: number, tournamentData: Partial<InsertTournament>): Promise<Tournament> {
    const [tournament] = await db
      .update(tournaments)
      .set(tournamentData)
      .where(eq(tournaments.id, tournamentId))
      .returning();
    return tournament;
  }
  
  async deleteTournament(tournamentId: number): Promise<boolean> {
    // Delete related data first due to foreign key constraints
    await db.delete(matches).where(eq(matches.tournamentId, tournamentId));
    await db.delete(tournamentRegistrations).where(eq(tournamentRegistrations.tournamentId, tournamentId));
    
    const [tournament] = await db
      .select({ gameId: tournaments.gameId })
      .from(tournaments)
      .where(eq(tournaments.id, tournamentId));
    
    if (tournament) {
      // Decrement game tournament count
      await db
        .update(games)
        .set({ tournamentCount: sql`${games.tournamentCount} - 1` })
        .where(eq(games.id, tournament.gameId));
    }
    
    await db.delete(tournaments).where(eq(tournaments.id, tournamentId));
    return true;
  }

  async registerForTournament(insertRegistration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    const [registration] = await db
      .insert(tournamentRegistrations)
      .values(insertRegistration)
      .returning();
    
    // Update tournament player count
    await db
      .update(tournaments)
      .set({ currentPlayers: sql`${tournaments.currentPlayers} + 1` })
      .where(eq(tournaments.id, insertRegistration.tournamentId));
    
    return registration;
  }

  async getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistration[]> {
    return db
      .select()
      .from(tournamentRegistrations)
      .where(eq(tournamentRegistrations.tournamentId, tournamentId));
  }
  
  async updateRegistrationStatus(registrationId: number, status: string): Promise<TournamentRegistration> {
    const [registration] = await db
      .update(tournamentRegistrations)
      .set({ status })
      .where(eq(tournamentRegistrations.id, registrationId))
      .returning();
    return registration;
  }

  async getMatches(tournamentId: number): Promise<Match[]> {
    return db
      .select()
      .from(matches)
      .where(eq(matches.tournamentId, tournamentId))
      .orderBy(asc(matches.round), asc(matches.matchNumber));
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const [match] = await db.insert(matches).values(insertMatch).returning();
    return match;
  }

  async updateMatchResult(
    matchId: number,
    winnerId: number,
    team1Score: number,
    team2Score: number
  ): Promise<Match> {
    const [match] = await db
      .update(matches)
      .set({
        winnerId,
        team1Score,
        team2Score,
        status: "completed"
      })
      .where(eq(matches.id, matchId))
      .returning();
    
    return match;
  }

  async getLeaderboardEntries(
    gameId?: number,
    period: string = "weekly",
    limit?: number
  ): Promise<LeaderboardEntry[]> {
    const conditions = [];
    
    conditions.push(eq(leaderboard.period, period));
    
    if (gameId !== undefined) {
      conditions.push(eq(leaderboard.gameId!, gameId));
    }
    
    let entries = await db
      .select()
      .from(leaderboard)
      .where(and(...conditions))
      .orderBy(desc(leaderboard.points));
    
    if (limit !== undefined) {
      return entries.slice(0, limit);
    }
    
    return entries;
  }

  async getLeaderboardEntry(
    userId: number,
    gameId?: number
  ): Promise<LeaderboardEntry | undefined> {
    let conditions = [eq(leaderboard.userId, userId)];
    
    if (gameId) {
      conditions.push(eq(leaderboard.gameId!, gameId));
    }
    
    const [entry] = await db
      .select()
      .from(leaderboard)
      .where(and(...conditions));
    
    return entry;
  }

  async updateLeaderboardEntry(
    insertEntry: InsertLeaderboardEntry
  ): Promise<LeaderboardEntry> {
    // Check if entry exists
    let existingEntry: LeaderboardEntry | undefined;
    
    if (insertEntry.userId) {
      const conditions = [
        eq(leaderboard.userId!, insertEntry.userId),
        eq(leaderboard.period, insertEntry.period || "weekly")
      ];
      
      if (insertEntry.gameId) {
        conditions.push(eq(leaderboard.gameId!, insertEntry.gameId));
      }
      
      const [entry] = await db
        .select()
        .from(leaderboard)
        .where(and(...conditions));
      
      existingEntry = entry;
    } else if (insertEntry.teamId) {
      const conditions = [
        eq(leaderboard.teamId!, insertEntry.teamId),
        eq(leaderboard.period, insertEntry.period || "weekly")
      ];
      
      if (insertEntry.gameId) {
        conditions.push(eq(leaderboard.gameId!, insertEntry.gameId));
      }
      
      const [entry] = await db
        .select()
        .from(leaderboard)
        .where(and(...conditions));
      
      existingEntry = entry;
    }
    
    // Update or insert
    if (existingEntry) {
      const [updated] = await db
        .update(leaderboard)
        .set({
          ...insertEntry,
          updatedAt: new Date()
        })
        .where(eq(leaderboard.id, existingEntry.id))
        .returning();
      
      return updated;
    } else {
      const [newEntry] = await db
        .insert(leaderboard)
        .values({
          ...insertEntry,
          updatedAt: new Date()
        })
        .returning();
      
      return newEntry;
    }
  }

  async createWalletTransaction(
    insertTransaction: InsertWalletTransaction
  ): Promise<WalletTransaction> {
    const [transaction] = await db
      .insert(walletTransactions)
      .values(insertTransaction)
      .returning();
    
    // Update user balance
    await this.updateUserWallet(
      insertTransaction.userId,
      insertTransaction.amount
    );
    
    return transaction;
  }

  async getWalletTransactions(userId: number): Promise<WalletTransaction[]> {
    return db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.timestamp));
  }
  
  async getPendingWithdrawals(): Promise<WalletTransaction[]> {
    return db
      .select()
      .from(walletTransactions)
      .where(and(
        eq(walletTransactions.type, "withdrawal"),
        eq(walletTransactions.status, "pending")
      ))
      .orderBy(asc(walletTransactions.timestamp));
  }
  
  async approveWithdrawal(transactionId: number): Promise<WalletTransaction> {
    const [transaction] = await db
      .update(walletTransactions)
      .set({ status: "completed" })
      .where(eq(walletTransactions.id, transactionId))
      .returning();
    return transaction;
  }
  
  async rejectWithdrawal(transactionId: number, reason: string): Promise<WalletTransaction> {
    // Get the transaction first to get the amount and user ID
    const [transaction] = await db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.id, transactionId));
    
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    
    // Refund the user
    await this.updateUserWallet(transaction.userId, Math.abs(transaction.amount));
    
    // Update the transaction status
    const [updatedTransaction] = await db
      .update(walletTransactions)
      .set({ 
        status: "rejected",
        description: `${transaction.description} - Rejected: ${reason}`
      })
      .where(eq(walletTransactions.id, transactionId))
      .returning();
    
    return updatedTransaction;
  }
  
  async createAuditLog(log: InsertAdminAuditLog): Promise<AdminAuditLog> {
    const [auditLog] = await db.insert(adminAuditLogs).values(log).returning();
    return auditLog;
  }
  
  async getAuditLogs(adminId?: number, limit?: number, offset?: number): Promise<AdminAuditLog[]> {
    let conditions = [];
    
    if (adminId !== undefined) {
      conditions.push(eq(adminAuditLogs.adminId, adminId));
    }
    
    let query;
    if (conditions.length > 0) {
      query = db.select()
        .from(adminAuditLogs)
        .where(and(...conditions))
        .orderBy(desc(adminAuditLogs.timestamp));
    } else {
      query = db.select()
        .from(adminAuditLogs)
        .orderBy(desc(adminAuditLogs.timestamp));
    }
    
    const logs = await query;
    
    if (offset !== undefined || limit !== undefined) {
      const startIndex = offset !== undefined ? offset : 0;
      const endIndex = limit !== undefined ? startIndex + limit : undefined;
      return logs.slice(startIndex, endIndex);
    }
    
    return logs;
  }
  
  async getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    pendingWithdrawals: number;
    ongoingTournaments: number;
    totalTransactions: number;
  }> {
    // Get total users
    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    
    // Get active users (users who logged in the last 30 days)
    const [activeUserCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.lastLogin} > NOW() - INTERVAL '30 days'`);
    
    // Get total revenue (entry fees)
    const [revenueResult] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(amount), 0)` 
      })
      .from(walletTransactions)
      .where(eq(walletTransactions.type, "entry_fee"));
    
    // Get pending withdrawals count
    const [pendingWithdrawalsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(walletTransactions)
      .where(and(
        eq(walletTransactions.type, "withdrawal"),
        eq(walletTransactions.status, "pending")
      ));
    
    // Get ongoing tournaments count
    const [ongoingTournamentsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(eq(tournaments.status, "ongoing"));
    
    // Get total transactions count
    const [transactionsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(walletTransactions);
    
    return {
      totalUsers: userCount.count,
      activeUsers: activeUserCount.count,
      totalRevenue: revenueResult.total,
      pendingWithdrawals: pendingWithdrawalsCount.count,
      ongoingTournaments: ongoingTournamentsCount.count,
      totalTransactions: transactionsCount.count
    };
  }
}

// Use the database storage implementation 
export const storage = new DatabaseStorage();
