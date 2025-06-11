
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
          className="w-full h-auto cursor-crosshair select-none"
          onLoad={() => setImageLoaded(true)}
          onClick={handleImageClick}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {/* Click indicators */}
        {imageLoaded && clicks.map((click, index) => {
          const position = getClickPosition(click);
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`
              }}
            >
              <div 
                className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-all duration-200 hover:scale-110 ${
                  isSetup ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500'
                }`}
                onClick={isSetup ? (e) => {
                  e.stopPropagation();
                  handleRemoveClick(index);
                } : undefined}
              >
                {index + 1}
              </div>
            </div>
          );
        })}

        {/* Overlay for better visual feedback */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Click counter */}
      <div className="mt-4 text-center">
        <span className="text-lg font-semibold text-gray-700">
          Clicks: {clicks.length} / {maxClicks}
        </span>
        {isSetup && clicks.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Click on a numbered circle to remove it
          </p>
        )}
      </div>
    </div>
  );
};

export default VisualPasswordImage;
