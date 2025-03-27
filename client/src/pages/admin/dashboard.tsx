import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RootLayout from "@/layouts/RootLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
  TrendingUp,
  Zap,
  Award,
  Calendar,
  Shield,
  Bell,
  CheckCircle,
  Search,
  XCircle,
  Trash,
  Filter,
  MoreVertical,
  Edit,
  Ban,
  UserX,
  UserCheck,
  RefreshCw,
  Wallet,
  Clock,
  Check,
  X,
  AlertTriangle,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard-stats');
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json();
    },
  });

  // Fetch recent transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/admin/recent-transactions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/recent-transactions');
      if (!response.ok) throw new Error('Failed to fetch recent transactions');
      return response.json();
    },
  });

  // Fetch pending withdrawals
  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['/api/admin/pending-withdrawals'],
    queryFn: async () => {
      const response = await fetch('/api/admin/pending-withdrawals');
      if (!response.ok) throw new Error('Failed to fetch pending withdrawals');
      return response.json();
    },
  });

  // Fetch active tournaments
  const { data: activeTournaments, isLoading: tournamentsLoading } = useQuery({
    queryKey: ['/api/admin/active-tournaments'],
    queryFn: async () => {
      const response = await fetch('/api/admin/active-tournaments');
      if (!response.ok) throw new Error('Failed to fetch active tournaments');
      return response.json();
    },
  });

  // Fetch audit logs
  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['/api/admin/audit-logs'],
    queryFn: async () => {
      const response = await fetch('/api/admin/audit-logs');
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
  });

  return (
    <RootLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => navigate('/admin/tournaments/create')}>
              Create Tournament
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Dashboard Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : stats?.totalUsers || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active: {statsLoading ? "..." : stats?.activeUsers || 0}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{statsLoading ? "..." : stats?.totalRevenue || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Transactions: {statsLoading ? "..." : stats?.totalTransactions || 0}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Tournaments
                  </CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : stats?.ongoingTournaments || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active matches ongoing
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Withdrawals
                  </CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : stats?.pendingWithdrawals || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity & Pending Withdrawals */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Last 10 transactions on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="text-center py-4">Loading transactions...</div>
                  ) : transactions && transactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.userId}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell>₹{transaction.amount}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  transaction.status === "completed" ? "default" : 
                                  transaction.status === "pending" ? "outline" : 
                                  "destructive"
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">No recent transactions</div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Pending Withdrawals</CardTitle>
                  <CardDescription>
                    Withdrawal requests requiring approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {withdrawalsLoading ? (
                    <div className="text-center py-4">Loading withdrawals...</div>
                  ) : withdrawals && withdrawals.length > 0 ? (
                    <div className="space-y-4">
                      {withdrawals.map((withdrawal) => (
                        <div key={withdrawal.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">User #{withdrawal.userId}</p>
                            <p className="text-sm text-muted-foreground">₹{withdrawal.amount}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Reject</Button>
                            <Button size="sm">Approve</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">No pending withdrawals</div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Active Tournaments */}
            <Card>
              <CardHeader>
                <CardTitle>Active Tournaments</CardTitle>
                <CardDescription>
                  Currently ongoing tournaments on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tournamentsLoading ? (
                  <div className="text-center py-4">Loading tournaments...</div>
                ) : activeTournaments && activeTournaments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tournament</TableHead>
                        <TableHead>Game</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Players</TableHead>
                        <TableHead>Prize Pool</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeTournaments.map((tournament) => (
                        <TableRow key={tournament.id}>
                          <TableCell className="font-medium">{tournament.name}</TableCell>
                          <TableCell>{tournament.gameName}</TableCell>
                          <TableCell>
                            <Badge>{tournament.status}</Badge>
                          </TableCell>
                          <TableCell>{tournament.currentPlayers}/{tournament.maxPlayers}</TableCell>
                          <TableCell>₹{tournament.prizePool}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
                            >
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4">No active tournaments</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all users on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">User Management Module</h3>
                  <p className="text-muted-foreground mt-2">User management features will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tournaments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Management</CardTitle>
                <CardDescription>
                  Create, edit and manage tournaments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Tournament Management Module</h3>
                  <p className="text-muted-foreground mt-2">Tournament management features will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>
                  View and manage all payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Payment Management Module</h3>
                  <p className="text-muted-foreground mt-2">Payment management features will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>
                  View detailed analytics and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Analytics Module</h3>
                  <p className="text-muted-foreground mt-2">Analytics features will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Audit Logs</CardTitle>
                <CardDescription>
                  Track all administrative actions on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="text-center py-4">Loading audit logs...</div>
                ) : auditLogs && auditLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.adminId}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4">No audit logs found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
}