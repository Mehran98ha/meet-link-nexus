
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MeetingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const MeetingFilters: React.FC<MeetingFiltersProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="flex gap-2">
      <div className="relative flex-grow md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search meetings..." 
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9 pr-4 w-full"
        />
      </div>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MeetingFilters;
