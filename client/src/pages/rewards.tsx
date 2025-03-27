import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function RewardsPage() {
  const [virtualCoins, setVirtualCoins] = useState(1500);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  
  const handleSpin = () => {
    if (virtualCoins < 100) return;
    
    // Deduct coins for spinning
    setVirtualCoins(prev => prev - 100);
    
    // Simulate random reward
    const rewards = [
      "50 Coins", "100 Coins", "200 Coins", "Free Tournament Entry", 
      "500 Coins", "₹10 Cash", "Special Avatar", "Better Luck Next Time"
    ];
    
    const result = rewards[Math.floor(Math.random() * rewards.length)];
    setSpinResult(result);
    
    // Add rewards if coins
    if (result === "50 Coins") setVirtualCoins(prev => prev + 50);
    if (result === "100 Coins") setVirtualCoins(prev => prev + 100);
    if (result === "200 Coins") setVirtualCoins(prev => prev + 200);
    if (result === "500 Coins") setVirtualCoins(prev => prev + 500);
  };
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-rajdhani text-white mb-2">REWARDS & STORE</h1>
        <p className="text-gray-400">
          Earn coins, redeem rewards, and claim exclusive items
        </p>
      </div>
      
      {/* Wallet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-secondary-bg border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-rajdhani text-white">Cash Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-rajdhani text-accent-green">₹1,250</div>
            <div className="flex mt-4">
              <Button className="w-full bg-accent-blue hover:bg-accent-blue/90 mr-2">Add Funds</Button>
              <Button className="w-full bg-gray-800 hover:bg-gray-700 border border-accent-blue/30">Withdraw</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary-bg border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-rajdhani text-white">Virtual Coins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-rajdhani text-accent-yellow">{virtualCoins}</div>
            <div className="text-xs text-gray-400 mt-1">Exchange rate: 1000 coins = ₹1</div>
            <div className="flex mt-4">
              <Button className="w-full bg-gray-800 hover:bg-gray-700 mr-2">Earn More</Button>
              <Button className="w-full bg-accent-blue hover:bg-accent-blue/90">Exchange</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary-bg border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-rajdhani text-white">Daily Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-rajdhani text-accent-pink">5 Days</div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress to bonus</span>
                <span>5/7 days</span>
              </div>
              <Progress value={71} className="h-2 bg-gray-700" indicatorClassName="bg-accent-pink" />
            </div>
            <Button className="w-full mt-4 bg-accent-pink hover:bg-accent-pink/90">Claim Daily Bonus</Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="store" className="mb-6">
        <TabsList className="bg-secondary-bg border border-gray-800 p-1">
          <TabsTrigger value="store" className="data-[state=active]:bg-accent-blue data-[state=active]:text-white">
            Reward Store
          </TabsTrigger>
          <TabsTrigger value="lucky" className="data-[state=active]:bg-accent-blue data-[state=active]:text-white">
            Lucky Spin
          </TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-accent-blue data-[state=active]:text-white">
            Challenges
          </TabsTrigger>
          <TabsTrigger value="referrals" className="data-[state=active]:bg-accent-blue data-[state=active]:text-white">
            Referrals
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="store" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Store Items */}
            <StoreItem 
              title="Free Fire Character" 
              imageUrl="https://images.unsplash.com/photo-1614294148960-9aa740632a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
              price={5000} 
              virtualCoins={virtualCoins}
            />
            
            <StoreItem 
              title="Gaming Backpack" 
              imageUrl="https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
              price={7500} 
              virtualCoins={virtualCoins}
            />
            
            <StoreItem 
              title="Tournament Pass" 
              imageUrl="https://images.unsplash.com/photo-1640565819215-6a0123982de7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
              price={2000} 
              virtualCoins={virtualCoins}
            />
            
            <StoreItem 
              title="Exclusive Avatar" 
              imageUrl="https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1176&q=80" 
              price={1000} 
              virtualCoins={virtualCoins}
            />
            
            <StoreItem 
              title="₹100 Mobile Recharge" 
              imageUrl="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1176&q=80" 
              price={10000} 
              virtualCoins={virtualCoins}
            />
            
            <StoreItem 
              title="Gaming Headset" 
              imageUrl="https://images.unsplash.com/photo-1563510362804-2c5d5288d30c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1176&q=80" 
              price={25000} 
              virtualCoins={virtualCoins}
            />
            
            <StoreItem 
              title="Custom Team Logo" 
              imageUrl="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1176&q=80" 
              price={3000} 
              virtualCoins={virtualCoins}
            />
            
            <StoreItem 
              title="Pro Membership (1 Month)" 
              imageUrl="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
              price={15000} 
              virtualCoins={virtualCoins}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="lucky" className="mt-4">
          <div className="bg-secondary-bg rounded-lg border border-gray-800 p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold font-rajdhani text-white mb-2">Lucky Spin Wheel</h3>
              <p className="text-gray-400">Try your luck and win amazing rewards! Each spin costs 100 coins.</p>
            </div>
            
            <div className="flex flex-col items-center">
              {/* Wheel representation */}
              <div className="w-64 h-64 rounded-full border-4 border-accent-blue relative mb-6 animate-pulse-glow">
                <div className="absolute inset-0 rounded-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    {spinResult ? (
                      <>
                        <div className="text-lg font-bold mb-2 text-accent-yellow">{spinResult}</div>
                        <div className="text-sm text-gray-400">Spin again?</div>
                      </>
                    ) : (
                      <div className="text-lg font-bold text-white">Spin to Win!</div>
                    )}
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-b-accent-pink border-l-transparent border-r-transparent"></div>
              </div>
              
              <Button 
                className="bg-accent-pink hover:bg-accent-pink/90 text-white px-8 py-2"
                onClick={handleSpin}
                disabled={virtualCoins < 100}
              >
                Spin (100 Coins)
              </Button>
              
              {virtualCoins < 100 && (
                <div className="text-sm text-accent-pink mt-2">Not enough coins to spin!</div>
              )}
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                <div className="bg-gray-800 rounded p-3">
                  <div className="text-sm text-gray-400">Your Coins</div>
                  <div className="text-xl font-bold text-accent-yellow">{virtualCoins}</div>
                </div>
                <div className="bg-gray-800 rounded p-3">
                  <div className="text-sm text-gray-400">Today's Spins</div>
                  <div className="text-xl font-bold text-white">3/5</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="challenges" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChallengeCard 
              title="Win a Tournament" 
              description="Win a tournament in any game mode" 
              reward={1000} 
              progress={0} 
              target={1} 
            />
            
            <ChallengeCard 
              title="Play 5 Matches" 
              description="Participate in 5 matches in any game" 
              reward={300} 
              progress={3} 
              target={5} 
            />
            
            <ChallengeCard 
              title="Login Daily" 
              description="Login to BattleSphere for 7 consecutive days" 
              reward={500} 
              progress={5} 
              target={7} 
            />
            
            <ChallengeCard 
              title="Invite Friends" 
              description="Invite 3 friends to join BattleSphere" 
              reward={300} 
              progress={1} 
              target={3} 
            />
            
            <ChallengeCard 
              title="Achieve 10 Kills" 
              description="Get 10 kills in a single tournament" 
              reward={500} 
              progress={7} 
              target={10} 
            />
            
            <ChallengeCard 
              title="Reach Top 3" 
              description="Finish in the top 3 of any tournament" 
              reward={700} 
              progress={0} 
              target={1} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="referrals" className="mt-4">
          <div className="bg-secondary-bg rounded-lg border border-gray-800 p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold font-rajdhani text-white mb-2">Refer Friends, Earn Rewards</h3>
              <p className="text-gray-400">Get ₹50 for each successful referral after they play their first match!</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6 flex items-center">
              <div className="flex-1 mr-4">
                <div className="text-sm text-gray-400 mb-1">Your Referral Link</div>
                <div className="bg-gray-900 p-2 rounded text-sm overflow-x-auto">
                  https://battlesphere.com/ref/ghostsniper123
                </div>
              </div>
              <Button className="bg-accent-blue hover:bg-accent-blue/90">
                Copy Link
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded p-4 text-center">
                <div className="text-3xl font-bold text-accent-blue mb-2">5</div>
                <div className="text-sm text-gray-400">Friends Referred</div>
              </div>
              <div className="bg-gray-800 rounded p-4 text-center">
                <div className="text-3xl font-bold text-accent-green mb-2">₹200</div>
                <div className="text-sm text-gray-400">Earnings from Referrals</div>
              </div>
              <div className="bg-gray-800 rounded p-4 text-center">
                <div className="text-3xl font-bold text-accent-yellow mb-2">4</div>
                <div className="text-sm text-gray-400">Pending Referrals</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white mb-2">Recent Referrals</h4>
              
              <div className="bg-gray-800 rounded p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 mr-3 flex items-center justify-center">
                    N
                  </div>
                  <div>
                    <div className="font-medium text-white">NinjaWarrior</div>
                    <div className="text-xs text-gray-400">Joined 2 days ago</div>
                  </div>
                </div>
                <div className="text-accent-green">+₹50</div>
              </div>
              
              <div className="bg-gray-800 rounded p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 mr-3 flex items-center justify-center">
                    S
                  </div>
                  <div>
                    <div className="font-medium text-white">StealthQueen</div>
                    <div className="text-xs text-gray-400">Joined 5 days ago</div>
                  </div>
                </div>
                <div className="text-accent-green">+₹50</div>
              </div>
              
              <div className="bg-gray-800 rounded p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 mr-3 flex items-center justify-center">
                    E
                  </div>
                  <div>
                    <div className="font-medium text-white">EagleEye</div>
                    <div className="text-xs text-gray-400">Joined 1 week ago</div>
                  </div>
                </div>
                <div className="text-accent-green">+₹50</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* VIP Membership */}
      <div className="bg-secondary-bg rounded-lg border border-gray-800 p-6 mb-10">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold font-rajdhani text-white mb-2">VIP Membership Plans</h3>
          <p className="text-gray-400">Get exclusive perks and bonuses with our premium plans</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-900 text-center">
              <h4 className="font-rajdhani font-bold text-white">Free</h4>
              <div className="text-2xl font-bold text-accent-blue my-2">₹0</div>
              <div className="text-xs text-gray-400">per month</div>
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <i className="ri-check-line text-accent-green mr-2"></i>
                  Limited tournaments
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-accent-green mr-2"></i>
                  Basic rewards
                </li>
                <li className="flex items-center text-gray-500">
                  <i className="ri-close-line text-accent-pink mr-2"></i>
                  Premium tournaments
                </li>
                <li className="flex items-center text-gray-500">
                  <i className="ri-close-line text-accent-pink mr-2"></i>
                  Exclusive rewards
                </li>
              </ul>
              <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600" disabled>
                Current Plan
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg border border-accent-yellow overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-accent-yellow text-gray-900 text-xs font-bold px-2 py-1">
              POPULAR
            </div>
            <div className="p-4 bg-gray-900 text-center">
              <h4 className="font-rajdhani font-bold text-white">Pro</h4>
              <div className="text-2xl font-bold text-accent-yellow my-2">₹199</div>
              <div className="text-xs text-gray-400">per month</div>
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <i className="ri-check-line text-accent-green mr-2"></i>
                  Access to all tournaments
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-accent-green mr-2"></i>
                  Increased coin rewards
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-accent-green mr-2"></i>
                  Priority registration
                </li>
                <li className="flex items-center text-gray-500">
                  <i className="ri-close-line text-accent-pink mr-2"></i>
                  Custom team badges
                </li>
              </ul>
              <Button className="w-full mt-4 bg-accent-yellow hover:bg-accent-yellow/90 text-gray-900">
                Upgrade Now
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg border border-accent-pink overflow-hidden">
            <div className="p-4 bg-gray-900 text-center">
              <h4 className="font-rajdhani font-bold text-white">Elite</h4>
              <div className="text-2xl font-bold text-accent-pink my-2">₹499</div>
              <div className="text-xs text-gray-400">per month</div>
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <i className="ri-check-line text-accent-green mr-2"></i>
                  All Pro features
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-accent-green mr-2"></i>
                  Exclusive tournaments
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-accent-green mr-2"></i>
                  Custom team badges
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-accent-green mr-2"></i>
                  Premium support
                </li>
              </ul>
              <Button className="w-full mt-4 bg-accent-pink hover:bg-accent-pink/90">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface StoreItemProps {
  title: string;
  imageUrl: string;
  price: number;
  virtualCoins: number;
}

function StoreItem({ title, imageUrl, price, virtualCoins }: StoreItemProps) {
  const canAfford = virtualCoins >= price;
  
  return (
    <Card className="bg-secondary-bg border-gray-800 overflow-hidden">
      <div className="h-40 relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-2 right-2 bg-accent-yellow text-gray-900 text-xs font-bold px-2 py-1 rounded">
          {price} Coins
        </div>
      </div>
      <CardContent className="p-4">
        <h4 className="font-medium text-white mb-4">{title}</h4>
        <Button 
          className={`w-full ${canAfford ? 'bg-accent-blue hover:bg-accent-blue/90' : 'bg-gray-700'}`}
          disabled={!canAfford}
        >
          {canAfford ? 'Redeem' : 'Not Enough Coins'}
        </Button>
      </CardContent>
    </Card>
  );
}

interface ChallengeCardProps {
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
}

function ChallengeCard({ title, description, reward, progress, target }: ChallengeCardProps) {
  const isComplete = progress >= target;
  const progressPercentage = Math.min(100, (progress / target) * 100);
  
  return (
    <Card className="bg-secondary-bg border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-rajdhani text-white">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress}/{target}</span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-gray-700" />
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <div className="text-xs text-gray-400">Reward</div>
            <div className="text-lg font-medium text-accent-yellow">{reward} Coins</div>
          </div>
          <Button 
            className={isComplete ? 'bg-accent-blue hover:bg-accent-blue/90' : 'bg-gray-700'} 
            disabled={!isComplete}
          >
            {isComplete ? 'Claim' : 'In Progress'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
