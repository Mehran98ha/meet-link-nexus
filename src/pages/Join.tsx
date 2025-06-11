
import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchMeetLinks, MeetLink } from '@/services/meetLinksService';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Join = () => {
  const [links, setLinks] = useState<MeetLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<MeetLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLinks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredLinks(
        links.filter(link => 
          link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (link.notes && link.notes.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredLinks(links);
    }
  }, [searchTerm, links]);

  const loadLinks = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMeetLinks();
      setLinks(data);
      setFilteredLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Error",
        description: "Failed to load meeting links. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to relative time
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
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Join Meetings</h1>
              <p className="text-gray-500">Browse and join available meeting links</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search meetings..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 w-full"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
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
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 text-lg">No meeting links found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? "Try a different search term" : "Check back later for available meetings"}
            </p>
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
                <CardFooter className="flex justify-end border-t pt-4">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-medium text-white shadow hover:from-blue-700 hover:to-blue-600 py-1 px-3 h-8"
                  >
                    <span>Join Meeting</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Join;
