
import React, { useState } from 'react';
import { Clock, User, FileText, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { MeetLink, canEditLink } from '@/services/meetLinksService';

interface LinkItemProps {
  link: MeetLink;
  onEdit: (link: MeetLink) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  expandedNotes: { [key: string]: boolean };
  onToggleNotes: (id: string) => void;
}

const LinkItem: React.FC<LinkItemProps> = ({
  link,
  onEdit,
  onDelete,
  isDeleting,
  expandedNotes,
  onToggleNotes
}) => {
  const canEdit = canEditLink(link);
  const isLegacyLink = link.creator_id.startsWith('legacy_user_');

  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-all duration-300 border-b border-border last:border-b-0">
      <div className="flex flex-col space-y-3">
        {/* Meeting Name and Link with Action Buttons */}
        <div className="flex items-start justify-between">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center space-x-2 group flex-1"
          >
            <span>{link.name}</span>
            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          
          {/* Edit/Delete buttons for creator's own links */}
          {canEdit && !isLegacyLink && (
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(link)}
                disabled={isDeleting}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit this link"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(link.id)}
                disabled={isDeleting}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete this link"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          
          {/* Indicator for user's own links */}
          {canEdit && !isLegacyLink && (
            <div className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Your link
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock size={14} />
            <span>{formatTimestamp(link.created_at)}</span>
            {link.updated_at !== link.created_at && (
              <span className="text-xs">(edited {formatTimestamp(link.updated_at)})</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <User size={14} />
            <span className="italic">{link.creator}</span>
          </div>
        </div>

        {/* Notes */}
        {link.notes && (
          <div className="flex items-start space-x-2">
            <FileText size={14} className="mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {expandedNotes[link.id] 
                  ? link.notes 
                  : truncateText(link.notes, 100)
                }
                {link.notes.length > 100 && (
                  <button
                    onClick={() => onToggleNotes(link.id)}
                    className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 text-xs underline"
                  >
                    {expandedNotes[link.id] ? 'Show less' : 'Show more'}
                  </button>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Deletion indicator */}
        {isDeleting && (
          <div className="text-sm text-orange-600 italic">
            Deleting...
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkItem;
