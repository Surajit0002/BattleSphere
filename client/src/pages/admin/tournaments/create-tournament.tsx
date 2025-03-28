import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "wouter";
import { insertTournamentSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, InfoIcon, TrophyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Create a more detailed tournament creation schema
const createTournamentSchema = insertTournamentSchema.extend({
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  registrationEndDate: z.coerce.date(),
  entryFee: z.coerce.number().min(0),
  prizePool: z.coerce.number().min(0),
  maxParticipants: z.coerce.number().min(2),
  minParticipants: z.coerce.number().min(2),
  gameMode: z.enum(["solo", "duo", "squad", "custom"]),
  tournamentType: z.enum(["free", "paid", "sponsored", "seasonal"]),
  rules: z.string().min(10, "Tournament rules must be at least 10 characters"),
  eligibilityCriteria: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type FormValues = z.infer<typeof createTournamentSchema>;

export default function CreateTournament() {
  const [selectedTab, setSelectedTab] = useState("basic");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch games for the dropdown
  const { data: games = [] } = useQuery({
    queryKey: ["/api/games"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: "",
      description: "",
      gameId: 1,
      startDate: new Date(),
      registrationEndDate: new Date(),
      gameMode: "solo",
      tournamentType: "free",
      entryFee: 0,
      prizePool: 1000,
      maxParticipants: 100,
      minParticipants: 10,
      rules: "1. Players must follow fair play guidelines\n2. Cheating will result in disqualification\n3. Tournament admins' decisions are final",
      status: "upcoming",
      isFeatured: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await apiRequest("/api/admin/tournaments", {
        method: "POST",
        data,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Tournament Created",
        description: "The tournament has been successfully created",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tournament. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onNext = () => {
    if (selectedTab === "basic") {
      setSelectedTab("details");
    } else if (selectedTab === "details") {
      setSelectedTab("rules");
    } else if (selectedTab === "rules") {
      form.handleSubmit(onSubmit)();
    }
  };

  const onBack = () => {
    if (selectedTab === "details") {
      setSelectedTab("basic");
    } else if (selectedTab === "rules") {
      setSelectedTab("details");
    }
  };

  return (
    <div className="container py-10 min-h-screen bg-black bg-dot-white/[0.2]">
      <div className="mb-8 flex items-center space-x-2">
        <TrophyIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Create Tournament</h1>
          <p className="text-gray-400">Create a new tournament with detailed configurations</p>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto border border-primary/20 bg-black/60 backdrop-blur-lg text-white shadow-lg shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-primary">Tournament Creation</CardTitle>
          <CardDescription className="text-center text-gray-400">Fill out the details below to create a new tournament</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="w-full h-14 grid grid-cols-3 mb-8 bg-gray-900/60">
                  <TabsTrigger 
                    value="basic" 
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none",
                      "data-[state=active]:shadow-none data-[state=active]:border-b-0"
                    )}
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="details"
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none",
                      "data-[state=active]:shadow-none data-[state=active]:border-b-0"
                    )}
                  >
                    Tournament Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rules"
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none",
                      "data-[state=active]:shadow-none data-[state=active]:border-b-0"
                    )}
                  >
                    Rules & Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="p-4">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tournament Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter tournament name" 
                              {...field} 
                              className="bg-gray-900/60 border-gray-700"
                            />
                          </FormControl>
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
                              placeholder="Describe the tournament" 
                              {...field} 
                              className="bg-gray-900/60 border-gray-700 h-24"
                            />
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
                            defaultValue={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-900/60 border-gray-700">
                                <SelectValue placeholder="Select a game" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              {games.map((game: any) => (
                                <SelectItem key={game.id} value={String(game.id)}>
                                  {game.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gameMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Game Mode</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-900/60 border-gray-700">
                                  <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-700">
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
                        name="tournamentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tournament Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-900/60 border-gray-700">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="sponsored">Sponsored</SelectItem>
                                <SelectItem value="seasonal">Seasonal</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="p-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-2 gap-4">
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
                                      "pl-3 text-left font-normal bg-gray-900/60 border-gray-700",
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
                              <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
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
                        name="registrationEndDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Registration End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal bg-gray-900/60 border-gray-700",
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
                              <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > form.getValues("startDate") ||
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="entryFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entry Fee (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                className="bg-gray-900/60 border-gray-700"
                              />
                            </FormControl>
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
                              <Input 
                                type="number" 
                                placeholder="1000" 
                                {...field} 
                                className="bg-gray-900/60 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Participants</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="10" 
                                {...field} 
                                className="bg-gray-900/60 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Participants</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="100" 
                                {...field} 
                                className="bg-gray-900/60 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rules" className="p-4">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="rules"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tournament Rules</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter detailed rules for the tournament" 
                              {...field} 
                              className="bg-gray-900/60 border-gray-700 h-32"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eligibilityCriteria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Eligibility Criteria (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Specify who can participate" 
                              {...field} 
                              className="bg-gray-900/60 border-gray-700 h-24"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4 bg-gray-900/40 border-gray-700">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Tournament</FormLabel>
                            <FormDescription className="text-sm text-gray-400">
                              Display this tournament prominently on the homepage
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                  disabled={selectedTab === "basic"}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  <ChevronLeftIcon className="mr-2 h-4 w-4" />
                  Back
                </Button>
                
                <Button 
                  type="button" 
                  onClick={onNext}
                  className="bg-primary hover:bg-primary/90"
                >
                  {selectedTab === "rules" ? "Create Tournament" : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
          <div className="flex items-center text-yellow-400 text-sm">
            <InfoIcon className="h-4 w-4 mr-2" />
            <span>All changes will be audited for admin accountability</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}