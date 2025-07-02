import React from 'react';
import { MeetLink } from '@/services/meetLinksService';
import MeetingCard from './MeetingCard';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';

interface MeetingsGridProps {
  meetings: MeetLink[];
  isLoading: boolean;
  searchQuery: string;
  isAuthenticated: boolean;
  currentUserId?: string;
  onEditMeeting: (meeting: MeetLink) => void;
  onDeleteMeeting: (id: string) => void;
  onAddMeeting: () => void;
}

const MeetingsGrid: React.FC<MeetingsGridProps> = ({
  meetings,
  isLoading,
  searchQuery,
  isAuthenticated,
  currentUserId,
  onEditMeeting,
  onDeleteMeeting,
  onAddMeeting
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (meetings.length === 0) {
    return (
      <EmptyState 
        searchTerm={searchQuery}
        isAuthenticated={isAuthenticated}
        onAddMeeting={onAddMeeting} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-ios-md">
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          link={meeting}
          onEdit={onEditMeeting}
          onDelete={onDeleteMeeting}
          showActions={meeting.creator_id === currentUserId}
          onAddMeeting={onAddMeeting}
        />
      ))}
    </div>
  );
};

export default MeetingsGrid;