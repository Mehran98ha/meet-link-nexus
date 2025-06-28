
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.browseMeetings': 'Browse Meetings',
    'nav.myLinks': 'My Links',
    'nav.joinMeetings': 'Join Meetings',
    'nav.savedLinks': 'Saved Links',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.login': 'Login / Sign Up',
    'nav.myAccount': 'My Account',
    'app.title': 'Meet Link Meetly',
    'app.subtitle': 'Share your meeting links with ease.',
    
    // Home page
    'home.title': 'Available Meeting Links',
    'home.description': 'Find and join active meeting rooms',
    'home.noMeetings': 'No meetings available',
    'home.createFirst': 'Create your first meeting link',
    'home.addMeeting': 'Add Meeting',
    'home.allMeetings': 'All Meetings',
    'home.myMeetings': 'My Meetings',
    
    // Buttons
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.create': 'Create',
    'button.edit': 'Edit',
    'button.delete': 'Delete',
    'button.join': 'Join',
    
    // Form fields
    'form.title': 'Title',
    'form.description': 'Description',
    'form.meetingUrl': 'Meeting URL',
    'form.category': 'Category',
    
    // Language switcher
    'language.english': 'English',
    'language.persian': 'فارسی',
  },
  fa: {
    // Navigation
    'nav.browseMeetings': 'مرور جلسات',
    'nav.myLinks': 'لینک‌های من',
    'nav.joinMeetings': 'پیوستن به جلسات',
    'nav.savedLinks': 'لینک‌های ذخیره شده',
    'nav.profile': 'پروفایل',
    'nav.logout': 'خروج',
    'nav.login': 'ورود / ثبت نام',
    'nav.myAccount': 'حساب کاربری من',
    'app.title': 'میت لینک میتلی',
    'app.subtitle': 'لینک‌های جلسه خود را به راحتی به اشتراک بگذارید.',
    
    // Home page
    'home.title': 'لینک‌های جلسه موجود',
    'home.description': 'اتاق‌های جلسه فعال را پیدا کنید و به آن‌ها بپیوندید',
    'home.noMeetings': 'هیچ جلسه‌ای موجود نیست',
    'home.createFirst': 'اولین لینک جلسه خود را ایجاد کنید',
    'home.addMeeting': 'افزودن جلسه',
    'home.allMeetings': 'تمام جلسات',
    'home.myMeetings': 'جلسات من',
    
    // Buttons
    'button.save': 'ذخیره',
    'button.cancel': 'لغو',
    'button.create': 'ایجاد',
    'button.edit': 'ویرایش',
    'button.delete': 'حذف',
    'button.join': 'پیوستن',
    
    // Form fields
    'form.title': 'عنوان',
    'form.description': 'توضیحات',
    'form.meetingUrl': 'لینک جلسه',
    'form.category': 'دسته‌بندی',
    
    // Language switcher
    'language.english': 'English',
    'language.persian': 'فارسی',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fa')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'fa' ? 'fa' : 'en';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'fa';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={`${isRTL ? 'font-vazir' : 'font-roboto'} ${isRTL ? 'rtl' : 'ltr'}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
