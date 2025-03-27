import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import RootLayout from "@/layouts/RootLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Users, Medal, Shield, Trophy, UserPlus, Camera, Upload, Check, AlertCircle } from "lucide-react";

const teamSchema = z.object({
  name: z.string().min(3, {
    message: "Team name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  logoUrl: z.string().url({
    message: "Please enter a valid URL for your team logo.",
  }).nullable().optional(),
  gameId: z.string(),
  isPublic: z.boolean().default(true),
  tags: z.string().optional(),
});

export default function TeamCreate() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  
  // Fetch available games
  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ['/api/games'],
    queryFn: async () => {
      const response = await fetch('/api/games');
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    },
  });
  
  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      gameId: "",
      isPublic: true,
      tags: "",
    },
  });
  
  const watchLogoUrl = form.watch("logoUrl");
  
  // Update preview when logo URL changes
  useEffect(() => {
    if (watchLogoUrl && watchLogoUrl.match(/^(https?:\/\/)/)) {
      setPreviewAvatar(watchLogoUrl);
    } else {
      setPreviewAvatar(null);
    }
  }, [watchLogoUrl]);
  
  const handleInviteMember = () => {
    if (!inviteEmail) return;
    if (invitedMembers.includes(inviteEmail)) {
      toast({
        variant: "destructive",
        title: "Already invited",
        description: "This email has already been invited.",
      });
      return;
    }
    setInvitedMembers([...invitedMembers, inviteEmail]);
    setInviteEmail("");
    toast({
      title: "Invitation added",
      description: `${inviteEmail} will be invited when the team is created.`,
    });
  };
  
  const removeInvite = (email: string) => {
    setInvitedMembers(invitedMembers.filter(e => e !== email));
  };

  async function onSubmit(values: z.infer<typeof teamSchema>) {
    try {
      const response = await apiRequest(
        "POST",
        "/api/teams", 
        {
          ...values,
          // The current user will be set as the captain on the server side
          logoUrl: values.logoUrl || null,
        }
      );

      if (response.ok) {
        // Invalidate the teams cache to refresh lists
        queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
        toast({
          title: "Team created!",
          description: "Your team has been created successfully.",
        });
        navigate("/teams");
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Error creating team",
          description: errorData.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating team",
        description: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <RootLayout>
      <div className="container py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Create New Team</h1>
            <Button variant="outline" onClick={() => navigate("/teams")}>
              Back to Teams
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Team Logo Preview Card */}
            <Card className="md:row-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Team Preview</CardTitle>
                <CardDescription>See how your team will look</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-2 border-border">
                    <AvatarImage src={previewAvatar || ""} />
                    <AvatarFallback className="text-3xl bg-primary/10">
                      {form.getValues().name ? form.getValues().name.substring(0, 2).toUpperCase() : "TM"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-xl font-bold">
                    {form.getValues().name || "Team Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {form.getValues().description ? 
                      (form.getValues().description.length > 60 
                        ? form.getValues().description.substring(0, 60) + "..." 
                        : form.getValues().description) 
                      : "Team description will appear here"}
                  </p>
                </div>
                
                <div className="w-full mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center">
                      <Users className="h-4 w-4 mr-1" /> Members
                    </span>
                    <Badge variant="secondary">0 + {invitedMembers.length} pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center">
                      <Trophy className="h-4 w-4 mr-1" /> Tournaments
                    </span>
                    <Badge variant="outline">0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center">
                      <Medal className="h-4 w-4 mr-1" /> Wins
                    </span>
                    <Badge variant="outline">0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Form Card */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">
                        <Shield className="h-4 w-4 mr-2" /> Basic Info
                      </TabsTrigger>
                      <TabsTrigger value="settings">
                        <Trophy className="h-4 w-4 mr-2" /> Settings
                      </TabsTrigger>
                      <TabsTrigger value="members">
                        <Users className="h-4 w-4 mr-2" /> Members
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Basic Info Tab */}
                      {activeTab === "basic" && (
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Team Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter team name" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Choose a unique name for your team.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your team's goals and achievements" 
                                    {...field} 
                                    rows={4}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Tell others about your team's focus and playstyle.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Team Logo URL</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="https://example.com/team-logo.png" 
                                    {...field} 
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Add a URL to your team logo image (optional).
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setActiveTab("settings")}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Settings Tab */}
                      {activeTab === "settings" && (
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="gameId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Game</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a game" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {gamesLoading ? (
                                      <SelectItem value="loading">Loading games...</SelectItem>
                                    ) : (
                                      games?.map((game: any) => (
                                        <SelectItem key={game.id} value={game.id.toString()}>
                                          {game.name}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Select the primary game your team will compete in.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="isPublic"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Public Team</FormLabel>
                                  <FormDescription>
                                    Allow players to find and request to join your team.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Team Tags</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="casual, competitive, fps" 
                                    {...field} 
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Add tags to help others find your team (comma separated).
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-between gap-2">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setActiveTab("basic")}
                            >
                              Back
                            </Button>
                            <Button 
                              type="button" 
                              onClick={() => setActiveTab("members")}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Members Tab */}
                      {activeTab === "members" && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-base font-medium mb-2">Invite Team Members</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Invite players to join your team by email. They will receive an invitation once the team is created.
                            </p>
                            
                            <div className="flex gap-2 mb-4">
                              <Input 
                                placeholder="Email address" 
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                              />
                              <Button 
                                type="button" 
                                onClick={handleInviteMember}
                                variant="secondary"
                              >
                                <UserPlus className="h-4 w-4 mr-2" /> Invite
                              </Button>
                            </div>
                            
                            {invitedMembers.length > 0 && (
                              <div className="border rounded-md p-4">
                                <h4 className="text-sm font-medium mb-2">Pending Invitations ({invitedMembers.length})</h4>
                                <div className="space-y-2">
                                  {invitedMembers.map((email) => (
                                    <div key={email} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                                      <span className="text-sm">{email}</span>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => removeInvite(email)}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-base font-medium mb-2">Team Permissions</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Set up what team members can do once they join.
                            </p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <Label className="text-sm">Members can invite others</Label>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <Label className="text-sm">Members can register team for tournaments</Label>
                                </div>
                                <Switch />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between gap-2">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setActiveTab("settings")}
                            >
                              Back
                            </Button>
                            <Button type="submit">
                              Create Team
                            </Button>
                          </div>
                        </div>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}