
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
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8">
      <form onSubmit={handleSubmit} className={`space-y-6 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}>
        {/* URL Input Group */}
        <div className="space-y-3">
          <label htmlFor="url" className={`block text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('meetings.googleMeetUrl')} *
          </label>
          <div className="relative">
            <Input
              id="url"
              name="url"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={formData.url}
              onChange={handleInputChange}
              className={`h-14 text-lg rounded-xl border-2 bg-white shadow-sm focus:shadow-lg transition-all duration-200 ${
                errors.url 
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          {errors.url && (
            <p className={`text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
              {errors.url}
            </p>
          )}
        </div>
        
        {/* Name Input Group */}
        <div className="space-y-3">
          <label htmlFor="name" className={`block text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('meetings.meetingName')} * 
            <span className="text-sm font-normal text-gray-600 ml-2">
              (50 {t('meetings.maxChars')})
            </span>
          </label>
          <div className="relative">
            <Input
              id="name"
              name="name"
              placeholder={isRTL ? 'جلسه هفتگی تیم' : 'Weekly Team Sync'}
              value={formData.name}
              onChange={handleInputChange}
              className={`h-14 text-lg rounded-xl border-2 bg-white shadow-sm focus:shadow-lg transition-all duration-200 ${
                errors.name 
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <div className={`absolute top-4 text-sm text-gray-500 bg-white px-2 rounded-lg ${isRTL ? 'left-4' : 'right-4'}`}>
              {formData.name.length}/50
            </div>
          </div>
          {errors.name && (
            <p className={`text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
              {errors.name}
            </p>
          )}
        </div>
        
        {/* Creator Input Group */}
        <div className="space-y-3">
          <label htmlFor="creator" className={`block text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('meetings.yourName')} *
          </label>
          <Input
            id="creator"
            name="creator"
            placeholder={isRTL ? 'محمد احمدی' : 'John Doe'}
            value={formData.creator}
            onChange={handleInputChange}
            className={`h-14 text-lg rounded-xl border-2 bg-white shadow-sm focus:shadow-lg transition-all duration-200 ${
              errors.creator 
                ? "border-red-400 focus:border-red-500 focus:ring-red-200" 
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
            }`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          {errors.creator && (
            <p className={`text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
              {errors.creator}
            </p>
          )}
        </div>
        
        {/* Notes Input Group */}
        <div className="space-y-3">
          <label htmlFor="notes" className={`block text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('meetings.notes')} 
            <span className="text-sm font-normal text-gray-600 ml-2">
              (500 {t('meetings.maxChars')})
            </span>
          </label>
          <div className="relative">
            <textarea
              id="notes"
              name="notes"
              placeholder={t('meetings.optionalNotes')}
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-200 focus:shadow-lg transition-all duration-200 resize-none"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <div className={`absolute bottom-4 text-sm text-gray-500 bg-white px-2 rounded-lg ${isRTL ? 'left-4' : 'right-4'}`}>
              {formData.notes.length}/500
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={`flex gap-4 pt-6 ${isRTL ? 'flex-row-reverse justify-start' : 'justify-end'}`}>
          <DrawerClose asChild>
            <Button 
              variant="outline" 
              type="button" 
              className={`h-14 px-8 text-lg font-semibold rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
            >
              {t('common.cancel')}
            </Button>
          </DrawerClose>
          <Button
            type="submit"
            className={`h-14 px-8 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${isRTL ? 'font-vazirmatn' : 'font-urbanist'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                {t('meetings.adding')}
              </div>
            ) : (
              t('meetings.addMeetingLink')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MeetingForm;
