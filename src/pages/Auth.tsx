
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Sparkles, ArrowLeft, Mail, Lock, User, Camera, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { registerUser, loginUser } from '@/services/authService';

type AuthMode = 'welcome' | 'login' | 'signup' | 'forgot';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    pin: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();

  // Show loading spinner while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-gradient-start/10">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to main page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: t('common.error'),
        description: t('error.fieldRequired'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, using the visual password system
      const result = await loginUser(formData.username, []);
      
      if (result.success && result.user) {
        toast({
          title: t('common.success'),
          description: t('auth.welcomeBack'),
        });
        login(result.user);
      } else {
        toast({
          title: t('common.error'),
          description: result.error || t('error.invalidCredentials'),
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('error.serverError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: t('common.error'),
        description: t('error.fieldRequired'),
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('common.error'),
        description: t('error.passwordsNotMatch'),
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: t('common.error'),
        description: t('error.passwordTooShort'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, using the visual password system
      const result = await registerUser(formData.username, []);
      
      if (result.success && result.user) {
        toast({
          title: t('common.success'),
          description: t('auth.createAccount'),
        });
        login(result.user);
      } else {
        toast({
          title: t('common.error'),
          description: result.error || t('error.serverError'),
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('error.serverError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'welcome') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-gradient-start/10 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md glass-card floating-card animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-gradient-end rounded-2xl flex items-center justify-center animate-float">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className={`text-3xl font-semibold bg-gradient-to-r from-primary-600 to-gradient-middle bg-clip-text text-transparent ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                {t('auth.joinMeetly')}
              </CardTitle>
              <p className={`text-muted-foreground mt-2 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                {t('app.description')}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setMode('login')}
              className={`w-full gradient-button text-white font-semibold py-6 rounded-2xl shadow-lg ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
              size="lg"
            >
              <User className="w-5 h-5 mr-2" />
              {t('auth.login')}
            </Button>
            
            <Button 
              onClick={() => setMode('signup')}
              variant="outline"
              className={`w-full py-6 rounded-2xl border-2 hover:bg-primary-50 transition-all duration-300 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t('auth.signup')}
            </Button>
            
            <div className={`text-center text-sm text-muted-foreground mt-6 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
              <p>{t('auth.alreadyHaveAccount')}</p>
              <a href="/" className="text-primary-600 hover:underline transition-colors">
                {t('empty.signUpButton')}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-gradient-start/10 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md glass-card floating-card animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <Button
              variant="ghost"
              onClick={() => setMode('welcome')}
              className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-4 p-2 rounded-full hover:bg-primary-50`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-gradient-end rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className={`text-2xl font-semibold ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                {t('auth.welcomeBack')}
              </CardTitle>
              <p className={`text-muted-foreground mt-2 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                {t('auth.enterUsername')}
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className={`text-sm font-medium ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  {t('auth.username')}
                </Label>
                <div className="relative">
                  <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-muted-foreground`} />
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`${isRTL ? 'pr-10 font-vazirmatn' : 'pl-10 font-urbanist'} h-12 rounded-xl border-2 focus:border-primary-500 transition-colors`}
                    placeholder={t('auth.enterUsername')}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className={`text-sm font-medium ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  {t('auth.password')}
                </Label>
                <div className="relative">
                  <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-muted-foreground`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`${isRTL ? 'pr-10 pl-10 font-vazirmatn' : 'pl-10 pr-10 font-urbanist'} h-12 rounded-xl border-2 focus:border-primary-500 transition-colors`}
                    placeholder={t('auth.enterPassword')}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-2 p-2`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <Button
                type="button"
                variant="link"
                onClick={() => setMode('forgot')}
                className={`text-primary-600 hover:text-primary-700 p-0 h-auto ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
              >
                {t('auth.forgotPassword')}
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full gradient-button text-white font-semibold py-6 rounded-2xl shadow-lg ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
              >
                {isLoading ? t('common.loading') : t('auth.login')}
              </Button>
              
              <div className={`text-center text-sm ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                <span className="text-muted-foreground">{t('auth.dontHaveAccount')} </span>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode('signup')}
                  className="text-primary-600 hover:text-primary-700 p-0 h-auto"
                >
                  {t('auth.signup')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'signup') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-gradient-start/10 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md glass-card floating-card animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <Button
              variant="ghost"
              onClick={() => setMode('welcome')}
              className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-4 p-2 rounded-full hover:bg-primary-50`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-gradient-end rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className={`text-2xl font-semibold ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                {t('auth.createYourAccount')}
              </CardTitle>
              <p className={`text-muted-foreground mt-2 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                {t('auth.joinMeetly')}
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username" className={`text-sm font-medium ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  {t('auth.username')}
                </Label>
                <div className="relative">
                  <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-muted-foreground`} />
                  <Input
                    id="signup-username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`${isRTL ? 'pr-10 font-vazirmatn' : 'pl-10 font-urbanist'} h-12 rounded-xl border-2 focus:border-primary-500 transition-colors`}
                    placeholder={t('auth.enterUsername')}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email" className={`text-sm font-medium ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  {t('auth.email')}
                </Label>
                <div className="relative">
                  <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-muted-foreground`} />
                  <Input
                    id="signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`${isRTL ? 'pr-10 font-vazirmatn' : 'pl-10 font-urbanist'} h-12 rounded-xl border-2 focus:border-primary-500 transition-colors`}
                    placeholder={t('auth.enterEmail')}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password" className={`text-sm font-medium ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  {t('auth.password')}
                </Label>
                <div className="relative">
                  <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-muted-foreground`} />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`${isRTL ? 'pr-10 pl-10 font-vazirmatn' : 'pl-10 pr-10 font-urbanist'} h-12 rounded-xl border-2 focus:border-primary-500 transition-colors`}
                    placeholder={t('auth.enterPassword')}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-2 p-2`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className={`text-sm font-medium ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  {t('auth.confirmPassword')}
                </Label>
                <div className="relative">
                  <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-muted-foreground`} />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`${isRTL ? 'pr-10 font-vazirmatn' : 'pl-10 font-urbanist'} h-12 rounded-xl border-2 focus:border-primary-500 transition-colors`}
                    placeholder={t('auth.confirmPassword')}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin" className={`text-sm font-medium ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  {t('auth.pin')} <span className="text-xs text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <Shield className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-muted-foreground`} />
                  <Input
                    id="pin"
                    type="text"
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) => handleInputChange('pin', e.target.value.replace(/\D/g, ''))}
                    className={`${isRTL ? 'pr-10 font-vazirmatn' : 'pl-10 font-urbanist'} h-12 rounded-xl border-2 focus:border-primary-500 transition-colors`}
                    placeholder={t('auth.enterPin')}
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full gradient-button text-white font-semibold py-6 rounded-2xl shadow-lg ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
              >
                {isLoading ? t('common.loading') : t('auth.createAccount')}
              </Button>
              
              <div className={`text-center text-sm ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                <span className="text-muted-foreground">{t('auth.alreadyHaveAccount')} </span>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode('login')}
                  className="text-primary-600 hover:text-primary-700 p-0 h-auto"
                >
                  {t('auth.login')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Auth;
