import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, insertLeaderboardSchema, insertMatchSchema, insertTeamMemberSchema, insertTeamSchema, insertTournamentRegistrationSchema, insertTournamentSchema, insertUserSchema, insertWalletTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const API_PREFIX = "/api";
  
  // User routes
  app.get(`${API_PREFIX}/users/:id`, async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.post(`${API_PREFIX}/users`, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Game routes
  app.get(`${API_PREFIX}/games`, async (req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });
  
  app.get(`${API_PREFIX}/games/featured`, async (req, res) => {
    const featuredGames = await storage.getFeaturedGames();
    res.json(featuredGames);
  });
  
  app.get(`${API_PREFIX}/games/:id`, async (req, res) => {
    const gameId = parseInt(req.params.id);
    const game = await storage.getGame(gameId);
    
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    res.json(game);
  });
  
  app.post(`${API_PREFIX}/games`, async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const newGame = await storage.createGame(gameData);
      res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create game" });
    }
  });
  
  // Team routes
  app.get(`${API_PREFIX}/teams`, async (req, res) => {
    const teams = await storage.getTeams();
    res.json(teams);
  });
  
  app.get(`${API_PREFIX}/teams/top`, async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const topTeams = await storage.getTopTeams(limit);
    res.json(topTeams);
  });
  
  app.get(`${API_PREFIX}/teams/user/:userId`, async (req, res) => {
    const userId = parseInt(req.params.userId);
    const teams = await storage.getTeamsByUserId(userId);
    res.json(teams);
  });
  
  app.get(`${API_PREFIX}/teams/:id`, async (req, res) => {
    const teamId = parseInt(req.params.id);
    const team = await storage.getTeam(teamId);
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    
    const members = await storage.getTeamMembers(teamId);
    
    res.json({ ...team, members });
  });
  
  app.post(`${API_PREFIX}/teams`, async (req, res) => {
    try {
      const teamData = insertTeamSchema.parse(req.body);
      const newTeam = await storage.createTeam(teamData);
      res.status(201).json(newTeam);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create team" });
    }
  });
  
  app.post(`${API_PREFIX}/teams/:id/members`, async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const team = await storage.getTeam(teamId);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      const memberData = insertTeamMemberSchema.parse({
        ...req.body,
        teamId
      });
      
      const newMember = await storage.addTeamMember(memberData);
      res.status(201).json(newMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid member data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add team member" });
    }
  });
  
  // Tournament routes
  app.get(`${API_PREFIX}/tournaments`, async (req, res) => {
    const tournaments = await storage.getTournaments();
    res.json(tournaments);
  });
  
  app.get(`${API_PREFIX}/tournaments/upcoming`, async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const upcomingTournaments = await storage.getUpcomingTournaments(limit);
    res.json(upcomingTournaments);
  });
  
  app.get(`${API_PREFIX}/tournaments/featured`, async (req, res) => {
    const featuredTournament = await storage.getFeaturedTournament();
    
    if (!featuredTournament) {
      return res.status(404).json({ message: "No featured tournament found" });
    }
    
    const matches = await storage.getMatches(featuredTournament.id);
    
    res.json({ ...featuredTournament, matches });
  });
  
  app.get(`${API_PREFIX}/tournaments/game/:gameId`, async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    const tournaments = await storage.getTournamentsByGameId(gameId);
    res.json(tournaments);
  });
  
  app.get(`${API_PREFIX}/tournaments/:id`, async (req, res) => {
    const tournamentId = parseInt(req.params.id);
    const tournament = await storage.getTournament(tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    
    const registrations = await storage.getTournamentRegistrations(tournamentId);
    const matches = await storage.getMatches(tournamentId);
    
    res.json({ ...tournament, registrations, matches });
  });
  
  app.post(`${API_PREFIX}/tournaments`, async (req, res) => {
    try {
      const tournamentData = insertTournamentSchema.parse(req.body);
      const newTournament = await storage.createTournament(tournamentData);
      res.status(201).json(newTournament);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tournament data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });
  
  app.post(`${API_PREFIX}/tournaments/:id/register`, async (req, res) => {
    try {
      const tournamentId = parseInt(req.params.id);
      const tournament = await storage.getTournament(tournamentId);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      if (tournament.currentPlayers >= tournament.maxPlayers) {
        return res.status(400).json({ message: "Tournament is full" });
      }
      
      const registrationData = insertTournamentRegistrationSchema.parse({
        ...req.body,
        tournamentId
      });
      
      const newRegistration = await storage.registerForTournament(registrationData);
      res.status(201).json(newRegistration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register for tournament" });
    }
  });
  
  // Match routes
  app.get(`${API_PREFIX}/tournaments/:id/matches`, async (req, res) => {
    const tournamentId = parseInt(req.params.id);
    const matches = await storage.getMatches(tournamentId);
    res.json(matches);
  });
  
  app.post(`${API_PREFIX}/tournaments/:id/matches`, async (req, res) => {
    try {
      const tournamentId = parseInt(req.params.id);
      const tournament = await storage.getTournament(tournamentId);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      const matchData = insertMatchSchema.parse({
        ...req.body,
        tournamentId
      });
      
      const newMatch = await storage.createMatch(matchData);
      res.status(201).json(newMatch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid match data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create match" });
    }
  });
  
  app.put(`${API_PREFIX}/matches/:id/result`, async (req, res) => {
    try {
      const matchId = parseInt(req.params.id);
      const { winnerId, team1Score, team2Score } = req.body;
      
      const updatedMatch = await storage.updateMatchResult(
        matchId,
        parseInt(winnerId),
        parseInt(team1Score),
        parseInt(team2Score)
      );
      
      res.json(updatedMatch);
    } catch (error) {
      res.status(500).json({ message: "Failed to update match result" });
    }
  });
  
  // Leaderboard routes
  app.get(`${API_PREFIX}/leaderboard`, async (req, res) => {
    const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
    const period = req.query.period as string || "weekly";
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const leaderboardEntries = await storage.getLeaderboardEntries(gameId, period, limit);
    
    // Populate user data
    const entriesWithUserData = await Promise.all(
      leaderboardEntries.map(async (entry) => {
        const user = await storage.getUser(entry.userId!);
        return {
          ...entry,
          user: user ? {
            username: user.username,
            displayName: user.displayName,
            profileImage: user.profileImage
          } : null
        };
      })
    );
    
    res.json(entriesWithUserData);
  });
  
  app.post(`${API_PREFIX}/leaderboard`, async (req, res) => {
    try {
      const entryData = insertLeaderboardSchema.parse(req.body);
      const newEntry = await storage.updateLeaderboardEntry(entryData);
      res.status(201).json(newEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid leaderboard entry data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update leaderboard entry" });
    }
  });
  
  // Wallet routes
  app.get(`${API_PREFIX}/users/:userId/wallet`, async (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const transactions = await storage.getWalletTransactions(userId);
    
    res.json({
      balance: user.walletBalance,
      transactions
    });
  });
  
  app.post(`${API_PREFIX}/users/:userId/wallet/transactions`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const transactionData = insertWalletTransactionSchema.parse({
        ...req.body,
        userId
      });
      
      const newTransaction = await storage.createWalletTransaction(transactionData);
      
      // Get updated user balance
      const updatedUser = await storage.getUser(userId);
      
      res.status(201).json({
        transaction: newTransaction,
        newBalance: updatedUser?.walletBalance
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create wallet transaction" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
