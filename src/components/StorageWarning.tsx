
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface StorageWarningProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const StorageWarning: React.FC<StorageWarningProps> = ({ isVisible, onDismiss }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-orange-800 mb-1">
            Browser Storage Unavailable
          </h3>
          <p className="text-sm text-orange-700">
            Your browser's local storage is not available or has been cleared. 
            You won't be able to edit or delete links you create in this session. 
            To enable editing, please ensure your browser allows local storage for this site.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-orange-600 hover:text-orange-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default StorageWarning;
