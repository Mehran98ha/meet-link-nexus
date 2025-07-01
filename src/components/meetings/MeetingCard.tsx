
import React from 'react';
import { Clock, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeetLink } from '@/services/meetLinksService';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';

interface MeetingCardProps {
  link: MeetLink;
  onEdit: (link: MeetLink) => void;
  onDelete: (id: string) => void;
  showActions: boolean;
  onAddMeeting: () => void;
}

const colorSchemes = [
  {
    gradient: 'from-ios-blue/20 to-ios-purple/20',
    accent: 'ios-blue',
    badge: 'bg-ios-blue/10 text-ios-blue border-ios-blue/20',
    button: 'bg-ios-blue hover:bg-blue-600 active:bg-blue-700'
  },
  {
    gradient: 'from-ios-green/20 to-ios-teal/20',
    accent: 'ios-green',
    badge: 'bg-ios-green/10 text-ios-green border-ios-green/20',
    button: 'bg-ios-green hover:bg-green-600 active:bg-green-700'
  },
  {
    gradient: 'from-ios-purple/20 to-ios-pink/20',
    accent: 'ios-purple',
    badge: 'bg-ios-purple/10 text-ios-purple border-ios-purple/20',
    button: 'bg-ios-purple hover:bg-purple-600 active:bg-purple-700'
  },
  {
    gradient: 'from-ios-orange/20 to-ios-red/20',
    accent: 'ios-orange',
    badge: 'bg-ios-orange/10 text-ios-orange border-ios-orange/20',
    button: 'bg-ios-orange hover:bg-orange-600 active:bg-orange-700'
  },
  {
    gradient: 'from-ios-teal/20 to-ios-cyan/20',
    accent: 'ios-teal',
    badge: 'bg-ios-teal/10 text-ios-teal border-ios-teal/20',
    button: 'bg-ios-teal hover:bg-teal-600 active:bg-teal-700'
  },
  {
    gradient: 'from-ios-indigo/20 to-ios-blue/20',
    accent: 'ios-indigo',
    badge: 'bg-ios-indigo/10 text-ios-indigo border-ios-indigo/20',
    button: 'bg-ios-indigo hover:bg-indigo-600 active:bg-indigo-700'
  }
];

const MeetingCard: React.FC<MeetingCardProps> = ({
  link,
  onEdit,
  onDelete,
  showActions,
  onAddMeeting
}) => {
  const { t, isRTL } = useLanguage();

  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Get consistent color scheme based on link ID
  const colorIndex = link.id.charCodeAt(0) % colorSchemes.length;
  const colorScheme = colorSchemes[colorIndex];

  return (
    <Card className={`ios-card ios-hover-lift overflow-hidden bg-gradient-to-br ${colorScheme.gradient} border-2 border-white/50 backdrop-blur-ios`}>
      <CardHeader className="pb-ios-sm relative">
        <div className="absolute inset-0 bg-white/30 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-ios-lg"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`ios-text-headline text-ios-label line-clamp-2 mb-ios-xs`}>
              {link.name}
            </h3>
            <p className={`ios-text-callout text-ios-secondary-label`}>
              {t('meetings.by')} {link.creator}
            </p>
          </div>
          <Badge className={`${colorScheme.badge} font-semibold px-ios-sm py-1 rounded-ios-md border-2 backdrop-blur-sm`}>
            {t('meetings.meeting')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-ios-sm">
        {link.notes && (
          <div className="bg-white/40 rounded-ios-md p-ios-sm mb-ios-sm backdrop-blur-sm border border-white/30">
            <p className={`ios-text-subhead text-ios-secondary-label line-clamp-3`}>
              {link.notes}
            </p>
          </div>
        )}
        <div className="flex items-center ios-text-caption text-ios-tertiary-label bg-white/30 rounded-ios-md px-ios-sm py-2 backdrop-blur-sm">
          <Clock className="h-3 w-3 mr-2" />
          <span>
            {t('meetings.added')} {formatRelativeTime(link.created_at)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t-2 border-white/30 pt-ios-sm bg-white/20 backdrop-blur-sm">
        <div className="flex gap-2">
          {showActions && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(link)}
                className="h-10 w-10 rounded-ios-md hover:bg-white/40 text-ios-secondary-label hover:text-ios-label transition-all duration-200 ios-spring"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(link.id)}
                className="h-10 w-10 rounded-ios-md hover:bg-ios-red/10 text-ios-red hover:text-red-700 transition-all duration-200 ios-spring"
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
          className={`inline-flex items-center justify-center rounded-ios-md ${colorScheme.button} text-white font-semibold py-ios-sm px-ios-md shadow-ios-sm hover:shadow-ios-md transition-all duration-200 ios-spring ios-text-callout`}
        >
          <span className="mr-2">{t('meetings.join')}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;
