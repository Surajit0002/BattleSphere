import { Switch, Route, useLocation } from "wouter";
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
import Profile from "@/pages/profile";
import Payment from "@/pages/payment";
import Support from "@/pages/support";
import AddFunds from "@/pages/add-funds";
import UserDetails from "@/pages/user-details";
import LiveStreams from "@/pages/live-streams";
import StreamDetails from "@/pages/stream-details";
import AdminDashboard from "@/pages/admin/dashboard";
import { lazy, Suspense } from "react";

// Direct-load pages
import Dashboard from "@/pages/dashboard";
import MatchStatistics from "@/pages/match-statistics";
import Rewards from "@/pages/rewards";

// Lazy load enhanced pages
const EnhancedProfile = lazy(() => import("@/pages/enhanced-profile"));
const LiveMatchesEnhanced = lazy(() => import("@/pages/live-matches-enhanced"));
const TournamentDetailsEnhanced = lazy(() => import("@/pages/tournament-details-enhanced"));
const TournamentDetailsPremium = lazy(() => import("@/pages/tournament-details-premium"));
const TournamentsEnhanced = lazy(() => import("@/pages/tournaments-enhanced"));
const FindTeammate = lazy(() => import("@/pages/find-teammate"));
const JoinTeam = lazy(() => import("@/pages/join-team"));
const TournamentBracketDemo = lazy(() => import("@/pages/tournament-bracket-demo"));
const Calendar = lazy(() => import("@/pages/calendar"));
const MyTournaments = lazy(() => import("@/pages/tournaments/my-tournaments"));
const MyTeams = lazy(() => import("@/pages/teams/my-teams"));
const Settings = lazy(() => import("@/pages/settings"));

// New Admin Pages
const UserManagement = lazy(() => import("@/pages/admin/user-management"));
const PaymentManagement = lazy(() => import("@/pages/admin/payment-management"));
const AuditLogs = lazy(() => import("@/pages/admin/audit-logs"));
const CreateTournamentLazy = lazy(() => import("@/pages/admin/create-tournament"));
const AdminCreateTournamentLazy = lazy(() => import("@/pages/admin/tournaments/create"));

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
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/tournaments" component={Tournaments}/>
      <Route path="/tournaments/:id" component={TournamentDetails}/>
      <Route path="/leaderboard" component={Leaderboard}/>
      <Route path="/teams" component={Teams}/>
      <Route path="/teams/create" component={TeamCreate}/>
      <Route path="/rewards" component={Rewards}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/match-statistics/:id?" component={MatchStatistics}/>
      <Route path="/payment/:type/:id" component={Payment}/>
      <Route path="/support" component={Support}/>
      <Route path="/add-funds" component={AddFunds}/>
      <Route path="/user/:id" component={UserDetails}/>
      <Route path="/streams" component={LiveStreams}/>
      <Route path="/stream/:id" component={StreamDetails}/>
      <Route path="/admin/dashboard" component={AdminDashboard}/>
      <Route path="/admin/tournaments/create" component={AdminCreateTournamentLazy}/>

      {/* Admin Pages */}
      <Route path="/admin/user-management">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <UserManagement />
          </Suspense>
        )}
      </Route>
      <Route path="/admin/payment-management">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <PaymentManagement />
          </Suspense>
        )}
      </Route>
      <Route path="/admin/audit-logs">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <AuditLogs />
          </Suspense>
        )}
      </Route>

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
            <CreateTournamentLazy />
          </Suspense>
        )}
      </Route>
      <Route path="/tournaments-enhanced">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <TournamentsEnhanced />
          </Suspense>
        )}
      </Route>

      <Route path="/find-teammate">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <FindTeammate />
          </Suspense>
        )}
      </Route>

      <Route path="/join-team">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <JoinTeam />
          </Suspense>
        )}
      </Route>

      <Route path="/tournaments/bracket-demo">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <TournamentBracketDemo />
          </Suspense>
        )}
      </Route>

      <Route path="/calendar">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <Calendar />
          </Suspense>
        )}
      </Route>

      <Route path="/tournaments/my-tournaments">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <MyTournaments />
          </Suspense>
        )}
      </Route>

      <Route path="/teams/my-teams">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <MyTeams />
          </Suspense>
        )}
      </Route>

      <Route path="/settings">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        )}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

import { ThemeProvider } from "@/components/theme-provider";

function App() {
  // Determine if the current route is an admin page
  const [location] = useLocation();
  const isAdminPage = location.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider> {/* Added ThemeProvider */}
      {isAdminPage ? (
        <Router />
      ) : (
        <RootLayout>
          <Router />
        </RootLayout>
      )}
      <Toaster />
      </ThemeProvider> {/* Closed ThemeProvider */}
    </QueryClientProvider>
  );
}

export default App;