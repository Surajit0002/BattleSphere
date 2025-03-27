import { db } from "./db";
import {
  users, games, teams, teamMembers, tournaments, matches, leaderboard,
  type InsertUser, type InsertGame, type InsertTeam, type InsertTeamMember,
  type InsertTournament, type InsertMatch, type InsertLeaderboardEntry, gameModeEnum, tournamentTypeEnum
} from "@shared/schema";

async function main() {
  // Clear existing data (for development only)
  await db.delete(matches);
  await db.delete(leaderboard);
  await db.delete(teamMembers);
  await db.delete(tournaments);
  await db.delete(teams);
  await db.delete(games);
  await db.delete(users);
  
  console.log("Creating users...");
  // Create some users
  const users_data: InsertUser[] = [
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
  
  const createdUsers = await db.insert(users).values(users_data).returning({ id: users.id });
  const userIds = createdUsers.map(user => user.id);
  
  console.log("Creating games...");
  // Initialize games
  const games_data: InsertGame[] = [
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
  
  const createdGames = await db.insert(games).values(games_data).returning({ id: games.id });
  const gameIds = createdGames.map(game => game.id);
  
  console.log("Creating teams...");
  // Create teams
  const teams_data: InsertTeam[] = [
    {
      name: "Team Golf",
      description: "Top ranked squad with multiple tournament wins",
      captainId: userIds[0], // GhostSniper
      wins: 28,
      totalEarnings: 45500,
      memberCount: 4,
      badge: "PRO"
    },
    {
      name: "Team Alpha",
      description: "Rising stars in the competitive scene",
      captainId: userIds[1], // NinjaWarrior
      wins: 25,
      totalEarnings: 38200,
      memberCount: 4,
      badge: "ELITE"
    },
    {
      name: "Team Delta",
      description: "Tactical experts specializing in objective play",
      captainId: userIds[2], // StealthQueen
      wins: 22,
      totalEarnings: 32750,
      memberCount: 4
    },
    {
      name: "Team Charlie",
      description: "Veteran team with consistent performance",
      captainId: userIds[3], // ShadowFighter
      wins: 20,
      totalEarnings: 28500,
      memberCount: 4
    },
    {
      name: "Team Foxtrot",
      description: "Aggressive playstyle with high kill counts",
      captainId: userIds[4], // EagleEye
      wins: 18,
      totalEarnings: 25400,
      memberCount: 4
    }
  ];
  
  const createdTeams = await db.insert(teams).values(teams_data).returning({ id: teams.id });
  const teamIds = createdTeams.map(team => team.id);
  
  console.log("Creating team members...");
  // Create team members
  const teamMembers_data: InsertTeamMember[] = teamIds.map((teamId, index) => ({
    teamId,
    userId: userIds[index],
    role: "captain"
  }));
  
  await db.insert(teamMembers).values(teamMembers_data);
  
  console.log("Creating tournaments...");
  // Create tournaments
  const now = new Date();
  const today = new Date();
  const tomorrow = new Date(new Date().setDate(now.getDate() + 1));
  const saturday = new Date(new Date().setDate(now.getDate() + (6 - now.getDay()) % 7));
  const sunday = new Date(new Date().setDate(now.getDate() + (7 - now.getDay()) % 7));
  
  const tournaments_data: InsertTournament[] = [
    {
      name: "Weekly Showdown",
      gameId: gameIds[0], // Free Fire
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
      gameId: gameIds[1], // PUBG Mobile
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
      gameId: gameIds[2], // COD Mobile
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
      gameId: gameIds[3], // BGMI
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
      gameId: gameIds[0], // Free Fire
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
  
  const createdTournaments = await db.insert(tournaments).values(tournaments_data).returning({ id: tournaments.id });
  
  console.log("Creating matches...");
  // Get the featured tournament
  const featuredTournament = createdTournaments.find((_, index) => tournaments_data[index].featured);
  
  if (featuredTournament) {
    // Create matches for the featured tournament
    const matches_data: InsertMatch[] = [
      {
        tournamentId: featuredTournament.id,
        round: 98, // Quarter Finals
        matchNumber: 1,
        team1Id: teamIds[1], // Team Alpha
        team2Id: teamIds[2], // Team Delta
        team1Score: 15,
        team2Score: 8,
        winnerId: teamIds[1], // Team Alpha
        status: "completed",
        scheduledTime: new Date(new Date(now).setDate(now.getDate() - 3))
      },
      {
        tournamentId: featuredTournament.id,
        round: 98, // Quarter Finals
        matchNumber: 2,
        team1Id: teamIds[3], // Team Charlie
        team2Id: teamIds[4], // Team Foxtrot
        team1Score: 12,
        team2Score: 10,
        winnerId: teamIds[3], // Team Charlie
        status: "completed",
        scheduledTime: new Date(new Date(now).setDate(now.getDate() - 3))
      },
      {
        tournamentId: featuredTournament.id,
        round: 99, // Semi Finals
        matchNumber: 1,
        team1Id: teamIds[0], // Team Golf
        team2Id: teamIds[1], // Team Alpha
        status: "scheduled",
        scheduledTime: new Date(new Date(now).setDate(now.getDate() + 1))
      },
      {
        tournamentId: featuredTournament.id,
        round: 99, // Semi Finals
        matchNumber: 2,
        team1Id: teamIds[2], // Team Delta
        team2Id: teamIds[3], // Team Charlie
        status: "scheduled",
        scheduledTime: new Date(new Date(now).setDate(now.getDate() + 1))
      },
      {
        tournamentId: featuredTournament.id,
        round: 100, // Finals
        matchNumber: 1,
        status: "scheduled",
        scheduledTime: new Date(new Date(now).setDate(now.getDate() + 4))
      }
    ];
    
    await db.insert(matches).values(matches_data);
  }
  
  console.log("Creating leaderboard entries...");
  // Create leaderboard entries
  const leaderboard_data: InsertLeaderboardEntry[] = [
    {
      userId: userIds[0], // GhostSniper
      gameId: gameIds[0], // Free Fire
      points: 3200,
      wins: 28,
      totalMatches: 42,
      kdRatio: "4.8",
      earnings: 45500,
      rank: 1,
      period: "weekly"
    },
    {
      userId: userIds[1], // NinjaWarrior
      gameId: gameIds[0], // Free Fire
      points: 2900,
      wins: 25,
      totalMatches: 38,
      kdRatio: "4.5",
      earnings: 38200,
      rank: 2,
      period: "weekly"
    },
    {
      userId: userIds[2], // StealthQueen
      gameId: gameIds[0], // Free Fire
      points: 2750,
      wins: 22,
      totalMatches: 35,
      kdRatio: "4.2",
      earnings: 32750,
      rank: 3,
      period: "weekly"
    },
    {
      userId: userIds[3], // ShadowFighter
      gameId: gameIds[0], // Free Fire
      points: 2600,
      wins: 20,
      totalMatches: 40,
      kdRatio: "3.9",
      earnings: 28500,
      rank: 4,
      period: "weekly"
    },
    {
      userId: userIds[4], // EagleEye
      gameId: gameIds[0], // Free Fire
      points: 2400,
      wins: 18,
      totalMatches: 33,
      kdRatio: "3.8",
      earnings: 25400,
      rank: 5,
      period: "weekly"
    }
  ];
  
  await db.insert(leaderboard).values(leaderboard_data);
  
  console.log("Database seeding complete!");
}

main().catch(e => {
  console.error("Error seeding database:", e);
  process.exit(1);
});