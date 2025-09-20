import { CONTACT_CONFIG } from '@/config/contact';

export const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsapp.phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

export const createTransferMessage = () => {
  const { transfer } = CONTACT_CONFIG.whatsapp.message;
  
  return `${transfer.greeting}

Hizmet: ${transfer.service}
Araç: ${transfer.vehicle}
Özellikler: ${transfer.features}

${transfer.closing}`;
};

export const createTourMessage = (tour: {
  name: string;
  duration: string;
  price: string;
  description: string;
}) => {
  const { tour: tourTemplate } = CONTACT_CONFIG.whatsapp.message;
  
  return `${tourTemplate.greeting.replace('{tourName}', tour.name)}

${tourTemplate.details}

${tourTemplate.tour.replace('{tourName}', tour.name)}
${tourTemplate.duration.replace('{duration}', tour.duration)}
${tourTemplate.price.replace('{price}', tour.price)}
${tourTemplate.description.replace('{description}', tour.description)}

${tourTemplate.closing}`;
};

export const createHotelMessage = (hotel: {
  name: string;
  location: string;
  price: string;
  description: string;
}) => {
  const { hotel: hotelTemplate } = CONTACT_CONFIG.whatsapp.message;
  
  return `${hotelTemplate.greeting.replace('{hotelName}', hotel.name)}

${hotelTemplate.details}

${hotelTemplate.hotel.replace('{hotelName}', hotel.name)}
${hotelTemplate.location.replace('{location}', hotel.location)}
${hotelTemplate.price.replace('{price}', hotel.price)}
${hotelTemplate.description.replace('{description}', hotel.description)}

${hotelTemplate.closing}`;
};
