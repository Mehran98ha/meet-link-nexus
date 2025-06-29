
import React from 'react';
import { LogIn } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const AuthPromptDialog: React.FC<AuthPromptDialogProps> = ({
  isOpen,
  onClose,
  onLoginClick
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isRTL ? 'font-vazir' : 'font-roboto'}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {t('auth.loginRequired')}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className={`text-gray-600 mb-4 ${isRTL ? 'text-right font-vazir' : 'text-left font-roboto'}`}>
            {t('auth.loginMessage')}
          </p>
          <div className={`flex gap-2 ${isRTL ? 'justify-start flex-row-reverse' : 'justify-end'}`}>
            <Button variant="outline" onClick={onClose} className={isRTL ? 'font-vazir' : 'font-roboto'}>
              {t('common.cancel')}
            </Button>
            <Button onClick={onLoginClick} className={`${isRTL ? 'flex-row-reverse font-vazir' : 'font-roboto'}`}>
              <LogIn className="h-4 w-4 mr-2" />
              {t('auth.loginSignup')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPromptDialog;
