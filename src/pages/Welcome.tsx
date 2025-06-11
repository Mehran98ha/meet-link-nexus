
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, Calendar, Bookmark, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Welcome = () => {
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
            Meet Link Meetly
          </h1>
          <p className="text-lg text-gray-600">
            Professional video meeting link sharing platform
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-4">
          <Card className="p-4 border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Organize Meetings</h3>
                <p className="text-gray-500 text-sm">Create and share your Google Meet links with one click</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-purple-100 p-2 flex-shrink-0">
                <Bookmark className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Save Important Links</h3>
                <p className="text-gray-500 text-sm">Bookmark recurring meetings for quick access</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-indigo-100 p-2 flex-shrink-0">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Personalized Profile</h3>
                <p className="text-gray-500 text-sm">Manage your links and meeting preferences</p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link to="/home">
            <Button className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
              <span>Start Sharing</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
