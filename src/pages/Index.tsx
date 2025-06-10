
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isLocalStorageAvailable, getUserId } from '@/utils/userIdentity';
import { 
  fetchMeetLinks, 
  createMeetLink, 
  updateMeetLink, 
  deleteMeetLink,
  MeetLink,
  CreateMeetLinkData,
  UpdateMeetLinkData
} from '@/services/meetLinksService';
import LinkItem from '@/components/LinkItem';
import EditLinkModal from '@/components/EditLinkModal';
import StorageWarning from '@/components/StorageWarning';

const Index = () => {
  const [links, setLinks] = useState<MeetLink[]>([]);
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    creator: '',
    notes: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [expandedNotes, setExpandedNotes] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingLink, setEditingLink] = useState<MeetLink | null>(null);
  const [showStorageWarning, setShowStorageWarning] = useState(false);
  const { toast } = useToast();

  // Check localStorage availability on mount
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setShowStorageWarning(true);
    }
    // Initialize user ID
    getUserId();
  }, []);

  // Fetch links from database on component mount
  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMeetLinks();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Error",
        description: "Failed to load meeting links. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateGoogleMeetUrl = (url: string): boolean => {
    const meetUrlPattern = /^https:\/\/meet\.google\.com\/[a-z-]+$/;
    return meetUrlPattern.test(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply character limits
    let finalValue = value;
    if (name === 'name' && value.length > 50) {
      finalValue = value.slice(0, 50);
    } else if (name === 'notes' && value.length > 500) {
      finalValue = value.slice(0, 500);
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!validateGoogleMeetUrl(formData.url)) {
      newErrors.url = 'Please enter a valid Google Meet URL';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Meeting name is required';
    }

    if (!formData.creator.trim()) {
      newErrors.creator = 'Creator name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const linkData: CreateMeetLinkData = {
        url: formData.url,
        name: formData.name,
        creator: formData.creator,
        notes: formData.notes
      };

      const newLink = await createMeetLink(linkData);
      
      // Add new link to the beginning of the list
      setLinks(prev => [newLink, ...prev]);
      
      // Clear form on success
      setFormData({ url: '', name: '', creator: '', notes: '' });
      toast({
        title: "Success",
        description: "Meeting link added successfully!"
      });

    } catch (error) {
      console.error('Error creating link:', error);
      toast({
        title: "Error",
        description: "Failed to save meeting link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (link: MeetLink) => {
    setEditingLink(link);
  };

  const handleUpdateLink = async (id: string, updates: UpdateMeetLinkData) => {
    setIsUpdating(true);
    try {
      const updatedLink = await updateMeetLink(id, updates);
      
      // Update the link in the list
      setLinks(prev => 
        prev.map(link => link.id === id ? updatedLink : link)
      );
      
      toast({
        title: "Success",
        description: "Meeting link updated successfully!"
      });
      
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update meeting link.",
        variant: "destructive"
      });
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meeting link? This action cannot be undone.')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await deleteMeetLink(id);
      
      // Remove the link from the list
      setLinks(prev => prev.filter(link => link.id !== id));
      
      toast({
        title: "Success",
        description: "Meeting link deleted successfully!"
      });
      
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete meeting link.",
        variant: "destructive"
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const toggleNotes = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-background font-['Roboto',sans-serif]">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-foreground mb-2">Meet Link Nexus</h1>
            <p className="text-muted-foreground text-lg">Professional Google Meet link sharing platform</p>
          </div>

          {/* Storage Warning */}
          <StorageWarning 
            isVisible={showStorageWarning} 
            onDismiss={() => setShowStorageWarning(false)} 
          />

          {/* Submission Form */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* URL field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Google Meet URL *
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.url ? 'border-red-500' : 'border-input'
                  }`}
                />
                {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
              </div>

              {/* Name field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meeting Name * (50 chars max)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter meeting name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.name ? 'border-red-500' : 'border-input'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  <p className="text-xs text-muted-foreground ml-auto">{formData.name.length}/50</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Creator field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Creator Name *
                </label>
                <input
                  type="text"
                  name="creator"
                  value={formData.creator}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.creator ? 'border-red-500' : 'border-input'
                  }`}
                />
                {errors.creator && <p className="text-red-500 text-sm mt-1">{errors.creator}</p>}
              </div>

              {/* Notes field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes (500 chars max)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Optional meeting notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.notes.length}/500</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-all duration-300 ease-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Plus size={20} />
              <span>{isSubmitting ? 'Adding...' : 'Add Meet Link'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-foreground mb-2">Recent Meet Links</h2>
          <p className="text-muted-foreground">Click on any meeting name to join. Edit or delete your own links.</p>
        </div>

        {/* Links Display */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>Loading meeting links...</p>
              </div>
            ) : links.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No meeting links yet. Add your first one above!</p>
              </div>
            ) : (
              <div>
                {links.map((link, index) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={deletingIds.has(link.id)}
                    expandedNotes={expandedNotes}
                    onToggleNotes={toggleNotes}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <EditLinkModal
        link={editingLink!}
        isOpen={!!editingLink}
        onClose={() => setEditingLink(null)}
        onSave={handleUpdateLink}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default Index;
