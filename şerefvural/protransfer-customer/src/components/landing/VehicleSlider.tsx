'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

const vehicleImages = [
  '/images/mercedes-vito-1.jpg',
  '/images/mercedes-vito-2.jpg',
  '/images/mercedes-vito-3.jpg',
  '/images/mercedes-vito-4.jpg',
  '/images/mercedes-vito-5.jpg',
  '/images/mercedes-vito-6.jpg',
  '/images/mercedes-vito-7.jpg',
  '/images/mercedes-vito-8.jpg',
  '/images/mercedes-vito-9.jpg',
  '/images/mercedes-vito-10.jpg',
];

export default function VehicleSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === vehicleImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? vehicleImages.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === vehicleImages.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Ana Slider Container */}
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {vehicleImages.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="relative h-64 sm:h-80 md:h-96">
                <Image
                  src={image}
                  alt={`Mercedes Vito ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
          aria-label="Önceki araç"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
          aria-label="Sonraki araç"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {vehicleImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-green-600 scale-110' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Araç ${index + 1}'e git`}
          />
        ))}
      </div>

      {/* Araç Bilgisi */}
      <div className="mt-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('vehicleSlider.title')}
        </h3>
        <p className="text-gray-600">
          {t('vehicleSlider.description')}
        </p>
      </div>
    </div>
  );
}
