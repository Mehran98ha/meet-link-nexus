
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMeetings } from '@/hooks/useMeetings';
import { filterLinks, formatRelativeTime } from '@/utils/meetingUtils';
import { CreateMeetLinkData } from '@/services/meetLinksService';
import EditLinkModal from '@/components/EditLinkModal';

// Component imports
import MeetingCard from '@/components/meetings/MeetingCard';
import MeetingForm from '@/components/meetings/MeetingForm';
import MeetingFilters from '@/components/meetings/MeetingFilters';
import MeetingTabs from '@/components/meetings/MeetingTabs';
import EmptyState from '@/components/meetings/EmptyState';
import AuthPromptDialog from '@/components/meetings/AuthPromptDialog';
import LoadingSkeleton from '@/components/meetings/LoadingSkeleton';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [editingLink, setEditingLink] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const {
    links,
    filteredLinks,
    setFilteredLinks,
    isLoading,
    isSubmitting,
    isUpdating,
    deletingIds,
    handleSubmit,
    handleUpdateLink,
    handleDelete,
    checkCanEdit
  } = useMeetings();

  // Filter links when searchTerm or activeTab changes
  useEffect(() => {
    const filtered = filterLinks(links, searchTerm, activeTab, isAuthenticated);
    setFilteredLinks(filtered);
  }, [searchTerm, activeTab, links, isAuthenticated, setFilteredLinks]);

  const handleAddLinkClick = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
  };

  const handleFormSubmit = async (e?: React.FormEvent, closeDrawer?: () => void) => {
    if (e) e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    // Get form data from the global window object (set by MeetingForm)
    const formData = (window as any).meetingFormData;
    if (!formData) return;

    try {
      const linkData: CreateMeetLinkData = {
        url: formData.url,
        name: formData.name,
        creator: formData.creator,
        notes: formData.notes
      };

      await handleSubmit(linkData, closeDrawer);
      
      // Clear form
      if ((window as any).clearMeetingForm) {
        (window as any).clearMeetingForm();
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEdit = (link: any) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setEditingLink(link);
  };

  return (
    <div className="pb-4">
      {/* Header with search */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meeting Links</h1>
              <p className="text-gray-500">Browse and join available meetings</p>
            </div>
            <div className="flex gap-2">
              <MeetingFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              {isAuthenticated ? (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Meeting
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="container max-w-lg mx-auto py-4">
                      <h3 className="text-xl font-semibold mb-4">Add New Meeting Link</h3>
                      <MeetingForm 
                        onSubmit={handleFormSubmit}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Button 
                  onClick={handleAddLinkClick}
                  className="bg-gradient-to-r from-blue-600 to-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meeting
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="container py-6">
        <MeetingTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isAuthenticated={isAuthenticated}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredLinks.length === 0 ? (
            <EmptyState 
              searchTerm={searchTerm}
              isAuthenticated={isAuthenticated}
              onSignUpClick={() => setShowAuthPrompt(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLinks.map(link => (
                <MeetingCard
                  key={link.id}
                  link={link}
                  canEdit={checkCanEdit(link)}
                  isDeleting={deletingIds.has(link.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  formatRelativeTime={formatRelativeTime}
                />
              ))}
            </div>
          )}
        </MeetingTabs>
      </div>

      {/* Authentication Prompt Dialog */}
      <AuthPromptDialog
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        onLoginClick={() => navigate('/auth')}
      />

      {/* Edit Modal */}
      <EditLinkModal
        link={editingLink}
        isOpen={!!editingLink}
        onClose={() => setEditingLink(null)}
        onSave={handleUpdateLink}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default Home;
