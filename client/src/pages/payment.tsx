import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import RootLayout from "@/layouts/RootLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CreditCard, 
  Check, 
  AlertCircle, 
  Shield, 
  ArrowRight,
  ChevronsUpDown,
  Clock
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

declare global {
  interface Window {
    Razorpay: any;
  }
}

enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SUCCESS = "success",
  FAILED = "failed",
}

export default function PaymentPage() {
  const { type, id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [upiId, setUpiId] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentCompleteDialogOpen, setPaymentCompleteDialogOpen] = useState<boolean>(false);
  
  // Fetch payment details
  const { data: paymentDetails, isLoading: detailsLoading } = useQuery({
    queryKey: [`/api/payments/${type}/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/payments/${type}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch payment details');
      return response.json();
    },
  });
  
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiry(e.target.value);
    setCardExpiry(formattedValue);
  };
  
  const validatePaymentForm = () => {
    if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        toast({
          variant: "destructive",
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g., username@upi)",
        });
        return false;
      }
    } else if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast({
          variant: "destructive",
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number",
        });
        return false;
      }
      
      if (!cardExpiry.includes('/') || cardExpiry.length !== 5) {
        toast({
          variant: "destructive",
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date (MM/YY)",
        });
        return false;
      }
      
      if (cardCvv.length < 3) {
        toast({
          variant: "destructive",
          title: "Invalid CVV",
          description: "Please enter a valid CVV",
        });
        return false;
      }
      
      if (!cardName.trim()) {
        toast({
          variant: "destructive",
          title: "Invalid Name",
          description: "Please enter the name on your card",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      // Verify payment on backend
      const response = await apiRequest(
        "POST",
        `/api/payments/verify`,
        {
          paymentId,
          type,
          id,
        }
      );

      if (response.ok) {
        setPaymentStatus(PaymentStatus.SUCCESS);
        setIsProcessing(false);
        setPaymentCompleteDialogOpen(true);
        
        // Invalidate relevant queries based on payment type
        if (type === 'tournament') {
          queryClient.invalidateQueries({ queryKey: ['/api/tournaments'] });
          queryClient.invalidateQueries({ queryKey: [`/api/tournaments/${id}`] });
          queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
        } else if (type === 'wallet') {
          queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
          queryClient.invalidateQueries({ queryKey: ['/api/user/wallet/transactions'] });
        }
      } else {
        const errorData = await response.json();
        setPaymentStatus(PaymentStatus.FAILED);
        setIsProcessing(false);
        toast({
          variant: "destructive",
          title: "Payment verification failed",
          description: errorData.message || "Your payment could not be verified. Please contact support.",
        });
      }
    } catch (error) {
      setPaymentStatus(PaymentStatus.FAILED);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Payment verification failed",
        description: "An error occurred while verifying your payment. Please contact support.",
      });
    }
  };
  
  const handlePaymentFailure = () => {
    setPaymentStatus(PaymentStatus.FAILED);
    setIsProcessing(false);
    toast({
      variant: "destructive",
      title: "Payment failed",
      description: "Your payment was unsuccessful. Please try again or use a different payment method.",
    });
  };
  
  const initiateRazorpayPayment = async () => {
    try {
      // Create order on backend
      const orderResponse = await apiRequest(
        "POST",
        "/api/payments/create-order",
        {
          amount: paymentDetails?.amount,
          type,
          id,
        }
      );

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        toast({
          variant: "destructive",
          title: "Payment initiation failed",
          description: errorData.message || "Something went wrong. Please try again.",
        });
        return;
      }

      const orderData = await orderResponse.json();
      
      // Handle Razorpay integration
      const options = {
        key: 'rzp_test_yourKeyHere', // This will be replaced by actual key from environment
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'BattleSphere',
        description: paymentDetails?.description || 'Payment',
        order_id: orderData.id,
        handler: function (response: any) {
          handlePaymentSuccess(response.razorpay_payment_id);
        },
        prefill: {
          name: 'John Doe',  // These would be filled from user profile
          email: 'john@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Payment initiation failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };
  
  const handleProceedToPayment = () => {
    if (!validatePaymentForm()) return;
    
    setIsProcessing(true);
    setPaymentStatus(PaymentStatus.PROCESSING);
    
    // Instead of the mock simulation, we would call Razorpay here
    initiateRazorpayPayment();
    
    // Mock successful payment for simulation
    /*
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% chance of success for mock
      
      if (isSuccess) {
        setPaymentStatus(PaymentStatus.SUCCESS);
        setPaymentCompleteDialogOpen(true);
      } else {
        setPaymentStatus(PaymentStatus.FAILED);
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: "Your payment was unsuccessful. Please try again or use a different payment method.",
        });
      }
      setIsProcessing(false);
    }, 3000);
    */
  };
  
  const handlePaymentComplete = () => {
    setPaymentCompleteDialogOpen(false);
    
    // Redirect based on payment type
    if (type === 'tournament') {
      navigate(`/tournaments/${id}`);
    } else if (type === 'wallet') {
      navigate('/profile');
    } else {
      navigate('/');
    }
  };
  
  if (detailsLoading) {
    return (
      <RootLayout>
        <div className="container py-10">
          <div className="max-w-md mx-auto">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </RootLayout>
    );
  }
  
  if (!paymentDetails) {
    return (
      <RootLayout>
        <div className="container py-10">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Details Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The payment details you are looking for could not be found.
            </p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </div>
      </RootLayout>
    );
  }
  
  return (
    <RootLayout>
      <div className="container py-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Secure Payment</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Complete your payment securely
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{paymentDetails.description}</span>
                    <span className="font-medium">₹{paymentDetails.amount}</span>
                  </div>
                  {paymentDetails.fees > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span className="font-medium">₹{paymentDetails.fees}</span>
                    </div>
                  )}
                  {paymentDetails.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">₹{paymentDetails.tax}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">₹{paymentDetails.totalAmount}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button" 
                    variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                    className="flex flex-col items-center h-auto py-3"
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span>UPI</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    className="flex flex-col items-center h-auto py-3"
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span>Card</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant={paymentMethod === 'netbanking' ? 'default' : 'outline'}
                    className="flex flex-col items-center h-auto py-3"
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span>Net Banking</span>
                  </Button>
                </div>
              </div>
              
              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input 
                    id="upi-id" 
                    placeholder="username@upi" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your UPI ID linked with Google Pay, PhonePe, or other UPI apps
                  </p>
                </div>
              )}
              
              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input 
                      id="card-number" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        type="password" 
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={3}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input 
                      id="card-name" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {/* Net Banking Payment Form */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <Label htmlFor="bank">Select Bank</Label>
                  <Select>
                    <SelectTrigger id="bank">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sbi">State Bank of India</SelectItem>
                      <SelectItem value="hdfc">HDFC Bank</SelectItem>
                      <SelectItem value="icici">ICICI Bank</SelectItem>
                      <SelectItem value="axis">Axis Bank</SelectItem>
                      <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                      <SelectItem value="other">Other Bank</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    You will be redirected to your bank's website to complete the payment
                  </p>
                </div>
              )}
              
              <div className="pt-4">
                <div className="flex items-center border border-green-200 bg-green-50 rounded-md p-3 mb-4">
                  <Shield className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <p className="text-sm text-green-700">
                    Your payment information is secure and encrypted
                  </p>
                </div>
                
                <Button 
                  className="w-full"
                  disabled={isProcessing}
                  onClick={handleProceedToPayment}
                >
                  {isProcessing ? (
                    <><Clock className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <>Pay ₹{paymentDetails.totalAmount} <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Success Dialog */}
          <Dialog open={paymentCompleteDialogOpen} onOpenChange={setPaymentCompleteDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">Payment Successful</DialogTitle>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto my-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <DialogDescription className="text-center">
                  Your payment of <span className="font-bold">₹{paymentDetails.totalAmount}</span> has been completed successfully.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 p-4 bg-muted rounded-lg mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-medium">TXN12345678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default">Completed</Badge>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full" onClick={handlePaymentComplete}>
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </RootLayout>
  );
}