'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Building,
  Wifi,
  Car,
  Coffee,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  DollarSign,
  XCircle
} from 'lucide-react';
import HotelEditModal from '@/components/admin/HotelEditModal';
import { useData, type Hotel } from '@/contexts/DataContext';

export default function HotelsPage() {
  const { hotels, updateHotel, loading, showPrices, setShowPrices } = useData();
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    setFilteredHotels(hotels);
  }, [hotels]);

  useEffect(() => {
    let filtered = hotels;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(hotel => 
        statusFilter === 'active' ? hotel.isActive : !hotel.isActive
      );
    }

    setFilteredHotels(filtered);
  }, [searchTerm, statusFilter, hotels]);

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'Free WiFi':
        return <Wifi size={16} className="text-green-600" />;
      case 'Parking':
        return <Car size={16} className="text-green-600" />;
      case 'Breakfast':
        return <Coffee size={16} className="text-green-600" />;
      case 'Family Friendly':
        return <Users size={16} className="text-green-600" />;
      default:
        return <Star size={16} className="text-green-600" />;
    }
  };

  const handleViewHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  const handleToggleStatus = (id: string) => {
    setHotels(prev => 
      prev.map(hotel => 
        hotel.id === id 
          ? { ...hotel, isActive: !hotel.isActive }
          : hotel
      )
    );
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setShowEditModal(true);
  };

  const handleSaveHotel = (hotelData: any) => {
    if (editingHotel) {
      // Update existing hotel
      const updatedHotel: Hotel = {
        ...editingHotel,
        ...hotelData,
        updatedAt: new Date().toISOString()
      };
      updateHotel(updatedHotel);
    }
    
    setShowEditModal(false);
    setEditingHotel(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Otel Yönetimi</h1>
          <p className="text-gray-600">Tüm otelleri görüntüleyin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Toplam: {filteredHotels.length} otel
          </div>
          <button
            onClick={() => setShowPrices(!showPrices)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              showPrices 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <DollarSign size={20} className="mr-2" />
            {showPrices ? 'Fiyatları Gizle' : 'Fiyatları Göster'}
          </button>
          <button
            onClick={() => {
              setEditingHotel(null);
              setShowEditModal(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Yeni Otel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Otel adı, açıklama veya konum ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Dışa Aktar
            </button>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-gray-200">
              {hotel.images.length > 0 ? (
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  hotel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {hotel.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="absolute top-4 left-4 flex items-center">
                <Star size={16} className="text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-semibold text-white bg-black/50 px-2 py-1 rounded">
                  {hotel.rating}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{hotel.name}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{hotel.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MapPin size={16} className="mr-2 text-green-600" />
                <span>{hotel.location}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Özellikler:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hotel.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      {getFeatureIcon(feature)}
                      <span className="ml-1">{feature}</span>
                    </div>
                  ))}
                  {hotel.features.length > 2 && (
                    <span className="text-xs text-gray-500">+{hotel.features.length - 2} daha</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                {showPrices ? (
                  <div className="text-xl font-bold text-green-600">
                    {hotel.currency === 'USD' ? '$' : hotel.currency === 'EUR' ? '€' : '₺'}{hotel.price}
                  </div>
                ) : (
                  <div className="text-xl font-bold text-gray-400">
                    Fiyat Gizli
                  </div>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewHotel(hotel)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleEditHotel(hotel)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hotel Detail Modal */}
      {showModal && selectedHotel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Otel Detayları</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Otel Bilgileri</h4>
                      <p className="text-sm text-gray-600 mb-1"><strong>Ad:</strong> {selectedHotel.name}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Konum:</strong> {selectedHotel.location}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Fiyat:</strong> {selectedHotel.price}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Puan:</strong> {selectedHotel.rating}/5</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Durum</h4>
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          selectedHotel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedHotel.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Oluşturulma:</strong> {new Date(selectedHotel.createdAt).toLocaleDateString('tr-TR')}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Güncellenme:</strong> {new Date(selectedHotel.updatedAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Açıklama</h4>
                    <p className="text-sm text-gray-600">{selectedHotel.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Özellikler</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedHotel.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          {getFeatureIcon(feature)}
                          <span className="ml-2">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Görseller ({selectedHotel.images.length})</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedHotel.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedHotel.name} ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleToggleStatus(selectedHotel.id)}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                    selectedHotel.isActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {selectedHotel.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hotel Edit Modal */}
      <HotelEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingHotel(null);
        }}
        hotel={editingHotel}
        onSave={handleSaveHotel}
      />
    </div>
  );
}

