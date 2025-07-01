
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
    <div className={`text-center py-16 px-8 ${isRTL ? 'font-vazirmatn' : 'font-vazirmatn'}`}>
      {/* Animated Icon Container */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-ios-blue/20 to-ios-purple/20 rounded-ios-3xl flex items-center justify-center shadow-ios-lg animate-float backdrop-blur-sm border border-ios-gray-5/50">
          <Calendar className="h-12 w-12 text-ios-blue" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-ios-yellow to-ios-orange rounded-full flex items-center justify-center animate-pulse shadow-ios-md">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-ios-md mb-ios-xl">
        <h3 className="font-bold ios-text-title-2 text-ios-label">
          {searchTerm ? t('empty.searchTitle') : t('empty.title')}
        </h3>
        <p className="ios-text-body text-ios-secondary-label max-w-md mx-auto leading-relaxed">
          {searchTerm 
            ? t('empty.searchMessage')
            : t('empty.noMeetings')}
        </p>
      </div>

      {/* Action Button */}
      {isAuthenticated && !searchTerm && (
        <div className="space-y-ios-md">
          <Button 
            onClick={onAddMeeting} 
            className="h-14 px-ios-xl ios-text-body font-bold rounded-ios-xl bg-gradient-to-r from-ios-blue to-ios-purple hover:from-ios-blue-dark hover:to-ios-purple-dark text-white shadow-ios-lg hover:shadow-ios-xl transition-all duration-300 transform hover:scale-105 ios-spring"
          >
            <Plus className="h-5 w-5 mr-ios-sm" />
            {t('meetings.addNew')}
          </Button>
          <p className="ios-text-footnote text-ios-tertiary-label">
            {t('empty.getStarted')}
          </p>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-ios-blue/10 to-ios-purple/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-ios-pink/10 to-ios-orange/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default EmptyState;
