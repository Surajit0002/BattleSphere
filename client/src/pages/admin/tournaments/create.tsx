import { useState } from "react";
import RootLayout from "@/layouts/RootLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Form, 
  FormControl, 
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

// Create a tournament schema based on shared schema
const tournamentSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  gameId: z.coerce.number().min(1, "Please select a game"),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }).nullable().optional(),
  startDate: z.date({ required_error: "Please select a start date" }),
  endDate: z.date().nullable().optional(),
  entryFee: z.coerce.number().min(0, "Entry fee must be 0 or higher"),
  prizePool: z.coerce.number().min(0, "Prize pool must be 0 or higher"),
  maxPlayers: z.coerce.number().min(2, "Maximum players must be at least 2"),
  gameMode: z.enum(["solo", "duo", "squad", "custom"], {
    required_error: "Please select a game mode",
  }),
  tournamentType: z.enum(["free", "paid", "sponsored", "seasonal"], {
    required_error: "Please select a tournament type",
  }),
  featured: z.boolean().default(false),
  status: z.string().default("upcoming"),
});

type FormValues = z.infer<typeof tournamentSchema>;

export default function AdminCreateTournament() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // Fetch games for selection
  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ['/api/games'],
    queryFn: async () => {
      const response = await fetch('/api/games');
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    },
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: "",
      description: "",
      gameId: undefined,
      imageUrl: "",
      startDate: undefined,
      endDate: null,
      entryFee: 0,
      prizePool: 0,
      maxPlayers: 100,
      gameMode: undefined,
      tournamentType: undefined,
      featured: false,
      status: "upcoming",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      const response = await apiRequest(
        "POST",
        "/api/admin/tournaments", 
        values
      );

      if (response.ok) {
        // Invalidate tournaments cache to update lists
        queryClient.invalidateQueries({ queryKey: ['/api/tournaments'] });
        toast({
          title: "Tournament created!",
          description: "The tournament has been created successfully.",
        });
        navigate("/admin/tournaments");
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Error creating tournament",
          description: errorData.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating tournament",
        description: "Something went wrong. Please try again.",
      });
    }
  };
  
  return (
    <RootLayout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Create New Tournament</h1>
          <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Tournament Details</CardTitle>
            <CardDescription>
              Enter the details for the new tournament
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tournament Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter tournament name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Choose a unique name for this tournament.
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
                              placeholder="Enter tournament description" 
                              {...field} 
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Describe the tournament, rules, and rewards.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tournament Banner URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/banner.jpg" 
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            URL for the tournament banner image (optional).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Tournament Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tournament Settings</h3>
                    
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
                              {gamesLoading ? (
                                <SelectItem value="loading" disabled>Loading games...</SelectItem>
                              ) : games && games.length > 0 ? (
                                games.map((game) => (
                                  <SelectItem key={game.id} value={game.id.toString()}>
                                    {game.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="none" disabled>No games available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The game this tournament is for.
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
                          <FormDescription>
                            Player team configuration for this tournament.
                          </FormDescription>
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
                            Type determines entry rules and visibility.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Schedule & Pricing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Schedule & Pricing</h3>
                    
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
                                  className="pl-3 text-left font-normal"
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
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setStartDate(date);
                                }}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When the tournament begins.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="pl-3 text-left font-normal"
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
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setEndDate(date);
                                }}
                                disabled={(date) => !startDate || date < startDate}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When the tournament ends (if known).
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
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Fee charged per participant (0 for free tournaments).
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
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Total prize money awarded to winners.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Participation & Visibility */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Participation & Visibility</h3>
                    
                    <FormField
                      control={form.control}
                      name="maxPlayers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Players</FormLabel>
                          <FormControl>
                            <Input type="number" min="2" {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum number of participants allowed.
                          </FormDescription>
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
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Current status of the tournament.
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
                            <FormLabel className="text-base">Featured Tournament</FormLabel>
                            <FormDescription>
                              Featured tournaments are prominently displayed on the homepage.
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
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Tournament</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}