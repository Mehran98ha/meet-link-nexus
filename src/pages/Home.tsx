
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MeetingCard from '@/components/meetings/MeetingCard';
import MeetingForm from '@/components/meetings/MeetingForm';
import MeetingFilters from '@/components/meetings/MeetingFilters';
import MeetingTabs from '@/components/meetings/MeetingTabs';
import EmptyState from '@/components/meetings/EmptyState';
import AuthPromptDialog from '@/components/meetings/AuthPromptDialog';
import LoadingSkeleton from '@/components/meetings/LoadingSkeleton';
import { useMeetings } from '@/hooks/useMeetings';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Home: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const { links, isLoading, handleSubmit, handleUpdateLink, handleDelete, checkCanEdit } = useMeetings();

  const handleAddMeeting = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setShowForm(true);
  };

  const handleCreateMeeting = async (meetingData: any) => {
    try {
      await handleSubmit(meetingData, () => setShowForm(false));
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const filteredMeetings = links.filter(meeting => {
    const matchesSearch = meeting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'my' && isAuthenticated && checkCanEdit(meeting));
    
    return matchesSearch && matchesTab;
  });

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row ${isRTL ? 'sm:flex-row-reverse' : ''} justify-between items-start sm:items-center gap-4`}>
        <div>
          <h1 className={`text-3xl font-bold ${isRTL ? 'text-right font-vazir' : 'text-left font-roboto'}`}>
            {t('home.title')}
          </h1>
          <p className={`text-muted-foreground mt-2 ${isRTL ? 'text-right font-vazir' : 'text-left font-roboto'}`}>
            {t('home.description')}
          </p>
        </div>
        <Button 
          onClick={handleAddMeeting}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse font-vazir' : 'font-roboto'}`}
        >
          <Plus className="h-4 w-4" />
          {t('home.addMeeting')}
        </Button>
      </div>

      {/* Tabs and Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="space-y-4">
            <MeetingTabs 
              activeTab={activeTab} 
              onTabChange={(value: string) => setActiveTab(value as 'all' | 'my')}
              isAuthenticated={isAuthenticated}
            >
              <MeetingFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </MeetingTabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMeetings.length === 0 ? (
            <EmptyState 
              searchTerm={searchTerm}
              isAuthenticated={isAuthenticated}
              onSignUpClick={() => setShowAuthPrompt(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  link={meeting}
                  canEdit={checkCanEdit(meeting)}
                  isDeleting={false}
                  onEdit={(link) => handleUpdateLink(link.id, link)}
                  onDelete={(id) => handleDelete(id)}
                  formatRelativeTime={formatRelativeTime}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meeting Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Add Meeting Link</h2>
            <MeetingForm
              onSubmit={handleCreateMeeting}
              isSubmitting={false}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Prompt Dialog */}
      <AuthPromptDialog
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        onLoginClick={() => {
          setShowAuthPrompt(false);
          // Navigate to auth page
          window.location.href = '/auth';
        }}
      />
    </div>
  );
};

export default Home;
