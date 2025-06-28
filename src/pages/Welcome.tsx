
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Video, Calendar, Bookmark, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Welcome = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect authenticated users to main page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-white shadow-md mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <Video className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-transparent bg-clip-text">
            Welcome to Meet Link Meetly
          </h1>
          <p className="text-lg text-gray-600">
            Discover and share meeting links with the community
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-4">
          <Card className="p-4 border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Browse Public Meetings</h3>
                <p className="text-gray-500 text-sm">View all shared meeting links without creating an account</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-purple-100 p-2 flex-shrink-0">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Share Your Meetings</h3>
                <p className="text-gray-500 text-sm">Sign up to add your own Google Meet links</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-indigo-100 p-2 flex-shrink-0">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Your Links</h3>
                <p className="text-gray-500 text-sm">Edit and organize your meeting links with an account</p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 space-y-3">
          <Link to="/">
            <Button variant="outline" className="w-full py-6 text-lg shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
              <span>Browse Meetings</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <Link to="/auth">
            <Button className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
              <span>Sign Up to Share</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <p className="text-center text-sm text-gray-500">
            No account needed to browse • Sign up to share your own meetings
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
