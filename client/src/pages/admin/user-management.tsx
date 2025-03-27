import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  Filter,
  MoreVertical,
  User as UserIcon,
  UserCheck,
  UserX,
  Shield,
  AlertTriangle,
  EyeIcon,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  FileText,
  AlertCircle,
  ChevronDown,
  Award,
  Wallet
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Enhanced user interface with additional fields needed for admin panel
interface EnhancedUser extends User {
  bio: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  kycVerified: boolean;
  isActive: boolean;
  kycDocuments?: {
    idType: string;
    idNumber: string;
    documentUrl: string;
    submissionDate: Date;
  };
  totalMatches: number;
  wins: number;
  totalEarnings: number;
  totalWithdrawals: number;
  isBanned: boolean;
  banReason?: string;
  lastLogin: Date;
  referralCode: string;
  referralBonus: number;
  referredUsers: number;
  warnings: {
    reason: string;
    date: Date;
  }[];
  reports: {
    reason: string;
    reportedBy: number;
    date: Date;
    status: 'pending' | 'reviewed' | 'dismissed';
  }[];
  withdrawalLimit: number;
  canAccessTournaments: boolean;
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
  const [banUserDialogOpen, setBanUserDialogOpen] = useState(false);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [privilegesDialogOpen, setPrivilegesDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EnhancedUser | null>(null);
  const [banReason, setBanReason] = useState('');
  const [withdrawalLimit, setWithdrawalLimit] = useState(5000);
  const [canAccessTournaments, setCanAccessTournaments] = useState(true);
  const { toast } = useToast();

  // Fetch users from API - In a real app, this would be paginated
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  // Mock Enhanced users data for demonstration
  const enhancedUsers: EnhancedUser[] = [
    {
      id: 1,
      username: "akshay_pro",
      displayName: "Akshay Kumar",
      email: "akshay.kumar@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
      password: "", // Password is never returned to frontend
      createdAt: new Date("2023-01-15"),
      walletBalance: 7500,
      bio: "Professional gamer since 2019. Specialized in PUBG Mobile and Free Fire.",
      role: "user",
      kycStatus: "verified",
      kycVerified: true,
      isActive: true,
      kycDocuments: {
        idType: "Aadhaar",
        idNumber: "XXXX-XXXX-1234",
        documentUrl: "https://example.com/docs/aadhar.jpg",
        submissionDate: new Date("2023-01-20")
      },
      totalMatches: 156,
      wins: 47,
      totalEarnings: 25000,
      totalWithdrawals: 17500,
      isBanned: false,
      lastLogin: new Date("2023-06-10T15:23:00"),
      referralCode: "AKPRO23",
      referralBonus: 750,
      referredUsers: 5,
      warnings: [],
      reports: [],
      withdrawalLimit: 5000,
      canAccessTournaments: true
    },
    {
      id: 2,
      username: "riya_gaming",
      displayName: "Riya Singh",
      email: "riya.singh@example.com",
      profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
      password: "",
      createdAt: new Date("2023-02-08"),
      walletBalance: 3200,
      bio: "Free Fire enthusiast. Tournament organizer and competitive player.",
      role: "user",
      kycStatus: "pending",
      kycVerified: false,
      isActive: true,
      kycDocuments: {
        idType: "PAN Card",
        idNumber: "ABCTY1234D",
        documentUrl: "https://example.com/docs/pan.jpg",
        submissionDate: new Date("2023-06-01")
      },
      totalMatches: 87,
      wins: 23,
      totalEarnings: 9800,
      totalWithdrawals: 6600,
      isBanned: false,
      lastLogin: new Date("2023-06-08T18:45:00"),
      referralCode: "RIYAGAME",
      referralBonus: 250,
      referredUsers: 2,
      warnings: [
        {
          reason: "Inappropriate in-game chat",
          date: new Date("2023-04-25")
        }
      ],
      reports: [
        {
          reason: "Suspected teaming in solo match",
          reportedBy: 5,
          date: new Date("2023-05-15"),
          status: "pending"
        }
      ],
      withdrawalLimit: 5000,
      canAccessTournaments: true
    },
    {
      id: 3,
      username: "rahul_sniper",
      displayName: "Rahul Verma",
      email: "rahul.verma@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/33.jpg",
      password: "",
      createdAt: new Date("2022-11-20"),
      walletBalance: 250,
      bio: "Professional sniper in BGMI. Multiple tournament victories.",
      role: "user",
      kycStatus: "verified",
      kycVerified: true,
      isActive: false,
      kycDocuments: {
        idType: "Aadhaar",
        idNumber: "XXXX-XXXX-5678",
        documentUrl: "https://example.com/docs/aadhaar.jpg",
        submissionDate: new Date("2022-12-05")
      },
      totalMatches: 212,
      wins: 78,
      totalEarnings: 42000,
      totalWithdrawals: 41750,
      isBanned: true,
      banReason: "Using unauthorized third-party software",
      lastLogin: new Date("2023-05-29T10:12:00"),
      referralCode: "RASNIPE",
      referralBonus: 1200,
      referredUsers: 8,
      warnings: [
        {
          reason: "Suspicious gameplay patterns",
          date: new Date("2023-05-20")
        },
        {
          reason: "Multiple reports of cheating",
          date: new Date("2023-05-25")
        }
      ],
      reports: [
        {
          reason: "Using aimbot",
          reportedBy: 12,
          date: new Date("2023-05-26"),
          status: "reviewed"
        },
        {
          reason: "Wall hacks",
          reportedBy: 8,
          date: new Date("2023-05-28"),
          status: "reviewed"
        }
      ],
      withdrawalLimit: 0, // Cannot withdraw when banned
      canAccessTournaments: false
    },
    {
      id: 4,
      username: "priya_queen",
      displayName: "Priya Sharma",
      email: "priya.sharma@example.com",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
      password: "",
      createdAt: new Date("2023-03-10"),
      walletBalance: 4800,
      bio: "Casual gamer turning pro. Love strategic gameplay and team coordination.",
      role: "user",
      kycStatus: "rejected",
      kycVerified: false,
      isActive: true,
      kycDocuments: {
        idType: "PAN Card",
        idNumber: "TYUPN7890H",
        documentUrl: "https://example.com/docs/pan_blurry.jpg",
        submissionDate: new Date("2023-04-15")
      },
      totalMatches: 62,
      wins: 15,
      totalEarnings: 6200,
      totalWithdrawals: 1400,
      isBanned: false,
      lastLogin: new Date("2023-06-09T21:30:00"),
      referralCode: "PRIYAQN",
      referralBonus: 0,
      referredUsers: 0,
      warnings: [],
      reports: [],
      withdrawalLimit: 1000, // Reduced limit due to KYC issues
      canAccessTournaments: true
    },
    {
      id: 5,
      username: "vikram_beast",
      displayName: "Vikram Kohli",
      email: "vikram.kohli@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/55.jpg",
      password: "",
      createdAt: new Date("2023-01-05"),
      walletBalance: 8900,
      bio: "Full-time esports athlete. Representing Team Inferno in multiple tournaments.",
      role: "user",
      kycStatus: "not_submitted",
      kycVerified: false,
      isActive: true,
      totalMatches: 195,
      wins: 82,
      totalEarnings: 35000,
      totalWithdrawals: 26100,
      isBanned: false,
      lastLogin: new Date("2023-06-10T09:15:00"),
      referralCode: "VIKBEAST",
      referralBonus: 1500,
      referredUsers: 10,
      warnings: [],
      reports: [],
      withdrawalLimit: 2000, // Reduced limit due to missing KYC
      canAccessTournaments: true
    }
  ];

  // Filter users based on search term and filters
  const filteredUsers = enhancedUsers.filter(user => {
    // Search filter
    if (searchTerm && 
        !user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // KYC filter
    if (kycFilter !== 'all' && user.kycStatus !== kycFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter === 'banned' && !user.isBanned) return false;
    if (statusFilter === 'active' && user.isBanned) return false;
    
    return true;
  });

  const handleViewUser = (user: EnhancedUser) => {
    setSelectedUser(user);
    setViewUserDialogOpen(true);
  };

  const handleBanUser = (user: EnhancedUser) => {
    setSelectedUser(user);
    setBanReason(user.banReason || '');
    setBanUserDialogOpen(true);
  };

  const handleKYCReview = (user: EnhancedUser) => {
    setSelectedUser(user);
    setKycDialogOpen(true);
  };

  const handleSetPrivileges = (user: EnhancedUser) => {
    setSelectedUser(user);
    setWithdrawalLimit(user.withdrawalLimit);
    setCanAccessTournaments(user.canAccessTournaments);
    setPrivilegesDialogOpen(true);
  };

  const handleSubmitBan = (action: 'ban' | 'unban') => {
    if (!selectedUser) return;
    
    // In a real app, this would make an API call
    toast({
      title: action === 'ban' ? 'User Banned' : 'User Unbanned',
      description: action === 'ban' 
        ? `${selectedUser.displayName} has been banned for: ${banReason}` 
        : `${selectedUser.displayName} has been unbanned and can now access all features`,
      variant: action === 'ban' ? 'destructive' : 'default',
    });
    
    setBanUserDialogOpen(false);
  };

  const handleKYCAction = (action: 'approve' | 'reject') => {
    if (!selectedUser) return;
    
    // In a real app, this would make an API call
    toast({
      title: action === 'approve' ? 'KYC Approved' : 'KYC Rejected',
      description: action === 'approve'
        ? `${selectedUser.displayName}'s KYC has been verified successfully.`
        : `${selectedUser.displayName}'s KYC has been rejected. User has been notified.`,
      variant: action === 'approve' ? 'default' : 'destructive',
    });
    
    setKycDialogOpen(false);
  };

  const handleUpdatePrivileges = () => {
    if (!selectedUser) return;
    
    // In a real app, this would make an API call
    toast({
      title: 'User Privileges Updated',
      description: `Privileges for ${selectedUser.displayName} have been updated successfully.`,
      variant: 'default',
    });
    
    setPrivilegesDialogOpen(false);
  };

  const getKYCBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">Not Submitted</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric' 
    }).format(new Date(date));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-500">
            Manage users, verify KYC, and control access privileges
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge className="px-3 py-1 bg-primary text-sm">{filteredUsers.length} Users</Badge>
          <Badge className="px-3 py-1 bg-green-600 text-sm">
            {enhancedUsers.filter(u => u.kycStatus === 'verified').length} Verified
          </Badge>
          <Badge className="px-3 py-1 bg-red-600 text-sm">
            {enhancedUsers.filter(u => u.isBanned).length} Banned
          </Badge>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search users by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={kycFilter} onValueChange={setKycFilter}>
          <SelectTrigger>
            <SelectValue placeholder="KYC Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All KYC Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="not_submitted">Not Submitted</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Account Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active Users</SelectItem>
            <SelectItem value="banned">Banned Users</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Users Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage all registered users and their privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead className="hidden md:table-cell">Stats</TableHead>
                  <TableHead className="text-right">Wallet</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className={user.isBanned ? "bg-red-500/10" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.profileImage || ""} alt={user.displayName} />
                          <AvatarFallback>{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getKYCBadge(user.kycStatus)}
                        {user.isBanned && (
                          <Badge variant="outline" className="border-red-500 text-red-500 text-xs">
                            Banned
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">{formatDate(user.createdAt)}</div>
                      <div className="text-xs text-gray-500">Last login: {formatDate(user.lastLogin)}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        <span className="font-medium">{user.wins}</span> wins / <span>{user.totalMatches}</span> matches
                      </div>
                      <div className="text-xs text-gray-500">
                        Win rate: {Math.round((user.wins / (user.totalMatches || 1)) * 100)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{formatCurrency(user.walletBalance)}</div>
                      <div className="text-xs text-gray-500">
                        Total earnings: {formatCurrency(user.totalEarnings)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleKYCReview(user)} disabled={user.kycStatus !== 'pending'}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Review KYC
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSetPrivileges(user)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Set Privileges
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleBanUser(user)}
                            className={user.isBanned ? "text-green-500" : "text-red-500"}
                          >
                            {user.isBanned ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Unban User
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Ban User
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* View User Dialog */}
      <Dialog open={viewUserDialogOpen} onOpenChange={setViewUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about this user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={selectedUser.profileImage || ""} alt={selectedUser.displayName} />
                  <AvatarFallback>{selectedUser.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-1 flex-1">
                  <h2 className="text-xl font-bold">{selectedUser.displayName}</h2>
                  <p className="text-gray-500">@{selectedUser.username}</p>
                  <p className="text-sm">{selectedUser.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getKYCBadge(selectedUser.kycStatus)}
                    {selectedUser.isBanned && (
                      <Badge variant="outline" className="border-red-500 text-red-500">
                        Banned
                      </Badge>
                    )}
                    <Badge className="bg-blue-500">
                      Referrals: {selectedUser.referredUsers}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="kyc">KYC Details</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">User Info</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Joined:</span>
                            <span>{formatDate(selectedUser.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Last Login:</span>
                            <span>{formatDate(selectedUser.lastLogin)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Account Status:</span>
                            <span className={selectedUser.isBanned ? "text-red-500" : "text-green-500"}>
                              {selectedUser.isBanned ? "Banned" : "Active"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tournament Access:</span>
                            <span className={selectedUser.canAccessTournaments ? "text-green-500" : "text-red-500"}>
                              {selectedUser.canAccessTournaments ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">Game Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total Matches:</span>
                            <span>{selectedUser.totalMatches}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Wins:</span>
                            <span>{selectedUser.wins}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Win Rate:</span>
                            <span>{Math.round((selectedUser.wins / (selectedUser.totalMatches || 1)) * 100)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tournaments Played:</span>
                            <span>-</span> {/* This would come from API in a real app */}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Bio</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm">{selectedUser.bio}</p>
                    </CardContent>
                  </Card>
                  
                  {selectedUser.warnings.length > 0 && (
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">Warning History</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <ul className="space-y-2">
                          {selectedUser.warnings.map((warning, index) => (
                            <li key={index} className="text-sm flex gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p>{warning.reason}</p>
                                <p className="text-xs text-gray-500">{formatDate(warning.date)}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">Wallet Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Current Balance:</span>
                            <span className="font-bold">{formatCurrency(selectedUser.walletBalance)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total Earnings:</span>
                            <span>{formatCurrency(selectedUser.totalEarnings)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total Withdrawals:</span>
                            <span>{formatCurrency(selectedUser.totalWithdrawals)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Withdrawal Limit:</span>
                            <span>{formatCurrency(selectedUser.withdrawalLimit)}/day</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">Referral Program</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Referral Code:</span>
                            <span className="font-mono">{selectedUser.referralCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Referral Bonus:</span>
                            <span>{formatCurrency(selectedUser.referralBonus)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Referred Users:</span>
                            <span>{selectedUser.referredUsers}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm text-gray-500">Transaction history would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="kyc" className="space-y-4">
                  {selectedUser.kycStatus === 'not_submitted' ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>KYC Not Submitted</CardTitle>
                        <CardDescription>
                          This user has not submitted any KYC documents yet.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ) : selectedUser.kycDocuments ? (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium">Document Information</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Document Type:</span>
                              <span>{selectedUser.kycDocuments.idType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Document Number:</span>
                              <span>{selectedUser.kycDocuments.idNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Submission Date:</span>
                              <span>{formatDate(selectedUser.kycDocuments.submissionDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Status:</span>
                              <span>{getKYCBadge(selectedUser.kycStatus)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium">Document Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="border border-gray-200 rounded-md p-2 text-center">
                            <p className="text-sm text-gray-500 my-8">
                              Document preview would be displayed here.
                            </p>
                          </div>
                          
                          {selectedUser.kycStatus === 'pending' && (
                            <div className="flex gap-2 mt-4 justify-end">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleKYCAction('reject')}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleKYCAction('approve')}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>No KYC Data Available</CardTitle>
                        <CardDescription>
                          KYC information is not available for this user.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="reports" className="space-y-4">
                  {selectedUser.reports.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUser.reports.map((report, index) => (
                        <Card key={index}>
                          <CardHeader className="py-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-sm font-medium flex items-center">
                                <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                                Report #{index + 1}
                              </CardTitle>
                              <Badge className={report.status === 'pending' 
                                ? 'bg-yellow-500' 
                                : report.status === 'reviewed' 
                                  ? 'bg-green-600' 
                                  : 'bg-gray-500'
                              }>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Reason:</span>
                                <span className="text-red-500">{report.reason}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Reported By:</span>
                                <span>User ID: {report.reportedBy}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Date:</span>
                                <span>{formatDate(report.date)}</span>
                              </div>
                            </div>
                            
                            {report.status === 'pending' && (
                              <div className="flex gap-2 mt-4 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  Dismiss
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleBanUser(selectedUser)}
                                >
                                  Take Action
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>No Reports</CardTitle>
                        <CardDescription>
                          This user has not been reported by other users.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Ban User Dialog */}
      <Dialog open={banUserDialogOpen} onOpenChange={setBanUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isBanned ? 'Unban User' : 'Ban User'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.isBanned
                ? 'Remove restrictions from this user account.'
                : 'Restrict this user from accessing the platform.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.profileImage || ""} alt={selectedUser.displayName} />
                  <AvatarFallback>{selectedUser.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.displayName}</div>
                  <div className="text-sm text-gray-500">@{selectedUser.username}</div>
                </div>
              </div>
              
              {!selectedUser.isBanned && (
                <div className="space-y-2">
                  <Label htmlFor="ban-reason">Reason for ban</Label>
                  <Input
                    id="ban-reason"
                    placeholder="Enter reason for banning this user"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                  />
                </div>
              )}
              
              {selectedUser.isBanned && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-md p-3">
                  <p className="text-sm flex items-start">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mr-2 mt-0.5" />
                    <span>
                      This user is currently banned for: <strong>{selectedUser.banReason}</strong>. 
                      Unbanning will restore their access to all platform features.
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanUserDialogOpen(false)}>
              Cancel
            </Button>
            {selectedUser?.isBanned ? (
              <Button onClick={() => handleSubmitBan('unban')}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Unban User
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => handleSubmitBan('ban')} disabled={!banReason}>
                <Ban className="mr-2 h-4 w-4" />
                Ban User
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* KYC Review Dialog */}
      <Dialog open={kycDialogOpen} onOpenChange={setKycDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review KYC Documents</DialogTitle>
            <DialogDescription>
              Verify user's identity documents before approving
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && selectedUser.kycDocuments && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.profileImage || ""} alt={selectedUser.displayName} />
                  <AvatarFallback>{selectedUser.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.displayName}</div>
                  <div className="text-sm text-gray-500">@{selectedUser.username}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-gray-500">Document Type</Label>
                    <p>{selectedUser.kycDocuments.idType}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Document Number</Label>
                    <p>{selectedUser.kycDocuments.idNumber}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-500">Submission Date</Label>
                  <p>{formatDate(selectedUser.kycDocuments.submissionDate)}</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-2 text-center">
                <p className="text-sm text-gray-500 my-8">
                  Document preview would be displayed here.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="destructive" onClick={() => handleKYCAction('reject')}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={() => handleKYCAction('approve')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Set Privileges Dialog */}
      <Dialog open={privilegesDialogOpen} onOpenChange={setPrivilegesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set User Privileges</DialogTitle>
            <DialogDescription>
              Adjust access levels and limitations for this user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.profileImage || ""} alt={selectedUser.displayName} />
                  <AvatarFallback>{selectedUser.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.displayName}</div>
                  <div className="text-sm text-gray-500">@{selectedUser.username}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="daily-withdrawal-limit">Daily Withdrawal Limit (₹)</Label>
                  <Input
                    id="daily-withdrawal-limit"
                    type="number"
                    min="0"
                    max="10000"
                    value={withdrawalLimit}
                    onChange={(e) => setWithdrawalLimit(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500">Maximum amount user can withdraw per day</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tournament-access"
                    checked={canAccessTournaments}
                    onCheckedChange={setCanAccessTournaments}
                  />
                  <Label htmlFor="tournament-access">Allow Tournament Participation</Label>
                </div>
                
                {!canAccessTournaments && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-md p-3">
                    <p className="text-sm flex items-start">
                      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mr-2 mt-0.5" />
                      <span>
                        User will not be able to register for or participate in any tournaments.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrivilegesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePrivileges}>
              <Shield className="mr-2 h-4 w-4" />
              Update Privileges
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}