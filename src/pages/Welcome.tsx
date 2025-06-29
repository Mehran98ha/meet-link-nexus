
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Video, Calendar, Users, Sparkles, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Welcome = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t, isRTL } = useLanguage();

  // Show loading spinner while checking auth status
  if (isLoading) {
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

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-gradient-start/10 p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className={`text-center space-y-6 animate-fade-in ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
          <div className="inline-flex p-4 rounded-3xl glass-card mb-4 animate-float">
            <div className="p-4 bg-gradient-to-br from-primary-500 to-gradient-end rounded-2xl">
              <Video className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-gradient-middle to-gradient-end bg-clip-text text-transparent">
            {t('app.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('app.description')}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-4 animate-fade-in">
          <Card className="p-6 glass-card floating-card smooth-transition">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 p-3 flex-shrink-0">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className={`font-semibold text-gray-900 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  Browse Public Meetings
                </h3>
                <p className={`text-gray-500 text-sm mt-1 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  View all shared meeting links without creating an account
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card floating-card smooth-transition">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-gradient-middle/20 to-gradient-middle/30 p-3 flex-shrink-0">
                <Calendar className="h-6 w-6 text-gradient-middle" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className={`font-semibold text-gray-900 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  Share Your Meetings
                </h3>
                <p className={`text-gray-500 text-sm mt-1 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  Sign up to add your own Google Meet links
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card floating-card smooth-transition">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-gradient-end/20 to-gradient-end/30 p-3 flex-shrink-0">
                <Shield className="h-6 w-6 text-gradient-end" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className={`font-semibold text-gray-900 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  Manage Your Links
                </h3>
                <p className={`text-gray-500 text-sm mt-1 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
                  Edit and organize your meeting links with an account
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 space-y-4 animate-fade-in">
          <Link to="/">
            <Button 
              variant="outline" 
              className={`w-full py-6 text-lg border-2 hover:bg-primary-50 rounded-2xl smooth-transition group ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
            >
              <Globe className="w-5 h-5 mr-2" />
              <span>Browse Meetings</span>
              <ArrowRight className={`ml-2 h-5 w-5 transition-transform group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'}`} />
            </Button>
          </Link>
          
          <Link to="/auth">
            <Button className={`w-full py-6 text-lg gradient-button text-white rounded-2xl shadow-lg group ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Sign Up to Share</span>
              <ArrowRight className={`ml-2 h-5 w-5 transition-transform group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'}`} />
            </Button>
          </Link>
          
          <p className={`text-center text-sm text-muted-foreground ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
            No account needed to browse • Sign up to share your own meetings
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
