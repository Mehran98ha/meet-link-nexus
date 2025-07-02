
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import { useMeetings } from '@/hooks/useMeetings';
import MeetingsGrid from '@/components/meetings/MeetingsGrid';
import SearchAndFilters from '@/components/meetings/SearchAndFilters';
import { useState } from 'react';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { links, isLoading: meetingsLoading } = useMeetings();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, redirect to home with sidebar
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Show public homepage with meetings for unauthenticated users
  const filteredMeetings = links.filter(meeting => {
    const matchesSearch = meeting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (meeting.notes && meeting.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Meeting Links
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Browse public meeting links or sign up to share your own
            </p>
          </div>
        </div>

        {/* Meetings Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showFilters={false}
            />
            
            <MeetingsGrid
              meetings={filteredMeetings}
              isLoading={meetingsLoading}
              searchQuery={searchQuery}
              isAuthenticated={false}
              onEditMeeting={() => {}}
              onDeleteMeeting={() => {}}
              onAddMeeting={() => {}}
            />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Index;
