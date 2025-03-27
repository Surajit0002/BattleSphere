import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock8, Send, MessageCircle, Phone, Mail, HelpCircle, FileQuestion } from "lucide-react";

export default function Support() {
  const { toast } = useToast();
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [liveSubject, setLiveSubject] = useState("");
  const [liveMessage, setLiveMessage] = useState("");

  const submitTicket = () => {
    if (!ticketSubject || !ticketMessage) {
      toast({
        variant: "destructive",
        title: "Form incomplete",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    toast({
      title: "Ticket Submitted",
      description: "We'll respond to your ticket within 24 hours",
      duration: 5000,
    });
    
    setTicketSubject("");
    setTicketMessage("");
  };

  const startLiveChat = () => {
    if (!liveSubject || !liveMessage) {
      toast({
        variant: "destructive",
        title: "Form incomplete",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    toast({
      title: "Live Chat Request Sent",
      description: "An agent will connect with you shortly",
      duration: 5000,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Player Support Center</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Get help with tournaments, payments, or technical issues. Our support team is available 24/7.
        </p>
      </div>
      
      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Live Chat
            </CardTitle>
            <CardDescription>Available 24/7</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Connect with a support agent instantly for urgent issues.</p>
            <Badge className="mt-2" variant="secondary">Average Wait: 5 min</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </CardTitle>
            <CardDescription>support@battlesphere.com</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Send us an email for non-urgent inquiries.</p>
            <Badge className="mt-2" variant="secondary">Response Time: 24h</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Phone Support
            </CardTitle>
            <CardDescription>1-800-BATTLE</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Call our dedicated gaming support line.</p>
            <Badge className="mt-2" variant="secondary">Hours: 9 AM - 8 PM</Badge>
          </CardContent>
        </Card>
      </div>
      
      {/* Support Options Tabs */}
      <Tabs defaultValue="ticket" className="mb-10">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="ticket">Submit a Ticket</TabsTrigger>
          <TabsTrigger value="livechat">Live Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ticket" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Our team will respond to your ticket within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input 
                  id="subject" 
                  placeholder="e.g., Tournament Registration Issue" 
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="attachment" className="text-sm font-medium">Attachments (Optional)</label>
                <Input id="attachment" type="file" />
                <p className="text-xs text-muted-foreground">Upload screenshots or relevant files (Max: 10MB)</p>
              </div>
              
              <Button onClick={submitTicket} className="w-full">
                <Send className="mr-2 h-4 w-4" /> Submit Ticket
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Clock8 className="h-4 w-4" />
            <span>Current response time: ~12 hours</span>
          </div>
        </TabsContent>
        
        <TabsContent value="livechat">
          <Card>
            <CardHeader>
              <CardTitle>Start a Live Chat Session</CardTitle>
              <CardDescription>
                Connect with a support agent in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="chat-subject" className="text-sm font-medium">What do you need help with?</label>
                <Input 
                  id="chat-subject" 
                  placeholder="e.g., Payment Issue" 
                  value={liveSubject}
                  onChange={(e) => setLiveSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="chat-message" className="text-sm font-medium">Additional Details</label>
                <Textarea 
                  id="chat-message" 
                  placeholder="Please provide specific details about your issue..."
                  rows={3}
                  value={liveMessage}
                  onChange={(e) => setLiveMessage(e.target.value)}
                />
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-sm">
                <p className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Support agents available
                </p>
                <p>Current estimated wait time: 3-5 minutes</p>
              </div>
              
              <Button onClick={startLiveChat} className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" /> Start Live Chat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* FAQ Section */}
      <div className="mb-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Find quick answers to common questions</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I register for a tournament?</AccordionTrigger>
            <AccordionContent>
              To register for a tournament, navigate to the Tournaments page, select your desired tournament, and click the "Register" button. You'll need to have a team created if it's a team tournament, or you can join as an individual for solo tournaments.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I withdraw my tournament winnings?</AccordionTrigger>
            <AccordionContent>
              Tournament winnings are automatically added to your BattleSphere wallet. To withdraw, go to your Profile page, navigate to the Wallet section, and click "Withdraw Funds." You can withdraw to various payment methods including bank transfers and e-wallets.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>What happens if I disconnect during a match?</AccordionTrigger>
            <AccordionContent>
              If you disconnect during a match, you have up to 5 minutes to reconnect. If you're unable to reconnect within this timeframe, the match may be forfeited. For technical issues, contact our support team immediately for assistance.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>How do I report a player for cheating?</AccordionTrigger>
            <AccordionContent>
              To report a player for cheating, go to the match details page, find the player's name, and click the "Report" option. Provide evidence such as screenshots or video recordings to support your claim. Our moderation team will investigate all reports within 48 hours.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>Can I change my team after registering for a tournament?</AccordionTrigger>
            <AccordionContent>
              Team changes are allowed up to 24 hours before the tournament begins. After this deadline, no further changes can be made. To modify your team, visit the tournament registration page and select the "Edit Team" option.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Recent Support Activity */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Your Recent Support Activity</h2>
        
        <div className="space-y-4">
          <Card>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <Badge variant="outline" className="h-fit">Ticket #287365</Badge>
                  <div>
                    <h3 className="font-medium">Payment Failed for Tournament Registration</h3>
                    <p className="text-sm text-muted-foreground mt-1">Submitted 2 days ago</p>
                  </div>
                </div>
                <Badge>Resolved</Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10 mt-1">
                    <AvatarImage src="/assets/user-avatar.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">You</p>
                      <span className="text-xs text-muted-foreground">March 25, 2025 - 10:23 AM</span>
                    </div>
                    <p className="text-sm">I tried to register for the Weekend Warriors tournament but my payment was declined even though I have sufficient funds.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10 mt-1">
                    <AvatarImage src="/assets/support-avatar.png" alt="Support Agent" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Sarah (Support)</p>
                      <span className="text-xs text-muted-foreground">March 25, 2025 - 11:45 AM</span>
                    </div>
                    <p className="text-sm">I've checked your account and found that your payment method needed verification. I've manually registered you for the tournament and waived the fee as a one-time courtesy. Please update your payment method in your profile settings.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <Badge variant="outline" className="h-fit">Ticket #286901</Badge>
                  <div>
                    <h3 className="font-medium">Request to Change Team Name</h3>
                    <p className="text-sm text-muted-foreground mt-1">Submitted 7 days ago</p>
                  </div>
                </div>
                <Badge>Resolved</Badge>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">This ticket has been resolved and is now closed.</p>
              <Button variant="ghost" className="w-full mt-4 text-sm">
                <FileQuestion className="mr-2 h-4 w-4" /> View Full Conversation
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Community Resources */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Community Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" /> Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm">Explore our comprehensive guides and tutorials for BattleSphere.</p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="outline" className="w-full">Browse Articles</Button>
            </div>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" /> Community Forum
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm">Connect with other players, share strategies, and find teammates.</p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="outline" className="w-full">Join Discussion</Button>
            </div>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" /> Discord Server
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm">Join our Discord community for real-time updates and support.</p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="outline" className="w-full">Join Discord</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}