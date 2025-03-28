import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Filter, Download, ChevronLeft, ChevronRight, AlertTriangle, FileText, User, Settings, Shield, Trash, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define interface for audit log
interface EnhancedAuditLog {
  id: number;
  adminId: number;
  action: string;
  targetId?: number;
  targetType?: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
  admin?: {
    id: number;
    username: string;
    avatarUrl?: string;
    role: string;
  };
}

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<EnhancedAuditLog | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [actionFilter, setActionFilter] = useState("all");
  
  const logsPerPage = 15;
  
  // Fetch audit logs
  const { data: logsData, isLoading } = useQuery({
    queryKey: ['/api/admin/audit-logs', currentPage, actionFilter],
  });
  
  const logs = logsData?.logs || [];
  const totalLogs = logsData?.totalCount || 0;
  const totalPages = Math.ceil(totalLogs / logsPerPage);
  
  // Open log details dialog
  const openDetailsDialog = (log: EnhancedAuditLog) => {
    setSelectedLog(log);
    setShowDetailsDialog(true);
  };
  
  // Get icon for action type
  const getActionIcon = (action: string) => {
    if (action.includes("delete") || action.includes("remove")) {
      return <Trash className="h-4 w-4 text-red-500" />;
    } else if (action.includes("create") || action.includes("add")) {
      return <FileText className="h-4 w-4 text-green-500" />;
    } else if (action.includes("update") || action.includes("edit")) {
      return <Settings className="h-4 w-4 text-blue-500" />;
    } else if (action.includes("login") || action.includes("logout")) {
      return <User className="h-4 w-4 text-amber-500" />;
    } else if (action.includes("permission") || action.includes("role")) {
      return <Shield className="h-4 w-4 text-purple-500" />;
    } else if (action.includes("view") || action.includes("read")) {
      return <Eye className="h-4 w-4 text-gray-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Format action for display
  const formatAction = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };
  
  // Filter logs based on search query and action filter
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.admin?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesAction = 
      actionFilter === "all" || 
      log.action.toLowerCase().includes(actionFilter.toLowerCase());
      
    return matchesSearch && matchesAction;
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Audit Logs</h1>
            <p className="text-gray-500">Track all administrative actions and changes</p>
          </div>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Activity Log</CardTitle>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search logs..."
                    className="pl-8 w-full md:w-[260px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select
                  value={actionFilter}
                  onValueChange={setActionFilter}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="permission">Permissions</SelectItem>
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
                    <TableHead className="w-[180px]">Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead className="w-[120px]">IP Address</TableHead>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={log.admin?.avatarUrl} alt={log.admin?.username} />
                              <AvatarFallback>{log.admin?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{log.admin?.username}</div>
                              <Badge variant="outline" className="text-xs">
                                {log.admin?.role === "superadmin" ? "Super Admin" : "Admin"}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <span>{formatAction(log.action)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.targetType && log.targetId ? (
                            <div className="text-sm">
                              <span className="text-muted-foreground mr-2">{log.targetType}:</span>
                              <span className="font-medium">#{log.targetId}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">System</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-secondary/30 px-1 py-0.5 rounded">
                            {log.ipAddress || "127.0.0.1"}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDetailsDialog(log)}
                          >
                            Details
                          </Button>
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
        
        {/* Details Dialog */}
        {selectedLog && (
          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Audit Log Details</DialogTitle>
                <DialogDescription>
                  Detailed information about the action
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Basic Information</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-muted-foreground">Log ID</div>
                    <div className="col-span-2 font-mono">{selectedLog.id}</div>
                    <div className="text-muted-foreground">Admin</div>
                    <div className="col-span-2">{selectedLog.admin?.username} (ID: {selectedLog.adminId})</div>
                    <div className="text-muted-foreground">Action</div>
                    <div className="col-span-2">{formatAction(selectedLog.action)}</div>
                    <div className="text-muted-foreground">Target</div>
                    <div className="col-span-2">
                      {selectedLog.targetType && selectedLog.targetId
                        ? `${selectedLog.targetType} #${selectedLog.targetId}`
                        : "System"}
                    </div>
                    <div className="text-muted-foreground">IP Address</div>
                    <div className="col-span-2 font-mono">{selectedLog.ipAddress || "127.0.0.1"}</div>
                    <div className="text-muted-foreground">Timestamp</div>
                    <div className="col-span-2">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                
                {selectedLog.details && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Details</h4>
                    <div className="bg-secondary/30 p-3 rounded text-sm font-mono whitespace-pre-wrap">
                      {selectedLog.details}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}