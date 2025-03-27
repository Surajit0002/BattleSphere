import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AdminAuditLog } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Calendar,
  AlertTriangle,
  EyeIcon,
  Clock,
  FileText,
  History,
  User,
  MoreVertical,
  Shield,
  UserCheck,
  Ban,
  DollarSign,
  Trophy,
  Settings,
  Trash2,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Enhanced audit log interface with additional fields
interface EnhancedAuditLog {
  id: number;
  adminId: number;
  action: string;
  entityType: string;
  entityId: number | null;
  details: string | null;
  ipAddress: string | null;
  timestamp: Date;
  // Additional fields for UI display
  adminUsername: string;
  adminDisplayName: string;
  adminProfileImage?: string;
  entityName?: string;
  userAgent?: string;
  isCritical?: boolean;
  actionDetails?: string;
}

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewLogDialogOpen, setViewLogDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<EnhancedAuditLog | null>(null);
  const { toast } = useToast();

  // In a real app, this would use the API to fetch data
  const { data: logs, isLoading } = useQuery<EnhancedAuditLog[]>({
    queryKey: ['/api/admin/audit-logs'],
    // Data would normally come from the API but we're mocking it here
    initialData: [
      {
        id: 1,
        adminId: 1,
        adminUsername: "admin_supreme",
        adminDisplayName: "Super Admin",
        adminProfileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        action: "user_ban",
        actionDetails: {
          userId: 3,
          username: "rahul_sniper",
          reason: "Using unauthorized third-party software",
          duration: "permanent"
        },
        timestamp: new Date("2023-06-10T15:45:00"),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        entityName: "Rahul Verma",
        entityId: 3,
        entityType: "user",
        isCritical: true
      },
      {
        id: 2,
        adminId: 1,
        adminUsername: "admin_supreme",
        adminDisplayName: "Super Admin",
        adminProfileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        action: "tournament_create",
        actionDetails: {
          tournamentId: 12,
          tournamentName: "BGMI Pro League Season 4",
          prizePool: 50000,
          entryFee: 200,
          maxPlayers: 100
        },
        timestamp: new Date("2023-06-10T14:30:00"),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        entityName: "BGMI Pro League Season 4",
        entityId: 12,
        entityType: "tournament",
        isCritical: false
      },
      {
        id: 3,
        adminId: 2,
        adminUsername: "mod_vikram",
        adminDisplayName: "Vikram Moderator",
        adminProfileImage: "https://randomuser.me/api/portraits/men/2.jpg",
        action: "kyc_approve",
        actionDetails: {
          userId: 4,
          username: "priya_queen",
          documentType: "Aadhaar Card",
          documentId: "XXXX-XXXX-5678"
        },
        timestamp: new Date("2023-06-10T12:15:00"),
        ipAddress: "192.168.1.2",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        entityName: "Priya Sharma",
        entityId: 4,
        entityType: "user",
        isCritical: false
      },
      {
        id: 4,
        adminId: 1,
        adminUsername: "admin_supreme",
        adminDisplayName: "Super Admin",
        adminProfileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        action: "withdrawal_approve",
        actionDetails: {
          userId: 1,
          username: "akshay_pro",
          amount: 5000,
          paymentMethod: "Bank Transfer"
        },
        timestamp: new Date("2023-06-10T11:05:00"),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        entityName: "Akshay Kumar",
        entityId: 1,
        entityType: "transaction",
        isCritical: false
      },
      {
        id: 5,
        adminId: 2,
        adminUsername: "mod_vikram",
        adminDisplayName: "Vikram Moderator",
        adminProfileImage: "https://randomuser.me/api/portraits/men/2.jpg",
        action: "match_result_update",
        actionDetails: {
          matchId: 45,
          tournamentId: 8,
          tournamentName: "Free Fire Weekly Cup",
          team1: "Inferno Squad",
          team2: "Phantom Flux",
          team1Score: 25,
          team2Score: 18
        },
        timestamp: new Date("2023-06-09T19:40:00"),
        ipAddress: "192.168.1.2",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        entityName: "Match #45 - Free Fire Weekly Cup",
        entityId: 45,
        entityType: "match",
        isCritical: false
      },
      {
        id: 6,
        adminId: 1,
        adminUsername: "admin_supreme",
        adminDisplayName: "Super Admin",
        adminProfileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        action: "payment_settings_update",
        actionDetails: {
          previousTransactionFee: 8,
          newTransactionFee: 10,
          previousWithdrawalLimit: 10000,
          newWithdrawalLimit: 5000,
          reason: "Compliance with new regulations"
        },
        timestamp: new Date("2023-06-09T16:20:00"),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        entityName: "Platform Payment Settings",
        entityType: "settings",
        isCritical: true
      },
      {
        id: 7,
        adminId: 1,
        adminUsername: "admin_supreme",
        adminDisplayName: "Super Admin",
        adminProfileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        action: "withdrawal_reject",
        actionDetails: {
          userId: 3,
          username: "rahul_sniper",
          amount: 3000,
          paymentMethod: "UPI",
          reason: "KYC documents rejected"
        },
        timestamp: new Date("2023-06-09T14:55:00"),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        entityName: "Rahul Verma",
        entityId: 3,
        entityType: "transaction",
        isCritical: false
      },
      {
        id: 8,
        adminId: 2,
        adminUsername: "mod_vikram",
        adminDisplayName: "Vikram Moderator",
        adminProfileImage: "https://randomuser.me/api/portraits/men/2.jpg",
        action: "kyc_reject",
        actionDetails: {
          userId: 5,
          username: "vikram_beast",
          documentType: "PAN Card",
          documentId: "ABCTY1234D",
          reason: "Document image is blurry and unreadable"
        },
        timestamp: new Date("2023-06-09T11:30:00"),
        ipAddress: "192.168.1.2",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        entityName: "Vikram Kohli",
        entityId: 5,
        entityType: "user",
        isCritical: false
      },
      {
        id: 9,
        adminId: 1,
        adminUsername: "admin_supreme",
        adminDisplayName: "Super Admin",
        adminProfileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        action: "tournament_cancel",
        actionDetails: {
          tournamentId: 10,
          tournamentName: "PUBG Mobile Weekly Challenge",
          reason: "Insufficient registrations",
          registeredPlayers: 12,
          minRequiredPlayers: 32
        },
        timestamp: new Date("2023-06-08T18:15:00"),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        entityName: "PUBG Mobile Weekly Challenge",
        entityId: 10,
        entityType: "tournament",
        isCritical: false
      },
      {
        id: 10,
        adminId: 1,
        adminUsername: "admin_supreme",
        adminDisplayName: "Super Admin",
        adminProfileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        action: "user_warning",
        actionDetails: {
          userId: 2,
          username: "riya_gaming",
          reason: "Inappropriate in-game chat",
          warningLevel: 1
        },
        timestamp: new Date("2023-06-08T15:40:00"),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        entityName: "Riya Singh",
        entityId: 2,
        entityType: "user",
        isCritical: false
      }
    ]
  });

  // Filter logs based on search term and filters
  const filteredLogs = logs?.filter(log => {
    // Filter by search term
    if (searchTerm && 
        !log.adminUsername.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.adminDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(log.entityName && log.entityName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !(JSON.stringify(log.actionDetails).toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filter by action type
    if (actionFilter !== 'all') {
      // Group similar actions
      if (actionFilter === 'user_actions') {
        if (!['user_ban', 'user_warning', 'user_unban', 'kyc_approve', 'kyc_reject'].includes(log.action)) {
          return false;
        }
      } else if (actionFilter === 'tournament_actions') {
        if (!['tournament_create', 'tournament_cancel', 'tournament_update', 'match_result_update'].includes(log.action)) {
          return false;
        }
      } else if (actionFilter === 'payment_actions') {
        if (!['withdrawal_approve', 'withdrawal_reject', 'payment_settings_update'].includes(log.action)) {
          return false;
        }
      } else if (log.action !== actionFilter) {
        return false;
      }
    }
    
    // Filter by admin
    if (adminFilter !== 'all' && log.adminId.toString() !== adminFilter) {
      return false;
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
      const today = new Date();
      const logDate = new Date(log.timestamp);
      
      if (dateFilter === 'today' && 
          !(logDate.getDate() === today.getDate() && 
            logDate.getMonth() === today.getMonth() && 
            logDate.getFullYear() === today.getFullYear())) {
        return false;
      }
      
      if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        if (logDate < weekAgo) return false;
      }
      
      if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        if (logDate < monthAgo) return false;
      }
    }
    
    return true;
  });

  const handleViewLog = (log: EnhancedAuditLog) => {
    setSelectedLog(log);
    setViewLogDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric' 
    }).format(new Date(date));
  };
  
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date));
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'user_ban':
        return <Ban className="h-4 w-4 text-red-500" />;
      case 'user_unban':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'user_warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'kyc_approve':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'kyc_reject':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'tournament_create':
        return <Plus className="h-4 w-4 text-blue-500" />;
      case 'tournament_update':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'tournament_cancel':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'match_result_update':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case 'withdrawal_approve':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'withdrawal_reject':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'payment_settings_update':
        return <Settings className="h-4 w-4 text-purple-500" />;
      default:
        return <History className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'user_ban':
        return 'Banned User';
      case 'user_unban':
        return 'Unbanned User';
      case 'user_warning':
        return 'Warned User';
      case 'kyc_approve':
        return 'Approved KYC';
      case 'kyc_reject':
        return 'Rejected KYC';
      case 'tournament_create':
        return 'Created Tournament';
      case 'tournament_update':
        return 'Updated Tournament';
      case 'tournament_cancel':
        return 'Cancelled Tournament';
      case 'match_result_update':
        return 'Updated Match Result';
      case 'withdrawal_approve':
        return 'Approved Withdrawal';
      case 'withdrawal_reject':
        return 'Rejected Withdrawal';
      case 'payment_settings_update':
        return 'Updated Payment Settings';
      default:
        return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  const getEntityIcon = (entityType?: string) => {
    switch (entityType) {
      case 'user':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'tournament':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case 'match':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case 'transaction':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'settings':
        return <Settings className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-gray-500">
            Track all administrative actions on the platform
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge className="px-3 py-1 bg-primary text-sm">{logs?.length || 0} Total Actions</Badge>
          <Badge className="px-3 py-1 bg-red-600 text-sm">
            {logs?.filter(log => log.isCritical).length || 0} Critical Actions
          </Badge>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="user_actions">User Management</SelectItem>
            <SelectItem value="tournament_actions">Tournament Management</SelectItem>
            <SelectItem value="payment_actions">Payment Management</SelectItem>
            <SelectItem value="user_ban">User Bans</SelectItem>
            <SelectItem value="kyc_approve">KYC Approvals</SelectItem>
            <SelectItem value="kyc_reject">KYC Rejections</SelectItem>
            <SelectItem value="tournament_create">Tournament Creation</SelectItem>
            <SelectItem value="tournament_cancel">Tournament Cancellation</SelectItem>
            <SelectItem value="withdrawal_approve">Withdrawal Approvals</SelectItem>
            <SelectItem value="withdrawal_reject">Withdrawal Rejections</SelectItem>
            <SelectItem value="payment_settings_update">Payment Settings Updates</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={adminFilter} onValueChange={setAdminFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Admin User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Admins</SelectItem>
            <SelectItem value="1">Super Admin</SelectItem>
            <SelectItem value="2">Vikram Moderator</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Audit Logs Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Admin Activity Log</CardTitle>
          <CardDescription>
            Comprehensive record of all administrative actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs?.map((log) => (
                  <TableRow key={log.id} className={log.isCritical ? "bg-red-500/10" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={log.adminProfileImage || ""} alt={log.adminDisplayName} />
                          <AvatarFallback>{log.adminDisplayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{log.adminDisplayName}</div>
                          <div className="text-xs text-gray-500">@{log.adminUsername}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getActionIcon(log.action)}
                        <span>{getActionLabel(log.action)}</span>
                      </div>
                      {log.isCritical && (
                        <Badge className="mt-1 bg-red-500">Critical</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.entityName && (
                        <div className="flex items-center gap-1">
                          {getEntityIcon(log.entityType)}
                          <span>{log.entityName}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(log.timestamp)}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">{log.ipAddress}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]" title={log.userAgent}>
                        {log.userAgent.split(' ')[0]}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewLog(log)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* View Log Dialog */}
      <Dialog open={viewLogDialogOpen} onOpenChange={setViewLogDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this administrative action
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  {getActionIcon(selectedLog.action)}
                </div>
                <div>
                  <div className="font-bold text-lg">{getActionLabel(selectedLog.action)}</div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(selectedLog.timestamp)}
                  </div>
                </div>
                
                {selectedLog.isCritical && (
                  <Badge className="ml-auto bg-red-500">Critical Action</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Admin</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedLog.adminProfileImage || ""} alt={selectedLog.adminDisplayName} />
                      <AvatarFallback>{selectedLog.adminDisplayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedLog.adminDisplayName}</div>
                      <div className="text-xs text-gray-500">@{selectedLog.adminUsername}</div>
                    </div>
                  </div>
                </div>
                
                {selectedLog.entityName && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Target</h3>
                    <div className="flex items-center gap-1">
                      {getEntityIcon(selectedLog.entityType)}
                      <span>{selectedLog.entityName}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {selectedLog.entityId}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Action Details</h3>
                <Card className="bg-gray-50 dark:bg-gray-800/50">
                  <CardContent className="p-3">
                    <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-[150px]">
                      {JSON.stringify(selectedLog.actionDetails, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">IP Address</h3>
                  <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">User Agent</h3>
                  <p className="text-xs text-gray-500 truncate" title={selectedLog.userAgent}>
                    {selectedLog.userAgent}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}