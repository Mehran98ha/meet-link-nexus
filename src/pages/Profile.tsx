
import React from 'react';
import { UserCircle, LogOut, Link, Share2, Settings, Shield, Activity, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const statsData = [
    { icon: Activity, label: "Total Meetings", value: "12", color: "ios-blue" },
    { icon: Users, label: "Connections", value: "48", color: "ios-green" },
    { icon: Link, label: "Shared Links", value: "8", color: "ios-purple" },
    { icon: Shield, label: "Security Score", value: "100%", color: "ios-orange" }
  ];

  return (
    <div className={`min-h-screen bg-ios-system-bg pb-20 md:pb-0 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* iOS-Style Header */}
      <div className="ios-nav">
        <div className="container py-ios-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="ios-text-title-2 text-ios-label">Profile</h1>
              <p className="ios-text-callout text-ios-secondary-label">Manage your account and preferences</p>
            </div>
            <Button 
              onClick={handleLogout}
              className="ios-button-destructive ios-spring"
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
        <div className="ios-card-elevated p-ios-lg">
          <div className="flex flex-col md:flex-row gap-ios-lg items-center md:items-start">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-ios-blue to-ios-purple rounded-ios-xl flex items-center justify-center shadow-ios-lg ios-spring">
                <UserCircle className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-ios-green rounded-full border-4 border-white shadow-ios-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-ios-sm">
              <h2 className="ios-text-title-3 text-ios-label">{user?.username}</h2>
              
              <div className="flex flex-wrap gap-ios-sm justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 bg-ios-gray-6 rounded-ios-md px-ios-sm py-1">
                  <Link className="h-4 w-4 text-ios-secondary-label" /> 
                  <span className="ios-text-footnote text-ios-secondary-label">
                    ID: {user?.id?.substring(0, 8)}
                  </span>
                </div>
                
                {user?.created_at && (
                  <div className="inline-flex items-center gap-2 bg-ios-gray-6 rounded-ios-md px-ios-sm py-1">
                    <span className="ios-text-footnote text-ios-secondary-label">
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
              
              <div className="flex gap-ios-sm justify-center md:justify-start mt-ios-md">
                <Button className="ios-button-primary ios-spring">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button className="ios-button-secondary ios-spring">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-ios-md">
          {statsData.map((stat, index) => (
            <div key={index} className="ios-card p-ios-md text-center ios-hover-scale ios-spring">
              <div className={`w-12 h-12 bg-${stat.color}/10 rounded-ios-lg flex items-center justify-center mx-auto mb-ios-sm`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}`} />
              </div>
              <div className="ios-text-title-3 text-ios-label font-bold">{stat.value}</div>
              <div className="ios-text-caption text-ios-secondary-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* iOS-Style Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="ios-list w-full md:w-auto">
            <TabsTrigger 
              value="activity" 
              className="ios-list-item rounded-ios-md data-[state=active]:bg-ios-blue data-[state=active]:text-white"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="ios-list-item rounded-ios-md data-[state=active]:bg-ios-blue data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="invite" 
              className="ios-list-item rounded-ios-md data-[state=active]:bg-ios-blue data-[state=active]:text-white"
            >
              Invite Friends
            </TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-ios-lg">
            <div className="ios-card-elevated p-ios-lg">
              <div className="text-center py-ios-xl">
                <div className="w-16 h-16 bg-ios-gray-6 rounded-ios-xl flex items-center justify-center mx-auto mb-ios-md">
                  <Activity className="h-8 w-8 text-ios-gray" />
                </div>
                <p className="ios-text-body text-ios-secondary-label">Your activity will appear here</p>
                <p className="ios-text-footnote text-ios-tertiary-label mt-ios-xs">Start sharing and joining meetings</p>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-ios-lg">
            <div className="ios-card-elevated p-ios-lg">
              <div className="space-y-ios-lg">
                <h3 className="ios-text-headline text-ios-label">Account Settings</h3>
                
                <div className="ios-list">
                  <button className="ios-list-item w-full text-left ios-spring">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-ios-sm">
                        <Shield className="h-5 w-5 text-ios-blue" />
                        <span className="ios-text-body">Change Visual Password</span>
                      </div>
                      <div className="text-ios-gray-2">›</div>
                    </div>
                  </button>
                  
                  <button className="ios-list-item w-full text-left ios-spring">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-ios-sm">
                        <Settings className="h-5 w-5 text-ios-purple" />
                        <span className="ios-text-body">Privacy Settings</span>
                      </div>
                      <div className="text-ios-gray-2">›</div>
                    </div>
                  </button>
                  
                  <button 
                    className="ios-list-item w-full text-left ios-spring"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-ios-sm">
                        <LogOut className="h-5 w-5 text-ios-red" />
                        <span className="ios-text-body text-ios-red">Logout</span>
                      </div>
                      <div className="text-ios-gray-2">›</div>
                    </div>
                  </button>
                </div>

                <div className="bg-gradient-to-r from-ios-blue/10 to-ios-purple/10 p-ios-md rounded-ios-lg border border-ios-blue/20">
                  <div className="flex items-start gap-ios-sm">
                    <Shield className="h-5 w-5 text-ios-blue mt-1" />
                    <div>
                      <h4 className="ios-text-callout font-semibold text-ios-label mb-ios-xs">Security</h4>
                      <p className="ios-text-footnote text-ios-secondary-label">
                        🔒 Your account is secured with visual password authentication. 
                        Your click pattern is unique and encrypted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Invite Friends Tab */}
          <TabsContent value="invite" className="mt-ios-lg">
            <div className="ios-card-elevated p-ios-lg">
              <div className="text-center py-ios-lg space-y-ios-md">
                <div className="w-16 h-16 bg-gradient-to-br from-ios-blue/20 to-ios-purple/20 rounded-ios-xl flex items-center justify-center mx-auto mb-ios-md">
                  <Share2 className="h-8 w-8 text-ios-blue" />
                </div>
                <h3 className="ios-text-headline text-ios-label">Invite Friends & Colleagues</h3>
                <p className="ios-text-callout text-ios-secondary-label">Share Meet Link Meetly with others</p>
                
                <div className="max-w-md mx-auto mt-ios-lg">
                  <div className="flex items-center ios-card overflow-hidden">
                    <input 
                      type="text" 
                      value="https://meet-link-meetly.com/invite/xyz123" 
                      readOnly
                      className="flex-1 px-ios-md py-ios-sm bg-ios-gray-6 ios-text-subhead focus:outline-none border-none"
                    />
                    <button className="px-ios-md py-ios-sm bg-ios-blue text-white ios-text-callout font-medium ios-spring">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
