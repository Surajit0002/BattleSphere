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
import Support from "@/pages/support";
import AddFunds from "@/pages/add-funds";
import UserDetails from "@/pages/user-details";
import LiveStreams from "@/pages/live-streams";
import StreamDetails from "@/pages/stream-details";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCreateTournament from "@/pages/admin/tournaments/create";
import { lazy, Suspense } from "react";

// Lazy load enhanced pages
const EnhancedProfile = lazy(() => import("@/pages/enhanced-profile"));
const LiveMatchesEnhanced = lazy(() => import("@/pages/live-matches-enhanced"));
const TournamentDetailsEnhanced = lazy(() => import("@/pages/tournament-details-enhanced"));
const TournamentDetailsPremium = lazy(() => import("@/pages/tournament-details-premium"));
const CreateTournament = lazy(() => import("@/pages/admin/create-tournament"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
      <Route path="/support" component={Support}/>
      <Route path="/add-funds" component={AddFunds}/>
      <Route path="/user/:id" component={UserDetails}/>
      <Route path="/streams" component={LiveStreams}/>
      <Route path="/stream/:id" component={StreamDetails}/>
      <Route path="/admin/dashboard" component={AdminDashboard}/>
      <Route path="/admin/tournaments/create" component={AdminCreateTournament}/>
      
      {/* Enhanced pages */}
      <Route path="/profile/enhanced">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <EnhancedProfile />
          </Suspense>
        )}
      </Route>
      <Route path="/streams/enhanced">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <LiveMatchesEnhanced />
          </Suspense>
        )}
      </Route>
      <Route path="/tournaments/enhanced/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <TournamentDetailsEnhanced />
          </Suspense>
        )}
      </Route>
      <Route path="/tournaments/premium/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <TournamentDetailsPremium />
          </Suspense>
        )}
      </Route>
      <Route path="/admin/create-tournament">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <CreateTournament />
          </Suspense>
        )}
      </Route>
      
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
