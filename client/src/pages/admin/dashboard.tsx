import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  PersonStanding,
  UserPlus,
  UserCheck,
  UserX,
  BadgeCheck,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  BarChart
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";

// Dashboard Analytics Data
const revenueData = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 1398 },
  { name: "Mar", value: 9800 },
  { name: "Apr", value: 3908 },
  { name: "May", value: 4800 },
  { name: "Jun", value: 3800 },
  { name: "Jul", value: 4300 },
  { name: "Aug", value: 5300 },
  { name: "Sep", value: 4890 },
  { name: "Oct", value: 7800 },
  { name: "Nov", value: 8900 },
  { name: "Dec", value: 6800 },
];

const userActivityData = [
  { name: "Jan", active: 4000, new: 2400 },
  { name: "Feb", active: 3000, new: 1398 },
  { name: "Mar", active: 2000, new: 9800 },
  { name: "Apr", active: 2780, new: 3908 },
  { name: "May", active: 1890, new: 4800 },
  { name: "Jun", active: 2390, new: 3800 },
  { name: "Jul", active: 3490, new: 4300 },
  { name: "Aug", active: 4000, new: 2400 },
  { name: "Sep", active: 3000, new: 1398 },
  { name: "Oct", active: 2000, new: 9800 },
  { name: "Nov", active: 2780, new: 3908 },
  { name: "Dec", active: 1890, new: 4800 },
];

const pieData = [
  { name: "Free", value: 400 },
  { name: "Paid", value: 300 },
  { name: "Sponsored", value: 200 },
  { name: "Seasonal", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const recentActivityData = [
  {
    id: 1,
    type: "user",
    action: "joined",
    target: "ProGamer123",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "payment",
    action: "made",
    target: "$50.00 payment",
    time: "10 minutes ago",
  },
  {
    id: 3,
    type: "tournament",
    action: "created",
    target: "Weekly Battle Royale",
    time: "45 minutes ago",
  },
  {
    id: 4,
    type: "team",
    action: "requested",
    target: "verification for Team Alpha",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "payment",
    action: "requested",
    target: "withdrawal of $200.00",
    time: "3 hours ago",
  },
  {
    id: 6,
    type: "user",
    action: "reported",
    target: "inappropriate behavior",
    time: "5 hours ago",
  },
];

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  changeValue, 
  changeType,
  className,
}: { 
  title: string, 
  value: string | number, 
  icon: React.ReactNode, 
  description?: string, 
  changeValue?: string | number,
  changeType?: "increase" | "decrease" | "neutral",
  className?: string,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {changeValue && (
          <div className="flex items-center gap-1 mt-2">
            {changeType === "increase" && (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            )}
            {changeType === "decrease" && (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            {changeType === "neutral" && (
              <ArrowRight className="h-4 w-4 text-yellow-500" />
            )}
            <p className={cn(
              "text-xs font-medium",
              changeType === "increase" && "text-green-500",
              changeType === "decrease" && "text-red-500",
              changeType === "neutral" && "text-yellow-500"
            )}>
              {changeValue}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ item }: { item: typeof recentActivityData[number] }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-8 w-8 text-blue-500" />;
      case "payment":
        return <Wallet className="h-8 w-8 text-green-500" />;
      case "tournament":
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case "team":
        return <BadgeCheck className="h-8 w-8 text-indigo-500" />;
      default:
        return <BarChart3 className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start gap-4 py-4">
      <div className="rounded-full bg-secondary/30 p-2">
        {getIcon(item.type)}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">
          <span className="capitalize">{item.type}</span> {item.action} {item.target}
        </p>
        <p className="text-xs text-muted-foreground">{item.time}</p>
      </div>
      <Button variant="ghost" size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function AdminDashboard() {
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      // In a real app, you would fetch this data from the server
      return {
        totalUsers: 3452,
        activeUsers: 842,
        newUsersToday: 56,
        totalRevenue: 34928.50,
        revenueChange: 12.8,
        pendingWithdrawals: 8,
        ongoingTournaments: 16,
        totalTransactions: 2842,
        transactionsToday: 184,
      };
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Overview of your platform's stats and activities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tabs defaultValue="daily" className="w-[300px]">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="w-full h-24 animate-pulse overflow-hidden">
                <div className="bg-muted h-full"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={dashboardStats?.totalUsers || 0}
              description={`${dashboardStats?.newUsersToday || 0} new today`}
              icon={<Users className="h-4 w-4" />}
              changeValue="+12% from last month"
              changeType="increase"
            />
            <StatCard
              title="Active Users"
              value={dashboardStats?.activeUsers || 0}
              description="Current online users"
              icon={<UserCheck className="h-4 w-4" />}
              changeValue="+5% from last week"
              changeType="increase"
            />
            <StatCard
              title="Total Revenue"
              value={`$${dashboardStats?.totalRevenue.toLocaleString() || 0}`}
              description="All time platform revenue"
              icon={<CreditCard className="h-4 w-4" />}
              changeValue={`${dashboardStats?.revenueChange || 0}% from last month`}
              changeType="increase"
            />
            <StatCard
              title="Pending Withdrawals"
              value={dashboardStats?.pendingWithdrawals || 0}
              description="Pending approval"
              icon={<Wallet className="h-4 w-4" />}
              changeValue="-3 since yesterday"
              changeType="decrease"
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 overflow-hidden">
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Monthly revenue trend for the past year
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorUv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 overflow-hidden">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest user actions and platform events
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-auto px-2 md:px-6">
              <div className="space-y-0 divide-y">
                {recentActivityData.map((activity) => (
                  <ActivityItem key={activity.id} item={activity} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4 flex justify-center">
              <Button variant="ghost" className="w-full" size="sm">
                View All Activity
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 overflow-hidden">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                New vs. active users over the past year
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={userActivityData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="active" fill="hsl(var(--primary))" name="Active Users" />
                    <Bar dataKey="new" fill="hsl(var(--primary) / 0.5)" name="New Users" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 overflow-hidden">
            <CardHeader>
              <CardTitle>Tournament Distribution</CardTitle>
              <CardDescription>
                Breakdown by tournament type
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex justify-center">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Ongoing Tournaments"
            value={dashboardStats?.ongoingTournaments || 0}
            description="Currently active tournaments"
            icon={<Trophy className="h-4 w-4" />}
            className="h-full"
          />
          <StatCard
            title="Total Transactions"
            value={dashboardStats?.totalTransactions || 0}
            description={`${dashboardStats?.transactionsToday || 0} new today`}
            icon={<CreditCard className="h-4 w-4" />}
            className="h-full"
          />
          <div className="flex flex-col gap-4">
            <Button variant="default" className="w-full">
              Generate Full Report
              <BarChart className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" className="w-full">
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}