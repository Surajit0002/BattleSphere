import { useState } from "react";
import { Match, Team } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  Award, 
  ShieldCheck, 
  Zap, 
  Flag, 
  Sword, 
  Heart 
} from "lucide-react";

interface MatchPredictionProps {
  match: Match;
  teams: Team[];
  onPredictionSubmit: (teamId: number, confidenceScore: number) => void;
  userWalletBalance?: number;
  disablePrediction?: boolean;
}

export default function MatchPrediction({ match, teams, onPredictionSubmit, userWalletBalance = 0, disablePrediction = false }: MatchPredictionProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(50);
  const [predictionAmount, setPredictionAmount] = useState<number>(10);
  const { toast } = useToast();
  
  const team1 = teams?.find(t => t.id === match.team1Id) || null;
  const team2 = teams?.find(t => t.id === match.team2Id) || null;
  
  // Simulated community prediction percentages
  const team1Percentage = 62;
  const team2Percentage = 38;

  // Stats comparison
  const stats = [
    { name: "Win Rate", team1: team1?.winRate || 50, team2: team2?.winRate || 45 },
    { name: "Matches Played", team1: team1?.totalMatches || 20, team2: team2?.totalMatches || 15 },
    { name: "Squad Strength", team1: 78, team2: 73 },
    { name: "Avg. Placement", team1: 4.2, team2: 5.7 },
    { name: "K/D Ratio", team1: 3.8, team2: 3.2 }
  ];
  
  // Get better team for a stat
  const getBetterTeam = (stat: { team1: number, team2: number }, isLowerBetter = false) => {
    if (isLowerBetter) {
      return stat.team1 < stat.team2 ? 1 : 2;
    } else {
      return stat.team1 > stat.team2 ? 1 : 2;
    }
  };
  
  // Calculate potential winnings
  const calculatePotentialWinnings = (amount: number, confidence: number) => {
    // Higher confidence means lower multiplier (less risk)
    const confidenceMultiplier = 2 - (confidence / 100);
    
    // If you're choosing the underdog, you get a better multiplier
    const oddsFactor = selectedTeamId === match.team1Id ? (team2Percentage / team1Percentage) : (team1Percentage / team2Percentage);
    
    // Final multiplier with min 1.05x and max 3.0x
    const multiplier = Math.min(Math.max(confidenceMultiplier * oddsFactor, 1.05), 3.0);
    
    return (amount * multiplier).toFixed(2);
  };
  
  // Handle prediction
  const handleSubmitPrediction = () => {
    if (!selectedTeamId) {
      toast({
        title: "Error",
        description: "Please select a team to predict",
        variant: "destructive"
      });
      return;
    }
    
    if (predictionAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid prediction amount",
        variant: "destructive"
      });
      return;
    }
    
    if (predictionAmount > userWalletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this prediction",
        variant: "destructive"
      });
      return;
    }
    
    // Call the onPredictionSubmit prop
    onPredictionSubmit(selectedTeamId, confidenceScore);
    
    // Show success message
    toast({
      title: "Prediction Submitted!",
      description: `You predicted ${selectedTeamId === match.team1Id ? match.team1Name : match.team2Name} will win with ${confidenceScore}% confidence.`,
    });
    
    // Reset form
    setSelectedTeamId(null);
    setConfidenceScore(50);
    setPredictionAmount(10);
  };
  
  // If match is missing teams or is already completed
  if (!match.team1Id || !match.team2Id || match.status === "completed" || match.status === "cancelled") {
    return (
      <Card className="bg-gradient-to-b from-gray-900/50 to-black/70 border border-gray-800 p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            {match.status === "completed" ? "Match Completed" : "Predictions Unavailable"}
          </h3>
          <p className="text-gray-400">
            {match.status === "completed" 
              ? `This match has ended. ${match.winnerId ? (match.winnerId === match.team1Id ? match.team1Name : match.team2Name) + " won!" : ""}` 
              : "Predictions are only available for upcoming matches with confirmed teams."}
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gradient-to-b from-gray-900/50 to-black/70 border border-gray-800 overflow-hidden">
      <div className="p-5 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white">Match Prediction</h3>
        <p className="text-gray-400 text-sm mt-1">Predict the winner and win rewards</p>
      </div>
      
      {/* Community predictions */}
      <div className="p-5 border-b border-gray-800">
        <h4 className="text-sm text-gray-400 mb-3 flex items-center">
          <BarChart2 className="h-4 w-4 mr-1.5" /> COMMUNITY PREDICTIONS
        </h4>
        
        <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-l-full"
            style={{ width: `${team1Percentage}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center">
            <div className="w-1/2 text-center text-white text-sm font-medium">
              {team1Percentage}%
            </div>
            <div className="w-1/2 text-center text-white text-sm font-medium">
              {team2Percentage}%
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-sm">
          <div className="text-gray-400">{match.team1Name}</div>
          <div className="text-gray-400">{match.team2Name}</div>
        </div>
      </div>
      
      {/* Teams comparison */}
      <div className="p-5 border-b border-gray-800">
        <h4 className="text-sm text-gray-400 mb-3 flex items-center">
          <Award className="h-4 w-4 mr-1.5" /> TEAM PERFORMANCE COMPARISON
        </h4>
        
        <div className="space-y-3">
          {stats.map((stat, index) => {
            const betterTeam = getBetterTeam(stat, stat.name === "Avg. Placement");
            return (
              <div key={index} className="flex items-center">
                <div className="w-1/3 flex items-center">
                  <div 
                    className={`font-medium ${betterTeam === 1 ? "text-accent-green" : "text-white"}`}
                  >
                    {stat.team1}
                    {betterTeam === 1 && <TrendingUp className="inline h-3 w-3 ml-1" />}
                  </div>
                </div>
                
                <div className="w-1/3 text-center text-xs text-gray-500 font-medium">
                  {stat.name}
                </div>
                
                <div className="w-1/3 flex items-center justify-end">
                  <div 
                    className={`font-medium ${betterTeam === 2 ? "text-accent-green" : "text-white"}`}
                  >
                    {betterTeam === 2 && <TrendingUp className="inline h-3 w-3 mr-1" />}
                    {stat.team2}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Key strengths */}
      <div className="p-5 border-b border-gray-800">
        <h4 className="text-sm text-gray-400 mb-3 flex items-center">
          <Zap className="h-4 w-4 mr-1.5" /> KEY STRENGTHS
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <div className="flex items-center text-primary mb-1">
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              <span className="font-medium">{match.team1Name}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-300">
                <Sword className="h-3 w-3 mr-1 text-accent-yellow" />
                <span>Superior early game</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Flag className="h-3 w-3 mr-1 text-accent-green" />
                <span>Strategic zone control</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Heart className="h-3 w-3 mr-1 text-accent-red" />
                <span>Team synergy</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <div className="flex items-center text-primary mb-1">
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              <span className="font-medium">{match.team2Name}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-300">
                <Sword className="h-3 w-3 mr-1 text-accent-yellow" />
                <span>Aggressive playstyle</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Flag className="h-3 w-3 mr-1 text-accent-red" />
                <span>Late game specialists</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Heart className="h-3 w-3 mr-1 text-accent-blue" />
                <span>Clutch performers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Make prediction */}
      {!disablePrediction && (
        <div className="p-5">
          <h4 className="text-sm text-gray-400 mb-3 flex items-center">
            <Flag className="h-4 w-4 mr-1.5" /> MAKE YOUR PREDICTION
          </h4>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              variant="outline"
              className={`border-2 h-auto py-3 ${
                selectedTeamId === match.team1Id 
                  ? "border-primary text-primary bg-primary/10" 
                  : "border-gray-700 text-gray-400 hover:border-primary/50"
              }`}
              onClick={() => setSelectedTeamId(match.team1Id)}
            >
              <div className="text-center">
                <div className="font-medium">{match.team1Name}</div>
                <div className="text-xs mt-1 opacity-70">Win Chance: {team1Percentage}%</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className={`border-2 h-auto py-3 ${
                selectedTeamId === match.team2Id 
                  ? "border-primary text-primary bg-primary/10" 
                  : "border-gray-700 text-gray-400 hover:border-primary/50"
              }`}
              onClick={() => setSelectedTeamId(match.team2Id)}
            >
              <div className="text-center">
                <div className="font-medium">{match.team2Name}</div>
                <div className="text-xs mt-1 opacity-70">Win Chance: {team2Percentage}%</div>
              </div>
            </Button>
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-gray-400">How confident are you?</div>
              <div className="text-sm font-medium">{confidenceScore}%</div>
            </div>
            
            <Slider
              value={[confidenceScore]}
              onValueChange={(value) => setConfidenceScore(value[0])}
              min={1}
              max={100}
              step={1}
              className="mb-2"
            />
            
            <div className="flex justify-between text-xs text-gray-500">
              <div>Low confidence</div>
              <div>High confidence</div>
            </div>
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-gray-400">Prediction Amount (₹)</div>
              <div className="text-sm font-medium">₹{predictionAmount}</div>
            </div>
            
            <Slider
              value={[predictionAmount]}
              onValueChange={(value) => setPredictionAmount(value[0])}
              min={10}
              max={500}
              step={10}
              className="mb-2"
            />
            
            <div className="flex justify-between text-xs">
              <div className="text-gray-500">Min: ₹10</div>
              <div className="text-gray-500">Available: ₹{userWalletBalance}</div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
            <div className="flex justify-between mb-1">
              <div className="text-sm text-gray-400">Your prediction:</div>
              <div className="text-sm font-medium text-white">
                {selectedTeamId === match.team1Id 
                  ? match.team1Name 
                  : selectedTeamId === match.team2Id 
                    ? match.team2Name 
                    : "-"}
              </div>
            </div>
            <div className="flex justify-between mb-1">
              <div className="text-sm text-gray-400">Confidence level:</div>
              <div className="text-sm font-medium text-white">{confidenceScore}%</div>
            </div>
            <div className="flex justify-between mb-1">
              <div className="text-sm text-gray-400">Amount:</div>
              <div className="text-sm font-medium text-white">₹{predictionAmount}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm text-gray-400">Potential winnings:</div>
              <div className="text-sm font-medium text-accent-green">
                ₹{selectedTeamId ? calculatePotentialWinnings(predictionAmount, confidenceScore) : "0.00"}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleSubmitPrediction}
            disabled={!selectedTeamId || predictionAmount <= 0 || predictionAmount > userWalletBalance}
            className="w-full bg-gradient-to-r from-primary to-accent-blue text-white font-medium"
          >
            Submit Prediction
          </Button>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Predictions can be made up to 15 minutes before the match starts.
          </p>
        </div>
      )}
    </Card>
  );
}