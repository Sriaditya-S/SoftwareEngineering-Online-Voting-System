
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateElection from "./pages/CreateElection";
import Election from "./pages/Election";
import Results from "./pages/Results";
import CandidateDashboard from "./pages/CandidateDashboard";
import VoterProfile from "./pages/VoterProfile";
import CandidateDetails from "./pages/CandidateDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CandidateRoute from "./components/CandidateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Voter Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['voter']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['voter']}>
                  <VoterProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/election/:id" 
              element={
                <ProtectedRoute allowedRoles={['voter']}>
                  <Election />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results/:id" 
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidate/:id" 
              element={
                <ProtectedRoute>
                  <CandidateDetails />
                </ProtectedRoute>
              } 
            />
            
            {/* Candidate Routes */}
            <Route 
              path="/candidate/dashboard" 
              element={
                <CandidateRoute>
                  <CandidateDashboard />
                </CandidateRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/create-election" 
              element={
                <AdminRoute>
                  <CreateElection />
                </AdminRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
