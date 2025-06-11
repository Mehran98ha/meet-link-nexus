
import React from 'react';
import { UserCircle, LogOut, Link, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
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

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-500">Manage your account and preferences</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        {/* User Info Card */}
        <Card className="bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex items-center justify-center h-20 w-20 bg-gray-100 rounded-full">
                <UserCircle className="h-12 w-12 text-gray-500" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Link className="h-4 w-4" /> 
                    <span>User ID: {user?.id?.substring(0, 8)}</span>
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
                {user?.last_login && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last login: {new Date(user.last_login).toLocaleDateString()}
                  </p>
                )}
                <div className="mt-4">
                  <Button variant="outline" size="sm">Edit Profile</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="w-full md:w-auto bg-gray-100/80 rounded-lg p-1">
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="invite" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              Invite Friends
            </TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">Your activity will appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Start sharing and joining meetings</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Account Settings</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">Change Visual Password</Button>
                    <Button variant="outline" className="w-full justify-start">Privacy Settings</Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>

                  <h3 className="font-medium text-lg pt-4">Security</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      🔒 Your account is secured with visual password authentication. 
                      Your click pattern is unique and encrypted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invite Friends Tab */}
          <TabsContent value="invite" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-center py-6 space-y-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-2">
                    <Share2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-lg">Invite Friends & Colleagues</h3>
                  <p className="text-gray-500">Share Meet Link Meetly with others</p>
                  
                  <div className="max-w-md mx-auto mt-4">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <input 
                        type="text" 
                        value="https://meet-link-Meetly.com/invite/xyz123" 
                        readOnly
                        className="flex-1 px-4 py-2 bg-gray-50 text-sm focus:outline-none"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium">
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
