
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MeetLink, UpdateMeetLinkData } from '@/services/meetLinksService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditLinkModalProps {
  link: MeetLink | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: UpdateMeetLinkData) => Promise<void>;
  isLoading: boolean;
}

const EditLinkModal: React.FC<EditLinkModalProps> = ({
  link,
  isOpen,
  onClose,
  onSave,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    url: link?.url || '',
    name: link?.name || '',
    notes: link?.notes || ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form data when link changes
  useEffect(() => {
    if (link) {
      setFormData({
        url: link.url,
        name: link.name,
        notes: link.notes || ''
      });
    }
  }, [link]);

  const validateGoogleMeetUrl = (url: string): boolean => {
    const meetUrlPattern = /^https:\/\/meet\.google\.com\/[a-z-]+$/;
    return meetUrlPattern.test(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply character limits
    let finalValue = value;
    if (name === 'name' && value.length > 50) {
      finalValue = value.slice(0, 50);
    } else if (name === 'notes' && value.length > 500) {
      finalValue = value.slice(0, 500);
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!validateGoogleMeetUrl(formData.url)) {
      newErrors.url = 'Please enter a valid Google Meet URL';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Meeting name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!link || !validateForm()) return;

    try {
      await onSave(link.id, {
        url: formData.url,
        name: formData.name,
        notes: formData.notes
      });
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Failed to update link:', error);
    }
  };

  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">Edit Meeting Link</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={20} />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Google Meet URL *
            </label>
            <Input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Meeting Name * (50 chars max)
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Enter meeting name"
              className={errors.name ? "border-red-500" : ""}
            />
            <div className="flex justify-between mt-1">
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              <p className="text-xs text-muted-foreground ml-auto">{formData.name.length}/50</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (500 chars max)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Optional meeting notes"
              rows={3}
              className={`w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.notes.length}/500</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-500"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditLinkModal;
