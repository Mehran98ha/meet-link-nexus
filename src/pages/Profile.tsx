
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
import { useAnimatedToast } from '@/components/ui/toast-container';

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { showToast } = useAnimatedToast();
  const { t, isRTL } = useLanguage();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('profile_image_url')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data?.profile_image_url) {
        setProfileImageUrl(data.profile_image_url);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleImageUpdate = (newImageUrl: string) => {
    setProfileImageUrl(newImageUrl);
    showToast({
      title: "Profile Updated",
      description: "Your profile picture has been successfully updated",
      variant: "success",
      duration: 4000
    });
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      showToast({
        title: "Logged Out",
        description: "You have been successfully logged out",
        variant: "info",
        duration: 3000
      });
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "error",
        duration: 4000
      });
    }
  };

  const statsData = [
    { icon: Activity, label: "Total Meetings", value: "12", color: "ios-blue", bgColor: "bg-ios-blue/10" },
    { icon: Users, label: "Connections", value: "48", color: "ios-green", bgColor: "bg-ios-green/10" },
    { icon: Link, label: "Shared Links", value: "8", color: "ios-purple", bgColor: "bg-ios-purple/10" },
    { icon: Shield, label: "Security Score", value: "100%", color: "ios-orange", bgColor: "bg-ios-orange/10" }
  ];

  return (
    <div className={`min-h-screen bg-ios-system-bg pb-20 md:pb-0 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* iOS-Style Header */}
      <div className="ios-nav bg-ios-secondary-bg/80 backdrop-blur-ios border-b border-ios-gray-5 sticky top-0 z-40">
        <div className="container py-ios-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="ios-text-title-2 text-ios-label font-bold">Profile</h1>
              <p className="ios-text-callout text-ios-secondary-label">Manage your account and preferences</p>
            </div>
            <Button 
              onClick={handleLogout}
              className="bg-ios-red hover:bg-ios-red-dark text-ios-label-on-red rounded-ios-lg px-ios-md py-ios-sm font-semibold shadow-ios-sm transition-all duration-200 ios-spring"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
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
                  {isLoadingProfile ? (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-ios-2xl bg-ios-gray-5 animate-pulse flex items-center justify-center">
                      <UserCircle className="h-16 w-16 text-ios-gray" />
                    </div>
                  ) : (
                    <ProfilePictureUpload
                      currentImageUrl={profileImageUrl || undefined}
                      onImageUpdate={handleImageUpdate}
                    />
                  )}
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
                            Member since: {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {user?.last_login && (
                      <p className="ios-text-footnote text-ios-tertiary-label">
                        Last login: {new Date(user.last_login).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-ios-sm justify-center sm:justify-start mt-ios-md">
                    <Button className="bg-ios-blue hover:bg-ios-blue-dark text-ios-label-on-blue rounded-ios-lg px-ios-md py-ios-sm font-semibold shadow-ios-sm transition-all duration-200 ios-spring">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button className="bg-ios-secondary-bg hover:bg-ios-gray-6 text-ios-label rounded-ios-lg px-ios-md py-ios-sm font-semibold border border-ios-gray-4 transition-all duration-200 ios-spring">
                      <Shield className="h-4 w-4 mr-2" />
                      Security
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
                  Activity
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="ios-text-callout font-semibold px-ios-md py-ios-sm rounded-ios-lg data-[state=active]:bg-ios-blue data-[state=active]:text-ios-label-on-blue data-[state=active]:shadow-ios-sm transition-all duration-200"
                >
                  Settings
                </TabsTrigger>
                <TabsTrigger 
                  value="invite" 
                  className="ios-text-callout font-semibold px-ios-md py-ios-sm rounded-ios-lg data-[state=active]:bg-ios-blue data-[state=active]:text-ios-label-on-blue data-[state=active]:shadow-ios-sm transition-all duration-200"
                >
                  Invite Friends
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
                  <p className="ios-text-body text-ios-secondary-label font-medium">Your activity will appear here</p>
                  <p className="ios-text-footnote text-ios-tertiary-label">Start sharing and joining meetings</p>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-ios-lg">
              <div className="space-y-ios-lg">
                <h3 className="ios-text-headline text-ios-label font-semibold">Account Settings</h3>
                
                <div className="space-y-ios-xs">
                  {[
                    { icon: Shield, label: "Change Visual Password", color: "ios-blue" },
                    { icon: Settings, label: "Privacy Settings", color: "ios-purple" },
                    { icon: LogOut, label: "Logout", color: "ios-red", action: handleLogout }
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

                <div className="bg-gradient-to-r from-ios-blue/10 to-ios-purple/10 p-ios-md rounded-ios-lg border border-ios-blue/20">
                  <div className="flex items-start gap-ios-sm">
                    <Shield className="h-5 w-5 text-ios-blue mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="ios-text-callout font-semibold text-ios-label mb-ios-xs">Security</h4>
                      <p className="ios-text-footnote text-ios-secondary-label leading-relaxed">
                        🔒 Your account is secured with visual password authentication. 
                        Your click pattern is unique and encrypted.
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
                  <h3 className="ios-text-headline text-ios-label font-semibold">Invite Friends & Colleagues</h3>
                  <p className="ios-text-callout text-ios-secondary-label">Share Meet Link Meetly with others</p>
                </div>
                
                <div className="max-w-md mx-auto mt-ios-lg">
                  <div className="flex items-center bg-ios-gray-6 rounded-ios-lg overflow-hidden border border-ios-gray-4">
                    <input 
                      type="text" 
                      value="https://meet-link-meetly.com/invite/xyz123" 
                      readOnly
                      className="flex-1 px-ios-md py-ios-sm bg-transparent ios-text-subhead focus:outline-none text-ios-secondary-label"
                    />
                    <button 
                      className="px-ios-md py-ios-sm bg-ios-blue text-ios-label-on-blue ios-text-callout font-semibold hover:bg-ios-blue-dark transition-colors duration-200 ios-spring"
                      onClick={() => showToast({
                        title: "Link Copied",
                        description: "Invitation link copied to clipboard",
                        variant: "success",
                        duration: 3000
                      })}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
