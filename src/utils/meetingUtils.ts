
import { MeetLink } from '@/services/meetLinksService';
import { getUserId } from '@/utils/userIdentity';

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
};

export const filterLinks = (
  links: MeetLink[], 
  searchTerm: string, 
  activeTab: string, 
  isAuthenticated: boolean
): MeetLink[] => {
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
  if (activeTab === 'mine' && isAuthenticated) {
    const userId = getUserId();
    filtered = filtered.filter(link => link.creator_id === userId);
  } else if (activeTab === 'recent') {
    filtered = [...filtered].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 10);
  }

  return filtered;
};

export const validateGoogleMeetUrl = (url: string): boolean => {
  const meetUrlPattern = /^https:\/\/meet\.google\.com\/[a-z-]+$/;
  return meetUrlPattern.test(url);
};
