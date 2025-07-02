
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMeetings } from '@/hooks/useMeetings';
import { MeetLink } from '@/services/meetLinksService';
import { useAnimatedToast } from '@/components/ui/toast-container';
import HeroSection from '@/components/meetings/HeroSection';
import SearchAndFilters from '@/components/meetings/SearchAndFilters';
import MeetingsGrid from '@/components/meetings/MeetingsGrid';
import MeetingForm from '@/components/meetings/MeetingForm';
import EditLinkModal from '@/components/EditLinkModal';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

const Home = () => {
  const { t, isRTL } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useAnimatedToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingLink, setEditingLink] = useState<MeetLink | null>(null);

  const {
    links,
    isLoading,
    isSubmitting,
    handleSubmit,
    handleUpdateLink,
    handleDelete
  } = useMeetings();

  const filteredMeetings = links.filter(meeting => {
    const matchesSearch = meeting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (meeting.notes && meeting.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleCreateMeeting = async (meetingData: any) => {
    try {
      await handleSubmit(meetingData, () => setIsCreating(false));
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
      await handleUpdateLink(editingLink.id, meetingData);
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
      await handleDelete(id);
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

  return (
    <SidebarProvider>
      <div className={`min-h-screen w-full flex bg-ios-system-bg ${isRTL ? 'rtl' : 'ltr'}`}>
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <HeroSection
            username={user?.username}
            onCreateMeeting={() => setIsCreating(true)}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />

          <div className="container py-ios-lg space-y-ios-lg">
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showFilters={showFilters}
            />

            <MeetingsGrid
              meetings={filteredMeetings}
              isLoading={isLoading}
              searchQuery={searchQuery}
              isAuthenticated={isAuthenticated}
              currentUserId={user?.id}
              onEditMeeting={setEditingLink}
              onDeleteMeeting={handleDeleteMeeting}
              onAddMeeting={() => setIsCreating(true)}
            />
          </div>

          {/* Modals */}
          {isCreating && (
            <MeetingForm
              onSubmit={handleCreateMeeting}
              isSubmitting={isSubmitting}
              onClose={() => setIsCreating(false)}
            />
          )}

          {editingLink && (
            <EditLinkModal
              link={editingLink}
              isOpen={!!editingLink}
              onClose={() => setEditingLink(null)}
              onSave={handleUpdateMeeting}
              isLoading={false}
            />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Home;
