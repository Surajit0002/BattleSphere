import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import RootLayout from "./layouts/RootLayout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Tournaments from "@/pages/tournaments";
import TournamentDetails from "@/pages/tournament-details";
import Leaderboard from "@/pages/leaderboard";
import Teams from "@/pages/teams";
import TeamCreate from "@/pages/team-create";
import Rewards from "@/pages/rewards";
import Profile from "@/pages/profile";
import Payment from "@/pages/payment";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCreateTournament from "@/pages/admin/tournaments/create";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/tournaments" component={Tournaments}/>
      <Route path="/tournaments/:id" component={TournamentDetails}/>
      <Route path="/leaderboard" component={Leaderboard}/>
      <Route path="/teams" component={Teams}/>
      <Route path="/teams/create" component={TeamCreate}/>
      <Route path="/rewards" component={Rewards}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/payment/:type/:id" component={Payment}/>
      <Route path="/admin/dashboard" component={AdminDashboard}/>
      <Route path="/admin/tournaments/create" component={AdminCreateTournament}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <Router />
      </RootLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
