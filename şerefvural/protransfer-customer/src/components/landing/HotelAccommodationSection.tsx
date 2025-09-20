'use client';

import { MapPin, Star, Wifi, Car, Coffee, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import HotelImageSlider from './HotelImageSlider';
import { openWhatsApp, createHotelMessage } from '@/utils/whatsapp';

export default function HotelAccommodationSection() {
  const { t } = useLanguage();
  const { hotels } = useData();

  const handleWhatsAppBooking = (hotel: any) => {
    const message = createHotelMessage(hotel);
    openWhatsApp(message);
  };

  // Sadece aktif otelleri göster
  const activeHotels = hotels.filter(hotel => hotel.isActive);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            {t('hotels.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('hotels.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col"
            >
              <div className="relative h-48 bg-gray-200">
                <HotelImageSlider
                  hotelId={hotel.id}
                  images={hotel.images}
                  alt={hotel.name}
                  className="w-full h-full"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-semibold text-gray-900">
                    {hotel.rating}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {hotel.description}
                </p>

                <div className="space-y-2 mb-4">
                  {hotel.features.map((feature, index) => {
                    const getFeatureIcon = (featureName: string) => {
                      switch (featureName) {
                        case 'Free WiFi': return <Wifi className="w-4 h-4 mr-2 text-green-600" />;
                        case 'Parking': return <Car className="w-4 h-4 mr-2 text-green-600" />;
                        case 'Breakfast': return <Coffee className="w-4 h-4 mr-2 text-green-600" />;
                        case 'Family Friendly': return <Users className="w-4 h-4 mr-2 text-green-600" />;
                        default: return <Star className="w-4 h-4 mr-2 text-green-600" />;
                      }
                    };
                    
                    return (
                      <div key={index} className="flex items-center text-sm text-gray-500">
                        {getFeatureIcon(feature)}
                        <span>{feature}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 mt-auto">
                  <div className="text-2xl font-bold text-green-600">
                    {hotel.currency === 'USD' ? '$' : hotel.currency === 'EUR' ? '€' : '₺'}{hotel.price}
                  </div>
                  <button 
                    onClick={() => handleWhatsAppBooking(hotel)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    {t('hotels.bookNow')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            {t('hotels.viewAll')}
          </button>
        </div>
      </div>
    </section>
  );
}
