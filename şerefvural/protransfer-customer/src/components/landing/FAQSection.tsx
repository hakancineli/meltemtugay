'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Rezervasyon nasıl yapılır?",
    answer: "Rezervasyon yapmak için 'Rezervasyon Yap' butonuna tıklayın veya WhatsApp'tan bizimle iletişime geçin. Size en uygun zamanı belirleyip rezervasyonunuzu oluşturuyoruz.",
    category: "Genel"
  },
  {
    question: "Fiyatlar sabit mi?",
    answer: "Evet, fiyatlarımız tamamen sabittir. Konumları girdiğiniz anda ücretinizi anında görürsünüz. Hiçbir sürpriz ücret yoktur.",
    category: "Genel"
  },
  {
    question: "Uçuş gecikmesi durumunda ne olur?",
    answer: "Uçuşunuzu takip ederiz ve gecikme durumunda ek ücret almadan bekleriz. Müşteri memnuniyeti bizim önceliğimizdir.",
    category: "Transfer"
  },
  {
    question: "Bagaj limiti var mı?",
    answer: "Mercedes Vito araçlarımız geniş bagaj kapasitesine sahiptir. Normal seyahat bagajları için limit yoktur. Özel eşyalar için önceden bilgi veriniz.",
    category: "Transfer"
  },
  {
    question: "Bebek koltuğu mevcut mu?",
    answer: "Evet, bebek koltuğu hizmetimiz mevcuttur. Rezervasyon yaparken bu talebinizi belirtmeniz yeterlidir.",
    category: "Transfer"
  },
  {
    question: "Turlar kaç kişilik gruplarla yapılıyor?",
    answer: "Turlarımız 7 kişilik Mercedes Vito araçlarla yapılmaktadır. Grup turları için özel fiyatlandırma mevcuttur.",
    category: "Tur"
  },
  {
    question: "Tur rehberi Türkçe mi?",
    answer: "Evet, tüm turlarımızda profesyonel Türkçe rehber hizmeti veriyoruz. İngilizce rehber talebi için önceden bilgi veriniz.",
    category: "Tur"
  },
  {
    question: "Tur sırasında yemek dahil mi?",
    answer: "Tur fiyatlarımızda yemek dahil değildir. Ancak güzergah üzerindeki restoranlarda öğle yemeği molası veriyoruz.",
    category: "Tur"
  },
  {
    question: "Hava durumu kötü olursa tur iptal edilir mi?",
    answer: "Güvenlik nedeniyle aşırı hava koşullarında turlar iptal edilebilir. Bu durumda ücret iadesi yapılır veya başka tarihe ertelenir.",
    category: "Tur"
  },
  {
    question: "Otel rezervasyonlarında iptal politikası nedir?",
    answer: "Otel rezervasyonlarında 48 saat önceden iptal edilen rezervasyonlar için ücret alınmaz. Son dakika iptalleri için belirli koşullar geçerlidir.",
    category: "Otel"
  },
  {
    question: "Otellerde WiFi ücretsiz mi?",
    answer: "Evet, tüm otellerimizde ücretsiz WiFi hizmeti mevcuttur. Ayrıca otopark, kahvaltı ve aile dostu hizmetler sunuyoruz.",
    category: "Otel"
  },
  {
    question: "Otel odalarında klima var mı?",
    answer: "Evet, tüm odalarımızda klima sistemi mevcuttur. Ayrıca modern konfor ve temizlik standartlarımızla hizmet veriyoruz.",
    category: "Otel"
  },
  {
    question: "Ödeme nasıl yapılır?",
    answer: "Nakit, kredi kartı veya havale ile ödeme yapabilirsiniz. Ödeme seçenekleri rezervasyon sırasında belirlenir.",
    category: "Genel"
  },
  {
    question: "Grup rezervasyonu yapılabilir mi?",
    answer: "Evet, grup rezervasyonları için özel fiyatlandırma yapıyoruz. WhatsApp'tan bizimle iletişime geçerek detayları öğrenebilirsiniz.",
    category: "Genel"
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Sık Sorulan Sorular
          </h2>
          <p className="text-lg text-gray-600">
            Merak ettiğiniz soruların cevapları
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    faq.category === 'Transfer' ? 'bg-blue-100 text-blue-800' :
                    faq.category === 'Tur' ? 'bg-green-100 text-green-800' :
                    faq.category === 'Otel' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {faq.category}
                  </span>
                </div>
                {openIndex === index ? (
                  <ChevronUp className="text-gray-500" size={20} />
                ) : (
                  <ChevronDown className="text-gray-500" size={20} />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

