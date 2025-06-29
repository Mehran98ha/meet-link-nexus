
import React, { useState, useRef } from 'react';
import { PasswordClick } from '@/services/authService';

interface VisualPasswordImageProps {
  onClicksChange: (clicks: PasswordClick[]) => void;
  clicks: PasswordClick[];
  maxClicks?: number;
  isSetup?: boolean;
}

const IMAGE_URL = "https://cdn.dribbble.com/userupload/43656088/file/original-88b72b9779d6dc4a3ed0c4e377eff16b.png?resize=752x588&vertical=center";

const VisualPasswordImage: React.FC<VisualPasswordImageProps> = ({
  onClicksChange,
  clicks,
  maxClicks = 5,
  isSetup = true
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || clicks.length >= maxClicks) return;

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const newClicks = [...clicks, { x, y }];
    onClicksChange(newClicks);
  };

  const handleRemoveClick = (index: number) => {
    if (!isSetup) return;
    const newClicks = clicks.filter((_, i) => i !== index);
    onClicksChange(newClicks);
  };

  const getClickPosition = (click: PasswordClick) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = rect.width / imageRef.current.naturalWidth;
    const scaleY = rect.height / imageRef.current.naturalHeight;
    
    return {
      x: click.x * scaleX,
      y: click.y * scaleY
    };
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
        <img
          ref={imageRef}
          src={IMAGE_URL}
          alt="Visual Password"
          className="w-full h-auto cursor-pointer select-none transition-all duration-300 hover:brightness-110"
          onLoad={() => setImageLoaded(true)}
          onClick={handleImageClick}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {/* Click indicators with enhanced animations */}
        {imageLoaded && clicks.map((click, index) => {
          const position = getClickPosition(click);
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
            >
              <div 
                className={`w-10 h-10 rounded-full border-3 border-white shadow-2xl flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-all duration-500 hover:scale-125 active:scale-110 animate-enhanced-pulse ${
                  isSetup 
                    ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 hover:from-blue-600 hover:to-purple-800' 
                    : 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700'
                }`}
                onClick={isSetup ? (e) => {
                  e.stopPropagation();
                  handleRemoveClick(index);
                } : undefined}
                style={{
                  boxShadow: `0 0 25px rgba(${isSetup ? '59, 130, 246' : '34, 197, 94'}, 0.7), 0 8px 20px rgba(0,0,0,0.3)`,
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
                  animation: `enhanced-pulse 2.5s infinite ease-in-out ${index * 0.3}s`
                }}
              >
                <span className="text-lg font-extrabold drop-shadow-lg">
                  {index + 1}
                </span>
              </div>
              
              {/* Multi-layered ripple effects */}
              <div 
                className={`absolute inset-0 rounded-full border-3 ${
                  isSetup ? 'border-blue-300' : 'border-emerald-300'
                } opacity-60`}
                style={{
                  animation: `enhanced-ripple 2s infinite ease-out ${index * 0.4}s`
                }}
              />
              <div 
                className={`absolute inset-0 rounded-full border-2 ${
                  isSetup ? 'border-purple-400' : 'border-teal-400'
                } opacity-40`}
                style={{
                  animation: `enhanced-ripple 2.5s infinite ease-out ${index * 0.4 + 0.5}s`
                }}
              />
            </div>
          );
        })}

        {/* Enhanced overlay effects */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-white/5" />
        
        {/* Dynamic glow effect */}
        <div className={`absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500 ${
          isSetup 
            ? 'bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-indigo-500/15' 
            : 'bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-teal-500/15'
        }`} />
      </div>

      {/* Enhanced click counter with animated progress */}
      <div className="mt-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-xl font-bold text-gray-800">
            Clicks: {clicks.length} / {maxClicks}
          </span>
          {clicks.length > 0 && (
            <div className="flex gap-2">
              {Array.from({ length: maxClicks }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-500 transform ${
                    i < clicks.length 
                      ? (isSetup 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50 scale-110' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/50 scale-110')
                      : 'bg-gray-300 scale-100'
                  }`}
                  style={{
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {isSetup && clicks.length > 0 && (
          <p className="text-sm text-gray-600 animate-fade-in font-medium">
            💡 Click on a numbered circle to remove it
          </p>
        )}
        
        {!isSetup && (
          <p className="text-base text-emerald-700 font-semibold animate-fade-in">
            🔐 Enter your visual password pattern
          </p>
        )}
      </div>

      <style>{`
        @keyframes enhanced-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          25% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.9;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.95;
          }
          75% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.85;
          }
        }
        
        @keyframes enhanced-ripple {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default VisualPasswordImage;
