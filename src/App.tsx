
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import MyLinks from "./pages/MyLinks";
import Join from "./pages/Join";
import Saved from "./pages/Saved";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Authentication Route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Welcome/Splash Screen */}
              <Route path="/welcome" element={<Welcome />} />
              
              {/* Protected Routes with AppLayout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Home />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/my-links" element={
                <ProtectedRoute>
                  <AppLayout>
                    <MyLinks />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/join" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Join />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/saved" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Saved />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* Redirect legacy routes */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
