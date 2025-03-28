import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertTournamentSchema } from "@shared/schema";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, GamepadIcon, Trophy, Users, DollarSign, Calendar as CalendarIcon2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Extended schema with validation
const createTournamentSchema = insertTournamentSchema.extend({
  startDate: z.date({
    required_error: "A start date is required",
  }),
  maxPlayers: z.coerce.number().min(2, "At least 2 players required").max(1000, "Maximum 1000 players allowed"),
  prizePool: z.coerce.number().min(100, "Minimum prize pool is ₹100"),
  entryFee: z.coerce.number().min(0, "Entry fee cannot be negative"),
});

// Extract the inferred type
type CreateTournamentValues = z.infer<typeof createTournamentSchema>;

export default function AdminCreateTournament() {
  const [tab, setTab] = useState("basic");
  const { toast } = useToast();
  
  // Fetch games for the dropdown
  const { data: games, isLoading: loadingGames } = useQuery({
    queryKey: ['/api/games'],
  });

  // Form setup
  const form = useForm<CreateTournamentValues>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "upcoming",
      prizePool: 1000,
      entryFee: 0,
      maxPlayers: 100,
      imageUrl: "",
      featured: false,
      startDate: new Date(),
      gameMode: "squad",
      tournamentType: "free",
      gameId: 1,
      rules: "Default tournament rules apply.",
      registrationEndDate: null,
      endDate: null,
      brackets: "single_elimination",
      discordLink: "",
      streamUrl: "",
      sponsorId: null,
      winnerTeamId: null,
      winnerUserId: null,
    },
  });

  // Mutation for creating tournament
  const createTournamentMutation = useMutation({
    mutationFn: (data: CreateTournamentValues) => {
      return apiRequest('/api/tournaments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Tournament Created Successfully",
        description: "The tournament has been created and is now available.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tournaments/featured'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tournaments/upcoming'] });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Tournament",
        description: error.message || "There was an error creating the tournament.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: CreateTournamentValues) {
    createTournamentMutation.mutate(data);
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Create Tournament</h1>
            <p className="text-gray-500">Set up a new tournament with all necessary details</p>
          </div>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={createTournamentMutation.isPending}
            size="lg"
          >
            {createTournamentMutation.isPending ? "Creating..." : "Create Tournament"}
          </Button>
        </div>
        
        <Card className="border-gray-800 bg-secondary/10">
          <CardHeader>
            <CardTitle>Tournament Information</CardTitle>
            <CardDescription>Configure all details for the new tournament</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="basic">Basic Details</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="media">Media & Extras</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tournament Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter tournament name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gameId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Game</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a game" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {games?.map((game) => (
                                  <SelectItem key={game.id} value={game.id.toString()}>
                                    {game.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide tournament details and description" 
                                className="min-h-32" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="registration">Registration Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="config" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="tournamentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tournament Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select tournament type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="sponsored">Sponsored</SelectItem>
                                <SelectItem value="seasonal">Seasonal</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              This determines access and prize distribution.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gameMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Game Mode</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select game mode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="solo">Solo</SelectItem>
                                <SelectItem value="duo">Duo</SelectItem>
                                <SelectItem value="squad">Squad</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maxPlayers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Players</FormLabel>
                            <FormControl>
                              <Input type="number" min={2} {...field} />
                            </FormControl>
                            <FormDescription>
                              Maximum number of participants.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="prizePool"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prize Pool (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} {...field} />
                            </FormControl>
                            <FormDescription>
                              Total prize amount to be distributed.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="entryFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entry Fee (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} {...field} />
                            </FormControl>
                            <FormDescription>
                              0 for free tournaments.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="brackets"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tournament Format</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value || "single_elimination"}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single_elimination">Single Elimination</SelectItem>
                                <SelectItem value="double_elimination">Double Elimination</SelectItem>
                                <SelectItem value="round_robin">Round Robin</SelectItem>
                                <SelectItem value="swiss">Swiss System</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rules"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Tournament Rules</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Define the rules, regulations, and scoring system" 
                                className="min-h-32" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="media" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tournament Banner Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter image URL" {...field} />
                            </FormControl>
                            <FormDescription>
                              Recommended size: 1200x630px
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Featured Tournament
                              </FormLabel>
                              <FormDescription>
                                Show this tournament prominently on the homepage.
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
                        name="discordLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discord Channel Link</FormLabel>
                            <FormControl>
                              <Input placeholder="https://discord.gg/..." {...field} />
                            </FormControl>
                            <FormDescription>
                              For tournament communication.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="streamUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stream URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://twitch.tv/..." {...field} />
                            </FormControl>
                            <FormDescription>
                              For live broadcast of matches.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </CardContent>
          <CardFooter className="justify-between border-t border-gray-800 pt-5">
            <Button 
              variant="outline" 
              onClick={() => form.reset()}
              disabled={createTournamentMutation.isPending}
            >
              Reset Form
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={createTournamentMutation.isPending}
            >
              {createTournamentMutation.isPending ? "Creating..." : "Create Tournament"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border-gray-800 bg-secondary/10 mt-6">
          <CardHeader>
            <CardTitle>Tournament Promotion</CardTitle>
            <CardDescription>Promote your tournament for increased participation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-6 border border-gray-800 rounded-lg bg-secondary/20 text-center">
                <Users className="h-12 w-12 mb-4 text-blue-500" />
                <h3 className="text-lg font-semibold mb-2">Social Share</h3>
                <p className="text-gray-400 text-sm mb-4">Share this tournament across social platforms to reach more gamers.</p>
                <Button variant="outline" size="sm">
                  Configure Sharing
                </Button>
              </div>
              
              <div className="flex flex-col items-center justify-center p-6 border border-gray-800 rounded-lg bg-secondary/20 text-center">
                <Trophy className="h-12 w-12 mb-4 text-amber-500" />
                <h3 className="text-lg font-semibold mb-2">Prize Breakdown</h3>
                <p className="text-gray-400 text-sm mb-4">Define how the prize pool will be distributed among winners.</p>
                <Button variant="outline" size="sm">
                  Set Prize Distribution
                </Button>
              </div>
              
              <div className="flex flex-col items-center justify-center p-6 border border-gray-800 rounded-lg bg-secondary/20 text-center">
                <Clock className="h-12 w-12 mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">Schedule Reminders</h3>
                <p className="text-gray-400 text-sm mb-4">Set up automatic notifications for participants before matches.</p>
                <Button variant="outline" size="sm">
                  Configure Reminders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}