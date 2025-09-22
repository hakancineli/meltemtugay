// Contact configuration
export const CONTACT_CONFIG = {
  whatsapp: {
    phoneNumber: "905319458931", // Gerçek WhatsApp numarası buraya yazılacak
    message: {
      transfer: {
        greeting: "Merhaba! İstanbul Havalimanı transfer hizmeti için rezervasyon yapmak istiyorum.",
        service: "İstanbul Havalimanı Transfer",
        vehicle: "Mercedes Vito (7 kişilik)",
        features: "Klima, WiFi, Profesyonel şoför"
      },
      tour: {
        greeting: "Merhaba! {tourName} turu için rezervasyon yapmak istiyorum.",
        details: "Detaylar:",
        tour: "Tur: {tourName}",
        duration: "Süre: {duration}",
        price: "Fiyat: {price}",
        description: "Açıklama: {description}"
      },
      hotel: {
        greeting: "Merhaba! {hotelName} oteli için rezervasyon yapmak istiyorum.",
        details: "Detaylar:",
        hotel: "Otel: {hotelName}",
        location: "Konum: {location}",
        price: "Fiyat: {price}",
        description: "Açıklama: {description}"
      },
      closing: "Lütfen benimle iletişime geçin. Teşekkürler!"
    }
  }
};

