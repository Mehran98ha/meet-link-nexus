
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MeetingTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const MeetingTabs: React.FC<MeetingTabsProps> = ({
  activeTab,
  onTabChange,
  isAuthenticated,
  children
}) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full md:w-auto bg-gray-100/80 rounded-lg p-1">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
        >
          All Meetings
        </TabsTrigger>
        {isAuthenticated && (
          <TabsTrigger 
            value="mine" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
          >
            My Meetings
          </TabsTrigger>
        )}
        <TabsTrigger 
          value="recent" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
        >
          Recent
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default MeetingTabs;
