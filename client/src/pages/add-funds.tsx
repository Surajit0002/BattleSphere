import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Wallet, ArrowRight, ShieldCheck, Clock, CheckCircle2, Info } from "lucide-react";
import { useLocation } from "wouter";

export default function AddFunds() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("creditcard");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [walletId, setWalletId] = useState("");
  
  const presetAmounts = [
    { value: "500", label: "₹500", bonus: "0" },
    { value: "1000", label: "₹1,000", bonus: "₹50" },
    { value: "2000", label: "₹2,000", bonus: "₹150" },
    { value: "5000", label: "₹5,000", bonus: "₹500" },
  ];

  const handlePresetClick = (value: string) => {
    setSelectedPreset(value);
    setAmount(value);
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPreset(null);
    setAmount(e.target.value.replace(/[^0-9]/g, ""));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    
    setCardExpiry(value);
  };

  const handleAddFunds = () => {
    if (!amount || parseInt(amount) < 100) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter at least ₹100 to add to your wallet",
      });
      return;
    }

    // Validate payment method fields
    if (paymentMethod === "creditcard") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast({
          variant: "destructive",
          title: "Missing payment details",
          description: "Please fill in all card details",
        });
        return;
      }
    } else if (paymentMethod === "upi" && !upiId) {
      toast({
        variant: "destructive",
        title: "Missing UPI ID",
        description: "Please enter your UPI ID",
      });
      return;
    } else if (paymentMethod === "wallet" && !walletId) {
      toast({
        variant: "destructive",
        title: "Missing wallet ID",
        description: "Please enter your E-wallet ID",
      });
      return;
    }

    // Simulated success toast
    toast({
      title: "Payment Processing",
      description: "Redirecting to payment gateway...",
    });

    // Simulate a redirect to payment gateway
    setTimeout(() => {
      navigate("/profile");
      toast({
        title: "Funds Added Successfully!",
        description: `₹${amount} has been added to your wallet`
      });
    }, 2000);
  };

  // Calculate bonus amount
  const getBonus = () => {
    const numAmount = parseInt(amount);
    if (!numAmount) return 0;
    
    if (numAmount >= 5000) return numAmount * 0.1;
    if (numAmount >= 2000) return numAmount * 0.075;
    if (numAmount >= 1000) return numAmount * 0.05;
    if (numAmount >= 500) return numAmount * 0.025;
    return 0;
  };

  const bonus = getBonus();
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Add Funds to Your Wallet</h1>
        <p className="text-muted-foreground mt-2">Securely add funds to participate in tournaments or purchase rewards</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Amount</CardTitle>
              <CardDescription>Choose a preset amount or enter a custom value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={`border rounded-lg p-3 text-center transition-all ${
                      selectedPreset === preset.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handlePresetClick(preset.value)}
                  >
                    <div className="font-medium">{preset.label}</div>
                    {preset.bonus !== "0" && (
                      <div className="text-xs text-green-500 font-medium mt-1">+{preset.bonus} Bonus</div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Or enter a custom amount (Min: ₹100)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="custom-amount"
                    className="pl-7"
                    value={amount}
                    onChange={handleCustomAmount}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="creditcard">Credit/Debit Card</TabsTrigger>
                  <TabsTrigger value="upi">UPI</TabsTrigger>
                  <TabsTrigger value="wallet">E-Wallet</TabsTrigger>
                </TabsList>
                
                <TabsContent value="creditcard" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="card-number"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input
                      id="card-name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="123"
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="upi" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input
                      id="upi-id"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@upi"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">You'll receive a payment request on your UPI app</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <img src="https://i.imgur.com/WIAP9Ku.png" alt="GPay" className="h-8" />
                    <img src="https://i.imgur.com/vI1SZcH.png" alt="PhonePe" className="h-8" />
                    <img src="https://i.imgur.com/XawGtO3.png" alt="Paytm" className="h-8" />
                    <img src="https://i.imgur.com/kPZOuLe.png" alt="BHIM" className="h-8" />
                  </div>
                </TabsContent>
                
                <TabsContent value="wallet" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-type">Select E-Wallet</Label>
                    <RadioGroup defaultValue="paytm">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paytm" id="paytm" />
                        <Label htmlFor="paytm">Paytm Wallet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phonepe" id="phonepe" />
                        <Label htmlFor="phonepe">PhonePe Wallet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amazon" id="amazon" />
                        <Label htmlFor="amazon">Amazon Pay</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wallet-id">Mobile Number / Email</Label>
                    <Input
                      id="wallet-id"
                      value={walletId}
                      onChange={(e) => setWalletId(e.target.value)}
                      placeholder="Enter mobile number or email"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span>₹{amount ? parseInt(amount).toLocaleString("en-IN") : "0"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bonus</span>
                  <span className="text-green-500">+₹{bonus.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Fee</span>
                  <span>₹0</span>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{amount ? (parseInt(amount) + bonus).toLocaleString("en-IN") : "0"}</span>
                </div>
              </div>
              
              <Button onClick={handleAddFunds} className="w-full" disabled={!amount}>
                Add Funds <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex space-x-2 items-center text-sm">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex space-x-2 items-center text-sm">
                  <Wallet className="h-4 w-4 text-green-500" />
                  <span>Instant Wallet Credit</span>
                </div>
                <div className="flex space-x-2 items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>No Hidden Charges</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                By proceeding with the payment, you agree to BattleSphere's Terms of Service and Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 p-6 border rounded-lg">
        <h3 className="text-lg font-medium mb-3">Recent Transactions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Added Funds</p>
                <p className="text-sm text-muted-foreground">Via Credit Card</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">+₹2,000</p>
              <p className="text-xs text-muted-foreground flex items-center justify-end">
                <Clock className="h-3 w-3 mr-1" />
                3 days ago
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Tournament Entry Fee</p>
                <p className="text-sm text-muted-foreground">Weekend Warriors</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">-₹500</p>
              <p className="text-xs text-muted-foreground flex items-center justify-end">
                <Clock className="h-3 w-3 mr-1" />
                5 days ago
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Tournament Winnings</p>
                <p className="text-sm text-muted-foreground">Weekly Showdown</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-500">+₹1,200</p>
              <p className="text-xs text-muted-foreground flex items-center justify-end">
                <Clock className="h-3 w-3 mr-1" />
                1 week ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}