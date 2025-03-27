import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const gameModeEnum = pgEnum('game_mode', ['solo', 'duo', 'squad', 'custom']);
export const tournamentTypeEnum = pgEnum('tournament_type', ['free', 'paid', 'sponsored', 'seasonal']);

// Users table
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'superadmin']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  walletBalance: integer("wallet_balance").default(0).notNull(),
  profileImage: text("profile_image"),
  role: userRoleEnum("role").default("user").notNull(),
  kycVerified: boolean("kyc_verified").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Games table
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"),
  playerCount: integer("player_count").default(0).notNull(),
  tournamentCount: integer("tournament_count").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  badge: text("badge"),
});

// Teams table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logoUrl: text("logo_url"),
  description: text("description"),
  captainId: integer("captain_id").notNull().references(() => users.id),
  wins: integer("wins").default(0).notNull(),
  totalEarnings: integer("total_earnings").default(0).notNull(),
  memberCount: integer("member_count").default(1).notNull(),
  badge: text("badge"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => teams.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Tournaments table
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gameId: integer("game_id").notNull().references(() => games.id),
  description: text("description"),
  imageUrl: text("image_url"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  entryFee: integer("entry_fee").default(0).notNull(),
  prizePool: integer("prize_pool").notNull(),
  maxPlayers: integer("max_players").notNull(),
  currentPlayers: integer("current_players").default(0).notNull(),
  status: text("status").default("upcoming").notNull(),
  gameMode: gameModeEnum("game_mode").notNull(),
  tournamentType: tournamentTypeEnum("tournament_type").notNull(),
  featured: boolean("featured").default(false).notNull(),
  winnerTeamId: integer("winner_team_id").references(() => teams.id),
  winnerUserId: integer("winner_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tournament registrations table
export const tournamentRegistrations = pgTable("tournament_registrations", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull().references(() => tournaments.id),
  userId: integer("user_id").notNull().references(() => users.id),
  teamId: integer("team_id").references(() => teams.id),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  status: text("status").default("confirmed").notNull(),
});

// Tournament matches table
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull().references(() => tournaments.id),
  round: integer("round").notNull(),
  matchNumber: integer("match_number").notNull(),
  team1Id: integer("team1_id").references(() => teams.id),
  team2Id: integer("team2_id").references(() => teams.id),
  player1Id: integer("player1_id").references(() => users.id),
  player2Id: integer("player2_id").references(() => users.id),
  winnerId: integer("winner_id").references(() => teams.id),
  winnerPlayerId: integer("winner_player_id").references(() => users.id),
  team1Score: integer("team1_score"),
  team2Score: integer("team2_score"),
  status: text("status").default("scheduled").notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
});

// Leaderboard entries
export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  teamId: integer("team_id").references(() => teams.id),
  gameId: integer("game_id").references(() => games.id),
  points: integer("points").default(0).notNull(),
  wins: integer("wins").default(0).notNull(),
  totalMatches: integer("total_matches").default(0).notNull(),
  kdRatio: text("kd_ratio").default("0").notNull(),
  earnings: integer("earnings").default(0).notNull(),
  rank: integer("rank"),
  period: text("period").default("all-time").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Wallet transactions
export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  status: text("status").default("completed").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Admin audit logs
export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(), // users, tournaments, payments, etc.
  entityId: integer("entity_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true, joinedAt: true });
export const insertTournamentSchema = createInsertSchema(tournaments).omit({ id: true, createdAt: true });
export const insertTournamentRegistrationSchema = createInsertSchema(tournamentRegistrations).omit({ id: true, registeredAt: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true });
export const insertLeaderboardSchema = createInsertSchema(leaderboard).omit({ id: true, updatedAt: true });
export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({ id: true, timestamp: true });
export const insertAdminAuditLogSchema = createInsertSchema(adminAuditLogs).omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;

export type TournamentRegistration = typeof tournamentRegistrations.$inferSelect;
export type InsertTournamentRegistration = z.infer<typeof insertTournamentRegistrationSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardSchema>;

export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;

export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
export type InsertAdminAuditLog = z.infer<typeof insertAdminAuditLogSchema>;
