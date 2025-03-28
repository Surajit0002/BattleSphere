
import React from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Lock, Bell, Wallet, Shield } from "lucide-react";
import RootLayout from "@/layouts/RootLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const form = useForm({
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      notifications: {
        email: true,
        push: true,
        tournaments: true,
        teams: true,
      },
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      // Implementation here
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    },
  });

  return (
    <RootLayout>
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary-bg/50 border-gray-800 p-1">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" /> Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-secondary-bg/50 border-gray-800">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.displayName} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Shield className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <Button variant="outline">Change Avatar</Button>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <Input {...form.register("displayName")} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input {...form.register("email")} type="email" />
                  </div>
                </div>

                <Button 
                  onClick={form.handleSubmit((data) => updateProfileMutation.mutate(data))}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-secondary-bg/50 border-gray-800">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(form.watch("notifications")).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="font-medium capitalize">{key} Notifications</h4>
                        <p className="text-sm text-gray-400">
                          Receive notifications about {key}
                        </p>
                      </div>
                      <Switch 
                        checked={value} 
                        onCheckedChange={(checked) => 
                          form.setValue(`notifications.${key}`, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-secondary-bg/50 border-gray-800">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <Input 
                    type="password" 
                    {...form.register("currentPassword")} 
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input 
                    type="password" 
                    {...form.register("newPassword")} 
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input 
                    type="password" 
                    {...form.register("confirmPassword")} 
                  />
                </div>
                <Button className="w-full">Change Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card className="bg-secondary-bg/50 border-gray-800">
              <CardHeader>
                <CardTitle>Wallet Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-primary-700/20 rounded-lg">
                    <h3 className="text-2xl font-bold mb-1">
                      ₹{user?.walletBalance?.toLocaleString() || "0"}
                    </h3>
                    <p className="text-gray-400">Current Balance</p>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1">Add Money</Button>
                    <Button variant="outline" className="flex-1">Withdraw</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
}
