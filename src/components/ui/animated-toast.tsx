
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnimatedToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const variantStyles = {
  default: {
    bg: 'bg-ios-secondary-bg',
    border: 'border-ios-gray-4',
    text: 'text-ios-label',
    icon: Info,
    iconColor: 'text-ios-blue'
  },
  success: {
    bg: 'bg-ios-green',
    border: 'border-ios-green',
    text: 'text-ios-label-on-green',
    icon: CheckCircle,
    iconColor: 'text-ios-label-on-green'
  },
  error: {
    bg: 'bg-ios-red',
    border: 'border-ios-red',
    text: 'text-ios-label-on-red',
    icon: AlertCircle,
    iconColor: 'text-ios-label-on-red'
  },
  warning: {
    bg: 'bg-ios-orange',
    border: 'border-ios-orange',
    text: 'text-ios-label-on-orange',
    icon: AlertTriangle,
    iconColor: 'text-ios-label-on-orange'
  },
  info: {
    bg: 'bg-ios-blue',
    border: 'border-ios-blue',
    text: 'text-ios-label-on-blue',
    icon: Info,
    iconColor: 'text-ios-label-on-blue'
  }
};

export const AnimatedToast: React.FC<AnimatedToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const style = variantStyles[variant];
  const Icon = style.icon;

  useEffect(() => {
    // Animate in
    const animateIn = setTimeout(() => setIsVisible(true), 50);
    
    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(animateIn);
      clearTimeout(timer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      className={cn(
        "relative flex items-start gap-ios-sm p-ios-md rounded-ios-lg shadow-ios-lg border-2 backdrop-blur-ios transform transition-all duration-300 ease-out min-w-[320px] max-w-[480px]",
        style.bg,
        style.border,
        style.text,
        isVisible && !isExiting ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-ios-xs">
        <Icon className={cn("h-5 w-5", style.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="ios-text-callout font-semibold mb-ios-xs">{title}</h4>
        {description && (
          <p className="ios-text-footnote opacity-90">{description}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className={cn(
          "flex-shrink-0 p-1 rounded-ios-sm hover:bg-black/10 transition-colors duration-150",
          style.iconColor
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnimatedToast;
