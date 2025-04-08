import React, { useState, useEffect, memo } from 'react';
import { createImagePlaceholder, preloadImage } from '../utils/imageUtils';

const OptimizedImage = memo(({ src, alt, className, width = 400, height = 300 }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        await preloadImage(src);
        setImageSrc(src);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading image:', error);
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      setImageSrc(null);
    };
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          className={`w-full h-full transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;