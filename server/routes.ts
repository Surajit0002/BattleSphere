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
  
  // Get current user profile
  app.get(`${API_PREFIX}/user/profile`, async (req, res) => {
    // Mock current user - in a real app this would come from a session
    const userId = 1; // Default user ID for the demo
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Get current user's teams
  app.get(`${API_PREFIX}/teams/user`, async (req, res) => {
    // Mock current user - in a real app this would come from a session
    const userId = 1; // Default user ID for the demo
    const teams = await storage.getTeamsByUserId(userId);
    res.json(teams);
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
  
  // Get teams registered for a tournament
  app.get(`${API_PREFIX}/tournaments/:id/teams`, async (req, res) => {
    const tournamentId = parseInt(req.params.id);
    const registrations = await storage.getTournamentRegistrations(tournamentId);
    
    // Get unique team IDs (filter out null teamIds)
    const teamIds = registrations
      .filter(reg => reg.teamId !== null)
      .map(reg => reg.teamId as number);
    
    // For tournaments with team registrations, get team details
    if (teamIds.length > 0) {
      const teams = await Promise.all(
        teamIds.map(teamId => storage.getTeam(teamId))
      );
      res.json(teams.filter(Boolean)); // Filter out any undefined teams
    } else {
      // For solo tournaments, get user details and map to a team-like structure
      const userIds = registrations.map(reg => reg.userId);
      const users = await Promise.all(
        userIds.map(userId => storage.getUser(userId))
      );
      
      // Map users to team-like structure
      const soloTeams = users
        .filter(Boolean)
        .map(user => ({
          id: user!.id,
          name: user!.displayName,
          logoUrl: user!.profileImage,
          description: null,
          captainId: user!.id,
          memberCount: 1,
          wins: 0,
          totalEarnings: 0,
          badge: null,
          createdAt: user!.createdAt
        }));
      
      res.json(soloTeams);
    }
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
  
  // Admin dashboard routes
  app.get(`${API_PREFIX}/admin/dashboard-stats`, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });
  
  app.get(`${API_PREFIX}/admin/recent-transactions`, async (req, res) => {
    try {
      // Get all users to have user information available
      const users = await Promise.all(
        (await storage.getUsers(100)).map(async user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        })
      );
      
      // Get transactions from all users (limited to the most recent 20)
      const transactions = [];
      for (const user of users.slice(0, 10)) {
        const userTransactions = await storage.getWalletTransactions(user.id);
        transactions.push(...userTransactions.map(tx => ({
          ...tx,
          user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName
          }
        })));
      }
      
      // Sort by timestamp descending and limit to 20
      const sortedTransactions = transactions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20);
      
      res.json(sortedTransactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent transactions" });
    }
  });
  
  app.get(`${API_PREFIX}/admin/pending-withdrawals`, async (req, res) => {
    try {
      const withdrawals = await storage.getPendingWithdrawals();
      
      // Get user details for each withdrawal
      const withdrawalsWithUserData = await Promise.all(
        withdrawals.map(async withdrawal => {
          const user = await storage.getUser(withdrawal.userId);
          return {
            ...withdrawal,
            user: user ? {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
              profileImage: user.profileImage,
              kycVerified: user.kycVerified
            } : null
          };
        })
      );
      
      res.json(withdrawalsWithUserData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending withdrawals" });
    }
  });
  
  app.put(`${API_PREFIX}/admin/withdrawals/:id/approve`, async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);
      const updatedTransaction = await storage.approveWithdrawal(transactionId);
      
      // Create audit log for this action
      await storage.createAuditLog({
        adminId: 1, // In a real app, this would come from the admin session
        action: "approve_withdrawal",
        entityType: "wallet_transaction",
        entityId: transactionId,
        details: `Approved withdrawal transaction #${transactionId} for ₹${updatedTransaction.amount}`
      });
      
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve withdrawal" });
    }
  });
  
  app.put(`${API_PREFIX}/admin/withdrawals/:id/reject`, async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }
      
      const updatedTransaction = await storage.rejectWithdrawal(transactionId, reason);
      
      // Create audit log for this action
      await storage.createAuditLog({
        adminId: 1, // In a real app, this would come from the admin session
        action: "reject_withdrawal",
        entityType: "wallet_transaction",
        entityId: transactionId,
        details: `Rejected withdrawal transaction #${transactionId} for ₹${updatedTransaction.amount} with reason: ${reason}`
      });
      
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject withdrawal" });
    }
  });
  
  app.get(`${API_PREFIX}/admin/active-tournaments`, async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      
      // Filter for active/ongoing tournaments
      const activeTournaments = tournaments.filter(tournament => 
        tournament.status === 'ongoing' || 
        (new Date(tournament.startDate) <= new Date() && 
         (!tournament.endDate || new Date(tournament.endDate) >= new Date()))
      );
      
      // For each tournament, get registration count
      const tournamentsWithDetails = await Promise.all(
        activeTournaments.slice(0, 10).map(async tournament => {
          const registrations = await storage.getTournamentRegistrations(tournament.id);
          const game = await storage.getGame(tournament.gameId);
          
          return {
            ...tournament,
            registrationsCount: registrations.length,
            gameName: game?.name || 'Unknown Game'
          };
        })
      );
      
      res.json(tournamentsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active tournaments" });
    }
  });
  
  app.get(`${API_PREFIX}/admin/users`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const users = await storage.getUsers(limit, offset);
      const totalUsers = await storage.getUsersCount();
      
      // Remove password from user data
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json({
        users: usersWithoutPasswords,
        total: totalUsers,
        limit,
        offset
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.put(`${API_PREFIX}/admin/users/:id/ban`, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { reason } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, { isBanned: true });
      
      // Create audit log for this action
      await storage.createAuditLog({
        adminId: 1, // In a real app, this would come from the admin session
        action: "ban_user",
        details: `Banned user ${updatedUser.username} (ID: ${userId}) with reason: ${reason || "No reason provided"}`
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to ban user" });
    }
  });
  
  app.put(`${API_PREFIX}/admin/users/:id/unban`, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, { isBanned: false });
      
      // Create audit log for this action
      await storage.createAuditLog({
        adminId: 1, // In a real app, this would come from the admin session
        action: "unban_user",
        details: `Unbanned user ${updatedUser.username} (ID: ${userId})`
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to unban user" });
    }
  });
  
  app.put(`${API_PREFIX}/admin/users/:id/verify-kyc`, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, { kycVerified: true });
      
      // Create audit log for this action
      await storage.createAuditLog({
        adminId: 1, // In a real app, this would come from the admin session
        action: "verify_kyc",
        details: `Verified KYC for user ${updatedUser.username} (ID: ${userId})`
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify KYC" });
    }
  });
  
  app.get(`${API_PREFIX}/admin/audit-logs`, async (req, res) => {
    try {
      const adminId = req.query.adminId ? parseInt(req.query.adminId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const logs = await storage.getAuditLogs(adminId, limit, offset);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });
  
  // Create an audit log
  app.post(`${API_PREFIX}/admin/audit-logs`, async (req, res) => {
    try {
      const { adminId, action, details } = req.body;
      
      if (!adminId || !action) {
        return res.status(400).json({ message: "Admin ID and action are required" });
      }
      
      const newLog = await storage.createAuditLog({
        adminId,
        action,
        details: details || ""
      });
      
      res.status(201).json(newLog);
    } catch (error) {
      res.status(500).json({ message: "Failed to create audit log" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
