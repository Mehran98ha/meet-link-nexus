
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DrawerClose } from '@/components/ui/drawer';
import { useLanguage } from '@/contexts/LanguageContext';

interface MeetingFormProps {
  onSubmit: (meetingData: any) => Promise<void>;
  isSubmitting: boolean;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ onSubmit, isSubmitting }) => {
  const { t, isRTL } = useLanguage();
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
      newErrors.url = t('meetings.urlRequired');
    } else if (!validateGoogleMeetUrl(formData.url)) {
      newErrors.url = t('meetings.validUrlRequired');
    }

    if (!formData.name.trim()) {
      newErrors.name = t('meetings.nameRequired');
    }

    if (!formData.creator.trim()) {
      newErrors.creator = t('meetings.creatorRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({ url: '', name: '', creator: '', notes: '' });
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={isRTL ? 'font-vazirmatn' : 'font-urbanist'}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="url" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('meetings.googleMeetUrl')} *
          </label>
          <Input
            id="url"
            name="url"
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            value={formData.url}
            onChange={handleInputChange}
            className={errors.url ? "border-red-500" : ""}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          {errors.url && <p className={`text-red-500 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{errors.url}</p>}
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="name" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('meetings.meetingName')} * (50 {t('meetings.maxChars')})
          </label>
          <Input
            id="name"
            name="name"
            placeholder={isRTL ? 'جلسه هفتگی تیم' : 'Weekly Team Sync'}
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          {errors.name && <p className={`text-red-500 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{errors.name}</p>}
          <p className={`text-xs text-gray-500 ${isRTL ? 'text-left' : 'text-right'}`}>{formData.name.length}/50</p>
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="creator" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('meetings.yourName')} *
          </label>
          <Input
            id="creator"
            name="creator"
            placeholder={isRTL ? 'محمد احمدی' : 'John Doe'}
            value={formData.creator}
            onChange={handleInputChange}
            className={errors.creator ? "border-red-500" : ""}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          {errors.creator && <p className={`text-red-500 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>{errors.creator}</p>}
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="notes" className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('meetings.notes')} (500 {t('meetings.maxChars')})
          </label>
          <textarea
            id="notes"
            name="notes"
            placeholder={t('meetings.optionalNotes')}
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <p className={`text-xs text-gray-500 ${isRTL ? 'text-left' : 'text-right'}`}>{formData.notes.length}/500</p>
        </div>
      </div>
      
      <div className={`flex gap-2 mt-4 ${isRTL ? 'flex-row-reverse justify-start' : 'justify-end'}`}>
        <DrawerClose asChild>
          <Button variant="outline" type="button" className={isRTL ? 'font-vazirmatn' : 'font-urbanist'}>
            {t('common.cancel')}
          </Button>
        </DrawerClose>
        <Button
          type="submit"
          className={`bg-gradient-to-r from-blue-600 to-blue-500 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('meetings.adding') : t('meetings.addMeetingLink')}
        </Button>
      </div>
    </form>
  );
};

export default MeetingForm;
