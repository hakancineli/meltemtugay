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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrices, setShowPrices] = useState(true);

  // Mock data - gerçek uygulamada API'den gelecek
  const mockTours: Tour[] = [
    {
      id: '1',
      name: 'İstanbul Turu',
      description: 'Sultanahmet, Ayasofya, Topkapı Sarayı ve Kapalıçarşı\'yı keşfedin',
      duration: '8 saat',
      price: '2,500',
      currency: 'TRY',
      rating: 4.9,
      images: [
        '/serefvip/istanbul/istanbul.jpeg',
        '/serefvip/istanbul/1-1.jpeg',
        '/serefvip/istanbul/2-2.jpeg',
        '/serefvip/istanbul/3-3.jpeg',
        '/serefvip/istanbul/4-4.jpeg',
        '/serefvip/istanbul/5-5.jpeg',
        '/serefvip/istanbul/6-6.jpeg',
        '/serefvip/istanbul/7-7.jpg',
        '/serefvip/istanbul/9-9.jpeg',
        '/serefvip/istanbul/11-11.jpeg',
        '/serefvip/istanbul/12-12.jpeg'
      ],
      isActive: true,
      capacity: 7,
      departure: 'İstanbul\'dan kalkış',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Sapanca Turu',
      description: 'Doğal güzellikleri ve temiz havasıyla ünlü Sapanca Gölü',
      duration: '10 saat',
      price: '3,200',
      currency: 'TRY',
      rating: 4.8,
      images: [
        '/serefvip/sapanca/1-1.jpeg',
        '/serefvip/sapanca/2-2.jpeg',
        '/serefvip/sapanca/3-3.jpeg',
        '/serefvip/sapanca/4-4.jpeg',
        '/serefvip/sapanca/5-5.jpeg',
        '/serefvip/sapanca/6-6.jpeg',
        '/serefvip/sapanca/7-7.jpeg',
        '/serefvip/sapanca/8-8.jpeg',
        '/serefvip/sapanca/9-9.jpeg',
        '/serefvip/sapanca/10-10.jpeg'
      ],
      isActive: true,
      capacity: 7,
      departure: 'İstanbul\'dan kalkış',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    },
    {
      id: '3',
      name: 'Bursa Turu',
      description: 'Osmanlı\'nın ilk başkenti, Uludağ ve tarihi çarşılar',
      duration: '12 saat',
      price: '3,800',
      currency: 'TRY',
      rating: 4.7,
      images: [
        '/serefvip/bursa/1-1.jpeg',
        '/serefvip/bursa/2-2.jpeg',
        '/serefvip/bursa/3-3.jpeg',
        '/serefvip/bursa/4-4.jpeg',
        '/serefvip/bursa/5-5.jpeg',
        '/serefvip/bursa/6-6.jpeg',
        '/serefvip/bursa/7-7.jpeg',
        '/serefvip/bursa/8-8.jpeg',
        '/serefvip/bursa/9-9.jpeg',
        '/serefvip/bursa/11-11.jpeg',
        '/serefvip/bursa/12-12.jpeg',
        '/serefvip/bursa/13-13.jpeg'
      ],
      isActive: true,
      capacity: 7,
      departure: 'İstanbul\'dan kalkış',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-17T09:15:00Z'
    },
    {
      id: '4',
      name: 'Abant Turu',
      description: 'Muhteşem doğası ve temiz havasıyla Abant Gölü',
      duration: '10 saat',
      price: '3,500',
      currency: 'TRY',
      rating: 4.8,
      images: [
        '/serefvip/abant/1-1.jpeg',
        '/serefvip/abant/2-2.jpeg',
        '/serefvip/abant/3-3.jpeg',
        '/serefvip/abant/4-4.jpeg',
        '/serefvip/abant/5-5.jpeg',
        '/serefvip/abant/6-6.jpeg',
        '/serefvip/abant/7-7.jpg',
        '/serefvip/abant/8-8.jpg'
      ],
      isActive: true,
      capacity: 7,
      departure: 'İstanbul\'dan kalkış',
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z'
    }
  ];

  const mockHotels: Hotel[] = [
    {
      id: '1',
      name: 'Sultanahmet Palace Hotel',
      description: 'Luxury accommodation experience in the historic peninsula',
      location: 'Sultanahmet, Istanbul',
      price: '2,800/night',
      currency: 'TRY',
      rating: 4.9,
      images: ['/images/hotels/sultanahmet-palace.svg'],
      isActive: true,
      features: ['Free WiFi', 'Parking', 'Breakfast', 'Family Friendly'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Bosphorus View Hotel',
      description: 'Modern hotel with Bosphorus view',
      location: 'Beşiktaş, Istanbul',
      price: '3,200/night',
      currency: 'TRY',
      rating: 4.7,
      images: ['/images/hotels/bosphorus-hotel.svg'],
      isActive: true,
      features: ['Free WiFi', 'Parking', 'Breakfast', 'Family Friendly'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '3',
      name: 'Old City Inn',
      description: 'Boutique hotel in traditional Turkish architecture',
      location: 'Fatih, Istanbul',
      price: '1,800/night',
      currency: 'TRY',
      rating: 4.6,
      images: ['/images/hotels/old-city-inn.svg'],
      isActive: true,
      features: ['Free WiFi', 'Parking', 'Breakfast', 'Family Friendly'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '4',
      name: 'Modern Istanbul Hotel',
      description: 'Modern comfort in the heart of the city',
      location: 'Şişli, Istanbul',
      price: '2,200/night',
      currency: 'TRY',
      rating: 4.8,
      images: ['/images/hotels/modern-istanbul.svg'],
      isActive: true,
      features: ['Free WiFi', 'Parking', 'Breakfast', 'Family Friendly'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    }
  ];

  // LocalStorage'dan veri yükle
  useEffect(() => {
    const loadData = () => {
      try {
        // Cache version kontrolü - yeni versiyonda cache'i temizle
        const cacheVersion = localStorage.getItem('dataVersion');
        const currentVersion = '4.0'; // Gerçek serefvip fotoğrafları eklendi
        
        if (cacheVersion !== currentVersion) {
          localStorage.clear();
          localStorage.setItem('dataVersion', currentVersion);
        }
        
        const savedTours = localStorage.getItem('tours');
        const savedHotels = localStorage.getItem('hotels');
        
        if (savedTours) {
          setTours(JSON.parse(savedTours));
        } else {
          setTours(mockTours);
          localStorage.setItem('tours', JSON.stringify(mockTours));
        }
        
        if (savedHotels) {
          setHotels(JSON.parse(savedHotels));
        } else {
          setHotels(mockHotels);
          localStorage.setItem('hotels', JSON.stringify(mockHotels));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setTours(mockTours);
        setHotels(mockHotels);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Veri güncelleme fonksiyonları
  const updateTour = (updatedTour: Tour) => {
    setTours(prev => {
      const newTours = prev.map(tour => 
        tour.id === updatedTour.id ? { ...updatedTour, updatedAt: new Date().toISOString() } : tour
      );
      localStorage.setItem('tours', JSON.stringify(newTours));
      return newTours;
    });
  };

  const updateHotel = (updatedHotel: Hotel) => {
    setHotels(prev => {
      const newHotels = prev.map(hotel => 
        hotel.id === updatedHotel.id ? { ...updatedHotel, updatedAt: new Date().toISOString() } : hotel
      );
      localStorage.setItem('hotels', JSON.stringify(newHotels));
      return newHotels;
    });
  };

  const addTour = (newTour: Tour) => {
    setTours(prev => {
      const newTours = [...prev, { ...newTour, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
      localStorage.setItem('tours', JSON.stringify(newTours));
      return newTours;
    });
  };

  const addHotel = (newHotel: Hotel) => {
    setHotels(prev => {
      const newHotels = [...prev, { ...newHotel, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
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
    try {
      const savedTours = localStorage.getItem('tours');
      const savedHotels = localStorage.getItem('hotels');
      
      if (savedTours) {
        setTours(JSON.parse(savedTours));
      }
      if (savedHotels) {
        setHotels(JSON.parse(savedHotels));
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
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
    setShowPrices
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export type { Tour, Hotel };
