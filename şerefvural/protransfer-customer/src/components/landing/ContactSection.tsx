'use client';

import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

export default function ContactSection() {
  const whatsappPhone = CONTACT_CONFIG.whatsapp.phoneNumber;
  const dailyDriverMsg = encodeURIComponent('Günlük şoför hizmeti hakkında bilgi almak istiyorum');
  const intercityMsg = encodeURIComponent('Şehirler arası transfer hakkında bilgi almak istiyorum');
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            İletişim
          </h2>
          <p className="text-lg text-gray-600">
            Bizimle iletişime geçin
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* WhatsApp */}
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              WhatsApp
            </h3>
            <p className="text-gray-600 mb-4">
              Hızlı cevap için WhatsApp'tan yazın
            </p>
            <a 
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              +90 554 581 20 34
            </a>
          </div>

          {/* Telefon */}
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Telefon
            </h3>
            <p className="text-gray-600 mb-4">
              7/24 telefon desteği
            </p>
            <a 
              href="tel:+905545812034"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              +90 554 581 20 34
            </a>
          </div>

          {/* Adresler */}
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Hizmet Alanları
            </h3>
            <div className="text-gray-600 space-y-1">
              <p>İstanbul Havalimanı (IST)</p>
              <p>Sabiha Gökçen (SAW)</p>
              <p>Beşiktaş, İstanbul</p>
            </div>
          </div>
        </div>

        {/* Ek Hizmetler */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Günlük Şoför */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Günlük Şoför Hizmeti
            </h3>
            <p className="text-gray-600 mb-4">
              Şehir içi ve şehirler arası günlük şoför hizmeti. 8 saatlik paketler halinde esnek rota planlaması.
            </p>
            <a 
              href={`https://wa.me/${whatsappPhone}?text=${dailyDriverMsg}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              WhatsApp'tan Fiyat Al
            </a>
          </div>

          {/* Şehirler Arası Transfer */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Şehirler Arası Transfer
            </h3>
            <p className="text-gray-600 mb-4">
              İstanbul'dan Ankara, İzmir, Bursa, Antalya'ya konforlu transfer. VIP Mercedes Vito ve lüks sedan seçenekleri.
            </p>
            <a 
              href={`https://wa.me/${whatsappPhone}?text=${intercityMsg}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Detaylı Bilgi Al
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

