
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
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                animation: `clickPulse 2s infinite ${index * 0.2}s`
              }}
            >
              <div 
                className={`w-8 h-8 rounded-full border-3 border-white shadow-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-all duration-300 hover:scale-125 active:scale-110 ${
                  isSetup 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/50' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/50'
                }`}
                onClick={isSetup ? (e) => {
                  e.stopPropagation();
                  handleRemoveClick(index);
                } : undefined}
                style={{
                  boxShadow: `0 0 20px rgba(${isSetup ? '59, 130, 246' : '34, 197, 94'}, 0.6)`,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
              >
                {index + 1}
              </div>
              
              {/* Ripple effect */}
              <div 
                className={`absolute inset-0 rounded-full border-2 ${
                  isSetup ? 'border-blue-400' : 'border-green-400'
                } animate-ping`}
                style={{
                  animation: `ripple 1.5s infinite ${index * 0.3}s`
                }}
              />
            </div>
          );
        })}

        {/* Enhanced overlay for better visual feedback */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/5 to-transparent" />
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
      </div>

      {/* Enhanced click counter with progress indicator */}
      <div className="mt-6 text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-semibold text-gray-700">
            Clicks: {clicks.length} / {maxClicks}
          </span>
          {clicks.length > 0 && (
            <div className="flex gap-1">
              {Array.from({ length: maxClicks }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < clicks.length 
                      ? (isSetup ? 'bg-blue-500 shadow-blue-500/50' : 'bg-green-500 shadow-green-500/50')
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {isSetup && clicks.length > 0 && (
          <p className="text-sm text-gray-500 animate-fade-in">
            Click on a numbered circle to remove it
          </p>
        )}
        
        {!isSetup && (
          <p className="text-sm text-emerald-600 font-medium animate-fade-in">
            Enter your visual password pattern
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes clickPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.8;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default VisualPasswordImage;
