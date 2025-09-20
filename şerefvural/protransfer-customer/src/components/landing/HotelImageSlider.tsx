'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HotelImageSliderProps {
  hotelId: string;
  images: string[];
  alt: string;
  className?: string;
}

export default function HotelImageSlider({ hotelId, images, alt, className = "" }: HotelImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  // Otomatik geçiş
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Otomatik geçiş süresi 5 saniye

    return () => clearInterval(interval);
  }, [images.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (images.length === 0) {
    return (
      <div className={`relative bg-gray-200 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <span className="text-sm">{t('hotels.noImage')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all duration-200 z-10"
            aria-label={t('vehicleSlider.prevVehicle')}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all duration-200 z-10"
            aria-label={t('vehicleSlider.nextVehicle')}
          >
            <ChevronRight size={16} />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentIndex === index ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`${t('vehicleSlider.goToVehicle')} ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}

