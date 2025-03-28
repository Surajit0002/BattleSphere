import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Search, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

// Define schemas
const approveWithdrawalSchema = z.object({
  transactionId: z.number(),
});

const rejectWithdrawalSchema = z.object({
  transactionId: z.number(),
  reason: z.string().min(1, "Reason is required"),
});

export default function PaymentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const { toast } = useToast();
  
  const transactionsPerPage = 10;
  
  // Fetch transactions
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['/api/transactions', currentPage, activeTab],
  });
  
  const transactions = transactionsData?.transactions || [];
  const totalTransactions = transactionsData?.totalCount || 0;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  
  // Fetch dashboard stats for summary
  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/admin/dashboard/stats'],
  });
  
  // Form for rejecting withdrawal
  const rejectForm = useForm({
    resolver: zodResolver(rejectWithdrawalSchema),
    defaultValues: {
      transactionId: 0,
      reason: "",
    },
  });
  
  // Approve withdrawal mutation
  const approveWithdrawalMutation = useMutation({
    mutationFn: (data: z.infer<typeof approveWithdrawalSchema>) => {
      return apiRequest(`/api/admin/withdrawals/${data.transactionId}/approve`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Approved",
        description: "The withdrawal request has been approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/stats'] });
      setShowApproveDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve withdrawal.",
        variant: "destructive",
      });
    },
  });
  
  // Reject withdrawal mutation
  const rejectWithdrawalMutation = useMutation({
    mutationFn: (data: z.infer<typeof rejectWithdrawalSchema>) => {
      return apiRequest(`/api/admin/withdrawals/${data.transactionId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason: data.reason }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Rejected",
        description: "The withdrawal request has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/stats'] });
      setShowRejectDialog(false);
      rejectForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject withdrawal.",
        variant: "destructive",
      });
    },
  });
  
  // Handle approve submission
  const onApproveSubmit = () => {
    if (selectedTransaction) {
      approveWithdrawalMutation.mutate({ transactionId: selectedTransaction.id });
    }
  };
  
  // Handle reject submission
  const onRejectSubmit = (data: z.infer<typeof rejectWithdrawalSchema>) => {
    rejectWithdrawalMutation.mutate(data);
  };
  
  // Open approve dialog
  const openApproveDialog = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowApproveDialog(true);
  };
  
  // Open reject dialog
  const openRejectDialog = (transaction: any) => {
    setSelectedTransaction(transaction);
    rejectForm.setValue("transactionId", transaction.id);
    setShowRejectDialog(true);
  };
  
  // Filter transactions based on search query and active tab
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "deposits" && transaction.type === "deposit") ||
      (activeTab === "withdrawals" && transaction.type === "withdrawal") ||
      (activeTab === "pending" && transaction.status === "pending");
      
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Payment Management</h1>
            <p className="text-gray-500">Manage deposits, withdrawals, and transactions</p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{dashboardStats?.totalRevenue?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats?.pendingWithdrawals || "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats?.totalTransactions?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Manage payment transactions</CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8 w-full md:w-[260px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="deposits">Deposits</SelectItem>
                    <SelectItem value="withdrawals">Withdrawals</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.transactionId || `TXN-${transaction.id.toString().padStart(6, '0')}`}
                        </TableCell>
                        <TableCell>{transaction.user?.username}</TableCell>
                        <TableCell>
                          {transaction.type === "deposit" ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                              Deposit
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              Withdrawal
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          {transaction.status === "completed" ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Completed
                            </Badge>
                          ) : transaction.status === "pending" ? (
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                              Pending
                            </Badge>
                          ) : transaction.status === "failed" ? (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500">
                              Failed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                              {transaction.status}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.type === "withdrawal" && transaction.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-500 hover:text-green-600"
                                onClick={() => openApproveDialog(transaction)}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => openRejectDialog(transaction)}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Approve Withdrawal Dialog */}
        {selectedTransaction && (
          <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Withdrawal</DialogTitle>
                <DialogDescription>
                  Are you sure you want to approve this withdrawal request of ₹{selectedTransaction.amount}?
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-muted-foreground">User</div>
                  <div>{selectedTransaction.user?.username}</div>
                  <div className="text-muted-foreground">Transaction ID</div>
                  <div>{selectedTransaction.transactionId || `TXN-${selectedTransaction.id.toString().padStart(6, '0')}`}</div>
                  <div className="text-muted-foreground">Amount</div>
                  <div className="font-medium">₹{selectedTransaction.amount.toLocaleString()}</div>
                  <div className="text-muted-foreground">Payment Method</div>
                  <div>{selectedTransaction.method || "Bank Transfer"}</div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={onApproveSubmit} 
                  disabled={approveWithdrawalMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {approveWithdrawalMutation.isPending ? "Processing..." : "Approve Withdrawal"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Reject Withdrawal Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Withdrawal</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this withdrawal request.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...rejectForm}>
              <form onSubmit={rejectForm.handleSubmit(onRejectSubmit)} className="space-y-4">
                {selectedTransaction && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-muted-foreground">User</div>
                    <div>{selectedTransaction.user?.username}</div>
                    <div className="text-muted-foreground">Amount</div>
                    <div className="font-medium">₹{selectedTransaction.amount.toLocaleString()}</div>
                  </div>
                )}
                
                <FormField
                  control={rejectForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Rejection</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter reason for rejection"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowRejectDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={rejectWithdrawalMutation.isPending}
                    variant="destructive"
                  >
                    {rejectWithdrawalMutation.isPending ? "Processing..." : "Reject Withdrawal"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}