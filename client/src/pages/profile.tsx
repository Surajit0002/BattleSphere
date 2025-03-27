import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import RootLayout from "@/layouts/RootLayout";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Wallet,
  User,
  Trophy,
  CreditCard,
  LogOut,
  Shield,
  History,
  Clock,
  Coins,
  Upload,
  Download,
  Award,
  ExternalLink
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProfilePage() {
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [depositDialogOpen, setDepositDialogOpen] = useState<boolean>(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState<boolean>(false);

  // Fetch user profile data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return response.json();
    },
  });

  // Fetch user wallet transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/user/wallet/transactions'],
    queryFn: async () => {
      const response = await fetch('/api/user/wallet/transactions');
      if (!response.ok) throw new Error('Failed to fetch wallet transactions');
      return response.json();
    },
  });

  // Fetch user tournament history
  const { data: tournamentHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/user/tournaments/history'],
    queryFn: async () => {
      const response = await fetch('/api/user/tournaments/history');
      if (!response.ok) throw new Error('Failed to fetch tournament history');
      return response.json();
    },
  });

  // Handle wallet deposit
  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest(
        "POST",
        "/api/user/wallet/deposit",
        { amount }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/wallet/transactions'] });
      toast({
        title: "Deposit successful",
        description: `₹${depositAmount} has been added to your wallet.`,
      });
      setDepositAmount("");
      setDepositDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Deposit failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    },
  });

  // Handle wallet withdrawal
  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest(
        "POST",
        "/api/user/wallet/withdraw",
        { amount }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/wallet/transactions'] });
      toast({
        title: "Withdrawal request submitted",
        description: `Your request to withdraw ₹${withdrawAmount} is being processed.`,
      });
      setWithdrawAmount("");
      setWithdrawDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    },
  });

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount to deposit.",
      });
      return;
    }
    depositMutation.mutate(amount);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw.",
      });
      return;
    }
    if (user && amount > user.walletBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "Your withdrawal amount exceeds your available balance.",
      });
      return;
    }
    withdrawMutation.mutate(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <RootLayout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userLoading ? "" : user?.profileImage || ""} />
                  <AvatarFallback className="text-xl">
                    {userLoading ? "..." : getInitials(user?.displayName || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <CardTitle className="text-xl">
                    {userLoading ? "Loading..." : user?.displayName}
                  </CardTitle>
                  <CardDescription>
                    @{userLoading ? "username" : user?.username}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{userLoading ? "..." : user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span className="font-medium">
                    {userLoading ? "..." : formatDate(user?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">KYC Status:</span>
                  <Badge variant={userLoading ? "outline" : (user?.kycVerified ? "default" : "outline")}>
                    {userLoading ? "..." : (user?.kycVerified ? "Verified" : "Not Verified")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Status:</span>
                  <Badge variant={userLoading ? "outline" : (user?.isActive ? "default" : "destructive")}>
                    {userLoading ? "..." : (user?.isActive ? "Active" : "Inactive")}
                  </Badge>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <h3 className="font-medium">Performance Stats</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Tournaments</span>
                      <span className="text-sm font-medium">24</span>
                    </div>
                    <Progress value={24} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Wins</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <Progress value={33} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                      <span className="text-sm font-medium">33%</span>
                    </div>
                    <Progress value={33} className="h-2 mt-1" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button variant="outline" className="w-full" size="sm">
                <Shield className="mr-2 h-4 w-4" /> Update KYC
              </Button>
            </CardFooter>
          </Card>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            <Tabs defaultValue="wallet" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="wallet">
                  <Wallet className="h-4 w-4 mr-2" /> Wallet
                </TabsTrigger>
                <TabsTrigger value="tournaments">
                  <Trophy className="h-4 w-4 mr-2" /> Tournaments
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <User className="h-4 w-4 mr-2" /> Settings
                </TabsTrigger>
              </TabsList>

              {/* Wallet Tab */}
              <TabsContent value="wallet" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Balance</CardTitle>
                    <CardDescription>
                      Manage your account balance and transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-6 rounded-lg mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground">Available Balance</p>
                          <h2 className="text-3xl font-bold">
                            ₹{userLoading ? "..." : user?.walletBalance || 0}
                          </h2>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
                            <DialogTrigger asChild>
                              <Button>
                                <Upload className="h-4 w-4 mr-2" /> Deposit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Deposit Funds</DialogTitle>
                                <DialogDescription>
                                  Add money to your wallet balance.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="deposit-amount">Amount (₹)</Label>
                                  <Input
                                    id="deposit-amount"
                                    type="number"
                                    min="10"
                                    placeholder="Enter amount"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Minimum deposit: ₹10
                                  </p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDepositDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleDeposit} disabled={depositMutation.isPending}>
                                  {depositMutation.isPending ? "Processing..." : "Deposit"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" /> Withdraw
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Withdraw Funds</DialogTitle>
                                <DialogDescription>
                                  Withdraw money from your wallet balance.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="withdraw-amount">Amount (₹)</Label>
                                  <Input
                                    id="withdraw-amount"
                                    type="number"
                                    min="50"
                                    max={userLoading ? "0" : user?.walletBalance || 0}
                                    placeholder="Enter amount"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                  />
                                  <div className="text-xs space-y-1">
                                    <p className="text-muted-foreground">
                                      Minimum withdrawal: ₹50
                                    </p>
                                    <p className="text-muted-foreground">
                                      Daily withdrawal limit: ₹5,000
                                    </p>
                                    <p className="text-muted-foreground">
                                      Withdrawal fee: 10% of amount
                                    </p>
                                    <p className="text-muted-foreground">
                                      You will receive: ₹{withdrawAmount ? parseFloat(withdrawAmount) * 0.9 : 0}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleWithdraw} disabled={withdrawMutation.isPending}>
                                  {withdrawMutation.isPending ? "Processing..." : "Withdraw"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                    {transactionsLoading ? (
                      <div className="text-center py-6">Loading transactions...</div>
                    ) : transactions && transactions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                              <TableCell>
                                {transaction.type === "deposit" ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <Upload className="h-3 w-3 mr-1" /> Deposit
                                  </Badge>
                                ) : transaction.type === "withdrawal" ? (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    <Download className="h-3 w-3 mr-1" /> Withdrawal
                                  </Badge>
                                ) : transaction.type === "prize" ? (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    <Award className="h-3 w-3 mr-1" /> Prize
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">
                                    <Coins className="h-3 w-3 mr-1" /> {transaction.type}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell className="text-right font-medium">
                                <span className={transaction.type === "withdrawal" ? "text-red-600" : "text-green-600"}>
                                  {transaction.type === "withdrawal" ? "-" : "+"}₹{transaction.amount}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  transaction.status === "completed" ? "default" : 
                                  transaction.status === "pending" ? "outline" : 
                                  "destructive"
                                }>
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6 border rounded-lg">
                        <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No transactions found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your transactions will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tournaments Tab */}
              <TabsContent value="tournaments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tournament History</CardTitle>
                    <CardDescription>
                      View your past tournament performances
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="text-center py-6">Loading tournament history...</div>
                    ) : tournamentHistory && tournamentHistory.length > 0 ? (
                      <div className="space-y-4">
                        {tournamentHistory.map((tournament) => (
                          <Card key={tournament.id} className="overflow-hidden">
                            <div className="border-b p-4 bg-muted/50 flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={
                                    tournament.position === 1 ? "default" : 
                                    tournament.position <= 3 ? "secondary" : 
                                    "outline"
                                  }
                                >
                                  {tournament.position === 1 ? "1st Place" : 
                                   tournament.position === 2 ? "2nd Place" : 
                                   tournament.position === 3 ? "3rd Place" : 
                                   `${tournament.position}th Place`}
                                </Badge>
                                <span className="font-medium">{tournament.tournamentName}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(tournament.date)}
                              </span>
                            </div>
                            <div className="p-4 grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Game</p>
                                <p className="font-medium">{tournament.gameName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Mode</p>
                                <p className="font-medium capitalize">{tournament.gameMode}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Prize</p>
                                <p className="font-medium text-green-600">₹{tournament.prizeMoney || 0}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border rounded-lg">
                        <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No tournament history found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Join tournaments to see your performance here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="display-name">Display Name</Label>
                            <Input 
                              id="display-name" 
                              defaultValue={userLoading ? "" : user?.displayName || ""}
                              placeholder="Your display name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              defaultValue={userLoading ? "" : user?.email || ""}
                              placeholder="Your email address"
                              disabled
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profile-image">Profile Image URL</Label>
                            <Input 
                              id="profile-image" 
                              defaultValue={userLoading ? "" : user?.profileImage || ""}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Security</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input 
                              id="current-password" 
                              type="password" 
                              placeholder="Enter current password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input 
                              id="new-password" 
                              type="password" 
                              placeholder="Enter new password"
                            />
                          </div>
                        </div>
                        <Button className="mt-2">Change Password</Button>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Notification Preferences</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <Label className="text-base">Tournament Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive updates about upcoming tournaments
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <Label className="text-base">Payment Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive updates about deposits and withdrawals
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <Label className="text-base">Marketing Communications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive promotional offers and news
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="text-red-600 hover:text-red-600 hover:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}