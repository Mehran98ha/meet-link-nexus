
import React, { useState } from 'react';
import { Plus, Search, Filter, Sparkles, Users, Link as LinkIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useMeetings } from '@/hooks/useMeetings';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import MeetingCard from '@/components/meetings/MeetingCard';
import MeetingForm from '@/components/meetings/MeetingForm';
import EditLinkModal from '@/components/EditLinkModal';
import MeetingFilters from '@/components/meetings/MeetingFilters';
import EmptyState from '@/components/meetings/EmptyState';
import LoadingSkeleton from '@/components/meetings/LoadingSkeleton';
import { MeetLink } from '@/services/meetLinksService';
import { useAnimatedToast } from '@/components/ui/toast-container';

const Home = () => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useAnimatedToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingLink, setEditingLink] = useState<MeetLink | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<string>('');

  const {
    data: meetings = [],
    isLoading,
    createMeeting,
    updateMeeting,
    deleteMeeting
  } = useMeetings();

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (meeting.notes && meeting.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCreator = !selectedCreator || meeting.creator === selectedCreator;
    return matchesSearch && matchesCreator;
  });

  const handleCreateMeeting = async (meetingData: any) => {
    try {
      await createMeeting.mutateAsync(meetingData);
      setIsCreating(false);
      showToast({
        title: "Meeting Created",
        description: "Your meeting has been successfully created and is ready to share",
        variant: "success",
        duration: 4000
      });
    } catch (error) {
      showToast({
        title: "Creation Failed",
        description: "Failed to create meeting. Please try again.",
        variant: "error",
        duration: 4000
      });
    }
  };

  const handleUpdateMeeting = async (meetingData: any) => {
    if (!editingLink) return;
    
    try {
      await updateMeeting.mutateAsync({ id: editingLink.id, ...meetingData });
      setEditingLink(null);
      showToast({
        title: "Meeting Updated",
        description: "Your meeting details have been successfully updated",
        variant: "success",
        duration: 4000
      });
    } catch (error) {
      showToast({
        title: "Update Failed", 
        description: "Failed to update meeting. Please try again.",
        variant: "error",
        duration: 4000
      });
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting.mutateAsync(id);
      showToast({
        title: "Meeting Deleted",
        description: "The meeting has been permanently removed",
        variant: "info",
        duration: 3000
      });
    } catch (error) {
      showToast({
        title: "Deletion Failed",
        description: "Failed to delete meeting. Please try again.",
        variant: "error",
        duration: 4000
      });
    }
  };

  const heroStats = [
    { icon: Users, label: t('meetings.activeUsers'), value: '1.2K+', color: 'ios-blue' },
    { icon: LinkIcon, label: t('meetings.totalMeetings'), value: '5.8K+', color: 'ios-green' },
    { icon: Calendar, label: t('meetings.thisMonth'), value: '342', color: 'ios-purple' }
  ];

  return (
    <div className={`min-h-screen bg-ios-system-bg ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ios-blue/10 via-ios-purple/10 to-ios-pink/10"></div>
        <div className="relative container py-ios-2xl">
          <div className="text-center space-y-ios-lg max-w-4xl mx-auto">
            <div className="space-y-ios-md">
              <div className="inline-flex items-center gap-2 bg-ios-secondary-bg/80 backdrop-blur-sm rounded-full px-ios-md py-ios-sm border border-ios-gray-4/50 shadow-ios-sm">
                <Sparkles className="h-4 w-4 text-ios-blue" />
                <span className="ios-text-footnote font-semibold text-ios-secondary-label">
                  {t('meetings.welcomeBack')} {user?.username}
                </span>
              </div>
              
              <h1 className="ios-text-title-1 font-bold text-ios-label leading-tight">
                {t('meetings.heroTitle')}
              </h1>
              
              <p className="ios-text-body text-ios-secondary-label max-w-2xl mx-auto leading-relaxed">
                {t('meetings.heroSubtitle')}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-ios-md max-w-2xl mx-auto">
              {heroStats.map((stat, index) => (
                <Card key={index} className="bg-ios-secondary-bg/60 backdrop-blur-sm border border-ios-gray-5/50 rounded-ios-xl shadow-ios-sm hover:shadow-ios-md transition-all duration-300">
                  <CardContent className="p-ios-md text-center">
                    <div className={`w-10 h-10 bg-${stat.color}/10 rounded-ios-lg flex items-center justify-center mx-auto mb-ios-sm`}>
                      <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                    </div>
                    <div className="ios-text-title-3 font-bold text-ios-label">{stat.value}</div>
                    <div className="ios-text-caption text-ios-secondary-label">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-ios-sm justify-center">
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-ios-blue hover:bg-ios-blue-dark text-ios-label-on-blue rounded-ios-lg px-ios-lg py-ios-md font-semibold shadow-ios-md hover:shadow-ios-lg transition-all duration-200 ios-spring"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t('meetings.createNew')}
              </Button>
              
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-ios-secondary-bg/80 hover:bg-ios-gray-6 text-ios-label border-ios-gray-4 rounded-ios-lg px-ios-lg py-ios-md font-semibold transition-all duration-200 ios-spring"
              >
                <Filter className="h-5 w-5 mr-2" />
                {t('meetings.filters')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-ios-lg space-y-ios-lg">
        {/* Search and Filters */}
        <Card className="bg-ios-secondary-bg rounded-ios-xl shadow-ios-md border border-ios-gray-5/50">
          <CardContent className="p-ios-lg space-y-ios-md">
            <div className="flex flex-col sm:flex-row gap-ios-md">
              <div className="relative flex-1">
                <Search className="absolute left-ios-sm top-1/2 transform -translate-y-1/2 h-5 w-5 text-ios-gray" />
                <Input
                  placeholder={t('meetings.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-ios-gray-6 border-ios-gray-4 rounded-ios-lg ios-text-body focus:border-ios-blue focus:ring-ios-blue/20"
                />
              </div>
            </div>

            {showFilters && (
              <div className="animate-ios-fade-in">
                <MeetingFilters
                  meetings={meetings}
                  selectedCreator={selectedCreator}
                  onCreatorChange={setSelectedCreator}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meetings Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredMeetings.length === 0 ? (
          <EmptyState onAddMeeting={() => setIsCreating(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-ios-md">
            {filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                link={meeting}
                onEdit={setEditingLink}
                onDelete={handleDeleteMeeting}
                showActions={meeting.creator_id === user?.id}
                onAddMeeting={() => setIsCreating(true)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreating && (
        <MeetingForm
          onSubmit={handleCreateMeeting}
          onCancel={() => setIsCreating(false)}
          isLoading={createMeeting.isPending}
        />
      )}

      {editingLink && (
        <EditLinkModal
          link={editingLink}
          onSave={handleUpdateMeeting}
          onCancel={() => setEditingLink(null)}
          isLoading={updateMeeting.isPending}
        />
      )}
    </div>
  );
};

export default Home;
