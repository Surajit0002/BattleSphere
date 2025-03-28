import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  MoreHorizontal, 
  Edit, 
  Trash, 
  Ban, 
  CheckCircle, 
  Lock, 
  Unlock, 
  Eye 
} from "lucide-react";

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const { toast } = useToast();

  // Fetch users data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, pageSize, searchQuery],
    queryFn: async () => {
      // In a real app, you would fetch from your API with proper pagination
      return {
        users: [
          {
            id: 1,
            username: "ProGamer123",
            email: "progamer@example.com",
            displayName: "Pro Gamer",
            role: "user",
            status: "active",
            walletBalance: 250.75,
            createdAt: "2023-11-15T09:30:00Z",
            lastLogin: "2023-12-23T18:45:00Z",
            tournamentWins: 12,
            totalMatches: 86,
            verified: true,
            profileImage: null,
          },
          {
            id: 2,
            username: "GamingQueen",
            email: "queen@gaming.com",
            displayName: "Gaming Queen",
            role: "user",
            status: "active",
            walletBalance: 780.25,
            createdAt: "2023-10-05T14:22:00Z",
            lastLogin: "2023-12-24T11:30:00Z",
            tournamentWins: 24,
            totalMatches: 142,
            verified: true,
            profileImage: null,
          },
          {
            id: 3,
            username: "NightStalker",
            email: "stalker@night.com",
            displayName: "Night Stalker",
            role: "user",
            status: "suspended",
            walletBalance: 45.50,
            createdAt: "2023-11-10T16:18:00Z",
            lastLogin: "2023-12-01T20:30:00Z",
            tournamentWins: 5,
            totalMatches: 37,
            verified: false,
            profileImage: null,
          },
          {
            id: 4,
            username: "TournamentOrganizer",
            email: "organizer@tournaments.com",
            displayName: "Tournament Guy",
            role: "admin",
            status: "active",
            walletBalance: 3500.00,
            createdAt: "2023-09-18T08:14:00Z",
            lastLogin: "2023-12-24T09:15:00Z",
            tournamentWins: 0,
            totalMatches: 5,
            verified: true,
            profileImage: null,
          },
          {
            id: 5,
            username: "NewPlayer2023",
            email: "newbie@gaming.com",
            displayName: "Newbie Player",
            role: "user",
            status: "pending",
            walletBalance: 0.00,
            createdAt: "2023-12-20T10:45:00Z",
            lastLogin: "2023-12-20T10:55:00Z",
            tournamentWins: 0,
            totalMatches: 2,
            verified: false,
            profileImage: null,
          },
        ],
        totalCount: 532,
      };
    },
  });

  // Ban user mutation
  const banUser = useMutation({
    mutationFn: async (userId: number) => {
      // Make API call to ban user
      return userId;
    },
    onSuccess: (userId) => {
      toast({
        title: "User banned",
        description: `User ID: ${userId} has been banned successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Verify user mutation
  const verifyUser = useMutation({
    mutationFn: async (userId: number) => {
      // Make API call to verify user
      return userId;
    },
    onSuccess: (userId) => {
      toast({
        title: "User verified",
        description: `User ID: ${userId} has been verified successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-blue-500";
      case "superadmin":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "banned":
        return <Badge variant="destructive">Banned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground">
              Manage user accounts, permissions, and activity
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                +14 from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">428</div>
              <p className="text-xs text-muted-foreground">
                80.5% of all users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                New Sign Ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Today's registrations
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              View and manage all users on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[400px] w-full flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : isError ? (
              <div className="h-[400px] w-full flex items-center justify-center">
                <p className="text-destructive">Error loading users data</p>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden md:table-cell">Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Verified</TableHead>
                      <TableHead className="hidden lg:table-cell">Joined</TableHead>
                      <TableHead className="hidden lg:table-cell">Balance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={user.username}
                                  className="h-9 w-9 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-medium">
                                  {user.username.substring(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{user.displayName}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-none">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className={getRoleColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.verified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          ${user.walletBalance.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.verified ? (
                                <DropdownMenuItem className="text-yellow-500" onClick={() => verifyUser.mutate(user.id)}>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Remove Verification
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-500" onClick={() => verifyUser.mutate(user.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Verify User
                                </DropdownMenuItem>
                              )}
                              {user.status === "suspended" || user.status === "banned" ? (
                                <DropdownMenuItem className="text-green-500">
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Reinstate User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-orange-500" onClick={() => banUser.mutate(user.id)}>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t p-4 gap-2">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * pageSize + 1, data?.totalCount || 0)} to{" "}
              {Math.min(page * pageSize, data?.totalCount || 0)} of{" "}
              {data?.totalCount || 0} users
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page <= 1}
                  >
                    <PaginationPrevious />
                  </Button>
                </PaginationItem>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                  <PaginationItem key={i}>
                    <Button
                      variant={page === i + 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  </PaginationItem>
                ))}
                {totalPages > 5 && (
                  <PaginationItem>
                    <span className="flex h-9 w-9 items-center justify-center">...</span>
                  </PaginationItem>
                )}
                {totalPages > 5 && (
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                  >
                    <PaginationNext />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                    {selectedUser.profileImage ? (
                      <img
                        src={selectedUser.profileImage}
                        alt={selectedUser.username}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium">
                        {selectedUser.username.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.displayName}</h3>
                    <p className="text-muted-foreground">@{selectedUser.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedUser.status)}
                      {selectedUser.verified && (
                        <Badge variant="default" className="bg-blue-500">Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 space-y-3">
                  <h4 className="font-medium">Account Information</h4>
                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role</span>
                      <span className={getRoleColor(selectedUser.role)}>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined</span>
                      <span>{formatDate(selectedUser.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Login</span>
                      <span>{formatDate(selectedUser.lastLogin)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-md p-4 space-y-3">
                  <h4 className="font-medium">Financial Information</h4>
                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wallet Balance</span>
                      <span className="font-bold">${selectedUser.walletBalance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 space-y-3">
                  <h4 className="font-medium">Game Statistics</h4>
                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tournament Wins</span>
                      <span>{selectedUser.tournamentWins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Matches</span>
                      <span>{selectedUser.totalMatches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Win Rate</span>
                      <span>
                        {selectedUser.totalMatches > 0
                          ? `${((selectedUser.tournamentWins / selectedUser.totalMatches) * 100).toFixed(1)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 space-y-3">
                  <h4 className="font-medium">Additional Actions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit User
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Activity
                    </Button>
                    {selectedUser.status === "active" ? (
                      <Button variant="destructive" className="w-full" onClick={() => banUser.mutate(selectedUser.id)}>
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend User
                      </Button>
                    ) : (
                      <Button variant="default" className="w-full">
                        <Unlock className="h-4 w-4 mr-2" />
                        Reinstate User
                      </Button>
                    )}
                    {selectedUser.verified ? (
                      <Button variant="outline" className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Remove Verification
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={() => verifyUser.mutate(selectedUser.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify User
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}