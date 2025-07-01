
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMeetings } from '@/hooks/useMeetings';
import { MeetLink } from '@/services/meetLinksService';
import MeetingTabs from '@/components/meetings/MeetingTabs';
import MeetingFilters from '@/components/meetings/MeetingFilters';
import MeetingCard from '@/components/meetings/MeetingCard';
import EmptyState from '@/components/meetings/EmptyState';
import LoadingSkeleton from '@/components/meetings/LoadingSkeleton';
import MeetingForm from '@/components/meetings/MeetingForm';
import AuthPromptDialog from '@/components/meetings/AuthPromptDialog';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle 
} from '@/components/ui/drawer';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const {
    links,
    filteredLinks,
    setFilteredLinks,
    isLoading,
    isSubmitting,
    handleSubmit,
    handleUpdateLink,
    handleDelete,
    checkCanEdit
  } = useMeetings();

  // Filter links based on active tab and search/category filters
  useEffect(() => {
    let filtered = links;

    // Filter by tab
    if (activeTab === 'my' && isAuthenticated) {
      filtered = filtered.filter(link => checkCanEdit(link));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(link =>
        link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category (if we add categories later)
    if (selectedCategory !== 'all') {
      // This can be extended when categories are added
    }

    setFilteredLinks(filtered);
  }, [links, activeTab, searchTerm, selectedCategory, isAuthenticated, checkCanEdit, setFilteredLinks]);

  const handleAddMeeting = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setShowForm(true);
  };

  const handleFormSubmit = async (meetingData: any) => {
    console.log('Form data received:', meetingData);
    try {
      await handleSubmit(meetingData);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error handling is done in the hook
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'my');
  };

  const handleEditLink = (link: MeetLink) => {
    // For now, just log - you can implement edit modal later
    console.log('Edit link:', link);
  };

  const handleAuthPromptLogin = () => {
    setShowAuthPrompt(false);
    // Navigate to auth page or show auth modal
    window.location.href = '/auth';
  };

  return (
    <div className={`min-h-screen bg-ios-system-bg ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-ios-md py-ios-lg space-y-ios-lg">
        {/* iOS-Style Hero Section */}
        <div className="text-center space-y-ios-md py-ios-xl">
          <div className="inline-flex items-center justify-center p-ios-md bg-gradient-to-br from-ios-blue/10 to-ios-purple/10 rounded-ios-xl mb-ios-md ios-spring">
            <div className="w-16 h-16 bg-gradient-to-br from-ios-blue to-ios-purple rounded-ios-lg flex items-center justify-center shadow-ios-md">
              <div className="w-8 h-8 bg-white rounded-ios-md flex items-center justify-center">
                <div className="w-4 h-4 bg-ios-blue rounded-ios-sm"></div>
              </div>
            </div>
          </div>
          <h1 className="ios-text-title-1 bg-gradient-to-r from-ios-blue via-ios-purple to-ios-blue bg-clip-text text-transparent animate-ios-fade-in">
            {t('app.name')}
          </h1>
          <p className="ios-text-body text-ios-secondary-label max-w-2xl mx-auto leading-relaxed">
            {t('app.description')}
          </p>
        </div>

        {/* iOS-Style Navigation Tabs */}
        <div className="ios-card ios-spring">
          <MeetingTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* iOS-Style Filters */}
        <div className="ios-card ios-spring">
          <div className="p-ios-md">
            <MeetingFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredLinks.length === 0 ? (
            <div className="ios-card-elevated p-ios-xl">
              <EmptyState 
                searchTerm={searchTerm}
                onAddMeeting={handleAddMeeting}
                isAuthenticated={isAuthenticated}
              />
            </div>
          ) : (
            <div className="grid gap-ios-md sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredLinks.map((link) => (
                <div key={link.id} className="ios-spring ios-hover-scale">
                  <MeetingCard
                    link={link}
                    onEdit={handleEditLink}
                    onDelete={handleDelete}
                    showActions={checkCanEdit(link)}
                    onAddMeeting={handleAddMeeting}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* iOS-Style Drawer */}
      <Drawer open={showForm} onOpenChange={setShowForm}>
        <DrawerContent className="max-w-3xl mx-auto bg-ios-secondary-bg rounded-t-ios-xl border-0 shadow-ios-xl">
          <DrawerHeader className="bg-gradient-to-r from-ios-blue/5 to-ios-purple/5 rounded-t-ios-xl border-b border-ios-gray-5 p-ios-lg">
            <DrawerTitle className={`ios-text-title-2 text-ios-label ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('meetings.addNew')}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-ios-lg">
            <MeetingForm
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Auth Prompt Dialog */}
      <AuthPromptDialog 
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />
    </div>
  );
};

export default Home;
