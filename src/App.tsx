
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import MyLinks from "./pages/MyLinks";
import Join from "./pages/Join";
import Saved from "./pages/Saved";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

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
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <SidebarInset className="flex-1">
                    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                      <SidebarTrigger className="-ml-1" />
                    </header>
                    <main className="flex-1 overflow-y-auto">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/auth" element={<Auth />} />
                        
                        {/* Main public page - shows meets interface */}
                        <Route path="/" element={<Home />} />
                        
                        {/* Protected Routes */}
                        <Route path="/my-links" element={
                          <ProtectedRoute>
                            <MyLinks />
                          </ProtectedRoute>
                        } />
                        <Route path="/join" element={
                          <ProtectedRoute>
                            <Join />
                          </ProtectedRoute>
                        } />
                        <Route path="/saved" element={
                          <ProtectedRoute>
                            <Saved />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />

                        {/* 404 Page */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
