
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface MeetingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const MeetingFilters: React.FC<MeetingFiltersProps> = ({
  searchTerm,
  onSearchChange
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className="relative flex-grow md:w-64">
        <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
        <Input 
          placeholder={t('search.placeholder')} 
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className={`${isRTL ? 'pr-9 pl-4 font-vazir' : 'pl-9 pr-4 font-roboto'} w-full`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MeetingFilters;
