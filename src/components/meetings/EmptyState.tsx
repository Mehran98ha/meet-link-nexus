
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyStateProps {
  searchTerm: string;
  isAuthenticated: boolean;
  onSignUpClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  isAuthenticated,
  onSignUpClick
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`text-center py-12 ${isRTL ? 'font-vazir' : 'font-roboto'}`}>
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className={`font-medium text-gray-900 text-lg ${isRTL ? 'font-vazir' : 'font-roboto'}`}>
        {t('empty.title')}
      </h3>
      <p className={`text-gray-500 mt-2 mb-6 ${isRTL ? 'font-vazir' : 'font-roboto'}`}>
        {searchTerm 
          ? t('empty.searchMessage')
          : t('empty.noMeetings')}
      </p>
      {!isAuthenticated && (
        <Button onClick={onSignUpClick} className={`${isRTL ? 'flex-row-reverse font-vazir' : 'font-roboto'}`}>
          <Plus className="h-4 w-4 mr-2" />
          {t('empty.signUpButton')}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
