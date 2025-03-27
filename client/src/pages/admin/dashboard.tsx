import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Trophy,
  Wallet,
  DollarSign,
  Clock,
  Shield,
  AlertTriangle,
  EyeIcon,
  BarChart3,
  ArrowRightCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  // In a real app, this would fetch from the API
  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    // Mock data
    initialData: {
      totalUsers: 8765,
      activeUsers: 3250,
      userGrowth: 12.8,
      totalRevenue: 1425000,
      revenueGrowth: 8.2,
      pendingWithdrawals: 85000,
      pendingWithdrawalsCount: 28,
      ongoingTournaments: 15,
      upcomingTournaments: 8,
      totalTransactions: 3560,
      newUsers: 120,
      suspiciousActivities: 8
    }
  });
  
  const { data: recentTransactions } = useQuery({
    queryKey: ['/api/admin/recent-transactions'],
    // Mock data
    initialData: [
      {
        id: 1,
        userId: 1,
        type: 'withdrawal',
        amount: 2500,
        status: 'pending',
        timestamp: new Date("2023-06-10T15:23:11"),
        user: {
          id: 1,
          username: "akshay_pro",
          displayName: "Akshay Kumar"
        }
      },
      {
        id: 2,
        userId: 2,
        type: 'deposit',
        amount: 1000,
        status: 'completed',
        timestamp: new Date("2023-06-10T15:10:45"),
        user: {
          id: 2,
          username: "riya_gaming",
          displayName: "Riya Singh"
        }
      },
      {
        id: 3,
        userId: 3,
        type: 'prize',
        amount: 3500,
        status: 'completed',
        timestamp: new Date("2023-06-10T14:45:22"),
        user: {
          id: 3,
          username: "vikram_beast",
          displayName: "Vikram Kohli"
        }
      },
      {
        id: 4,
        userId: 4,
        type: 'deposit',
        amount: 500,
        status: 'completed',
        timestamp: new Date("2023-06-10T14:30:10"),
        user: {
          id: 4,
          username: "priya_queen",
          displayName: "Priya Sharma"
        }
      }
    ]
  });
  
  const { data: recentUsers } = useQuery({
    queryKey: ['/api/admin/recent-users'],
    // Mock data
    initialData: [
      {
        id: 1,
        username: "gamer_2023",
        displayName: "Rajesh Kumar",
        profileImage: "https://randomuser.me/api/portraits/men/64.jpg",
        createdAt: new Date("2023-06-10T16:30:00"),
        gamesPlayed: 0,
        walletBalance: 0
      },
      {
        id: 2,
        username: "pro_striker",
        displayName: "Ankit Sharma",
        profileImage: "https://randomuser.me/api/portraits/men/65.jpg",
        createdAt: new Date("2023-06-10T16:15:00"),
        gamesPlayed: 2,
        walletBalance: 200
      },
      {
        id: 3,
        username: "fire_queen",
        displayName: "Pooja Patel",
        profileImage: "https://randomuser.me/api/portraits/women/64.jpg",
        createdAt: new Date("2023-06-10T15:55:00"),
        gamesPlayed: 0,
        walletBalance: 500
      },
      {
        id: 4,
        username: "game_master",
        displayName: "Rahul Verma",
        profileImage: "https://randomuser.me/api/portraits/men/66.jpg",
        createdAt: new Date("2023-06-10T15:40:00"),
        gamesPlayed: 3,
        walletBalance: 350
      }
    ]
  });
  
  const { data: activeTournaments } = useQuery({
    queryKey: ['/api/admin/active-tournaments'],
    // Mock data
    initialData: [
      {
        id: 1,
        name: "Free Fire Pro League",
        participants: 82,
        maxParticipants: 100,
        prizePool: 25000,
        status: "live",
        startTime: new Date("2023-06-10T14:00:00"),
        endTime: new Date("2023-06-10T18:00:00"),
        gameImage: "https://i.imgur.com/JyAzM6h.png"
      },
      {
        id: 2,
        name: "PUBG Mobile Weekly Cup",
        participants: 64,
        maxParticipants: 64,
        prizePool: 15000,
        status: "live",
        startTime: new Date("2023-06-10T15:30:00"),
        endTime: new Date("2023-06-10T19:30:00"),
        gameImage: "https://i.imgur.com/DwYpM3E.png"
      },
      {
        id: 3,
        name: "BGMI Masters",
        participants: 45,
        maxParticipants: 100,
        prizePool: 50000,
        status: "registration",
        startTime: new Date("2023-06-11T12:00:00"),
        endTime: new Date("2023-06-11T16:00:00"),
        gameImage: "https://i.imgur.com/T0YyvNM.png"
      }
    ]
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of platform performance and metrics</p>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-green-500 flex items-center mr-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> {dashboardStats.userGrowth}%
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-green-500 flex items-center mr-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> {dashboardStats.revenueGrowth}%
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardStats.pendingWithdrawals)}</div>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-yellow-500 mr-1">
                  {dashboardStats.pendingWithdrawalsCount} requests
                </span>
                <span className="text-gray-500">awaiting approval</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Tournaments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.ongoingTournaments}</div>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-blue-500 mr-1">
                  {dashboardStats.upcomingTournaments} upcoming
                </span>
                <span className="text-gray-500">tournaments scheduled</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{dashboardStats.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Active Users Today</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{dashboardStats.totalTransactions.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Transactions</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{dashboardStats.suspiciousActivities}</div>
                <div className="text-sm text-gray-500">Suspicious Activities</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Link href="/admin/payment-management">
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-gray-100">
                      View All <ArrowRightCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Latest financial activities on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-secondary/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'deposit' 
                              ? 'bg-green-500/20 text-green-500' 
                              : transaction.type === 'withdrawal' 
                                ? 'bg-red-500/20 text-red-500' 
                                : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            {transaction.type === 'deposit' 
                              ? <ArrowUpRight className="h-5 w-5" /> 
                              : transaction.type === 'withdrawal' 
                                ? <ArrowUpRight className="h-5 w-5 transform rotate-180" /> 
                                : <Trophy className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-semibold">{transaction.user.displayName}</div>
                            <div className="text-xs text-gray-500">
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            transaction.type === 'deposit' || transaction.type === 'prize' 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'prize' ? '+ ' : '- '}
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Active Tournaments */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Active Tournaments</CardTitle>
                  <Link href="/admin/tournaments">
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-gray-100">
                      View All <ArrowRightCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Currently running and upcoming tournaments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeTournaments.map((tournament) => (
                    <div 
                      key={tournament.id} 
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-secondary/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-800">
                          <img 
                            src={tournament.gameImage} 
                            alt={tournament.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{tournament.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatTime(tournament.startTime)} - {formatTime(tournament.endTime)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {tournament.participants}/{tournament.maxParticipants}
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          {tournament.status === 'live' ? (
                            <Badge className="bg-red-500">Live</Badge>
                          ) : (
                            <Badge className="bg-blue-500">Registration</Badge>
                          )}
                          <Badge variant="outline" className="border-primary text-primary">
                            {formatCurrency(tournament.prizePool)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Side Content */}
          <div className="space-y-6">
            {/* Recent Users */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>New Users</CardTitle>
                  <Link href="/admin/user-management">
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-gray-100">
                      View All <ArrowRightCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Recently registered players</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-secondary/30"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profileImage || ""} alt={user.displayName} />
                            <AvatarFallback>{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{user.displayName}</div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            Joined {new Date(user.createdAt).toLocaleTimeString()}
                          </div>
                          <div className="text-xs">
                            Games: {user.gamesPlayed} | Balance: {formatCurrency(user.walletBalance)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Action Items */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-semibold">Withdrawal Requests</div>
                      <div className="text-sm">{dashboardStats.pendingWithdrawalsCount} pending approvals</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link href="/admin/payment-management">
                      <Button variant="outline" size="sm" className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20">
                        Process Withdrawals
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-semibold">KYC Verifications</div>
                      <div className="text-sm">12 users pending verification</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link href="/admin/user-management">
                      <Button variant="outline" size="sm" className="w-full border-blue-500/50 text-blue-500 hover:bg-blue-500/20">
                        Review KYC Documents
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <div className="font-semibold">Suspicious Activities</div>
                      <div className="text-sm">{dashboardStats.suspiciousActivities} cases need investigation</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link href="/admin/anti-cheat">
                      <Button variant="outline" size="sm" className="w-full border-red-500/50 text-red-500 hover:bg-red-500/20">
                        Investigate Reports
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}