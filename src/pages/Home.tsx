
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
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Header with Better Typography */}
        <div className={`text-center space-y-6 py-8 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-lg"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
            {t('app.name')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('app.description')}
          </p>
        </div>

        {/* Enhanced Tabs with Modern Design */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
          <MeetingTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Improved Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <MeetingFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredLinks.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
              <EmptyState 
                searchTerm={searchTerm}
                onAddMeeting={handleAddMeeting}
                isAuthenticated={isAuthenticated}
              />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
      </div>

      {/* Enhanced Drawer with Better Styling */}
      <Drawer open={showForm} onOpenChange={setShowForm}>
        <DrawerContent className="max-w-3xl mx-auto bg-white rounded-t-3xl border-0 shadow-2xl">
          <DrawerHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl border-b border-gray-100">
            <DrawerTitle className={`text-2xl font-bold text-gray-900 ${isRTL ? 'font-vazirmatn text-right' : 'font-urbanist text-left'}`}>
              {t('meetings.addNew')}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-6">
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
