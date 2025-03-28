import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Ban, Shield, CheckCircle, UserCog, ChevronLeft, ChevronRight } from "lucide-react";

const userRoleSchema = z.object({
  userId: z.number(),
  role: z.enum(["user", "admin", "superadmin"]),
});

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userToEdit, setUserToEdit] = useState<number | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  const usersPerPage = 10;
  
  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['/api/users', currentPage],
  });
  
  const users = usersData?.users || [];
  const totalUsers = usersData?.totalCount || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  
  // Form for editing user role
  const roleForm = useForm({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      userId: 0,
      role: "user" as const,
    },
  });
  
  // Change role mutation
  const changeRoleMutation = useMutation({
    mutationFn: (data: z.infer<typeof userRoleSchema>) => {
      return apiRequest(`/api/users/${data.userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: data.role }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setShowRoleDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role.",
        variant: "destructive",
      });
    },
  });
  
  // Handle role update
  const onRoleSubmit = (data: z.infer<typeof userRoleSchema>) => {
    changeRoleMutation.mutate(data);
  };
  
  // Open role dialog
  const openRoleDialog = (user: any) => {
    setUserToEdit(user.id);
    roleForm.setValue("userId", user.id);
    roleForm.setValue("role", user.role);
    setShowRoleDialog(true);
  };
  
  // Filter users based on search query and active tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "admins" && (user.role === "admin" || user.role === "superadmin")) ||
      (activeTab === "users" && user.role === "user") ||
      (activeTab === "suspended" && user.status === "suspended");
      
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-500">Manage users, roles, and permissions</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Total users: {totalUsers}</CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8 w-full md:w-[260px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="admins">Admins</TabsTrigger>
                <TabsTrigger value="users">Regular Users</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <div className="flex justify-center">
                              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                                  <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.username}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.role === "superadmin" ? (
                                <Badge variant="destructive">Super Admin</Badge>
                              ) : user.role === "admin" ? (
                                <Badge variant="default">Admin</Badge>
                              ) : (
                                <Badge variant="outline">User</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.status === "active" ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                  Active
                                </Badge>
                              ) : user.status === "suspended" ? (
                                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                                  Suspended
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => openRoleDialog(user)}
                                  disabled={user.role === "superadmin" && user.id !== 1}
                                >
                                  <UserCog className="h-4 w-4" />
                                  <span className="sr-only">Edit Role</span>
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  disabled={user.role === "superadmin" && user.id !== 1}
                                >
                                  {user.status === "suspended" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Ban className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    {user.status === "suspended" ? "Unban" : "Ban"}
                                  </span>
                                </Button>
                              </div>
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Role Edit Dialog */}
        <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update the user's role and permission level
              </DialogDescription>
            </DialogHeader>
            
            <Form {...roleForm}>
              <form onSubmit={roleForm.handleSubmit(onRoleSubmit)} className="space-y-4">
                <FormField
                  control={roleForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">Regular User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Super Admin has full access to all features and settings.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowRoleDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={changeRoleMutation.isPending}>
                    {changeRoleMutation.isPending ? "Updating..." : "Update Role"}
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