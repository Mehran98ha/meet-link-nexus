
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    'home.title': 'Meet Link Meetly',
    'home.description': 'Professional platform for sharing and accessing Google Meet links',
    'home.addMeeting': 'Add Meeting Link',
    'search.placeholder': 'Search meetings...',
    'empty.title': 'No meetings found',
    'empty.searchMessage': 'Try a different search term or clear your filters',
    'empty.noMeetings': 'Be the first to share a meeting link!',
    'empty.signUpButton': 'Sign up to add meetings',
    'auth.loginRequired': 'Login Required',
    'auth.loginMessage': 'You need to be logged in to add, edit, or delete meeting links.',
    'auth.loginSignup': 'Login / Sign Up',
    'common.cancel': 'Cancel',
    'language.english': 'English',
    'language.persian': 'Persian',
    'nav.home': 'Home',
    'nav.myLinks': 'My Links',
    'nav.join': 'Join',
    'nav.saved': 'Saved',
    'nav.profile': 'Profile',
  },
  fa: {
    'home.title': 'میت لینک میتلی',
    'home.description': 'پلتفرم حرفه‌ای برای اشتراک‌گذاری و دسترسی به لینک‌های گوگل میت',
    'home.addMeeting': 'افزودن لینک جلسه',
    'search.placeholder': 'جستجوی جلسات...',
    'empty.title': 'هیچ جلسه‌ای یافت نشد',
    'empty.searchMessage': 'عبارت جستجوی دیگری را امتحان کنید یا فیلترها را پاک کنید',
    'empty.noMeetings': 'اولین نفری باشید که لینک جلسه به اشتراک می‌گذارد!',
    'empty.signUpButton': 'ثبت نام برای افزودن جلسات',
    'auth.loginRequired': 'ورود الزامی است',
    'auth.loginMessage': 'برای افزودن، ویرایش یا حذف لینک‌های جلسه، باید وارد شوید.',
    'auth.loginSignup': 'ورود / ثبت نام',
    'common.cancel': 'لغو',
    'language.english': 'English',
    'language.persian': 'فارسی',
    'nav.home': 'خانه',
    'nav.myLinks': 'لینک‌های من',
    'nav.join': 'پیوستن',
    'nav.saved': 'ذخیره شده',
    'nav.profile': 'پروفایل',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'fa';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
