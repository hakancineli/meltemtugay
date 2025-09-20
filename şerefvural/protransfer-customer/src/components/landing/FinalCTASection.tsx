'use client';

import { Calendar, MessageCircle } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="py-16 bg-green-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
          Hazır mısınız?
        </h2>
        
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          İstanbul Havalimanı transfer hizmetimizden yararlanmaya hazır olduğunuzu belirten metin. 
          Profesyonel ekibimiz ve konforlu araçlarımızla güvenli bir yolculuk için rezervasyon yapın.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white hover:bg-gray-100 text-green-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <Calendar className="mr-2" size={20} />
            Rezervasyon Talebi Gönder
          </button>
          
          <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center">
            <MessageCircle className="mr-2" size={20} />
            WhatsApp'tan Yaz
          </button>
        </div>

        {/* Güven Göstergeleri */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">500+</div>
            <div className="text-green-100">Mutlu Müşteri</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">7/24</div>
            <div className="text-green-100">Hizmet</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
            <div className="text-green-100">Müşteri Puanı</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">100%</div>
            <div className="text-green-100">Güvenli Transfer</div>
          </div>
        </div>
      </div>
    </section>
  );
}

