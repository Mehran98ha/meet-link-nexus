
import React, { useState, useEffect } from 'react';
import { UserCircle, LogOut, Link, Share2, Settings, Shield, Activity, Users, Edit3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import ChangeVisualPassword from '@/components/profile/ChangeVisualPassword';
import { useAnimatedToast } from '@/components/ui/toast-container';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { showToast } = useAnimatedToast();
  const { t, isRTL } = useLanguage();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  useEffect(() => {
    if (user?.profile_image_url) {
      setProfileImageUrl(user.profile_image_url);
    }
  }, [user]);

  const handleImageUpdate = (newImageUrl: string) => {
    setProfileImageUrl(newImageUrl);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      showToast({
        title: t('profile.logout'),
        description: t('common.success'),
        variant: "info",
        duration: 3000
      });
    } catch (error) {
      showToast({
        title: t('common.error'),
        description: t('error.serverError'),
        variant: "error",
        duration: 4000
      });
    }
  };

  const statsData = [
    { icon: Activity, label: t('profile.activity'), value: "12", color: "ios-blue", bgColor: "bg-ios-blue/10" },
    { icon: Users, label: t('nav.joinMeetings'), value: "48", color: "ios-green", bgColor: "bg-ios-green/10" },
    { icon: Link, label: t('nav.myLinks'), value: "8", color: "ios-purple", bgColor: "bg-ios-purple/10" },
    { icon: Shield, label: t('profile.security'), value: "100%", color: "ios-orange", bgColor: "bg-ios-orange/10" }
  ];

  return (
    <SidebarProvider>
      <div className={`min-h-screen w-full flex bg-ios-system-bg ${isRTL ? 'rtl' : 'ltr'}`}>
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="min-h-screen bg-ios-system-bg pb-20 md:pb-0">
      {/* iOS-Style Header */}
      <div className="ios-nav bg-ios-secondary-bg/80 backdrop-blur-ios border-b border-ios-gray-5 sticky top-0 z-40">
        <div className="container py-ios-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="ios-text-title-2 text-ios-label font-bold">{t('profile.title')}</h1>
              <p className="ios-text-callout text-ios-secondary-label">{t('profile.accountSettings')}</p>
            </div>
            <Button 
              onClick={handleLogout}
              className="bg-ios-red hover:bg-ios-red-dark text-ios-label-on-red rounded-ios-lg px-ios-md py-ios-sm font-semibold shadow-ios-sm transition-all duration-200 ios-spring"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('profile.logout')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-ios-lg space-y-ios-lg">
        {/* Enhanced User Profile Card */}
        <Card className="ios-card bg-ios-secondary-bg rounded-ios-2xl shadow-ios-lg border-2 border-ios-gray-5/50 overflow-hidden">
          <div className="bg-gradient-to-br from-ios-blue/10 via-ios-purple/10 to-ios-pink/10 p-ios-lg">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-ios-lg items-center sm:items-start">
                {/* Profile Picture Upload */}
                <div className="flex-shrink-0">
                  <ProfilePictureUpload
                    currentImageUrl={profileImageUrl || undefined}
                    onImageUpdate={handleImageUpdate}
                  />
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left space-y-ios-sm min-w-0">
                  <div className="space-y-ios-xs">
                    <h2 className="ios-text-title-3 text-ios-label font-semibold truncate">{user?.username}</h2>
                    <div className="flex flex-wrap gap-ios-sm justify-center sm:justify-start">
                      <div className="inline-flex items-center gap-2 bg-ios-secondary-bg/80 backdrop-blur-sm rounded-ios-lg px-ios-sm py-ios-xs border border-ios-gray-4/50">
                        <Link className="h-3 w-3 text-ios-blue" /> 
                        <span className="ios-text-footnote text-ios-secondary-label font-medium">
                          ID: {user?.id?.substring(0, 8)}
                        </span>
                      </div>
                      
                      {user?.created_at && (
                        <div className="inline-flex items-center gap-2 bg-ios-secondary-bg/80 backdrop-blur-sm rounded-ios-lg px-ios-sm py-ios-xs border border-ios-gray-4/50">
                          <span className="ios-text-footnote text-ios-secondary-label font-medium">
                            {t('profile.memberSince')}: {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {user?.last_login && (
                      <p className="ios-text-footnote text-ios-tertiary-label">
                        {t('profile.lastLogin')}: {new Date(user.last_login).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-ios-sm justify-center sm:justify-start mt-ios-md">
                    <Button className="bg-ios-blue hover:bg-ios-blue-dark text-ios-label-on-blue rounded-ios-lg px-ios-md py-ios-sm font-semibold shadow-ios-sm transition-all duration-200 ios-spring">
                      <Edit3 className="h-4 w-4 mr-2" />
                      {t('profile.editProfile')}
                    </Button>
                    <Button className="bg-ios-secondary-bg hover:bg-ios-gray-6 text-ios-label rounded-ios-lg px-ios-md py-ios-sm font-semibold border border-ios-gray-4 transition-all duration-200 ios-spring">
                      <Shield className="h-4 w-4 mr-2" />
                      {t('profile.security')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-ios-md">
          {statsData.map((stat, index) => (
            <Card key={index} className={`ios-card bg-ios-secondary-bg rounded-ios-xl shadow-ios-md border border-ios-gray-5/50 p-ios-md text-center hover:shadow-ios-lg transition-all duration-300 ios-spring group hover:scale-105`}>
              <CardContent className="p-0 space-y-ios-sm">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-ios-lg flex items-center justify-center mx-auto mb-ios-sm group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
                <div className="space-y-ios-xs">
                  <div className="ios-text-title-3 text-ios-label font-bold">{stat.value}</div>
                  <div className="ios-text-caption text-ios-secondary-label font-medium">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* iOS-Style Tabs */}
        <Card className="ios-card bg-ios-secondary-bg rounded-ios-2xl shadow-ios-lg border border-ios-gray-5/50 overflow-hidden">
          <Tabs defaultValue="activity" className="w-full">
            <div className="border-b border-ios-gray-5 bg-ios-gray-6/50">
              <TabsList className="bg-transparent w-full justify-start p-ios-md gap-ios-xs">
                <TabsTrigger 
                  value="activity" 
                  className="ios-text-callout font-semibold px-ios-md py-ios-sm rounded-ios-lg data-[state=active]:bg-ios-blue data-[state=active]:text-ios-label-on-blue data-[state=active]:shadow-ios-sm transition-all duration-200"
                >
                  {t('profile.activity')}
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="ios-text-callout font-semibold px-ios-md py-ios-sm rounded-ios-lg data-[state=active]:bg-ios-blue data-[state=active]:text-ios-label-on-blue data-[state=active]:shadow-ios-sm transition-all duration-200"
                >
                  {t('profile.settings')}
                </TabsTrigger>
                <TabsTrigger 
                  value="invite" 
                  className="ios-text-callout font-semibold px-ios-md py-ios-sm rounded-ios-lg data-[state=active]:bg-ios-blue data-[state=active]:text-ios-label-on-blue data-[state=active]:shadow-ios-sm transition-all duration-200"
                >
                  {t('profile.inviteFriends')}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Activity Tab */}
            <TabsContent value="activity" className="p-ios-lg">
              <div className="text-center py-ios-xl space-y-ios-md">
                <div className="w-16 h-16 bg-ios-gray-6 rounded-ios-2xl flex items-center justify-center mx-auto">
                  <Activity className="h-8 w-8 text-ios-gray" />
                </div>
                <div className="space-y-ios-xs">
                  <p className="ios-text-body text-ios-secondary-label font-medium">{t('profile.activityEmpty')}</p>
                  <p className="ios-text-footnote text-ios-tertiary-label">{t('profile.activityEmptyDescription')}</p>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-ios-lg">
              <div className="space-y-ios-lg">
                <h3 className="ios-text-headline text-ios-label font-semibold">{t('profile.accountSettings')}</h3>
                
                {showChangePassword ? (
                  <div className="space-y-ios-md">
                    <Button
                      onClick={() => setShowChangePassword(false)}
                      variant="outline"
                      className="mb-ios-md"
                    >
                      {t('common.back')}
                    </Button>
                    <ChangeVisualPassword />
                  </div>
                ) : (
                  <div className="space-y-ios-xs">
                    {[
                      { 
                        icon: Shield, 
                        label: t('password.changeVisualPassword'), 
                        color: "ios-blue", 
                        action: () => setShowChangePassword(true) 
                      },
                      { 
                        icon: Settings, 
                        label: t('profile.privacySettings'), 
                        color: "ios-purple" 
                      },
                      { 
                        icon: LogOut, 
                        label: t('profile.logout'), 
                        color: "ios-red", 
                        action: handleLogout 
                      }
                    ].map((item, index) => (
                      <button 
                        key={index}
                        onClick={item.action}
                        className="w-full bg-ios-gray-6/50 hover:bg-ios-gray-6 rounded-ios-lg p-ios-md transition-all duration-200 ios-spring hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-ios-sm">
                            <div className={`w-8 h-8 bg-${item.color}/10 rounded-ios-md flex items-center justify-center`}>
                              <item.icon className={`h-4 w-4 text-${item.color}`} />
                            </div>
                            <span className={`ios-text-body font-medium ${item.color === 'ios-red' ? `text-${item.color}` : 'text-ios-label'}`}>
                              {item.label}
                            </span>
                          </div>
                          <div className="text-ios-gray-2 text-xl">›</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="bg-gradient-to-r from-ios-blue/10 to-ios-purple/10 p-ios-md rounded-ios-lg border border-ios-blue/20">
                  <div className="flex items-start gap-ios-sm">
                    <Shield className="h-5 w-5 text-ios-blue mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="ios-text-callout font-semibold text-ios-label mb-ios-xs">{t('profile.security')}</h4>
                      <p className="ios-text-footnote text-ios-secondary-label leading-relaxed">
                        🔒 {t('profile.securityNote')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Invite Friends Tab */}
            <TabsContent value="invite" className="p-ios-lg">
              <div className="text-center py-ios-lg space-y-ios-md">
                <div className="w-16 h-16 bg-gradient-to-br from-ios-blue/20 to-ios-purple/20 rounded-ios-2xl flex items-center justify-center mx-auto">
                  <Share2 className="h-8 w-8 text-ios-blue" />
                </div>
                <div className="space-y-ios-sm">
                  <h3 className="ios-text-headline text-ios-label font-semibold">{t('profile.inviteFriends')}</h3>
                  <p className="ios-text-callout text-ios-secondary-label">{t('profile.inviteDescription')}</p>
                </div>
                
                <div className="max-w-md mx-auto mt-ios-lg">
                  <div className="flex items-center bg-ios-gray-6 rounded-ios-lg overflow-hidden border border-ios-gray-4">
                    <input 
                      type="text" 
                      value={t('profile.inviteLink')} 
                      readOnly
                      className="flex-1 px-ios-md py-ios-sm bg-transparent ios-text-subhead focus:outline-none text-ios-secondary-label"
                    />
                    <button 
                      className="px-ios-md py-ios-sm bg-ios-blue text-ios-label-on-blue ios-text-callout font-semibold hover:bg-ios-blue-dark transition-colors duration-200 ios-spring"
                      onClick={() => showToast({
                        title: t('profile.linkCopied'),
                        description: t('profile.linkCopiedDescription'),
                        variant: "success",
                        duration: 3000
                      })}
                    >
                      {t('profile.copyInviteLink')}
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
          </div>
        </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
