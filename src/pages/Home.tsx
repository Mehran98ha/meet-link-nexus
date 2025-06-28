
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const { meetings, isLoading, createMeeting, deleteMeeting, updateMeeting } = useMeetings();

  const handleAddMeeting = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setShowForm(true);
  };

  const handleCreateMeeting = async (meetingData: any) => {
    await createMeeting(meetingData);
    setShowForm(false);
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || meeting.category === selectedCategory;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'my' && isAuthenticated && meeting.creator_id === 'current-user');
    
    return matchesSearch && matchesCategory && matchesTab;
  });

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
          <h1 className={`text-3xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('home.title')}
          </h1>
          <p className={`text-muted-foreground mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('home.description')}
          </p>
        </div>
        <Button 
          onClick={handleAddMeeting}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
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
              onTabChange={setActiveTab}
              showMyTab={isAuthenticated}
            />
            <MeetingFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredMeetings.length === 0 ? (
            <EmptyState onAddMeeting={handleAddMeeting} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onEdit={updateMeeting}
                  onDelete={deleteMeeting}
                  showActions={isAuthenticated}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meeting Form Modal */}
      {showForm && (
        <MeetingForm
          onSubmit={handleCreateMeeting}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Auth Prompt Dialog */}
      <AuthPromptDialog
        open={showAuthPrompt}
        onOpenChange={setShowAuthPrompt}
      />
    </div>
  );
};

export default Home;
