import React from 'react';
import { User } from 'lucide-react';

interface AvatarFallbackProps {
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ 
  username, 
  size = 'lg',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-32 h-32 text-2xl',
    xl: 'w-40 h-40 text-3xl'
  };

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(username);

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg ${className}`}>
      {initials || <User className="w-1/2 h-1/2" />}
    </div>
  );
};

export default AvatarFallback;