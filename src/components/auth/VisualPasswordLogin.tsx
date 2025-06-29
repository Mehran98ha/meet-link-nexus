
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import VisualPasswordImage from './VisualPasswordImage';
import { PasswordClick, loginUser } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const VisualPasswordLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [clicks, setClicks] = useState<PasswordClick[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'username' | 'password'>('username');
  const { toast } = useToast();
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: t('common.error'),
        description: t('auth.enterUsername'),
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
        title: t('common.error'),
        description: 'Please click your password pattern',
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser(username, clicks);
      
      if (result.success && result.user) {
        toast({
          title: t('auth.welcomeBack'),
          description: "You have been logged in successfully",
        });
        login(result.user);
      } else {
        toast({
          title: "Login Failed",
          description: result.error || t('error.invalidCredentials'),
          variant: "destructive"
        });
        // Reset clicks on failed attempt
        setClicks([]);
      }
    } catch (error) {
      toast({
        title: t('common.error'),
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
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 ${isRTL ? 'rtl font-vazirmatn' : 'ltr font-urbanist'}`}>
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className={`text-3xl font-bold text-gray-900 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
            {step === 'username' ? t('auth.welcomeBack') : t('auth.enterVisualPassword')}
          </CardTitle>
          <p className={`text-gray-600 mt-2 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
            {step === 'username' 
              ? t('auth.enterUsernameToLogin')
              : t('auth.clickSamePoints')
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'username' ? (
            <form onSubmit={handleUsernameSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="username" className={isRTL ? 'font-vazirmatn' : 'font-urbanist'}>
                  {t('auth.username')}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('auth.enterUsername')}
                  className={`text-center text-lg ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
                  autoComplete="username"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              
              <Button type="submit" className={`w-full ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`} size="lg">
                {t('auth.continue')}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-xl font-semibold text-gray-800 mb-2 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  {isRTL ? `سلام، ${username}!` : `Hello, ${username}!`}
                </h3>
                <p className={`text-gray-600 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  {t('auth.rememberPattern')}
                </p>
              </div>

              <VisualPasswordImage
                onClicksChange={setClicks}
                clicks={clicks}
                maxClicks={5}
                isSetup={false}
              />

              <div className={`flex flex-col sm:flex-row gap-3 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className={isRTL ? 'font-vazirmatn' : 'font-urbanist'}
                >
                  {t('common.back')}
                </Button>
                
                <Button
                  onClick={handlePasswordSubmit}
                  disabled={clicks.length === 0 || isLoading}
                  className={`px-8 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
                >
                  {isLoading ? 'Logging in...' : t('auth.login')}
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
