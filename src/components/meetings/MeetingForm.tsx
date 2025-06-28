
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DrawerClose } from '@/components/ui/drawer';

interface MeetingFormProps {
  onSubmit: (e?: React.FormEvent, closeDrawer?: () => void) => void;
  isSubmitting: boolean;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    creator: '',
    notes: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateGoogleMeetUrl = (url: string): boolean => {
    const meetUrlPattern = /^https:\/\/meet\.google\.com\/[a-z-]+$/;
    return meetUrlPattern.test(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    if (name === 'name' && value.length > 50) {
      finalValue = value.slice(0, 50);
    } else if (name === 'notes' && value.length > 500) {
      finalValue = value.slice(0, 500);
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
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

    if (!formData.creator.trim()) {
      newErrors.creator = 'Creator name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Pass form data to parent through a custom event or callback
    onSubmit(e, () => document.querySelector<HTMLButtonElement>('[data-drawer-close]')?.click());
  };

  // Expose form data to parent component
  React.useEffect(() => {
    (window as any).meetingFormData = formData;
    (window as any).clearMeetingForm = () => {
      setFormData({ url: '', name: '', creator: '', notes: '' });
    };
  }, [formData]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="url" className="text-sm font-medium">
            Google Meet URL *
          </label>
          <Input
            id="url"
            name="url"
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            value={formData.url}
            onChange={handleInputChange}
            className={errors.url ? "border-red-500" : ""}
          />
          {errors.url && <p className="text-red-500 text-xs">{errors.url}</p>}
        </div>
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Meeting Name * (50 chars max)
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Weekly Team Sync"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          <p className="text-xs text-gray-500 text-right">{formData.name.length}/50</p>
        </div>
        <div className="grid gap-2">
          <label htmlFor="creator" className="text-sm font-medium">
            Your Name *
          </label>
          <Input
            id="creator"
            name="creator"
            placeholder="John Doe"
            value={formData.creator}
            onChange={handleInputChange}
            className={errors.creator ? "border-red-500" : ""}
          />
          {errors.creator && <p className="text-red-500 text-xs">{errors.creator}</p>}
        </div>
        <div className="grid gap-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes (500 chars max)
          </label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Optional meeting details..."
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 text-right">{formData.notes.length}/500</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <DrawerClose asChild>
          <Button variant="outline" type="button">Cancel</Button>
        </DrawerClose>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Meeting Link"}
        </Button>
      </div>
    </form>
  );
};

export default MeetingForm;
