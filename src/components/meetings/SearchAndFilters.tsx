import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import MeetingFilters from './MeetingFilters';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  showFilters
}) => {
  const { t } = useLanguage();

  return (
    <Card className="bg-ios-secondary-bg rounded-ios-xl shadow-ios-md border border-ios-gray-5/50">
      <CardContent className="p-ios-lg space-y-ios-md">
        <div className="flex flex-col sm:flex-row gap-ios-md">
          <div className="relative flex-1">
            <Search className="absolute left-ios-sm top-1/2 transform -translate-y-1/2 h-5 w-5 text-ios-gray" />
            <Input
              placeholder={t('meetings.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 bg-ios-gray-6 border-ios-gray-4 rounded-ios-lg ios-text-body focus:border-ios-blue focus:ring-ios-blue/20"
            />
          </div>
        </div>

        {showFilters && (
          <div className="animate-ios-fade-in">
            <MeetingFilters
              searchTerm={searchQuery}
              onSearchChange={onSearchChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchAndFilters;