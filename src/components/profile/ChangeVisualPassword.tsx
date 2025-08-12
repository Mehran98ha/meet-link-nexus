import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAnimatedToast } from '@/components/ui/toast-container';
import VisualPasswordImage from '@/components/auth/VisualPasswordImage';

interface PasswordClick {
  x: number;
  y: number;
}

const ChangeVisualPassword: React.FC = () => {
  const { t } = useLanguage();
  const { user, refreshAuth } = useAuth();
  const { showToast } = useAnimatedToast();
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>('current');
  const [currentPassword, setCurrentPassword] = useState<PasswordClick[]>([]);
  const [newPassword, setNewPassword] = useState<PasswordClick[]>([]);
  const [confirmPassword, setConfirmPassword] = useState<PasswordClick[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleCurrentPasswordSubmit = async (clicks: PasswordClick[]) => {
    if (clicks.length < 3) {
      showToast({
        title: t('common.error'),
        description: t('password.minimumClicks'),
        variant: 'error',
        duration: 4000
      });
      return;
    }

    setIsLoading(true);
    try {
      // First verify current password using login function
      const { loginUser } = await import('@/services/authService');
      const result = await loginUser(user!.username, clicks);
      
      if (!result.success) {
        showToast({
          title: t('common.error'),
          description: t('password.currentIncorrect'),
          variant: 'error',
          duration: 4000
        });
        setCurrentPassword([]);
        return;
      }

      setCurrentPassword(clicks);
      setStep('new');
      showToast({
        title: t('common.success'),
        description: t('password.currentVerified'),
        variant: 'success',
        duration: 3000
      });
    } catch (error) {
      showToast({
        title: t('common.error'),
        description: t('error.serverError'),
        variant: 'error',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordSubmit = (clicks: PasswordClick[]) => {
    if (clicks.length < 3) {
      showToast({
        title: t('common.error'),
        description: t('password.minimumClicks'),
        variant: 'error',
        duration: 4000
      });
      return;
    }

    setNewPassword(clicks);
    setStep('confirm');
    showToast({
      title: t('password.newPasswordSet'),
      description: t('password.confirmPattern'),
      variant: 'info',
      duration: 3000
    });
  };

  const handleConfirmPasswordSubmit = async (clicks: PasswordClick[]) => {
    if (clicks.length !== newPassword.length) {
      showToast({
        title: t('common.error'),
        description: t('password.patternsDontMatch'),
        variant: 'error',
        duration: 4000
      });
      setConfirmPassword([]);
      return;
    }

    // Check if patterns match (with tolerance)
    const tolerance = 50;
    let isMatch = true;
    for (let i = 0; i < newPassword.length; i++) {
      const distance = Math.hypot(newPassword[i].x - clicks[i].x, newPassword[i].y - clicks[i].y);
      if (distance > tolerance) {
        isMatch = false;
        break;
      }
    }

    if (!isMatch) {
      showToast({
        title: t('common.error'),
        description: t('password.patternsDontMatch'),
        variant: 'error',
        duration: 4000
      });
      setConfirmPassword([]);
      return;
    }

    setIsLoading(true);
    try {
      // Add secure RPC for password change
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.rpc('change_visual_password', {
        p_user_id: user!.id,
        p_current_clicks: currentPassword as any,
        p_new_clicks: newPassword as any
      });

      if (error || !data) {
        throw new Error('Failed to change password');
      }

      showToast({
        title: t('common.success'),
        description: t('password.changeSuccess'),
        variant: 'success',
        duration: 4000
      });

      // Reset form
      setStep('current');
      setCurrentPassword([]);
      setNewPassword([]);
      setConfirmPassword([]);
      
      // Refresh auth to ensure session is valid
      await refreshAuth();
    } catch (error) {
      showToast({
        title: t('common.error'),
        description: t('password.changeFailed'),
        variant: 'error',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setStep('current');
    setCurrentPassword([]);
    setNewPassword([]);
    setConfirmPassword([]);
  };

  const getStepTitle = () => {
    switch (step) {
      case 'current':
        return t('password.enterCurrent');
      case 'new':
        return t('password.enterNew');
      case 'confirm':
        return t('password.confirmNew');
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'current':
        return t('password.currentDescription');
      case 'new':
        return t('password.newDescription');
      case 'confirm':
        return t('password.confirmDescription');
      default:
        return '';
    }
  };

  return (
    <Card className="ios-card bg-ios-secondary-bg rounded-ios-2xl shadow-ios-lg border border-ios-gray-5/50">
      <CardHeader className="pb-ios-sm">
        <CardTitle className="flex items-center gap-ios-sm">
          <div className="w-8 h-8 bg-ios-blue/10 rounded-ios-md flex items-center justify-center">
            <Shield className="h-4 w-4 text-ios-blue" />
          </div>
          <span className="ios-text-headline text-ios-label">{t('password.changeVisualPassword')}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-ios-lg">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          {['current', 'new', 'confirm'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                step === stepName 
                  ? 'bg-ios-blue text-ios-label-on-blue' 
                  : (index < ['current', 'new', 'confirm'].indexOf(step))
                    ? 'bg-ios-green text-ios-label-on-green'
                    : 'bg-ios-gray-5 text-ios-secondary-label'
              }`}>
                {index + 1}
              </div>
              {index < 2 && (
                <div className={`w-12 h-0.5 mx-2 transition-all duration-200 ${
                  index < ['current', 'new', 'confirm'].indexOf(step) 
                    ? 'bg-ios-green' 
                    : 'bg-ios-gray-5'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        {showInstructions && (
          <div className="bg-ios-blue/10 border border-ios-blue/20 rounded-ios-lg p-ios-md">
            <div className="flex items-start gap-ios-sm">
              <Button
                onClick={() => setShowInstructions(!showInstructions)}
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-ios-blue hover:text-ios-blue-dark"
              >
                {showInstructions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <div className="flex-1">
                <h4 className="ios-text-callout font-semibold text-ios-label mb-ios-xs">
                  {t('password.instructions')}
                </h4>
                <ul className="ios-text-footnote text-ios-secondary-label space-y-ios-xs list-disc list-inside">
                  <li>{t('password.instruction1')}</li>
                  <li>{t('password.instruction2')}</li>
                  <li>{t('password.instruction3')}</li>
                  <li>{t('password.instruction4')}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Current Step */}
        <div className="space-y-ios-md">
          <div className="text-center space-y-ios-xs">
            <h3 className="ios-text-body font-semibold text-ios-label">{getStepTitle()}</h3>
            <p className="ios-text-footnote text-ios-secondary-label">{getStepDescription()}</p>
          </div>

          <div className="flex justify-center">
            <VisualPasswordImage
              onClicksChange={
                step === 'current' 
                  ? handleCurrentPasswordSubmit
                  : step === 'new'
                    ? handleNewPasswordSubmit
                    : handleConfirmPasswordSubmit
              }
              clicks={
                step === 'current' 
                  ? currentPassword
                  : step === 'new'
                    ? newPassword
                    : confirmPassword
              }
              isSetup={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-ios-sm justify-end pt-ios-md border-t border-ios-gray-5">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="px-ios-lg py-ios-sm"
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          
          {step !== 'current' && (
            <Button
              onClick={() => setStep(step === 'confirm' ? 'new' : 'current')}
              variant="outline"
              className="px-ios-lg py-ios-sm"
              disabled={isLoading}
            >
              {t('common.back')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeVisualPassword;