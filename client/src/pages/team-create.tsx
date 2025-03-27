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
import RootLayout from "@/layouts/RootLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

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
});

export default function TeamCreate() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
    },
  });

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
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Create New Team</h1>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/teams")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Team</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}