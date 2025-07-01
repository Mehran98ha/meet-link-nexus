
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MeetingFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const MeetingFilters: React.FC<MeetingFiltersProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-ios-md">
      <div className="text-ios-secondary-label ios-text-footnote font-medium">
        {t('meetings.filtersTitle')}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-ios-md">
        {/* Additional filter options can be added here */}
        <div className="flex flex-col space-y-ios-sm">
          <label className="ios-text-caption text-ios-secondary-label font-medium">
            {t('meetings.searchBy')}
          </label>
          <div className="ios-text-caption text-ios-tertiary-label">
            {searchTerm ? `"${searchTerm}"` : t('meetings.allMeetings')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingFilters;
