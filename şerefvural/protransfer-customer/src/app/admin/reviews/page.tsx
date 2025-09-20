'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  User, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MessageCircle
} from 'lucide-react';

interface Review {
  id: string;
  author: string;
  email: string;
  rating: number;
  comment: string;
  service: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchReviews = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReviews: Review[] = [
        {
          id: '1',
          author: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          rating: 5,
          comment: 'Çok memnun kaldık, şoför çok nazikti. Araç temiz ve konforluydu. Kesinlikle tavsiye ederim.',
          service: 'Transfer',
          isApproved: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          author: 'Maria Garcia',
          email: 'maria@example.com',
          rating: 5,
          comment: 'Excellent service, highly recommended! The driver was professional and the car was very comfortable.',
          service: 'Transfer',
          isApproved: true,
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          author: 'Mehmet Kaya',
          email: 'mehmet@example.com',
          rating: 4,
          comment: 'Güzel bir deneyimdi, teşekkürler. Sadece biraz gecikme oldu ama genel olarak memnunum.',
          service: 'İstanbul Turu',
          isApproved: false,
          createdAt: '2024-01-13T08:20:00Z',
          updatedAt: '2024-01-13T08:20:00Z'
        },
        {
          id: '4',
          author: 'Sarah Johnson',
          email: 'sarah@example.com',
          rating: 5,
          comment: 'Perfect timing and professional driver. The tour was amazing, we saw all the important places in Istanbul.',
          service: 'İstanbul Turu',
          isApproved: true,
          createdAt: '2024-01-12T12:10:00Z',
          updatedAt: '2024-01-12T12:10:00Z'
        },
        {
          id: '5',
          author: 'Ali Veli',
          email: 'ali@example.com',
          rating: 3,
          comment: 'Orta seviyede bir hizmet. Araç biraz eskiydi ama şoför nazikti.',
          service: 'Transfer',
          isApproved: false,
          createdAt: '2024-01-11T16:30:00Z',
          updatedAt: '2024-01-11T16:30:00Z'
        },
        {
          id: '6',
          author: 'Emma Wilson',
          email: 'emma@example.com',
          rating: 5,
          comment: 'Outstanding service! The hotel was beautiful and the staff was very helpful. Will definitely book again.',
          service: 'Otel Konaklama',
          isApproved: true,
          createdAt: '2024-01-10T09:15:00Z',
          updatedAt: '2024-01-10T09:15:00Z'
        }
      ];
      
      setReviews(mockReviews);
      setFilteredReviews(mockReviews);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => 
        statusFilter === 'approved' ? review.isApproved : !review.isApproved
      );
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
  }, [searchTerm, statusFilter, ratingFilter, reviews]);

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleToggleApproval = (id: string) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === id 
          ? { ...review, isApproved: !review.isApproved }
          : review
      )
    );
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      setReviews(prev => prev.filter(review => review.id !== id));
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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
          <h1 className="text-2xl font-bold text-gray-900">Yorum Yönetimi</h1>
          <p className="text-gray-600">Müşteri yorumlarını görüntüleyin ve yönetin</p>
        </div>
        <div className="text-sm text-gray-500">
          Toplam: {filteredReviews.length} yorum
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle size={20} className="text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Toplam Yorum</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Onaylanan</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.isApproved).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <XCircle size={20} className="text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => !r.isApproved).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star size={20} className="text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
              <p className="text-2xl font-bold text-gray-900">
                {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Yazar, email veya yorum ara..."
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
              <option value="approved">Onaylanan</option>
              <option value="pending">Bekleyen</option>
            </select>
          </div>

          <div className="relative">
            <Star size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tüm Puanlar</option>
              <option value="5">5 Yıldız</option>
              <option value="4">4 Yıldız</option>
              <option value="3">3 Yıldız</option>
              <option value="2">2 Yıldız</option>
              <option value="1">1 Yıldız</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Dışa Aktar
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hizmet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yorum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{review.author}</div>
                      <div className="text-sm text-gray-500">{review.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {review.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-900">{review.rating}/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {review.comment}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {review.isApproved ? (
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                      ) : (
                        <XCircle size={16} className="text-yellow-500 mr-2" />
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.isApproved ? 'Onaylandı' : 'Beklemede'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewReview(review)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleApproval(review.id)}
                        className={`${review.isApproved ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {review.isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 hover:text-red-900"
                      >
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

      {/* Review Detail Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Yorum Detayları</h3>
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
                      <h4 className="font-medium text-gray-900 mb-2">Yazar Bilgileri</h4>
                      <p className="text-sm text-gray-600 mb-1"><strong>Ad:</strong> {selectedReview.author}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {selectedReview.email}</p>
                      <p className="text-sm text-gray-600 mb-1"><strong>Hizmet:</strong> {selectedReview.service}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Değerlendirme</h4>
                      <div className="flex items-center mb-2">
                        {renderStars(selectedReview.rating)}
                        <span className="ml-2 text-sm text-gray-900">{selectedReview.rating}/5</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {selectedReview.isApproved ? (
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                        ) : (
                          <XCircle size={16} className="text-yellow-500 mr-2" />
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          selectedReview.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedReview.isApproved ? 'Onaylandı' : 'Beklemede'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Tarih:</strong> {new Date(selectedReview.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Yorum</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedReview.comment}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleToggleApproval(selectedReview.id)}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                    selectedReview.isApproved 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {selectedReview.isApproved ? 'Onayı Kaldır' : 'Onayla'}
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