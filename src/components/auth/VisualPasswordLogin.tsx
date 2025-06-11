
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import VisualPasswordImage from './VisualPasswordImage';
import { PasswordClick, loginUser } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

const VisualPasswordLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [clicks, setClicks] = useState<PasswordClick[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'username' | 'password'>('username');
  const { toast } = useToast();
  const { login } = useAuth();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter your username",
        variant: "destructive"
      });
      return;
    }
    setStep('password');
    setClicks([]);
  };

  const handlePasswordSubmit = async () => {
    if (clicks.length === 0) {
      toast({
        title: "Error",
        description: "Please click your password pattern",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser(username, clicks);
      
      if (result.success && result.user) {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully",
        });
        login(result.user);
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });
        // Reset clicks on failed attempt
        setClicks([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setClicks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('username');
    setClicks([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {step === 'username' ? 'Welcome Back!' : 'Enter Your Visual Password'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {step === 'username' 
              ? 'Enter your username to continue' 
              : 'Click the same points you selected during registration'
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'username' ? (
            <form onSubmit={handleUsernameSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="text-center text-lg"
                  autoComplete="username"
                />
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                Continue
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Hello, {username}!
                </h3>
                <p className="text-gray-600">
                  Click to log in. Remember your click pattern!
                </p>
              </div>

              <VisualPasswordImage
                onClicksChange={setClicks}
                clicks={clicks}
                maxClicks={5}
                isSetup={false}
              />

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
                
                <Button
                  onClick={handlePasswordSubmit}
                  disabled={clicks.length === 0 || isLoading}
                  className="px-8"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualPasswordLogin;
