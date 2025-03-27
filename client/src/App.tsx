import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Tickets from "@/pages/Tickets";
import Dashboard from "@/pages/Dashboard";
import KnowledgeBase from "@/pages/KnowledgeBase";
import NewTicket from "@/pages/NewTicket";
import AppHeader from "@/components/AppHeader";
import MobileNavigation from "@/components/MobileNavigation";
import { useState } from "react";

// Simple user context for demonstration
const defaultUser = {
  name: "John Smith",
  initials: "JS",
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Tickets} />
      <Route path="/tickets" component={Tickets} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/knowledge-base" component={KnowledgeBase} />
      <Route path="/new-ticket" component={NewTicket} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user] = useState(defaultUser);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <AppHeader user={user} />
        <div className="flex-1 flex flex-col">
          <Router />
        </div>
        <MobileNavigation />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
