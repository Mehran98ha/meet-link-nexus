
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="font-medium text-gray-900 text-lg">No meetings found</h3>
      <p className="text-gray-500 mt-2 mb-6">
        {searchTerm 
          ? "Try a different search term or clear your filters" 
          : "Be the first to share a meeting link!"}
      </p>
      {!isAuthenticated && (
        <Button onClick={onSignUpClick}>
          <Plus className="h-4 w-4 mr-2" />
          Sign up to add meetings
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
