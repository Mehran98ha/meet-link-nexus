
import React from 'react';
import { Calendar, Plus, Sparkles } from 'lucide-react';
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
    <div className={`text-center py-16 px-8 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
      {/* Animated Icon Container */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg animate-float">
          <Calendar className="h-12 w-12 text-blue-600" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 mb-8">
        <h3 className={`font-bold text-3xl text-gray-900 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
          {searchTerm ? t('empty.searchTitle') : t('empty.title')}
        </h3>
        <p className={`text-xl text-gray-600 max-w-md mx-auto leading-relaxed ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
          {searchTerm 
            ? t('empty.searchMessage')
            : t('empty.noMeetings')}
        </p>
      </div>

      {/* Action Button */}
      {isAuthenticated && !searchTerm && (
        <div className="space-y-4">
          <Button 
            onClick={onAddMeeting} 
            className={`h-14 px-8 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${isRTL ? 'flex-row-reverse font-vazirmatn' : 'font-urbanist'}`}
          >
            <Plus className="h-5 w-5 mr-3" />
            {t('meetings.addNew')}
          </Button>
          <p className="text-sm text-gray-500">
            {t('empty.getStarted')}
          </p>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default EmptyState;
