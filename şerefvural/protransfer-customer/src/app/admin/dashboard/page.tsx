'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Star,
  Car,
  MapPin,
  Building,
  DollarSign
} from 'lucide-react';

interface DashboardStats {
  totalReservations: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  activeTours: number;
  activeHotels: number;
  vehiclesAvailable: number;
  monthlyGrowth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageRating: 0,
    activeTours: 4,
    activeHotels: 4,
    vehiclesAvailable: 3,
    monthlyGrowth: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      setLoading(true);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalReservations: 1247,
        totalRevenue: 125000,
        totalCustomers: 892,
        averageRating: 4.8,
        activeTours: 4,
        activeHotels: 4,
        vehiclesAvailable: 3,
        monthlyGrowth: 12.5
      });
      
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Toplam Rezervasyon',
      value: stats.totalReservations.toLocaleString(),
      icon: Calendar,
      color: 'bg-blue-500',
      change: `+${stats.monthlyGrowth}% bu ay`
    },
    {
      title: 'Toplam Gelir',
      value: `₺${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: `+${stats.monthlyGrowth}% bu ay`
    },
    {
      title: 'Toplam Müşteri',
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'bg-purple-500',
      change: `+${stats.monthlyGrowth}% bu ay`
    },
    {
      title: 'Ortalama Puan',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-500',
      change: '+0.2 bu ay'
    },
    {
      title: 'Aktif Turlar',
      value: stats.activeTours,
      icon: MapPin,
      color: 'bg-indigo-500',
      change: '4 aktif tur'
    },
    {
      title: 'Aktif Oteller',
      value: stats.activeHotels,
      icon: Building,
      color: 'bg-pink-500',
      change: '4 aktif otel'
    },
    {
      title: 'Müsait Araçlar',
      value: stats.vehiclesAvailable,
      icon: Car,
      color: 'bg-red-500',
      change: '3 araç müsait'
    },
    {
      title: 'Aylık Büyüme',
      value: `%${stats.monthlyGrowth}`,
      icon: TrendingUp,
      color: 'bg-emerald-500',
      change: 'Geçen aya göre'
    }
  ];

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">ProTransfer yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Son Rezervasyonlar</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { customer: 'Ahmet Yılmaz', route: 'İstanbul Havalimanı → Sultanahmet', date: '2024-01-15', status: 'Onaylandı' },
                { customer: 'Maria Garcia', route: 'Sultanahmet → İstanbul Havalimanı', date: '2024-01-15', status: 'Beklemede' },
                { customer: 'John Smith', route: 'İstanbul Havalimanı → Taksim', date: '2024-01-14', status: 'Tamamlandı' },
                { customer: 'Fatma Demir', route: 'Taksim → İstanbul Havalimanı', date: '2024-01-14', status: 'Onaylandı' },
              ].map((reservation, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{reservation.customer}</p>
                    <p className="text-sm text-gray-600">{reservation.route}</p>
                    <p className="text-xs text-gray-500">{reservation.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    reservation.status === 'Onaylandı' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'Beklemede' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Son Yorumlar</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { customer: 'Mehmet Kaya', rating: 5, comment: 'Çok memnun kaldık, şoför çok nazikti.', date: '2024-01-15' },
                { customer: 'Sarah Johnson', rating: 5, comment: 'Excellent service, highly recommended!', date: '2024-01-14' },
                { customer: 'Ali Veli', rating: 4, comment: 'Güzel bir deneyimdi, teşekkürler.', date: '2024-01-13' },
                { customer: 'Emma Wilson', rating: 5, comment: 'Perfect timing and professional driver.', date: '2024-01-12' },
              ].map((review, index) => (
                <div key={index} className="py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{review.customer}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


