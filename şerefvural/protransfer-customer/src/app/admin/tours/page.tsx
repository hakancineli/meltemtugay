'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  Calendar,
  XCircle
} from 'lucide-react';
import TourEditModal from '@/components/admin/TourEditModal';
import { useData, type Tour } from '@/contexts/DataContext';

export default function ToursPage() {
  const { tours, updateTour, loading } = useData();
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  useEffect(() => {
    setFilteredTours(tours);
  }, [tours]);

  useEffect(() => {
    let filtered = tours;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tour => 
        statusFilter === 'active' ? tour.isActive : !tour.isActive
      );
    }

    setFilteredTours(filtered);
  }, [searchTerm, statusFilter, tours]);

  const handleViewTour = (tour: Tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleToggleStatus = (id: string) => {
    setTours(prev => 
      prev.map(tour => 
        tour.id === id 
          ? { ...tour, isActive: !tour.isActive }
          : tour
      )
    );
  };

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour);
    setShowEditModal(true);
  };

  const handleSaveTour = (tourData: any) => {
    if (editingTour) {
      // Update existing tour
      const updatedTour: Tour = {
        ...editingTour,
        ...tourData,
        updatedAt: new Date().toISOString()
      };
      updateTour(updatedTour);
    }
    
    setShowEditModal(false);
    setEditingTour(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Tur Yönetimi</h1>
          <p className="text-gray-600">Tüm turları görüntüleyin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Toplam: {filteredTours.length} tur
          </div>
          <button
            onClick={() => {
              setEditingTour(null);
              setShowEditModal(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Yeni Tur
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
              placeholder="Tur adı veya açıklama ara..."
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

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-gray-200">
              {tour.images.length > 0 ? (
                <img
                  src={tour.images[0]}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  tour.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tour.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="absolute top-4 left-4 flex items-center">
                <Star size={16} className="text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-semibold text-white bg-black/50 px-2 py-1 rounded">
                  {tour.rating}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-2 text-green-600" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users size={16} className="mr-2 text-green-600" />
                  <span>{tour.capacity} kişilik kapasite</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={16} className="mr-2 text-green-600" />
                  <span>{tour.departure}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-green-600">
                  {tour.currency === 'USD' ? '$' : tour.currency === 'EUR' ? '€' : '₺'}{tour.price}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewTour(tour)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleEditTour(tour)}
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

      {/* Tour Detail Modal */}
      {showModal && selectedTour && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Tur Detayları</h3>
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
                      <h4 className="font-medium text-gray-900 mb-2">Tur Bilgileri</h4>
                      <p className="text-sm text-gray-600 mb-1"><strong>Ad:</strong> {selectedTour.name}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Süre:</strong> {selectedTour.duration}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Fiyat:</strong> {selectedTour.price}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Kapasite:</strong> {selectedTour.capacity} kişi</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Kalkış:</strong> {selectedTour.departure}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Durum</h4>
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          selectedTour.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedTour.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Puan:</strong> {selectedTour.rating}/5</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Oluşturulma:</strong> {new Date(selectedTour.createdAt).toLocaleDateString('tr-TR')}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Güncellenme:</strong> {new Date(selectedTour.updatedAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Açıklama</h4>
                    <p className="text-sm text-gray-600">{selectedTour.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Görseller ({selectedTour.images.length})</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedTour.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedTour.name} ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleToggleStatus(selectedTour.id)}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                    selectedTour.isActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {selectedTour.isActive ? 'Pasif Yap' : 'Aktif Yap'}
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

      {/* Tour Edit Modal */}
      <TourEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTour(null);
        }}
        tour={editingTour}
        onSave={handleSaveTour}
      />
    </div>
  );
}

