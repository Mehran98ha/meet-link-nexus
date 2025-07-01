
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(true);

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
      setIsOpen(false);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-ios-2xl shadow-ios-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-ios-lg border-b border-ios-gray-5">
          <h2 className="ios-text-title-2 font-bold text-ios-label">
            {t('meetings.addMeetingLink')}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full hover:bg-ios-gray-5"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-ios-lg">
          <form onSubmit={handleSubmit} className={`space-y-ios-lg ${isRTL ? 'font-vazirmatn' : 'font-vazirmatn'}`}>
            {/* URL Input Group */}
            <div className="space-y-ios-sm">
              <label htmlFor="url" className={`block ios-text-body font-semibold text-ios-label ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('meetings.googleMeetUrl')} *
              </label>
              <Input
                id="url"
                name="url"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={formData.url}
                onChange={handleInputChange}
                className={`h-12 ios-text-body rounded-ios-lg border-2 bg-ios-gray-6 shadow-ios-sm focus:shadow-ios-md transition-all duration-200 ${
                  errors.url 
                    ? "border-ios-red focus:border-ios-red focus:ring-ios-red/20" 
                    : "border-ios-gray-4 focus:border-ios-blue focus:ring-ios-blue/20"
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              {errors.url && (
                <p className={`text-ios-red ios-text-footnote font-medium bg-ios-red/10 px-ios-sm py-ios-xs rounded-ios-md ${isRTL ? 'text-right' : 'text-left'}`}>
                  {errors.url}
                </p>
              )}
            </div>
            
            {/* Name Input Group */}
            <div className="space-y-ios-sm">
              <label htmlFor="name" className={`block ios-text-body font-semibold text-ios-label ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('meetings.meetingName')} * 
                <span className="ios-text-footnote font-normal text-ios-secondary-label ml-2">
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
                  className={`h-12 ios-text-body rounded-ios-lg border-2 bg-ios-gray-6 shadow-ios-sm focus:shadow-ios-md transition-all duration-200 ${
                    errors.name 
                      ? "border-ios-red focus:border-ios-red focus:ring-ios-red/20" 
                      : "border-ios-gray-4 focus:border-ios-blue focus:ring-ios-blue/20"
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <div className={`absolute top-3 ios-text-caption text-ios-tertiary-label bg-ios-gray-6 px-ios-xs rounded ${isRTL ? 'left-3' : 'right-3'}`}>
                  {formData.name.length}/50
                </div>
              </div>
              {errors.name && (
                <p className={`text-ios-red ios-text-footnote font-medium bg-ios-red/10 px-ios-sm py-ios-xs rounded-ios-md ${isRTL ? 'text-right' : 'text-left'}`}>
                  {errors.name}
                </p>
              )}
            </div>
            
            {/* Creator Input Group */}
            <div className="space-y-ios-sm">
              <label htmlFor="creator" className={`block ios-text-body font-semibold text-ios-label ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('meetings.yourName')} *
              </label>
              <Input
                id="creator"
                name="creator"
                placeholder={isRTL ? 'محمد احمدی' : 'John Doe'}
                value={formData.creator}
                onChange={handleInputChange}
                className={`h-12 ios-text-body rounded-ios-lg border-2 bg-ios-gray-6 shadow-ios-sm focus:shadow-ios-md transition-all duration-200 ${
                  errors.creator 
                    ? "border-ios-red focus:border-ios-red focus:ring-ios-red/20" 
                    : "border-ios-gray-4 focus:border-ios-blue focus:ring-ios-blue/20"
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              {errors.creator && (
                <p className={`text-ios-red ios-text-footnote font-medium bg-ios-red/10 px-ios-sm py-ios-xs rounded-ios-md ${isRTL ? 'text-right' : 'text-left'}`}>
                  {errors.creator}
                </p>
              )}
            </div>
            
            {/* Notes Input Group */}
            <div className="space-y-ios-sm">
              <label htmlFor="notes" className={`block ios-text-body font-semibold text-ios-label ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('meetings.notes')} 
                <span className="ios-text-footnote font-normal text-ios-secondary-label ml-2">
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
                  className="w-full rounded-ios-lg border-2 border-ios-gray-4 bg-ios-gray-6 px-ios-md py-ios-sm ios-text-body shadow-ios-sm focus:border-ios-blue focus:ring-ios-blue/20 focus:shadow-ios-md transition-all duration-200 resize-none"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <div className={`absolute bottom-3 ios-text-caption text-ios-tertiary-label bg-ios-gray-6 px-ios-xs rounded ${isRTL ? 'left-3' : 'right-3'}`}>
                  {formData.notes.length}/500
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className={`flex gap-ios-sm pt-ios-md ${isRTL ? 'flex-row-reverse justify-start' : 'justify-end'}`}>
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleClose}
                className={`h-12 px-ios-lg ios-text-body font-semibold rounded-ios-lg border-2 border-ios-gray-4 bg-ios-gray-6 hover:bg-ios-gray-5 text-ios-secondary-label hover:text-ios-label transition-all duration-200 ${isRTL ? 'font-vazirmatn' : 'font-vazirmatn'}`}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                className={`h-12 px-ios-lg ios-text-body font-semibold rounded-ios-lg bg-gradient-to-r from-ios-blue to-ios-purple hover:from-ios-blue-dark hover:to-ios-purple-dark text-white shadow-ios-lg hover:shadow-ios-xl transition-all duration-200 transform hover:scale-105 ios-spring ${isRTL ? 'font-vazirmatn' : 'font-vazirmatn'}`}
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
      </div>
    </div>
  );
};

export default MeetingForm;
