'use client';

import { Clock, Shield, Baby, Building, CheckCircle, MapPin, Star, Users, Wifi, Car, Coffee } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Clock,
      title: "Uçuş Takibi",
      description: "Uçuşunuzu takip eder, gecikme durumunda bekleriz",
      category: "Transfer"
    },
    {
      icon: Shield,
      title: "Karşılama Hizmeti",
      description: "Havalimanında karşılar, bagajlarınızı taşırız",
      category: "Transfer"
    },
    {
      icon: Baby,
      title: "Bebek Koltuğu",
      description: "Bebek koltuğu ve özel taleplere hızlı cevap",
      category: "Transfer"
    },
    {
      icon: Building,
      title: "Kurumsal Transfer",
      description: "Kurumsal sözleşmeli transfer seçenekleri",
      category: "Transfer"
    },
    {
      icon: MapPin,
      title: "Profesyonel Rehber",
      description: "Deneyimli rehberlerimizle unutulmaz turlar",
      category: "Tur"
    },
    {
      icon: Star,
      title: "Kaliteli Konaklama",
      description: "Seçkin otellerimizde konforlu konaklama",
      category: "Otel"
    },
    {
      icon: Users,
      title: "Aile Dostu",
      description: "Tüm aile üyeleri için uygun hizmetler",
      category: "Genel"
    },
    {
      icon: Wifi,
      title: "Modern Konfor",
      description: "WiFi, klima ve modern konfor imkanları",
      category: "Otel"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Neden Şeref Vural Travel?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Profesyonel hizmet anlayışımız ve müşteri memnuniyeti odaklı yaklaşımımızla 
            İstanbul'un en güvenilir transfer, tur ve konaklama hizmeti sunuyoruz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-green-600" size={32} />
              </div>
              <div className="mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  feature.category === 'Transfer' ? 'bg-blue-100 text-blue-800' :
                  feature.category === 'Tur' ? 'bg-green-100 text-green-800' :
                  feature.category === 'Otel' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {feature.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Fiyat Bilgilendirmesi */}
        <div className="bg-green-50 rounded-xl p-8 text-center">
          <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Şeffaf Fiyatlandırma
          </h3>
          <p className="text-lg text-gray-700">
            Konumları girdiğiniz anda ücretinizi anında görün. Sabit fiyat, sürpriz yok.
          </p>
        </div>
      </div>
    </section>
  );
}

