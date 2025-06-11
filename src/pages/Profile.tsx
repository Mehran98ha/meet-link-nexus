
import React from 'react';
import { UserCircle, Mail, Link, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getUserId } from '@/utils/userIdentity';

const Profile = () => {
  // In a real implementation, we would fetch user data from a backend
  // For now, we're using placeholder data
  const userId = getUserId();
  
  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500">Manage your account and preferences</p>
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
                <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
                <p className="text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-4 w-4" /> 
                    <span>user@example.com</span>
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Link className="h-4 w-4" /> 
                    <span>User ID: {userId.substring(0, 8)}</span>
                  </span>
                </p>
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
                  <h3 className="font-medium text-lg">Notification Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Email Notifications</span>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                        <span className="inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition-transform duration-200 ease-in-out translate-x-[2px]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Meeting Reminders</span>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                        <span className="inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition-transform duration-200 ease-in-out translate-x-[2px]" />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-medium text-lg pt-4">Account Settings</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">Change Password</Button>
                    <Button variant="outline" className="w-full justify-start">Privacy Settings</Button>
                    <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">Delete Account</Button>
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
                  <p className="text-gray-500">Share Meet Link Nexus with others</p>
                  
                  <div className="max-w-md mx-auto mt-4">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <input 
                        type="text" 
                        value="https://meet-link-nexus.com/invite/xyz123" 
                        readOnly
                        className="flex-1 px-4 py-2 bg-gray-50 text-sm focus:outline-none"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium">
                        Copy
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-center mt-4 space-x-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                      
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="#1DA1F2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.205 10.205 0 01-3.126 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </Button>
                      
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </Button>
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
