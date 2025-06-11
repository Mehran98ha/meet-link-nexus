
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import VisualPasswordImage from './VisualPasswordImage';
import { PasswordClick, registerUser } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

const VisualPasswordSetup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [clicks, setClicks] = useState<PasswordClick[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'username' | 'password'>('username');
  const { toast } = useToast();
  const { login } = useAuth();

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast({
        title: "Error", 
        description: "Username can only contain letters, numbers, and underscores",
        variant: "destructive"
      });
      return;
    }

    setStep('password');
  };

  const handlePasswordSubmit = async () => {
    if (clicks.length === 0) {
      toast({
        title: "Error",
        description: "Please set at least one click point",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser(username, clicks);
      
      if (result.success && result.user) {
        toast({
          title: "Success!",
          description: "Your account has been created successfully",
        });
        login(result.user);
      } else {
        toast({
          title: "Error",
          description: result.error || "Registration failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('username');
    setClicks([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {step === 'username' ? 'Welcome!' : 'Set Your Visual Password'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {step === 'username' 
              ? 'Create your account to get started' 
              : 'Click 1 to 5 points on the image to create your unique visual password'
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'username' ? (
            <form onSubmit={handleUsernameSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="username">Choose a Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="text-center text-lg"
                  autoComplete="username"
                />
                <p className="text-sm text-gray-500">
                  Use only letters, numbers, and underscores
                </p>
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
                  Click to set your visual password. Remember your click pattern!
                </p>
              </div>

              <VisualPasswordImage
                onClicksChange={setClicks}
                clicks={clicks}
                maxClicks={5}
                isSetup={true}
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
                  {isLoading ? 'Creating Account...' : 'Confirm & Create Account'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualPasswordSetup;
