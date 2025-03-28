import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RootLayout from "@/layouts/RootLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Gift,
  Trophy,
  Calendar,
  Clock,
  ChevronRight,
  CreditCard,
  Link,
  BarChart3,
  Star,
  Lock,
  Check,
  Rocket,
  Users,
  Award,
  DollarSign,
  Zap,
  ExternalLink,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for rewards
const mockRewards = {
  dailyRewards: [
    { 
      id: 1, 
      name: "Day 1", 
      description: "Daily login reward", 
      reward: "100 Coins", 
      icon: <Gift className="h-8 w-8" />, 
      claimed: true,
      available: true,
      cooldown: 0
    },
    { 
      id: 2, 
      name: "Day 2", 
      description: "Daily login reward", 
      reward: "150 Coins", 
      icon: <Gift className="h-8 w-8" />, 
      claimed: true,
      available: true,
      cooldown: 0
    },
    { 
      id: 3, 
      name: "Day 3", 
      description: "Daily login reward", 
      reward: "200 Coins", 
      icon: <Gift className="h-8 w-8" />, 
      claimed: false,
      available: true,
      cooldown: 0
    },
    { 
      id: 4, 
      name: "Day 4", 
      description: "Daily login reward", 
      reward: "250 Coins", 
      icon: <Gift className="h-8 w-8" />, 
      claimed: false,
      available: false,
      cooldown: 0
    },
    { 
      id: 5, 
      name: "Day 5", 
      description: "Daily login reward", 
      reward: "300 Coins", 
      icon: <Gift className="h-8 w-8" />, 
      claimed: false,
      available: false,
      cooldown: 0
    },
    { 
      id: 6, 
      name: "Day 6", 
      description: "Daily login reward", 
      reward: "350 Coins", 
      icon: <Gift className="h-8 w-8" />, 
      claimed: false,
      available: false,
      cooldown: 0
    },
    { 
      id: 7, 
      name: "Day 7", 
      description: "Weekly Bonus", 
      reward: "Premium Booster Pack", 
      icon: <Gift className="h-8 w-8" />, 
      claimed: false,
      available: false,
      cooldown: 0,
      premium: true
    },
  ],
  achievements: [
    {
      id: 1,
      name: "Tournament Champion",
      description: "Win your first tournament",
      reward: "500 Coins",
      progress: 100,
      claimed: true,
      icon: <Trophy className="h-8 w-8" />
    },
    {
      id: 2,
      name: "Team Builder",
      description: "Create your first team",
      reward: "300 Coins",
      progress: 100,
      claimed: true,
      icon: <Users className="h-8 w-8" />
    },
    {
      id: 3,
      name: "Social Butterfly",
      description: "Connect social media accounts",
      reward: "150 Coins",
      progress: 50,
      claimed: false,
      icon: <Link className="h-8 w-8" />
    },
    {
      id: 4,
      name: "Perfect Attendance",
      description: "Log in for 30 consecutive days",
      reward: "1,000 Coins",
      progress: 40,
      claimed: false,
      icon: <Calendar className="h-8 w-8" />
    },
    {
      id: 5,
      name: "Refer a Friend",
      description: "Invite 5 friends to BattleSphere",
      reward: "750 Coins",
      progress: 20,
      claimed: false,
      icon: <Users className="h-8 w-8" />
    }
  ],
  challenges: [
    {
      id: 1,
      name: "Weekly Tournament Challenge",
      description: "Participate in at least 3 tournaments this week",
      reward: "300 Coins",
      progress: 2,
      total: 3,
      expires: "2025-04-01T00:00:00Z",
      icon: <Trophy className="h-8 w-8" />
    },
    {
      id: 2,
      name: "Team Victory",
      description: "Win 5 matches with your team",
      reward: "500 Coins",
      progress: 3,
      total: 5,
      expires: "2025-04-03T00:00:00Z",
      icon: <Users className="h-8 w-8" />
    },
    {
      id: 3,
      name: "Social Media Star",
      description: "Share 2 tournament results on social media",
      reward: "150 Coins",
      progress: 1,
      total: 2,
      expires: "2025-04-05T00:00:00Z",
      icon: <Link className="h-8 w-8" />
    }
  ],
  redeemableRewards: [
    {
      id: 1,
      name: "Tournament Entry Fee Waiver",
      description: "Enter one tournament for free",
      cost: 1000,
      icon: <Trophy className="h-8 w-8" />,
      available: true,
      cooldown: null,
      limited: false
    },
    {
      id: 2,
      name: "Premium Profile Banner",
      description: "Unlock an exclusive profile banner",
      cost: 2000,
      icon: <Award className="h-8 w-8" />,
      available: true,
      cooldown: null,
      limited: false
    },
    {
      id: 3,
      name: "Team Logo Customization",
      description: "Unlock advanced team logo customization options",
      cost: 3000,
      icon: <Rocket className="h-8 w-8" />,
      available: true,
      cooldown: null,
      limited: false
    },
    {
      id: 4,
      name: "Exclusive Tournament Access",
      description: "Gain access to premium tournaments",
      cost: 5000,
      icon: <Star className="h-8 w-8" />,
      available: true,
      cooldown: null,
      limited: true,
      limitedCount: 10
    }
  ],
  rewards: [
    {
      id: 1,
      name: "Free Tournament Entry",
      description: "You've received a free tournament entry ticket",
      date: "2025-03-28T10:00:00Z",
      expired: false,
      used: false,
      icon: <Trophy className="h-8 w-8" />
    },
    {
      id: 2,
      name: "Weekly Login Bonus",
      description: "500 Coins bonus for continuous login",
      date: "2025-03-25T10:00:00Z",
      expired: false,
      used: true,
      icon: <Gift className="h-8 w-8" />
    },
    {
      id: 3,
      name: "Tournament Participation Bonus",
      description: "200 Coins for participating in tournament",
      date: "2025-03-20T10:00:00Z",
      expired: false,
      used: true,
      icon: <Trophy className="h-8 w-8" />
    }
  ],
  userStats: {
    coins: 3850,
    streak: 15,
    nextReward: "2025-03-29T00:00:00Z",
    totalEarned: 12500,
    totalSpent: 8650
  }
};

interface RewardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: React.ReactNode;
  footer?: React.ReactNode;
  highlight?: boolean;
}

const RewardCard = ({ title, description, icon, action, footer, highlight }: RewardCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all ${highlight ? 'border-primary shadow-md' : ''}`}>
      <div className="relative">
        {highlight && (
          <div className="absolute top-0 right-0">
            <Badge className="rounded-none rounded-bl-lg bg-primary">
              <Zap className="h-3 w-3 mr-1" /> Available Now
            </Badge>
          </div>
        )}
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${highlight ? 'bg-primary/20 text-primary' : 'bg-muted text-foreground'}`}>
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex justify-between p-4 pt-0">
        {action}
        {footer && (
          <div className="text-xs text-muted-foreground flex items-center">
            {footer}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

interface DailyRewardProps {
  reward: any;
  day: number;
  totalDays: number;
}

const DailyReward = ({ reward, day, totalDays }: DailyRewardProps) => {
  const isPremium = reward.premium;
  
  return (
    <div className={`relative rounded-lg border p-4 flex flex-col items-center text-center gap-2
      ${reward.claimed ? 'bg-muted' : reward.available ? 'border-primary bg-primary/5' : ''}`}
    >
      {isPremium && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-amber-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}
      
      <div className="text-xl font-bold">Day {day}</div>
      
      <div className={`p-4 rounded-full 
        ${reward.claimed ? 'bg-muted text-muted-foreground' : 
        reward.available ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'}`}
      >
        {reward.icon}
      </div>
      
      <div className="font-medium">{reward.reward}</div>
      
      {reward.claimed ? (
        <Badge variant="outline" className="gap-1">
          <Check className="h-3 w-3" /> Claimed
        </Badge>
      ) : reward.available ? (
        <Button size="sm" className="mt-2 w-full">Claim</Button>
      ) : (
        <Button size="sm" className="mt-2 w-full" variant="outline" disabled>
          <Lock className="h-3 w-3 mr-1" /> Locked
        </Button>
      )}
    </div>
  );
};

const RewardDialog = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Complete actions to earn rewards
          </DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button type="submit">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("daily");
  
  const { data: userData } = useQuery({
    queryKey: ["/api/user/profile"],
    retry: false,
  });
  
  const { data: rewards = mockRewards } = useQuery({
    queryKey: ["/api/rewards"],
    initialData: mockRewards,
    enabled: false
  });
  
  const getTimeRemaining = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const diffMs = target.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Expired";
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`;
    } else {
      return `${diffHours}h remaining`;
    }
  };
  
  return (
    <RootLayout>
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rewards Center</h1>
            <p className="text-muted-foreground">Complete challenges, earn achievements, and redeem rewards</p>
          </div>
          
          <Card className="p-4 w-full md:w-auto">
            <div className="flex gap-6">
              <div>
                <div className="text-sm text-muted-foreground">Your Balance</div>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                  {rewards.userStats.coins.toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Login Streak</div>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <Calendar className="h-5 w-5 text-primary" />
                  {rewards.userStats.streak} days
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <Tabs defaultValue="daily" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[600px] grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="daily">Daily Rewards</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="redeem">Redeem</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {rewards.dailyRewards.map((reward, index) => (
                <DailyReward 
                  key={reward.id} 
                  reward={reward} 
                  day={index + 1} 
                  totalDays={rewards.dailyRewards.length} 
                />
              ))}
            </div>
            
            <Alert className="bg-primary/10 border-primary">
              <Zap className="h-5 w-5 text-primary" />
              <AlertTitle>Don't miss your daily rewards!</AlertTitle>
              <AlertDescription>
                Log in every day to receive rewards. If you miss a day, your streak will reset.
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Next daily reward available in: 12h 34m</span>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rewards.achievements.map((achievement) => (
                <RewardCard
                  key={achievement.id}
                  title={achievement.name}
                  description={achievement.description}
                  icon={achievement.icon}
                  highlight={achievement.progress === 100 && !achievement.claimed}
                  action={
                    achievement.claimed ? (
                      <Badge variant="outline" className="gap-1">
                        <Check className="h-3 w-3" /> Claimed
                      </Badge>
                    ) : achievement.progress === 100 ? (
                      <Button>Claim {achievement.reward}</Button>
                    ) : (
                      <Button variant="outline" disabled>In Progress</Button>
                    )
                  }
                  footer={
                    achievement.claimed ? null : (
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )
                  }
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rewards.challenges.map((challenge) => (
                <RewardCard
                  key={challenge.id}
                  title={challenge.name}
                  description={challenge.description}
                  icon={challenge.icon}
                  highlight={false}
                  action={
                    <Button 
                      variant={challenge.progress === challenge.total ? "default" : "outline"}
                      disabled={challenge.progress !== challenge.total}
                    >
                      {challenge.progress === challenge.total ? `Claim ${challenge.reward}` : "In Progress"}
                    </Button>
                  }
                  footer={
                    <>
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{challenge.progress} / {challenge.total}</span>
                        </div>
                        <Progress 
                          value={(challenge.progress / challenge.total) * 100} 
                          className="h-2" 
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeRemaining(challenge.expires)}</span>
                      </div>
                    </>
                  }
                />
              ))}
            </div>
            
            <Alert className="bg-muted">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Weekly Challenges</AlertTitle>
              <AlertDescription>
                New challenges are available every week. Complete them before they expire to earn rewards.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="redeem" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rewards.redeemableRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  title={reward.name}
                  description={reward.description}
                  icon={reward.icon}
                  highlight={rewards.userStats.coins >= reward.cost}
                  action={
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 font-semibold">
                        <DollarSign className="h-4 w-4 text-amber-500" />
                        <span>{reward.cost.toLocaleString()} Coins</span>
                      </div>
                      <Button 
                        disabled={rewards.userStats.coins < reward.cost}
                        variant={rewards.userStats.coins >= reward.cost ? "default" : "outline"}
                      >
                        Redeem Now
                      </Button>
                    </div>
                  }
                  footer={
                    reward.limited ? (
                      <Badge variant="outline" className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> Limited: {reward.limitedCount} left
                      </Badge>
                    ) : null
                  }
                />
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Rewards</CardTitle>
                <CardDescription>
                  Rewards you've earned but haven't used yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewards.rewards.filter(r => !r.used && !r.expired).map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                          {reward.icon}
                        </div>
                        <div>
                          <div className="font-medium">{reward.name}</div>
                          <div className="text-sm text-muted-foreground">{reward.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Received: {new Date(reward.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Use</Button>
                    </div>
                  ))}
                  
                  {rewards.rewards.filter(r => !r.used && !r.expired).length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Gift className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No unused rewards</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Alert>
              <DollarSign className="h-5 w-5" />
              <AlertTitle>Coin Balance</AlertTitle>
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total Earned:</span>
                  <span className="font-medium">{rewards.userStats.totalEarned.toLocaleString()} Coins</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="font-medium">{rewards.userStats.totalSpent.toLocaleString()} Coins</span>
                </div>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
}