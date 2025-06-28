
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchMeetLinks, 
  createMeetLink, 
  updateMeetLink, 
  deleteMeetLink,
  MeetLink,
  CreateMeetLinkData,
  canEditLink
} from '@/services/meetLinksService';

export const useMeetings = () => {
  const [links, setLinks] = useState<MeetLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<MeetLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

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

  const handleSubmit = async (formData: CreateMeetLinkData, closeDrawer?: () => void) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }

    setIsSubmitting(true);
    try {
      const newLink = await createMeetLink(formData);
      setLinks(prev => [newLink, ...prev]);
      
      toast({
        title: "Success",
        description: "Meeting link added successfully!"
      });

      if (closeDrawer) closeDrawer();
    } catch (error) {
      console.error('Error creating link:', error);
      toast({
        title: "Error",
        description: "Failed to save meeting link. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLink = async (id: string, updates: any) => {
    setIsUpdating(true);
    try {
      const updatedLink = await updateMeetLink(id, updates);
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
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }

    if (!confirm('Are you sure you want to delete this meeting link? This action cannot be undone.')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await deleteMeetLink(id);
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

  const checkCanEdit = (link: MeetLink): boolean => {
    return isAuthenticated && canEditLink(link);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return {
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
    checkCanEdit,
    loadLinks
  };
};
