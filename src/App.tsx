import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MemoryProvider } from "@/contexts/MemoryContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Tutor from "./pages/Tutor";
import Grading from "./pages/Grading";
import MemoryProfile from "./pages/MemoryProfile";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MemoryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Onboarding - requires auth but not completed onboarding */}
              <Route path="/onboarding" element={
                <ProtectedRoute requireOnboarding={false}>
                  <Onboarding />
                </ProtectedRoute>
              } />
              
              {/* Protected app routes */}
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tutor" element={<Tutor />} />
                <Route path="/grading" element={<Grading />} />
                <Route path="/memory" element={<MemoryProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/billing" element={<Billing />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MemoryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
