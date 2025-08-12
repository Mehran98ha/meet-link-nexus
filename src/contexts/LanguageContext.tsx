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
    // App branding
    'app.name': 'Meetly',
    'app.description': 'Professional platform for sharing and accessing Google Meet links',
    
    // Home page
    'home.title': 'Meetly',
    'home.description': 'Professional platform for sharing and accessing Google Meet links',
    'home.addMeeting': 'Add Meeting Link',
    
    // Tabs
    'tabs.allMeetings': 'All Meetings',
    'tabs.myMeetings': 'My Meetings',
    
    // Navigation
    'nav.home': 'Home',
    'nav.browseMeetings': 'Browse Meetings',
    'nav.myLinks': 'My Links',
    'nav.joinMeetings': 'Join Meetings',
    'nav.savedLinks': 'Saved Links',
    'nav.profile': 'Profile',
    'nav.inviteFriends': 'Invite Friends',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    
    // Meetings
    'meetings.addNew': 'Add New Meeting',
    'meetings.editMeeting': 'Edit Meeting',
    'meetings.googleMeetUrl': 'Google Meet URL',
    'meetings.meetingName': 'Meeting Name',
    'meetings.yourName': 'Your Name',
    'meetings.notes': 'Notes',
    'meetings.optionalNotes': 'Optional meeting details...',
    'meetings.urlRequired': 'URL is required',
    'meetings.nameRequired': 'Meeting name is required',
    'meetings.creatorRequired': 'Creator name is required',
    'meetings.validUrlRequired': 'Please enter a valid Google Meet URL',
    'meetings.maxChars': 'chars max',
    'meetings.adding': 'Adding...',
    'meetings.addMeetingLink': 'Add Meeting Link',
    'meetings.saving': 'Saving...',
    'meetings.saveChanges': 'Save Changes',
    
    // Search and filters
    'search.placeholder': 'Search meetings...',
    'empty.title': 'No meetings found',
    'empty.searchMessage': 'Try a different search term or clear your filters',
    'empty.noMeetings': 'Be the first to share a meeting link!',
    'empty.signUpButton': 'Sign up to add meetings',
    
    // Authentication
    'auth.loginRequired': 'Login Required',
    'auth.loginMessage': 'You need to be logged in to add, edit, or delete meeting links.',
    'auth.loginSignup': 'Login / Sign Up',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.username': 'Username',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.pin': '4-Digit PIN',
    'auth.welcomeBack': 'Welcome Back!',
    'auth.createAccount': 'Create Account',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.enterUsername': 'Enter your username',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.enterPin': 'Enter 4-digit PIN',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.continue': 'Continue',
    'auth.createYourAccount': 'Create Your Account',
    'auth.joinMeetly': 'Join Meetly',
    'auth.profilePicture': 'Profile Picture',
    'auth.uploadPhoto': 'Upload Photo',
    'auth.chooseAvatar': 'Choose Avatar',
    'auth.enterVisualPassword': 'Enter Your Visual Password',
    'auth.clickSamePoints': 'Click the same points you selected during registration',
    'auth.enterUsernameToLogin': 'Enter your username to continue',
    'auth.rememberPattern': 'Click to log in. Remember your click pattern!',
    
    // Common actions
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.join': 'Join',
    
    // Language switcher
    'language.english': 'English',
    'language.persian': 'Persian',
    'language.switch': 'Switch Language',
    
    // Profile
    'profile.title': 'Profile',
    'profile.editProfile': 'Edit Profile',
    'profile.referralPoints': 'Referral Points',
    'profile.inviteHistory': 'Invite History',
    'profile.updateProfile': 'Update Profile',
    'profile.changePassword': 'Change Password',
    'profile.changePicture': 'Change Picture',
    'profile.changeVisualPassword': 'Change Visual Password',
    'profile.activity': 'Activity',
    'profile.settings': 'Settings',
    'profile.inviteFriends': 'Invite Friends',
    'profile.accountSettings': 'Account Settings',
    'profile.privacySettings': 'Privacy Settings',
    'profile.logout': 'Logout',
    'profile.memberSince': 'Member since',
    'profile.lastLogin': 'Last login',
    'profile.security': 'Security',
    'profile.activityEmpty': 'Your activity will appear here',
    'profile.activityEmptyDescription': 'Start sharing and joining meetings',
    'profile.securityNote': 'Your account is secured with visual password authentication. Your click pattern is unique and encrypted.',
    'profile.inviteDescription': 'Share Meet Link Meetly with others',
    'profile.inviteLink': 'https://meet-link-meetly.com/invite/xyz123',
    'profile.copyInviteLink': 'Copy',
    'profile.linkCopied': 'Link Copied',
    'profile.linkCopiedDescription': 'Invitation link copied to clipboard',
    
    // Visual password change
    'password.changeVisualPassword': 'Change Visual Password',
    'password.enterCurrent': 'Enter Current Password',
    'password.enterNew': 'Create New Password',
    'password.confirmNew': 'Confirm New Password',
    'password.currentDescription': 'Click your current visual password pattern to verify your identity',
    'password.newDescription': 'Create a new visual password by clicking 3-6 points on the image',
    'password.confirmDescription': 'Repeat the same pattern to confirm your new password',
    'password.minimumClicks': 'Please click at least 3 points',
    'password.currentIncorrect': 'Current password is incorrect',
    'password.currentVerified': 'Current password verified successfully',
    'password.newPasswordSet': 'New password pattern set',
    'password.confirmPattern': 'Please repeat the same pattern to confirm',
    'password.patternsDontMatch': 'Password patterns do not match. Please try again.',
    'password.changeSuccess': 'Visual password changed successfully',
    'password.changeFailed': 'Failed to change password. Please try again.',
    'password.instructions': 'How to change your visual password',
    'password.instruction1': 'First, enter your current visual password',
    'password.instruction2': 'Then create a new password with 3-6 clicks',
    'password.instruction3': 'Confirm your new password by repeating the pattern',
    'password.instruction4': 'Remember your new pattern for future logins',
    
    // Invite system
    'invite.title': 'Invite Friends',
    'invite.description': 'Share your referral link and earn points',
    'invite.referralLink': 'Your Referral Link',
    'invite.copyLink': 'Copy Link',
    'invite.linkCopied': 'Link copied to clipboard!',
    'invite.earnPoints': 'Earn 10 points for each friend who joins!',
    'invite.yourPoints': 'Your Points',
    
    // Errors
    'error.invalidCredentials': 'Invalid credentials',
    'error.userNotFound': 'User not found',
    'error.serverError': 'Server error. Please try again.',
    'error.networkError': 'Network error. Check your connection.',
    'error.fieldRequired': 'This field is required',
    'error.emailInvalid': 'Please enter a valid email address',
    'error.passwordTooShort': 'Password must be at least 6 characters',
    'error.passwordsNotMatch': 'Passwords do not match',
    'error.pinInvalid': 'PIN must be exactly 4 digits',
    'error.usernameExists': 'Username already exists',
    'error.emailExists': 'Email already exists',
  },
  fa: {
    // App branding
    'app.name': 'میتلی',
    'app.description': 'پلتفرم حرفه‌ای برای اشتراک‌گذاری و دسترسی به لینک‌های گوگل میت',
    
    // Home page
    'home.title': 'میتلی',
    'home.description': 'پلتفرم حرفه‌ای برای اشتراک‌گذاری و دسترسی به لینک‌های گوگل میت',
    'home.addMeeting': 'افزودن لینک جلسه',
    
    // Tabs
    'tabs.allMeetings': 'همه جلسات',
    'tabs.myMeetings': 'جلسات من',
    
    // Navigation
    'nav.home': 'خانه',
    'nav.browseMeetings': 'مرور جلسات',
    'nav.myLinks': 'لینک‌های من',
    'nav.joinMeetings': 'پیوستن به جلسات',
    'nav.savedLinks': 'لینک‌های ذخیره شده',
    'nav.profile': 'پروفایل',
    'nav.inviteFriends': 'دعوت از دوستان',
    'nav.logout': 'خروج',
    'nav.login': 'ورود',
    
    // Meetings
    'meetings.addNew': 'افزودن جلسه جدید',
    'meetings.editMeeting': 'ویرایش جلسه',
    'meetings.googleMeetUrl': 'لینک گوگل میت',
    'meetings.meetingName': 'نام جلسه',
    'meetings.yourName': 'نام شما',
    'meetings.notes': 'یادداشت‌ها',
    'meetings.optionalNotes': 'جزئیات اختیاری جلسه...',
    'meetings.urlRequired': 'لینک الزامی است',
    'meetings.nameRequired': 'نام جلسه الزامی است',
    'meetings.creatorRequired': 'نام سازنده الزامی است',
    'meetings.validUrlRequired': 'لطفاً لینک معتبر گوگل میت وارد کنید',
    'meetings.maxChars': 'حداکثر کاراکتر',
    'meetings.adding': 'در حال افزودن...',
    'meetings.addMeetingLink': 'افزودن لینک جلسه',
    'meetings.saving': 'در حال ذخیره...',
    'meetings.saveChanges': 'ذخیره تغییرات',
    
    // Search and filters
    'search.placeholder': 'جستجوی جلسات...',
    'empty.title': 'هیچ جلسه‌ای یافت نشد',
    'empty.searchMessage': 'عبارت جستجوی دیگری را امتحان کنید یا فیلترها را پاک کنید',
    'empty.noMeetings': 'اولین نفری باشید که لینک جلسه به اشتراک می‌گذارد!',
    'empty.signUpButton': 'ثبت نام برای افزودن جلسات',
    
    // Authentication
    'auth.loginRequired': 'ورود الزامی است',
    'auth.loginMessage': 'برای افزودن، ویرایش یا حذف لینک‌های جلسه، باید وارد شوید.',
    'auth.loginSignup': 'ورود / ثبت نام',
    'auth.login': 'ورود',
    'auth.signup': 'ثبت نام',
    'auth.username': 'نام کاربری',
    'auth.email': 'ایمیل',
    'auth.password': 'رمز عبور',
    'auth.confirmPassword': 'تأیید رمز عبور',
    'auth.pin': 'پین ۴ رقمی',
    'auth.welcomeBack': 'خوش برگشتید!',
    'auth.createAccount': 'ایجاد حساب کاربری',
    'auth.forgotPassword': 'رمز عبور را فراموش کرده‌اید؟',
    'auth.resetPassword': 'بازنشانی رمز عبور',
    'auth.enterUsername': 'نام کاربری خود را وارد کنید',
    'auth.enterEmail': 'ایمیل خود را وارد کنید',
    'auth.enterPassword': 'رمز عبور خود را وارد کنید',
    'auth.enterPin': 'پین ۴ رقمی را وارد کنید',
    'auth.alreadyHaveAccount': 'قبلاً حساب کاربری دارید؟',
    'auth.dontHaveAccount': 'حساب کاربری ندارید؟',
    'auth.continue': 'ادامه',
    'auth.createYourAccount': 'حساب کاربری خود را ایجاد کنید',
    'auth.joinMeetly': 'به میتلی بپیوندید',
    'auth.profilePicture': 'تصویر پروفایل',
    'auth.uploadPhoto': 'آپلود عکس',
    'auth.chooseAvatar': 'انتخاب آواتار',
    'auth.enterVisualPassword': 'رمز تصویری خود را وارد کنید',
    'auth.clickSamePoints': 'همان نقاطی را که در هنگام ثبت نام انتخاب کردید، کلیک کنید',
    'auth.enterUsernameToLogin': 'نام کاربری خود را برای ادامه وارد کنید',
    'auth.rememberPattern': 'برای ورود کلیک کنید. الگوی کلیک خود را به یاد داشته باشید!',
    
    // Common actions
    'common.cancel': 'لغو',
    'common.save': 'ذخیره',
    'common.edit': 'ویرایش',
    'common.delete': 'حذف',
    'common.back': 'بازگشت',
    'common.next': 'بعدی',
    'common.loading': 'در حال بارگذاری...',
    'common.error': 'خطا',
    'common.success': 'موفقیت',
    'common.join': 'پیوستن',
    
    // Language switcher
    'language.english': 'English',
    'language.persian': 'فارسی',
    'language.switch': 'تغییر زبان',
    
    // Profile
    'profile.title': 'پروفایل',
    'profile.editProfile': 'ویرایش پروفایل',
    'profile.referralPoints': 'امتیاز دعوت',
    'profile.inviteHistory': 'تاریخچه دعوت‌ها',
    'profile.updateProfile': 'به‌روزرسانی پروفایل',
    'profile.changePassword': 'تغییر رمز عبور',
    'profile.changePicture': 'تغییر تصویر',
    'profile.changeVisualPassword': 'تغییر رمز تصویری',
    'profile.activity': 'فعالیت',
    'profile.settings': 'تنظیمات',
    'profile.inviteFriends': 'دعوت از دوستان',
    'profile.accountSettings': 'تنظیمات حساب کاربری',
    'profile.privacySettings': 'تنظیمات حریم خصوصی',
    'profile.logout': 'خروج',
    'profile.memberSince': 'عضو از',
    'profile.lastLogin': 'آخرین ورود',
    'profile.security': 'امنیت',
    'profile.activityEmpty': 'فعالیت شما اینجا نمایش داده خواهد شد',
    'profile.activityEmptyDescription': 'شروع به اشتراک‌گذاری و پیوستن به جلسات کنید',
    'profile.securityNote': 'حساب شما با احراز هویت رمز تصویری محافظت می‌شود. الگوی کلیک شما منحصر به فرد و رمزگذاری شده است.',
    'profile.inviteDescription': 'میتلی لینک میت را با دیگران به اشتراک بگذارید',
    'profile.inviteLink': 'https://meet-link-meetly.com/invite/xyz123',
    'profile.copyInviteLink': 'کپی',
    'profile.linkCopied': 'لینک کپی شد',
    'profile.linkCopiedDescription': 'لینک دعوت در کلیپ‌بورد کپی شد',
    
    // Visual password change
    'password.changeVisualPassword': 'تغییر رمز تصویری',
    'password.enterCurrent': 'رمز فعلی را وارد کنید',
    'password.enterNew': 'رمز جدید ایجاد کنید',
    'password.confirmNew': 'رمز جدید را تأیید کنید',
    'password.currentDescription': 'الگوی رمز تصویری فعلی خود را برای تأیید هویت کلیک کنید',
    'password.newDescription': 'با کلیک بر ۳ تا ۶ نقطه روی تصویر، رمز تصویری جدید ایجاد کنید',
    'password.confirmDescription': 'همان الگو را برای تأیید رمز جدید تکرار کنید',
    'password.minimumClicks': 'لطفاً حداقل ۳ نقطه کلیک کنید',
    'password.currentIncorrect': 'رمز فعلی نادرست است',
    'password.currentVerified': 'رمز فعلی با موفقیت تأیید شد',
    'password.newPasswordSet': 'الگوی رمز جدید تنظیم شد',
    'password.confirmPattern': 'لطفاً همان الگو را برای تأیید تکرار کنید',
    'password.patternsDontMatch': 'الگوهای رمز مطابقت ندارند. لطفاً دوباره تلاش کنید.',
    'password.changeSuccess': 'رمز تصویری با موفقیت تغییر کرد',
    'password.changeFailed': 'تغییر رمز ناموفق بود. لطفاً دوباره تلاش کنید.',
    'password.instructions': 'نحوه تغییر رمز تصویری',
    'password.instruction1': 'ابتدا رمز تصویری فعلی خود را وارد کنید',
    'password.instruction2': 'سپس رمز جدیدی با ۳ تا ۶ کلیک ایجاد کنید',
    'password.instruction3': 'رمز جدید خود را با تکرار الگو تأیید کنید',
    'password.instruction4': 'الگوی جدید خود را برای ورودهای آینده به خاطر بسپارید',
    
    // Invite system
    'invite.title': 'دعوت از دوستان',
    'invite.description': 'لینک دعوت خود را به اشتراک بگذارید و امتیاز کسب کنید',
    'invite.referralLink': 'لینک دعوت شما',
    'invite.copyLink': 'کپی لینک',
    'invite.linkCopied': 'لینک در کلیپ‌بورد کپی شد!',
    'invite.earnPoints': 'برای هر دوستی که می‌پیوندد ۱۰ امتیاز کسب کنید!',
    'invite.yourPoints': 'امتیاز شما',
    
    // Errors
    'error.invalidCredentials': 'اطلاعات ورود نامعتبر است',
    'error.userNotFound': 'کاربر یافت نشد',
    'error.serverError': 'خطای سرور. لطفاً دوباره تلاش کنید.',
    'error.networkError': 'خطای شبکه. اتصال خود را بررسی کنید.',
    'error.fieldRequired': 'این فیلد الزامی است',
    'error.emailInvalid': 'لطفاً یک ایمیل معتبر وارد کنید',
    'error.passwordTooShort': 'رمز عبور باید حداقل ۶ کاراکتر باشد',
    'error.passwordsNotMatch': 'رمزهای عبور مطابقت ندارند',
    'error.pinInvalid': 'پین باید دقیقاً ۴ رقم باشد',
    'error.usernameExists': 'نام کاربری قبلاً وجود دارد',
    'error.emailExists': 'ایمیل قبلاً وجود دارد',
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
    
    // Update body class for font switching
    document.body.className = language === 'fa' ? 'font-vazirmatn' : 'font-urbanist';
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