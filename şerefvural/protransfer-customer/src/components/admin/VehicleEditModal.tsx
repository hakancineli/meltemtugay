'use client';

import { useState, useEffect } from 'react';
import { X, Car, Users, Wifi, Snowflake } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: string;
  currency: string;
  features: string[];
  isAvailable: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface VehicleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSave: (vehicleData: any) => void;
}

export default function VehicleEditModal({ isOpen, onClose, vehicle, onSave }: VehicleEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: 4,
    price: '',
    currency: 'TRY',
    features: ['Klima', 'WiFi'],
    isAvailable: true,
    images: []
  });



  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        type: vehicle.type || '',
        capacity: vehicle.capacity || 4,
        price: vehicle.price || '',
        currency: vehicle.currency || 'TRY',
        features: vehicle.features || ['Klima', 'WiFi'],
        isAvailable: vehicle.isAvailable !== undefined ? vehicle.isAvailable : true,
        images: vehicle.images || []
      });
    } else {
      setFormData({
        name: '',
        type: '',
        capacity: 4,
        price: '',
        currency: 'TRY',
        features: ['Klima', 'WiFi'],
        isAvailable: true,
        images: []
      });
    }
  }, [vehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseInt(value) || 0) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
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
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'WiFi':
        return <Wifi size={16} className="text-green-600" />;
      case 'Klima':
        return <Snowflake size={16} className="text-green-600" />;
      case 'Bebek Koltuğu':
        return <Users size={16} className="text-green-600" />;
      default:
        return <Car size={16} className="text-green-600" />;
    }
  };

  const availableFeatures = [
    'Klima', 'WiFi', 'Bebek Koltuğu', 'GPS', 'USB Şarj', 'Deri Koltuk', 'Ses Sistemi', 'Güneşlik'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-transparent" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {vehicle ? 'Araç Düzenle' : 'Yeni Araç Ekle'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol Kolon - Temel Bilgiler */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Araç Adı
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Örn: Mercedes Vito"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Araç Tipi
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Araç tipi seçin</option>
                      <option value="Minivan">Minivan</option>
                      <option value="Minibus">Minibus</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kapasite
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="1"
                      max="20"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fiyat
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Örn: 1,500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Para Birimi
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="TRY">TRY</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Müsait
                    </label>
                  </div>
                </div>

                {/* Sağ Kolon - Özellikler ve Görseller */}
                <div className="space-y-4">
                  <div>
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
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 flex items-center">
                            {getFeatureIcon(feature)}
                            <span className="ml-1">{feature}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <ImageUploader
                      images={formData.images}
                      onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                      maxImages={10}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              >
                {vehicle ? 'Güncelle' : 'Oluştur'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                İptal
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}
