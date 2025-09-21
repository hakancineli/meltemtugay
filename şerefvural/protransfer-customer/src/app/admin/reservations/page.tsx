'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  message?: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchReservations = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReservations: Reservation[] = [
        {
          id: '1',
          customerName: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '+90 555 123 4567',
          from: 'İstanbul Havalimanı',
          to: 'Sultanahmet',
          date: '2024-01-20',
          time: '14:30',
          passengers: 4,
          status: 'confirmed',
          createdAt: '2024-01-15T10:30:00Z',
          message: 'Bebek koltuğu gerekli'
        },
        {
          id: '2',
          customerName: 'Maria Garcia',
          email: 'maria@example.com',
          phone: '+90 555 234 5678',
          from: 'Sultanahmet',
          to: 'İstanbul Havalimanı',
          date: '2024-01-22',
          time: '09:00',
          passengers: 2,
          status: 'pending',
          createdAt: '2024-01-16T15:45:00Z'
        },
        {
          id: '3',
          customerName: 'John Smith',
          email: 'john@example.com',
          phone: '+90 555 345 6789',
          from: 'İstanbul Havalimanı',
          to: 'Taksim',
          date: '2024-01-18',
          time: '16:15',
          passengers: 3,
          status: 'completed',
          createdAt: '2024-01-14T08:20:00Z'
        },
        {
          id: '4',
          customerName: 'Fatma Demir',
          email: 'fatma@example.com',
          phone: '+90 555 456 7890',
          from: 'Taksim',
          to: 'İstanbul Havalimanı',
          date: '2024-01-25',
          time: '11:30',
          passengers: 6,
          status: 'cancelled',
          createdAt: '2024-01-17T12:10:00Z',
          message: 'Uçuş iptal edildi'
        }
      ];
      
      setReservations(mockReservations);
      setFilteredReservations(mockReservations);
      setLoading(false);
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    let filtered = reservations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.phone.includes(searchTerm) ||
        reservation.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.to.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    setFilteredReservations(filtered);
  }, [searchTerm, statusFilter, reservations]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-blue-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Onaylandı';
      case 'pending':
        return 'Beklemede';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id 
          ? { ...reservation, status: newStatus as any }
          : reservation
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
          <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Yönetimi</h1>
          <p className="text-gray-600">Tüm rezervasyonları görüntüleyin ve yönetin</p>
        </div>
        <div className="text-sm text-gray-500">
          Toplam: {filteredReservations.length} rezervasyon
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Müşteri, email, telefon veya rota ara..."
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
              <option value="pending">Beklemede</option>
              <option value="confirmed">Onaylandı</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Yeni Rezervasyon
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Dışa Aktar
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih & Saat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yolcu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                      <div className="text-sm text-gray-500">{reservation.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{reservation.from}</div>
                        <div className="text-sm text-gray-500">→ {reservation.to}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{reservation.date}</div>
                        <div className="text-sm text-gray-500">{reservation.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{reservation.passengers} kişi</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(reservation.status)}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewReservation(reservation)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Detail Modal */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Rezervasyon Detayları</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Müşteri Bilgileri</h4>
                    <p className="text-sm text-gray-600">{selectedReservation.customerName}</p>
                    <p className="text-sm text-gray-600">{selectedReservation.email}</p>
                    <p className="text-sm text-gray-600">{selectedReservation.phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Transfer Bilgileri</h4>
                    <p className="text-sm text-gray-600">{selectedReservation.from} → {selectedReservation.to}</p>
                    <p className="text-sm text-gray-600">Tarih: {selectedReservation.date}</p>
                    <p className="text-sm text-gray-600">Saat: {selectedReservation.time}</p>
                    <p className="text-sm text-gray-600">Yolcu Sayısı: {selectedReservation.passengers}</p>
                  </div>
                  
                  {selectedReservation.message && (
                    <div>
                      <h4 className="font-medium text-gray-900">Not</h4>
                      <p className="text-sm text-gray-600">{selectedReservation.message}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Durum</h4>
                    <div className="flex items-center">
                      {getStatusIcon(selectedReservation.status)}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReservation.status)}`}>
                        {getStatusText(selectedReservation.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
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


