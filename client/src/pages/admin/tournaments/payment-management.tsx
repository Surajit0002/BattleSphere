import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { User, WalletTransaction } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  FileText,
  AlertTriangle,
  EyeIcon,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Calendar,
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  ShieldAlert,
  Wallet,
  CreditCard,
  AlertCircle,
  ChevronDown,
  Award,
  Settings,
  Download
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Enhanced transaction interface with additional fields
interface EnhancedTransaction extends WalletTransaction {
  user: {
    id: number;
    username: string;
    displayName: string;
    profileImage?: string;
    kycStatus: 'verified' | 'pending' | 'rejected' | 'not_submitted';
  };
  paymentMethod?: string;
  transactionId?: string;
  paymentGateway?: string;
  suspicious?: boolean;
  suspiciousReason?: string;
}

export default function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewTransactionDialogOpen, setViewTransactionDialogOpen] = useState(false);
  const [reviewWithdrawalDialogOpen, setReviewWithdrawalDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<EnhancedTransaction | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [paymentSettings, setPaymentSettings] = useState({
    minDepositAmount: 100,
    maxWithdrawalLimit: 5000,
    transactionFee: 10,
    instantWithdrawalEnabled: true,
    allowUPIPayments: true,
    allowNetBanking: true,
    allowWalletTransfer: true,
    kycRequiredForWithdrawal: true,
  });
  const { toast } = useToast();

  // Mock transaction data
  const transactions: EnhancedTransaction[] = [
    {
      id: 1,
      userId: 1,
      type: 'deposit',
      amount: 2000,
      status: 'completed',
      timestamp: new Date("2023-06-10T14:23:11"),
      description: "Added funds via UPI",
      user: {
        id: 1,
        username: "akshay_pro",
        displayName: "Akshay Kumar",
        profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
        kycStatus: "verified"
      },
      paymentMethod: "UPI",
      transactionId: "UPI123456789",
      paymentGateway: "RazorPay"
    },
    {
      id: 2,
      userId: 2,
      type: 'withdrawal',
      amount: 1500,
      status: 'pending',
      timestamp: new Date("2023-06-09T18:05:22"),
      description: "Withdrawal to bank account",
      user: {
        id: 2,
        username: "riya_gaming",
        displayName: "Riya Singh",
        profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
        kycStatus: "pending"
      },
      paymentMethod: "Bank Transfer",
      transactionId: "BANK987654321",
      paymentGateway: "RazorPay",
      suspicious: true,
      suspiciousReason: "Multiple withdrawals in short period"
    },
    {
      id: 3,
      userId: 3,
      type: 'withdrawal',
      amount: 3000,
      status: 'rejected',
      timestamp: new Date("2023-06-08T11:42:55"),
      description: "Withdrawal to UPI",
      user: {
        id: 3,
        username: "rahul_sniper",
        displayName: "Rahul Verma",
        profileImage: "https://randomuser.me/api/portraits/men/33.jpg",
        kycStatus: "rejected"
      },
      paymentMethod: "UPI",
      transactionId: "UPI567891234",
      paymentGateway: "RazorPay"
    },
    {
      id: 4,
      userId: 4,
      type: 'prize',
      amount: 5000,
      status: 'completed',
      timestamp: new Date("2023-06-07T09:15:30"),
      description: "Tournament winnings - BGMI Championships",
      user: {
        id: 4,
        username: "priya_queen",
        displayName: "Priya Sharma",
        profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
        kycStatus: "verified"
      }
    },
    {
      id: 5,
      userId: 5,
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      timestamp: new Date("2023-06-06T21:08:45"),
      description: "Added funds via Net Banking",
      user: {
        id: 5,
        username: "vikram_beast",
        displayName: "Vikram Kohli",
        profileImage: "https://randomuser.me/api/portraits/men/55.jpg",
        kycStatus: "not_submitted"
      },
      paymentMethod: "Net Banking",
      transactionId: "NB123987456",
      paymentGateway: "RazorPay"
    },
    {
      id: 6,
      userId: 1,
      type: 'fee',
      amount: 50,
      status: 'completed',
      timestamp: new Date("2023-06-05T15:30:00"),
      description: "Tournament entry fee - Free Fire Showdown",
      user: {
        id: 1,
        username: "akshay_pro",
        displayName: "Akshay Kumar",
        profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
        kycStatus: "verified"
      }
    },
    {
      id: 7,
      userId: 2,
      type: 'withdrawal',
      amount: 2500,
      status: 'pending',
      timestamp: new Date("2023-06-04T17:22:10"),
      description: "Withdrawal to UPI",
      user: {
        id: 2,
        username: "riya_gaming",
        displayName: "Riya Singh",
        profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
        kycStatus: "pending"
      },
      paymentMethod: "UPI",
      transactionId: "UPI098765432",
      paymentGateway: "RazorPay"
    },
    {
      id: 8,
      userId: 3,
      type: 'referral',
      amount: 200,
      status: 'completed',
      timestamp: new Date("2023-06-03T12:11:05"),
      description: "Referral bonus",
      user: {
        id: 3,
        username: "rahul_sniper",
        displayName: "Rahul Verma",
        profileImage: "https://randomuser.me/api/portraits/men/33.jpg",
        kycStatus: "rejected"
      }
    },
    {
      id: 9,
      userId: 4,
      type: 'deposit',
      amount: 3000,
      status: 'completed',
      timestamp: new Date("2023-06-02T10:45:30"),
      description: "Added funds via Credit Card",
      user: {
        id: 4,
        username: "priya_queen",
        displayName: "Priya Sharma",
        profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
        kycStatus: "verified"
      },
      paymentMethod: "Credit Card",
      transactionId: "CC543219876",
      paymentGateway: "RazorPay"
    },
    {
      id: 10,
      userId: 5,
      type: 'withdrawal',
      amount: 4500,
      status: 'pending',
      timestamp: new Date("2023-06-01T08:33:20"),
      description: "Withdrawal to bank account",
      user: {
        id: 5,
        username: "vikram_beast",
        displayName: "Vikram Kohli",
        profileImage: "https://randomuser.me/api/portraits/men/55.jpg",
        kycStatus: "not_submitted"
      },
      paymentMethod: "Bank Transfer",
      transactionId: "BANK456789123",
      paymentGateway: "RazorPay",
      suspicious: true,
      suspiciousReason: "KYC not completed"
    }
  ];

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by search term
    if (searchTerm && 
        !transaction.user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(transaction.transactionId && transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filter by transaction type
    if (typeFilter !== 'all' && transaction.type !== typeFilter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
      const today = new Date();
      const txDate = new Date(transaction.timestamp);
      
      if (dateFilter === 'today' && 
          !(txDate.getDate() === today.getDate() && 
            txDate.getMonth() === today.getMonth() && 
            txDate.getFullYear() === today.getFullYear())) {
        return false;
      }
      
      if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        if (txDate < weekAgo) return false;
      }
      
      if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        if (txDate < monthAgo) return false;
      }
    }
    
    return true;
  });

  // Calculate summary stats
  const summaryStats = {
    totalDeposits: transactions
      .filter(tx => tx.type === 'deposit' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0),
    totalWithdrawals: transactions
      .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0),
    pendingWithdrawals: transactions
      .filter(tx => tx.type === 'withdrawal' && tx.status === 'pending')
      .reduce((sum, tx) => sum + tx.amount, 0),
    pendingCount: transactions
      .filter(tx => tx.type === 'withdrawal' && tx.status === 'pending')
      .length,
    transactionFees: transactions
      .filter(tx => tx.type === 'fee' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0),
  };

  const handleViewTransaction = (transaction: EnhancedTransaction) => {
    setSelectedTransaction(transaction);
    setViewTransactionDialogOpen(true);
  };

  const handleReviewWithdrawal = (transaction: EnhancedTransaction) => {
    setSelectedTransaction(transaction);
    setRejectionReason('');
    setReviewWithdrawalDialogOpen(true);
  };

  const handleWithdrawalAction = (action: 'approve' | 'reject') => {
    if (!selectedTransaction) return;
    
    // In a real app, this would make an API call
    toast({
      title: action === 'approve' ? 'Withdrawal Approved' : 'Withdrawal Rejected',
      description: action === 'approve' 
        ? `Withdrawal of ₹${selectedTransaction.amount} for ${selectedTransaction.user.displayName} has been approved.` 
        : `Withdrawal rejected with reason: ${rejectionReason}`,
      variant: action === 'approve' ? 'default' : 'destructive',
    });
    
    setReviewWithdrawalDialogOpen(false);
  };

  const handleUpdateSettings = () => {
    // In a real app, this would make an API call
    toast({
      title: 'Payment Settings Updated',
      description: 'Your changes to the payment settings have been saved.',
      variant: 'default',
    });
    
    setSettingsDialogOpen(false);
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
  
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
      case 'prize':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'fee':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'referral':
        return <UserIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'prize':
        return 'Tournament Prize';
      case 'fee':
        return 'Entry Fee';
      case 'referral':
        return 'Referral Bonus';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getKYCBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600">KYC Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">KYC Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">KYC Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">KYC Not Submitted</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-gray-500">
            Manage deposits, withdrawals, and payment settings
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSettingsDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Payment Settings
          </Button>
          <Button variant="default">
            <Download className="mr-2 h-4 w-4" />
            Export Transactions
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalDeposits)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalWithdrawals)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {formatCurrency(summaryStats.pendingWithdrawals)}
              <span className="text-sm ml-2 text-yellow-500">({summaryStats.pendingCount})</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Transaction Fees</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.transactionFees)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Profit</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(summaryStats.transactionFees)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposits</SelectItem>
            <SelectItem value="withdrawal">Withdrawals</SelectItem>
            <SelectItem value="prize">Tournament Prizes</SelectItem>
            <SelectItem value="fee">Entry Fees</SelectItem>
            <SelectItem value="referral">Referral Bonuses</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
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
      
      {/* Tabs for Different Transaction Views */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="withdrawals">Pending Withdrawals</TabsTrigger>
          <TabsTrigger value="suspicious">Suspicious Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and manage all financial transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-500px)] w-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className={transaction.suspicious ? "bg-red-500/10" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={transaction.user.profileImage || ""} alt={transaction.user.displayName} />
                              <AvatarFallback>{transaction.user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{transaction.user.displayName}</div>
                              <div className="text-xs text-gray-500">@{transaction.user.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(transaction.type)}
                            <span>{getTypeLabel(transaction.type)}</span>
                          </div>
                          <div className="text-xs text-gray-500">{transaction.description}</div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${transaction.type === 'withdrawal' || transaction.type === 'fee' ? 'text-red-500' : 'text-green-500'}`}>
                            {transaction.type === 'withdrawal' || transaction.type === 'fee' ? '- ' : '+ '}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(transaction.timestamp)}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.timestamp).toLocaleTimeString()}
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
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewTransaction(transaction)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {transaction.type === 'withdrawal' && transaction.status === 'pending' && (
                                <DropdownMenuItem onClick={() => handleReviewWithdrawal(transaction)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Review Withdrawal
                                </DropdownMenuItem>
                              )}
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
        </TabsContent>
        
        <TabsContent value="withdrawals">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Pending Withdrawals</CardTitle>
              <CardDescription>
                Review and process withdrawal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-500px)] w-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions
                      .filter(tx => tx.type === 'withdrawal' && tx.status === 'pending')
                      .map((transaction) => (
                        <TableRow key={transaction.id} className={transaction.suspicious ? "bg-red-500/10" : ""}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={transaction.user.profileImage || ""} alt={transaction.user.displayName} />
                                <AvatarFallback>{transaction.user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{transaction.user.displayName}</div>
                                <div className="text-xs text-gray-500">@{transaction.user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-red-500">
                              {formatCurrency(transaction.amount)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{transaction.paymentMethod}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(transaction.timestamp)}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(transaction.timestamp).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getKYCBadge(transaction.user.kycStatus)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewTransaction(transaction)}
                              >
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleReviewWithdrawal(transaction)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Review
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suspicious">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Suspicious Activity</CardTitle>
              <CardDescription>
                Transactions flagged for review due to potential issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-500px)] w-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Flagged Reason</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions
                      .filter(tx => tx.suspicious)
                      .map((transaction) => (
                        <TableRow key={transaction.id} className="bg-red-500/10">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={transaction.user.profileImage || ""} alt={transaction.user.displayName} />
                                <AvatarFallback>{transaction.user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{transaction.user.displayName}</div>
                                <div className="text-xs text-gray-500">@{transaction.user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(transaction.type)}
                              <span>{getTypeLabel(transaction.type)}</span>
                            </div>
                            <div className="text-xs text-gray-500">{transaction.description}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-red-500">
                              <AlertTriangle className="h-4 w-4" />
                              <span>{transaction.suspiciousReason}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-red-500">
                              {formatCurrency(transaction.amount)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(transaction.timestamp)}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(transaction.timestamp).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewTransaction(transaction)}
                              >
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View
                              </Button>
                              {transaction.type === 'withdrawal' && transaction.status === 'pending' && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => handleReviewWithdrawal(transaction)}
                                >
                                  <ShieldAlert className="mr-2 h-4 w-4" />
                                  Review
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                    
                    {transactions.filter(tx => tx.suspicious).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                          <p className="text-gray-500">No suspicious activity detected</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* View Transaction Dialog */}
      <Dialog open={viewTransactionDialogOpen} onOpenChange={setViewTransactionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1 items-center mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-2">
                  {getTypeIcon(selectedTransaction.type)}
                </div>
                <div className="text-xl font-bold flex gap-1 items-center">
                  {selectedTransaction.type === 'withdrawal' || selectedTransaction.type === 'fee' ? '- ' : '+ '}
                  {formatCurrency(selectedTransaction.amount)}
                </div>
                <div className="text-sm">{getTypeLabel(selectedTransaction.type)}</div>
                <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Date & Time</Label>
                  <p className="text-sm">{formatDateTime(selectedTransaction.timestamp)}</p>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500">Transaction ID</Label>
                  <p className="text-sm font-mono">{selectedTransaction.transactionId || 'N/A'}</p>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500">Payment Method</Label>
                  <p className="text-sm">{selectedTransaction.paymentMethod || 'N/A'}</p>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500">Payment Gateway</Label>
                  <p className="text-sm">{selectedTransaction.paymentGateway || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-gray-500">Description</Label>
                <p className="text-sm">{selectedTransaction.description}</p>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage src={selectedTransaction.user.profileImage || ""} alt={selectedTransaction.user.displayName} />
                    <AvatarFallback>{selectedTransaction.user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedTransaction.user.displayName}</div>
                    <div className="text-xs text-gray-500">@{selectedTransaction.user.username}</div>
                  </div>
                </div>
                <div className="mt-2">
                  {getKYCBadge(selectedTransaction.user.kycStatus)}
                </div>
              </div>
              
              {selectedTransaction.suspicious && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-md p-3">
                  <p className="text-sm flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500 mr-2 mt-0.5" />
                    <span>
                      <strong>Flagged for review:</strong> {selectedTransaction.suspiciousReason}
                    </span>
                  </p>
                </div>
              )}
              
              {selectedTransaction.type === 'withdrawal' && selectedTransaction.status === 'pending' && (
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setViewTransactionDialogOpen(false);
                      handleReviewWithdrawal(selectedTransaction);
                    }}
                  >
                    Review Withdrawal
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Review Withdrawal Dialog */}
      <Dialog open={reviewWithdrawalDialogOpen} onOpenChange={setReviewWithdrawalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Withdrawal Request</DialogTitle>
            <DialogDescription>
              Approve or reject this withdrawal request
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedTransaction.user.profileImage || ""} alt={selectedTransaction.user.displayName} />
                  <AvatarFallback>{selectedTransaction.user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedTransaction.user.displayName}</div>
                  <div className="text-sm text-gray-500">@{selectedTransaction.user.username}</div>
                </div>
                <div className="ml-auto">
                  {getKYCBadge(selectedTransaction.user.kycStatus)}
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-bold">{formatCurrency(selectedTransaction.amount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Payment Method:</span>
                  <span>{selectedTransaction.paymentMethod}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Date Requested:</span>
                  <span>{formatDate(selectedTransaction.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-mono text-sm">{selectedTransaction.transactionId || 'N/A'}</span>
                </div>
              </div>
              
              {selectedTransaction.user.kycStatus !== 'verified' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-md p-3">
                  <p className="text-sm flex items-start">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mr-2 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> This user's KYC is not verified. Consider rejecting or asking for verification first.
                    </span>
                  </p>
                </div>
              )}
              
              {selectedTransaction.suspicious && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-md p-3">
                  <p className="text-sm flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500 mr-2 mt-0.5" />
                    <span>
                      <strong>Suspicious Activity:</strong> {selectedTransaction.suspiciousReason}
                    </span>
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Reason for rejection (optional)</Label>
                <Input
                  id="rejection-reason"
                  placeholder="Enter reason if rejecting this withdrawal"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="destructive" onClick={() => handleWithdrawalAction('reject')}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject Withdrawal
            </Button>
            <Button onClick={() => handleWithdrawalAction('approve')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Settings</DialogTitle>
            <DialogDescription>
              Configure platform-wide payment policies
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min-deposit">Minimum Deposit Amount (₹)</Label>
              <Input
                id="min-deposit"
                type="number"
                min="1"
                value={paymentSettings.minDepositAmount}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  minDepositAmount: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-withdrawal">Maximum Withdrawal Limit (₹/day)</Label>
              <Input
                id="max-withdrawal"
                type="number"
                min="0"
                value={paymentSettings.maxWithdrawalLimit}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  maxWithdrawalLimit: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transaction-fee">Transaction Fee (%)</Label>
              <Input
                id="transaction-fee"
                type="number"
                min="0"
                max="100"
                value={paymentSettings.transactionFee}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  transactionFee: parseInt(e.target.value) || 0
                })}
              />
              <p className="text-xs text-gray-500">
                Fee charged on withdrawals (default: 10%)
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Payment Methods</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="upi-payments" className="cursor-pointer">UPI Payments</Label>
                  <Switch
                    id="upi-payments"
                    checked={paymentSettings.allowUPIPayments}
                    onCheckedChange={(checked) => setPaymentSettings({
                      ...paymentSettings,
                      allowUPIPayments: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="net-banking" className="cursor-pointer">Net Banking</Label>
                  <Switch
                    id="net-banking"
                    checked={paymentSettings.allowNetBanking}
                    onCheckedChange={(checked) => setPaymentSettings({
                      ...paymentSettings,
                      allowNetBanking: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="wallet-transfer" className="cursor-pointer">Wallet Transfer</Label>
                  <Switch
                    id="wallet-transfer"
                    checked={paymentSettings.allowWalletTransfer}
                    onCheckedChange={(checked) => setPaymentSettings({
                      ...paymentSettings,
                      allowWalletTransfer: checked
                    })}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Additional Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="instant-withdrawal" className="cursor-pointer">Instant Withdrawals</Label>
                  <Switch
                    id="instant-withdrawal"
                    checked={paymentSettings.instantWithdrawalEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({
                      ...paymentSettings,
                      instantWithdrawalEnabled: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="kyc-withdrawal" className="cursor-pointer">KYC Required for Withdrawals</Label>
                  <Switch
                    id="kyc-withdrawal"
                    checked={paymentSettings.kycRequiredForWithdrawal}
                    onCheckedChange={(checked) => setPaymentSettings({
                      ...paymentSettings,
                      kycRequiredForWithdrawal: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSettings}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}