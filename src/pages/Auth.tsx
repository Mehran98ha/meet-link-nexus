
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import VisualPasswordSetup from '@/components/auth/VisualPasswordSetup';
import VisualPasswordLogin from '@/components/auth/VisualPasswordLogin';

type AuthMode = 'welcome' | 'login' | 'signup';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('welcome');
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();

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

  if (mode === 'login') {
    return <VisualPasswordLogin />;
  }

  if (mode === 'signup') {
    return <VisualPasswordSetup />;
  }

  // Welcome screen
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-gradient-start/10 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="w-full max-w-md glass-card floating-card animate-fade-in rounded-3xl p-8">
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 rounded-3xl glass-card mb-4 animate-float">
            <div className="p-4 bg-gradient-to-br from-primary-500 to-gradient-end rounded-2xl">
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">M</span>
              </div>
            </div>
          </div>
          
          <div>
            <h1 className={`text-4xl font-bold bg-gradient-to-r from-primary-600 via-gradient-middle to-gradient-end bg-clip-text text-transparent ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
              {t('app.name')}
            </h1>
            <p className={`text-lg text-muted-foreground mt-2 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
              {t('app.description')}
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <Button 
            onClick={() => setMode('login')}
            className={`w-full gradient-button text-white font-semibold py-6 rounded-2xl shadow-lg ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
            size="lg"
          >
            {t('auth.login')}
          </Button>
          
          <Button 
            onClick={() => setMode('signup')}
            variant="outline"
            className={`w-full py-6 rounded-2xl border-2 hover:bg-primary-50 transition-all duration-300 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
            size="lg"
          >
            {t('auth.signup')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
