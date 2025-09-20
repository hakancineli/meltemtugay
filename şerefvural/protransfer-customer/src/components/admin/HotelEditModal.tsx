'use client';

import { useState, useEffect } from 'react';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';

interface HotelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel?: {
    id: string;
    name: string;
    description: string;
    location: string;
    price: string;
    currency?: string;
    features: string[];
    images: string[];
  };
  onSave: (hotelData: any) => void;
}

export default function HotelEditModal({ isOpen, onClose, hotel, onSave }: HotelEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    currency: 'TRY',
    features: ['Free WiFi', 'Parking', 'Breakfast', 'Family Friendly'],
    images: []
  });

  // Hotel verilerini form'a yükle
  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || '',
        description: hotel.description || '',
        location: hotel.location || '',
        price: hotel.price || '',
        currency: hotel.currency || 'TRY',
        features: hotel.features || ['Free WiFi', 'Parking', 'Breakfast', 'Family Friendly'],
        images: hotel.images || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        location: '',
        price: '',
        currency: 'TRY',
        features: ['Free WiFi', 'Parking', 'Breakfast', 'Family Friendly'],
        images: []
      });
    }
  }, [hotel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const availableFeatures = [
    'Free WiFi',
    'Parking',
    'Breakfast',
    'Family Friendly',
    'Pool',
    'Gym',
    'Spa',
    'Restaurant'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 border-4 border-blue-500" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {hotel ? 'Otel Düzenle' : 'Yeni Otel Ekle'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Otel Adı
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konum
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Örn: Sultanahmet, İstanbul"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat
              </label>
              <div className="flex">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="TRY">₺</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: 2,800/gece"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Otel hakkında detaylı bilgi..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özellikler
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableFeatures.map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Save size={16} className="inline mr-2" />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}