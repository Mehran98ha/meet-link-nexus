
import React, { useState, useEffect } from 'react';
import { CalendarDays, ExternalLink, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserId } from '@/utils/userIdentity';
import { fetchMeetLinks, deleteMeetLink, MeetLink, canEditLink } from '@/services/meetLinksService';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EditLinkModal from '@/components/EditLinkModal';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

const MyLinks = () => {
  const [links, setLinks] = useState<MeetLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingLink, setEditingLink] = useState<MeetLink | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMyLinks();
  }, []);

  const loadMyLinks = async () => {
    try {
      setIsLoading(true);
      const allLinks = await fetchMeetLinks();
      const userId = getUserId();
      const myLinks = allLinks.filter(link => link.creator_id === userId);
      setLinks(myLinks);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Error",
        description: "Failed to load your meeting links. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meeting link?')) {
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

  const handleUpdateLink = async (id: string, updates: any) => {
    setIsUpdating(true);
    try {
      // We will get the updated link from the server, but we'll update optimistically
      setLinks(prev => 
        prev.map(link => link.id === id ? { ...link, ...updates } : link)
      );
      
      toast({
        title: "Success",
        description: "Meeting link updated successfully!"
      });
      
      // Refresh the list to get the actual updated data
      loadMyLinks();
      
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update meeting link.",
        variant: "destructive"
      });
      
      // Refresh to get the original data in case of error
      loadMyLinks();
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Meeting Links</h1>
              <p className="text-gray-500">Manage all the meeting links you've created</p>
            </div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Link
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                {/* Form content would go here - same as in Home.tsx */}
                <div className="container max-w-lg mx-auto py-4">
                  <h3 className="text-xl font-semibold">Add New Meeting Link</h3>
                  <p className="text-gray-500">Form would go here</p>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-white shadow-sm">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 text-lg">No meeting links yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Create your first meeting link to share with others</p>
            <Drawer>
              <DrawerTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Link
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                {/* Form content would go here */}
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {links.map(link => (
              <Card key={link.id} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{link.name}</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Meeting
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-600 truncate">{link.url}</p>
                </CardHeader>
                <CardContent className="py-2">
                  {link.notes && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{link.notes}</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CalendarDays className="h-3 w-3" />
                    <span>Created: {formatDate(link.created_at)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setEditingLink(link)}
                      className="h-8 px-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(link.id)}
                      disabled={deletingIds.has(link.id)}
                      className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                    </Button>
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MyLinks;
