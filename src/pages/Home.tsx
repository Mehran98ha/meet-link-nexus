import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMeetings } from '@/hooks/useMeetings';
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
    try {
      await handleSubmit(meetingData, () => setShowForm(false));
    } catch (error) {
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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 via-white to-gradient-start/10 p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`text-center space-y-4 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-gradient-middle to-gradient-end bg-clip-text text-transparent">
            {t('app.name')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('app.description')}
          </p>
        </div>

        {/* Tabs */}
        <MeetingTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          isAuthenticated={isAuthenticated}
        />

        {/* Filters */}
        <MeetingFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredLinks.length === 0 ? (
          <EmptyState 
            activeTab={activeTab}
            searchTerm={searchTerm}
            onAddMeeting={handleAddMeeting}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLinks.map((link) => (
              <MeetingCard
                key={link.id}
                link={link}
                onEdit={handleEditLink}
                onDelete={handleDelete}
                showActions={checkCanEdit(link)}
                onAddMeeting={handleAddMeeting}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Meeting Form Drawer */}
      <Drawer open={showForm} onOpenChange={setShowForm}>
        <DrawerContent className="max-w-2xl mx-auto">
          <DrawerHeader>
            <DrawerTitle className={isRTL ? 'font-vazirmatn' : 'font-urbanist'}>
              {t('meetings.addNew')}
            </DrawerTitle>
          </DrawerHeader>
          <MeetingForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
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
