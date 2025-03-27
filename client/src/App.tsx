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
import Rewards from "@/pages/rewards";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/tournaments" component={Tournaments}/>
      <Route path="/tournaments/:id" component={TournamentDetails}/>
      <Route path="/leaderboard" component={Leaderboard}/>
      <Route path="/teams" component={Teams}/>
      <Route path="/rewards" component={Rewards}/>
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
