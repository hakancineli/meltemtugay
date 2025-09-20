'use client';

import { Star } from 'lucide-react';

const reviews = [
  {
    name: "Ahmet Y.",
    rating: 5,
    comment: "Çok profesyonel hizmet. Şoförümüz çok nazikti ve zamanında geldi. Kesinlikle tavsiye ederim.",
    date: "2 gün önce",
    service: "Transfer"
  },
  {
    name: "Fatma K.",
    rating: 5,
    comment: "Uçuşum gecikmişti ama şoförümüz sabırla bekledi. Araç çok temiz ve konforluydu.",
    date: "1 hafta önce",
    service: "Transfer"
  },
  {
    name: "Mehmet S.",
    rating: 5,
    comment: "İstanbul Havalimanı'ndan şehir merkezine çok rahat bir yolculuk yaptık. Teşekkürler Şeref Vural Travel.",
    date: "2 hafta önce",
    service: "Transfer"
  },
  {
    name: "Ayşe M.",
    rating: 5,
    comment: "Bebek koltuğu talebimizi hemen karşıladılar. Çok memnun kaldık.",
    date: "3 hafta önce",
    service: "Transfer"
  },
  {
    name: "Can T.",
    rating: 5,
    comment: "Fiyatlar çok uygun ve şeffaf. Hiç sürpriz yaşamadık. Harika hizmet!",
    date: "1 ay önce",
    service: "Transfer"
  },
  {
    name: "Zeynep A.",
    rating: 5,
    comment: "WhatsApp'tan çok hızlı cevap aldık. Rezervasyon süreci çok kolaydı.",
    date: "1 ay önce",
    service: "Transfer"
  },
  {
    name: "Elif D.",
    rating: 5,
    comment: "İstanbul turu muhteşemdi! Rehberimiz çok bilgiliydi. Sultanahmet ve Ayasofya'yı çok güzel anlattı.",
    date: "1 hafta önce",
    service: "Tur"
  },
  {
    name: "Oğuz K.",
    rating: 5,
    comment: "Sapanca turu harikaydı! Doğa çok güzeldi, rehberimiz çok ilgiliydi. Kesinlikle tekrar geleceğiz.",
    date: "2 hafta önce",
    service: "Tur"
  },
  {
    name: "Selin M.",
    rating: 5,
    comment: "Bursa turu çok eğlenceliydi! Uludağ manzarası muhteşemdi. Ailecek çok memnun kaldık.",
    date: "3 hafta önce",
    service: "Tur"
  },
  {
    name: "Murat B.",
    rating: 5,
    comment: "Abant turu doğa severler için mükemmel! Temiz hava ve güzel manzaralar. Çok rahatladık.",
    date: "1 ay önce",
    service: "Tur"
  },
  {
    name: "Deniz A.",
    rating: 5,
    comment: "Sultanahmet Palace Hotel'de kaldık. Çok lüks ve konforluydu. Personel çok ilgiliydi.",
    date: "1 hafta önce",
    service: "Otel"
  },
  {
    name: "Cem Y.",
    rating: 5,
    comment: "Bosphorus View Hotel'den Boğaz manzarası muhteşemdi! Kahvaltı çok güzeldi. Tekrar kalacağız.",
    date: "2 hafta önce",
    service: "Otel"
  },
  {
    name: "Gülşen T.",
    rating: 5,
    comment: "Old City Inn'de geleneksel Türk mimarisini yaşadık. Çok sıcak bir atmosfer. Tavsiye ederim.",
    date: "3 hafta önce",
    service: "Otel"
  },
  {
    name: "Berk H.",
    rating: 5,
    comment: "Modern Istanbul Hotel'de kaldık. Çok modern ve temizdi. WiFi hızı mükemmeldi.",
    date: "1 ay önce",
    service: "Otel"
  }
];

export default function ReviewsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Müşteri Yorumları
          </h2>
          <p className="text-lg text-gray-600">
            Müşterilerimizin deneyimlerini okuyun
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.service === 'Transfer' ? 'bg-blue-100 text-blue-800' :
                    review.service === 'Tur' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {review.service}
                  </span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                "{review.comment}"
              </p>
              
              <div className="text-sm font-semibold text-gray-900">
                {review.name}
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center bg-white px-6 py-3 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-900">4.9/5</span>
            </div>
            <span className="ml-4 text-gray-600">Google Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}

