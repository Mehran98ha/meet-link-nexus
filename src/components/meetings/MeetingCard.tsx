
import React from 'react';
import { Clock, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeetLink } from '@/services/meetLinksService';

interface MeetingCardProps {
  link: MeetLink;
  canEdit: boolean;
  isDeleting: boolean;
  onEdit: (link: MeetLink) => void;
  onDelete: (id: string) => void;
  formatRelativeTime: (dateString: string) => string;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  link,
  canEdit,
  isDeleting,
  onEdit,
  onDelete,
  formatRelativeTime
}) => {
  return (
    <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
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
          {canEdit && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(link)}
                className="h-8 px-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(link.id)}
                disabled={isDeleting}
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
  );
};

export default MeetingCard;
