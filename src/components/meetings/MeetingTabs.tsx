
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

interface MeetingTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isAuthenticated: boolean;
}

const MeetingTabs: React.FC<MeetingTabsProps> = ({
  activeTab,
  onTabChange,
  isAuthenticated
}) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full md:w-auto bg-gray-100/80 rounded-lg p-1">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
        >
          {t('tabs.allMeetings')}
        </TabsTrigger>
        {isAuthenticated && (
          <TabsTrigger 
            value="my" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
          >
            {t('tabs.myMeetings')}
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
};

export default MeetingTabs;
