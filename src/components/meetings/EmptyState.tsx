
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyStateProps {
  activeTab?: 'all' | 'my';
  searchTerm: string;
  isAuthenticated: boolean;
  onAddMeeting: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  activeTab = 'all',
  searchTerm,
  isAuthenticated,
  onAddMeeting
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`text-center py-12 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className={`font-medium text-gray-900 text-lg ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
        {t('empty.title')}
      </h3>
      <p className={`text-gray-500 mt-2 mb-6 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
        {searchTerm 
          ? t('empty.searchMessage')
          : t('empty.noMeetings')}
      </p>
      {isAuthenticated && (
        <Button onClick={onAddMeeting} className={`${isRTL ? 'flex-row-reverse font-vazirmatn' : 'font-urbanist'}`}>
          <Plus className="h-4 w-4 mr-2" />
          {t('meetings.addNew')}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
