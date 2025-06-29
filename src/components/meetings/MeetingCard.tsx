
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
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    border: 'border-blue-200/50',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
  },
  {
    bg: 'bg-gradient-to-br from-purple-50 to-pink-100',
    border: 'border-purple-200/50',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
  },
  {
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-100',
    border: 'border-emerald-200/50',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    button: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
  },
  {
    bg: 'bg-gradient-to-br from-orange-50 to-red-100',
    border: 'border-orange-200/50',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
    button: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
  },
  {
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-100',
    border: 'border-cyan-200/50',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    button: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
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
    <Card className={`${colorScheme.bg} ${colorScheme.border} border-2 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group hover:scale-105`}>
      <CardHeader className="pb-4 relative">
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`font-bold text-xl text-gray-900 line-clamp-2 mb-2 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
              {link.name}
            </h3>
            <p className={`text-gray-700 font-medium ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
              {t('meetings.by')} {link.creator}
            </p>
          </div>
          <Badge className={`${colorScheme.badge} font-semibold px-3 py-1 rounded-xl border-2`}>
            {t('meetings.meeting')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        {link.notes && (
          <div className="bg-white/40 rounded-xl p-4 mb-4 backdrop-blur-sm">
            <p className={`text-gray-800 text-sm line-clamp-3 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
              {link.notes}
            </p>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600 bg-white/30 rounded-xl px-3 py-2">
          <Clock className="h-4 w-4 mr-2" />
          <span className={isRTL ? 'font-vazirmatn' : 'font-urbanist'}>
            {t('meetings.added')} {formatRelativeTime(link.created_at)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t-2 border-white/30 pt-4 bg-white/20">
        <div className="flex gap-2">
          {showActions && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(link)}
                className="h-10 w-10 rounded-xl hover:bg-white/40 text-gray-700 hover:text-gray-900 transition-all duration-200"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(link.id)}
                className="h-10 w-10 rounded-xl hover:bg-red-100 text-red-600 hover:text-red-800 transition-all duration-200"
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
          className={`inline-flex items-center justify-center rounded-xl ${colorScheme.button} text-white font-semibold py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
        >
          <span className="mr-2">{t('meetings.join')}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;
