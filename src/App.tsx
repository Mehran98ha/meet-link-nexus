
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ToastProvider } from "@/components/ui/toast-container";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Home from './pages/Home';
import Profile from './pages/Profile';
import MyLinks from './pages/MyLinks';
import Saved from './pages/Saved';
import Join from './pages/Join';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <LanguageProvider>
              <ToastProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/home" element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/my-links" element={
                      <ProtectedRoute>
                        <MyLinks />
                      </ProtectedRoute>
                    } />
                    <Route path="/saved" element={
                      <ProtectedRoute>
                        <Saved />
                      </ProtectedRoute>
                    } />
                    <Route path="/join/:linkId" element={<Join />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ToastProvider>
            </LanguageProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
