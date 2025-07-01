
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatedToast, AnimatedToastProps } from './animated-toast';

interface ToastContextType {
  showToast: (toast: Omit<AnimatedToastProps, 'id' | 'onClose'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useAnimatedToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useAnimatedToast must be used within a ToastProvider');
  }
  return context;
};

interface Toast extends AnimatedToastProps {}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toastData: Omit<AnimatedToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toastData,
      id,
      onClose: (toastId: string) => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }
    };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-ios-sm">
        {toasts.map(toast => (
          <AnimatedToast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
