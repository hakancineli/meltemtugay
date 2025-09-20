'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Car, 
  Users, 
  Wifi,
  Snowflake,
  Eye,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  features: string[];
  isAvailable: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchVehicles = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVehicles: Vehicle[] = [
        {
          id: '1',
          name: 'Mercedes Vito',
          type: 'Minivan',
          capacity: 7,
          features: ['Klima', 'WiFi', 'Bebek Koltuğu', 'GPS'],
          isAvailable: true,
          images: ['/images/mercedes-vito-1.jpg'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Mercedes Sprinter',
          type: 'Minibus',
          capacity: 12,
          features: ['Klima', 'WiFi', 'Bebek Koltuğu', 'GPS', 'USB Şarj'],
          isAvailable: true,
          images: ['/images/mercedes-sprinter-1.jpg'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '3',
          name: 'BMW 5 Series',
          type: 'Sedan',
          capacity: 4,
          features: ['Klima', 'WiFi', 'GPS', 'Deri Koltuk'],
          isAvailable: false,
          images: ['/images/bmw-5series-1.jpg'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        }
      ];
      
      setVehicles(mockVehicles);
      setFilteredVehicles(mockVehicles);
      setLoading(false);
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    let filtered = vehicles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => 
        statusFilter === 'available' ? vehicle.isAvailable : !vehicle.isAvailable
      );
    }

    setFilteredVehicles(filtered);
  }, [searchTerm, statusFilter, vehicles]);

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

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleToggleStatus = (id: string) => {
    setVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === id 
          ? { ...vehicle, isAvailable: !vehicle.isAvailable }
          : vehicle
      )
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Araç Yönetimi</h1>
          <p className="text-gray-600">Tüm araçları görüntüleyin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Toplam: {filteredVehicles.length} araç
          </div>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus size={20} className="mr-2" />
            Yeni Araç
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
              placeholder="Araç adı veya tipi ara..."
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
              <option value="available">Müsait</option>
              <option value="unavailable">Müsait Değil</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Dışa Aktar
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-gray-200">
              {vehicle.images.length > 0 ? (
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  vehicle.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {vehicle.isAvailable ? 'Müsait' : 'Müsait Değil'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{vehicle.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{vehicle.type}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Users size={16} className="mr-2 text-green-600" />
                <span>{vehicle.capacity} kişilik kapasite</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Özellikler:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      {getFeatureIcon(feature)}
                      <span className="ml-1">{feature}</span>
                    </div>
                  ))}
                  {vehicle.features.length > 2 && (
                    <span className="text-xs text-gray-500">+{vehicle.features.length - 2} daha</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewVehicle(vehicle)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
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

      {/* Vehicle Detail Modal */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Araç Detayları</h3>
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
                      <h4 className="font-medium text-gray-900 mb-2">Araç Bilgileri</h4>
                      <p className="text-sm text-gray-600 mb-1"><strong>Ad:</strong> {selectedVehicle.name}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Tip:</strong> {selectedVehicle.type}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Kapasite:</strong> {selectedVehicle.capacity} kişi</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Durum</h4>
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          selectedVehicle.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedVehicle.isAvailable ? 'Müsait' : 'Müsait Değil'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Oluşturulma:</strong> {new Date(selectedVehicle.createdAt).toLocaleDateString('tr-TR')}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Güncellenme:</strong> {new Date(selectedVehicle.updatedAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Özellikler</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedVehicle.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          {getFeatureIcon(feature)}
                          <span className="ml-2">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Görseller ({selectedVehicle.images.length})</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedVehicle.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedVehicle.name} ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleToggleStatus(selectedVehicle.id)}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                    selectedVehicle.isAvailable 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {selectedVehicle.isAvailable ? 'Müsait Değil Yap' : 'Müsait Yap'}
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
    </div>
  );
}
