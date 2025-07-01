
import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
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
    <div className={`flex gap-4 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Enhanced Search Input */}
      <div className="relative flex-grow max-w-md">
        <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} z-10`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Search className="h-5 w-5 text-white" />
          </div>
        </div>
        <Input 
          placeholder={t('search.placeholder')} 
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className={`h-16 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg focus:shadow-xl focus:border-blue-400 transition-all duration-300 ${
            isRTL ? 'pr-16 pl-6 font-vazirmatn' : 'pl-16 pr-6 font-vazirmatn'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {searchTerm && (
          <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              ×
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Filter Button */}
      <Button 
        variant="outline" 
        className="h-16 w-16 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl group"
      >
        <div className="relative">
          <Filter className="h-6 w-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-200" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
        </div>
      </Button>

      {/* Results Count (if searching) */}
      {searchTerm && (
        <div className="hidden sm:flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
          <Sparkles className="h-4 w-4 mr-2" />
          <span className={`text-sm font-medium font-vazirmatn`}>
            {t('search.results')}
          </span>
        </div>
      )}
    </div>
  );
};

export default MeetingFilters;
