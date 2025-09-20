'use client';

import { MessageCircle, Calendar } from 'lucide-react';
import VehicleSlider from './VehicleSlider';
import { useLanguage } from '@/contexts/LanguageContext';
import { openWhatsApp, createTransferMessage } from '@/utils/whatsapp';

export default function HeroSection() {
  const { t } = useLanguage();

  const handleWhatsAppTransfer = () => {
    const message = createTransferMessage();
    openWhatsApp(message);
  };

  const handleReservationTransfer = () => {
    const message = createTransferMessage();
    openWhatsApp(message);
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Sol Taraf - İçerik */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              {t('landing.title')}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              {t('landing.description')}
            </p>

            {/* CTA Butonları */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={handleReservationTransfer}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Calendar className="mr-2" size={20} />
                {t('landing.cta.reservation')}
              </button>
              
              <button 
                onClick={handleWhatsAppTransfer}
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <MessageCircle className="mr-2" size={20} />
                {t('landing.cta.whatsapp')}
              </button>
            </div>

            {/* Özellik Kartları */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-green-600 font-semibold mb-1">{t('landing.features.service24')}</div>
                <div className="text-sm text-gray-600">{t('landing.features.service24Desc')}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-green-600 font-semibold mb-1">{t('landing.features.fixedPrice')}</div>
                <div className="text-sm text-gray-600">{t('landing.features.fixedPriceDesc')}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-green-600 font-semibold mb-1">{t('landing.features.professionalDriver')}</div>
                <div className="text-sm text-gray-600">{t('landing.features.professionalDriverDesc')}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-green-600 font-semibold mb-1">{t('landing.features.capacity')}</div>
                <div className="text-sm text-gray-600">{t('landing.features.capacityDesc')}</div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - VehicleSlider */}
          <div className="lg:pl-8">
            <VehicleSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
