
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VisualPasswordSetup from '@/components/auth/VisualPasswordSetup';
import VisualPasswordLogin from '@/components/auth/VisualPasswordLogin';
import { useAuth } from '@/contexts/AuthContext';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect authenticated users to home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (mode === 'login') {
    return <VisualPasswordLogin />;
  }

  if (mode === 'signup') {
    return <VisualPasswordSetup />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Meet Link Meetly
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Secure visual password authentication
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={() => setMode('login')}
            className="w-full" 
            size="lg"
          >
            Login
          </Button>
          
          <Button 
            onClick={() => setMode('signup')}
            variant="outline"
            className="w-full" 
            size="lg"
          >
            Create Account
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>New to visual passwords?</p>
            <p>Create an account to get started!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
