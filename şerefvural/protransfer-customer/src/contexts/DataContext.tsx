'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Tour {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  currency?: string;
  rating: number;
  images: string[];
  isActive: boolean;
  capacity: number;
  departure: string;
  createdAt: string;
  updatedAt: string;
}

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  price: string;
  currency?: string;
  rating: number;
  images: string[];
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface DataContextType {
  tours: Tour[];
  hotels: Hotel[];
  updateTour: (tour: Tour) => void;
  updateHotel: (hotel: Hotel) => void;
  addTour: (tour: Tour) => void;
  addHotel: (hotel: Hotel) => void;
  deleteTour: (id: string) => void;
  deleteHotel: (id: string) => void;
  refreshData: () => void;
  loading: boolean;
  showPrices: boolean;
  setShowPrices: (show: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Mock data
const mockTours: Tour[] = [
  {
    id: '1',
    name: 'İstanbul Tarihi Yarımada Turu',
    description: 'İstanbul\'un en önemli tarihi mekanlarını keşfedin. Ayasofya, Sultanahmet Camii, Topkapı Sarayı ve daha fazlası.',
    duration: '8 saat',
    price: '150',
    currency: 'TRY',
    rating: 4.8,
    images: [
      '/serefvip/istanbul/1-1.jpeg',
      '/serefvip/istanbul/2-2.jpeg',
      '/serefvip/istanbul/3-3.jpeg',
      '/serefvip/istanbul/4-4.jpeg',
      '/serefvip/istanbul/5-5.jpeg',
      '/serefvip/istanbul/6-6.jpeg',
      '/serefvip/istanbul/7-7.jpg',
      '/serefvip/istanbul/9-9.jpeg'
    ],
    isActive: true,
    capacity: 20,
    departure: 'Sultanahmet',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sapanca Doğa Turu',
    description: 'Sapanca Gölü çevresinde doğa yürüyüşü ve piknik. Temiz hava ve muhteşem manzara.',
    duration: '6 saat',
    price: '120',
    currency: 'TRY',
    rating: 4.6,
    images: [
      '/serefvip/sapanca/1-1.jpeg',
      '/serefvip/sapanca/2-2.jpeg',
      '/serefvip/sapanca/3-3.jpeg',
      '/serefvip/sapanca/4-4.jpeg',
      '/serefvip/sapanca/5-5.jpeg'
    ],
    isActive: true,
    capacity: 15,
    departure: 'Sapanca Merkez',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Bursa Tarihi ve Kültürel Tur',
    description: 'Osmanlı İmparatorluğu\'nun ilk başkenti Bursa\'yı keşfedin. Ulu Camii, Yeşil Türbe ve daha fazlası.',
    duration: '10 saat',
    price: '180',
    currency: 'TRY',
    rating: 4.7,
    images: [
      '/serefvip/bursa/1-1.jpeg',
      '/serefvip/bursa/2-2.jpeg',
      '/serefvip/bursa/3-3.jpeg',
      '/serefvip/bursa/4-4.jpeg',
      '/serefvip/bursa/5-5.jpeg'
    ],
    isActive: true,
    capacity: 18,
    departure: 'Bursa Merkez',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Abant Gölü Doğa Turu',
    description: 'Abant Gölü\'nde doğa yürüyüşü ve fotoğraf çekimi. Muhteşem doğa manzaraları.',
    duration: '7 saat',
    price: '140',
    currency: 'TRY',
    rating: 4.5,
    images: [
      '/serefvip/abant/1-1.jpeg',
      '/serefvip/abant/2-2.jpeg',
      '/serefvip/abant/3-3.jpeg',
      '/serefvip/abant/4-4.jpeg',
      '/serefvip/abant/5-5.jpeg'
    ],
    isActive: true,
    capacity: 12,
    departure: 'Abant Merkez',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Hotel İstanbul',
    description: 'Sultanahmet\'te lüks konaklama. Tarihi yarımadaya yürüme mesafesi.',
    location: 'Sultanahmet, İstanbul',
    price: '250',
    currency: 'TRY',
    rating: 4.9,
    images: [
      '/serefvip/istanbul/1-1.jpeg',
      '/serefvip/istanbul/2-2.jpeg',
      '/serefvip/istanbul/3-3.jpeg',
      '/serefvip/istanbul/4-4.jpeg'
    ],
    isActive: true,
    features: ['WiFi', 'Klima', 'Oda Servisi', 'Spa', 'Fitness'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sapanca Resort Hotel',
    description: 'Sapanca Gölü manzaralı doğa oteli. Huzurlu ve sakin bir tatil.',
    location: 'Sapanca, Sakarya',
    price: '180',
    currency: 'TRY',
    rating: 4.6,
    images: [
      '/serefvip/sapanca/1-1.jpeg',
      '/serefvip/sapanca/2-2.jpeg',
      '/serefvip/sapanca/3-3.jpeg',
      '/serefvip/sapanca/4-4.jpeg'
    ],
    isActive: true,
    features: ['WiFi', 'Klima', 'Havuz', 'Restoran', 'Park Alanı'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Bursa Thermal Hotel',
    description: 'Bursa\'da termal sularla ünlü lüks otel. Sağlık ve dinlenme.',
    location: 'Çekirge, Bursa',
    price: '220',
    currency: 'TRY',
    rating: 4.7,
    images: [
      '/serefvip/bursa/1-1.jpeg',
      '/serefvip/bursa/2-2.jpeg',
      '/serefvip/bursa/3-3.jpeg',
      '/serefvip/bursa/4-4.jpeg'
    ],
    isActive: true,
    features: ['WiFi', 'Klima', 'Termal Havuz', 'Spa', 'Sauna'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Abant Nature Hotel',
    description: 'Abant Gölü kıyısında doğa oteli. Temiz hava ve huzur.',
    location: 'Abant, Bolu',
    price: '160',
    currency: 'TRY',
    rating: 4.4,
    images: [
      '/serefvip/abant/1-1.jpeg',
      '/serefvip/abant/2-2.jpeg',
      '/serefvip/abant/3-3.jpeg',
      '/serefvip/abant/4-4.jpeg'
    ],
    isActive: true,
    features: ['WiFi', 'Klima', 'Restoran', 'Park Alanı', 'Bisiklet Kiralama'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrices, setShowPrices] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showPrices');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  // LocalStorage'dan veri yükle
  useEffect(() => {
    const loadData = () => {
      // Cache version kontrolü - yeni versiyonda cache'i temizle
      const cacheVersion = localStorage.getItem('dataVersion');
      const currentVersion = '9.0'; // Ayarlar ve fiyat gizleme düzeltildi
      
      if (cacheVersion !== currentVersion) {
        localStorage.clear();
        localStorage.setItem('dataVersion', currentVersion);
      }
      
      // Her zaman mock data'yı yükle (test için)
      setTours(mockTours);
      setHotels(mockHotels);
      localStorage.setItem('tours', JSON.stringify(mockTours));
      localStorage.setItem('hotels', JSON.stringify(mockHotels));
      setLoading(false);
    };

    loadData();
  }, []);

  // Veri güncelleme fonksiyonları
  const updateTour = (updatedTour: Tour) => {
    // Hemen local state'i güncelle
    setTours(prev => {
      const newTours = prev.map(tour => 
        tour.id === updatedTour.id ? { ...updatedTour, updatedAt: new Date().toISOString() } : tour
      );
      localStorage.setItem('tours', JSON.stringify(newTours));
      return newTours;
    });

    // API'ye async request gönder
    fetch(`/api/tours/${updatedTour.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTour)
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('API Error');
    }).then(updatedData => {
      setTours(prev => prev.map(tour => 
        tour.id === updatedTour.id ? updatedData : tour
      ));
    }).catch(error => {
      console.error('Error updating tour:', error);
    });
  };

  const updateHotel = (updatedHotel: Hotel) => {
    // Hemen local state'i güncelle
    setHotels(prev => {
      const newHotels = prev.map(hotel => 
        hotel.id === updatedHotel.id ? { ...updatedHotel, updatedAt: new Date().toISOString() } : hotel
      );
      localStorage.setItem('hotels', JSON.stringify(newHotels));
      return newHotels;
    });

    // API'ye async request gönder
    fetch(`/api/hotels/${updatedHotel.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedHotel)
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('API Error');
    }).then(updatedData => {
      setHotels(prev => prev.map(hotel => 
        hotel.id === updatedHotel.id ? updatedData : hotel
      ));
    }).catch(error => {
      console.error('Error updating hotel:', error);
    });
  };

  const addTour = (newTour: Tour) => {
    const tourWithId = { ...newTour, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setTours(prev => {
      const newTours = [...prev, tourWithId];
      localStorage.setItem('tours', JSON.stringify(newTours));
      return newTours;
    });
  };

  const addHotel = (newHotel: Hotel) => {
    const hotelWithId = { ...newHotel, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setHotels(prev => {
      const newHotels = [...prev, hotelWithId];
      localStorage.setItem('hotels', JSON.stringify(newHotels));
      return newHotels;
    });
  };

  const deleteTour = (id: string) => {
    setTours(prev => {
      const newTours = prev.filter(tour => tour.id !== id);
      localStorage.setItem('tours', JSON.stringify(newTours));
      return newTours;
    });
  };

  const deleteHotel = (id: string) => {
    setHotels(prev => {
      const newHotels = prev.filter(hotel => hotel.id !== id);
      localStorage.setItem('hotels', JSON.stringify(newHotels));
      return newHotels;
    });
  };

  const refreshData = () => {
    setLoading(true);
    // Cache'i temizle ve yeniden yükle
    localStorage.removeItem('tours');
    localStorage.removeItem('hotels');
    setTours(mockTours);
    setHotels(mockHotels);
    localStorage.setItem('tours', JSON.stringify(mockTours));
    localStorage.setItem('hotels', JSON.stringify(mockHotels));
    setLoading(false);
  };

  const handleSetShowPrices = (show: boolean) => {
    setShowPrices(show);
    if (typeof window !== 'undefined') {
      localStorage.setItem('showPrices', JSON.stringify(show));
    }
  };

  const value: DataContextType = {
    tours,
    hotels,
    updateTour,
    updateHotel,
    addTour,
    addHotel,
    deleteTour,
    deleteHotel,
    refreshData,
    loading,
    showPrices,
    setShowPrices: handleSetShowPrices
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}