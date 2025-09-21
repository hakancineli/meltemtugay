'use client';

import { MapPin, Clock, Users, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import TourImageSlider from './TourImageSlider';
import { openWhatsApp, createTourMessage } from '@/utils/whatsapp';

export default function DailyToursSection() {
  const { t } = useLanguage();
  const { tours, showPrices } = useData();

  const handleWhatsAppBooking = (tour: any) => {
    const message = createTourMessage(tour);
    openWhatsApp(message);
  };

  // Sadece aktif turları göster
  const activeTours = tours.filter(tour => tour.isActive);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            {t('tours.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('tours.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative h-48 bg-gray-200">
                <TourImageSlider
                  tourId={tour.id}
                  images={tour.images}
                  alt={tour.name}
                  className="w-full h-full"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-semibold text-gray-900">{tour.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{tour.name}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {tour.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2 text-green-600" />
                    <span>{t('tours.capacity')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    <span>{t('tours.departure')}</span>
                  </div>
                </div>
                
              <div className="flex items-center justify-between">
                {showPrices && (
                  <div className="text-2xl font-bold text-green-600">
                    {tour.currency === 'USD' ? '$' : tour.currency === 'EUR' ? '€' : '₺'}{tour.price}
                  </div>
                )}
                  <button 
                    onClick={() => handleWhatsAppBooking(tour)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    {t('tours.bookNow')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            {t('tours.viewAll')}
          </button>
        </div>
      </div>
    </section>
  );
}
