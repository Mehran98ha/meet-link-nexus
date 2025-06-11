import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Clock, ExternalLink, Edit, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { isLocalStorageAvailable, getUserId } from '@/utils/userIdentity';
import { 
  fetchMeetLinks, 
  createMeetLink, 
  updateMeetLink, 
  deleteMeetLink,
  MeetLink,
  CreateMeetLinkData,
  canEditLink
} from '@/services/meetLinksService';
import EditLinkModal from '@/components/EditLinkModal';

const Home = () => {
  const [links, setLinks] = useState<MeetLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<MeetLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingLink, setEditingLink] = useState<MeetLink | null>(null);
  const [showStorageWarning, setShowStorageWarning] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    creator: '',
    notes: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('all');
  
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

  // Filter links when searchTerm or activeTab changes
  useEffect(() => {
    filterLinks();
  }, [searchTerm, activeTab, links]);

  const filterLinks = () => {
    let filtered = [...links];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(link => 
        link.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        link.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab === 'mine') {
      const userId = getUserId();
      filtered = filtered.filter(link => link.creator_id === userId);
    } else if (activeTab === 'recent') {
      // Sort by created_at and take top 5
      filtered = [...filtered].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 5);
    }

    setFilteredLinks(filtered);
  };

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

  const handleSubmit = async (e?: React.FormEvent, closeDrawer?: () => void) => {
    if (e) e.preventDefault();
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

      // Close drawer if provided
      if (closeDrawer) closeDrawer();

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

  const handleUpdateLink = async (id: string, updates: any) => {
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

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  return (
    <div className="pb-20 md:pb-0">
      {/* Header with search */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">Browse and manage your meeting links</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search links..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 w-full"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="container max-w-lg mx-auto py-4">
                    <h3 className="text-xl font-semibold mb-4">Add New Meeting Link</h3>
                    <form onSubmit={e => handleSubmit(e, () => document.querySelector<HTMLButtonElement>('[data-drawer-close]')?.click())}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label htmlFor="url" className="text-sm font-medium">
                            Google Meet URL *
                          </label>
                          <Input
                            id="url"
                            name="url"
                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            value={formData.url}
                            onChange={handleInputChange}
                            className={errors.url ? "border-red-500" : ""}
                          />
                          {errors.url && <p className="text-red-500 text-xs">{errors.url}</p>}
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Meeting Name * (50 chars max)
                          </label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Weekly Team Sync"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={errors.name ? "border-red-500" : ""}
                          />
                          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                          <p className="text-xs text-gray-500 text-right">{formData.name.length}/50</p>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="creator" className="text-sm font-medium">
                            Your Name *
                          </label>
                          <Input
                            id="creator"
                            name="creator"
                            placeholder="John Doe"
                            value={formData.creator}
                            onChange={handleInputChange}
                            className={errors.creator ? "border-red-500" : ""}
                          />
                          {errors.creator && <p className="text-red-500 text-xs">{errors.creator}</p>}
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="notes" className="text-sm font-medium">
                            Notes (500 chars max)
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            placeholder="Optional meeting details..."
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                          <p className="text-xs text-gray-500 text-right">{formData.notes.length}/500</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <DrawerClose asChild>
                          <Button variant="outline" type="button">Cancel</Button>
                        </DrawerClose>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-blue-500"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Adding..." : "Add Meeting Link"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="container py-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto bg-gray-100/80 rounded-lg p-1">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              All Links
            </TabsTrigger>
            <TabsTrigger 
              value="mine" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              My Links
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="bg-white border-gray-100 shadow-sm hover:shadow transition-all duration-300 animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded-md w-1/4"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 text-lg">No meeting links found</h3>
                <p className="text-gray-500 mt-2 mb-6">
                  {searchTerm 
                    ? "Try a different search term or clear your filters" 
                    : "Add your first meeting link to get started"}
                </p>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Link
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    {/* Form content - same as above */}
                  </DrawerContent>
                </Drawer>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLinks.map(link => (
                  <Card key={link.id} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{link.name}</h3>
                          <p className="text-sm text-gray-500">by {link.creator}</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Meeting
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {link.notes && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{link.notes}</p>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Added {formatRelativeTime(link.created_at)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex gap-2">
                        {canEditLink(link) && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(link)}
                              className="h-8 px-2"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(link.id)}
                              disabled={deletingIds.has(link.id)}
                              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-medium text-white shadow hover:from-blue-700 hover:to-blue-600 py-1 px-3 h-8"
                      >
                        <span>Join</span>
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

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

```
