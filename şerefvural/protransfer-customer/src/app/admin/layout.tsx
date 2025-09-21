'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ErrorBoundary from '@/components/admin/ErrorBoundary';
import { setupErrorHandlers, suppressConsoleErrors } from '@/utils/errorHandler';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  Building, 
  Star, 
  Settings, 
  LogOut,
  Menu,
  X,
  Users,
  Car,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  // Console hatalarını önle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Setup error handlers
      const cleanup = setupErrorHandlers();
      suppressConsoleErrors();
      
      return cleanup;
    }
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Calendar, label: 'Rezervasyonlar', href: '/admin/reservations' },
    { icon: Car, label: 'Araçlar', href: '/admin/vehicles' },
    { icon: MapPin, label: 'Turlar', href: '/admin/tours' },
    { icon: Building, label: 'Oteller', href: '/admin/hotels' },
    { icon: Star, label: 'Yorumlar', href: '/admin/reviews' },
    { icon: Users, label: 'Müşteriler', href: '/admin/customers' },
    { icon: Settings, label: 'Ayarlar', href: '/admin/settings' },
  ];

  const handleLogout = () => {
    // Logout logic here
    router.push('/admin/auth');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Collapsible */}
        <div className={`fixed top-16 bottom-0 left-0 z-50 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
          
          {/* Sidebar Header - Collapse button */}
          <div className="flex items-center justify-end p-4 border-b border-gray-200">
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title={sidebarCollapsed ? 'Genişlet' : 'Daralt'}
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <div className="px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 ${
                      sidebarCollapsed ? 'justify-center' : ''
                    }`}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <Icon size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
                    {!sidebarCollapsed && item.label}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Çıkış Yap' : ''}
            >
              <LogOut size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
              {!sidebarCollapsed && 'Çıkış Yap'}
            </button>
          </div>
        </div>

        {/* Main content - Responsive margin */}
        <div className={`min-h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
                  {/* Top bar */}
                  <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200" style={{ height: '64px' }}>
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu size={20} />
              </button>
              
              {/* Logo - Responsive to sidebar state */}
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-green-600 hover:text-green-700 transition-all duration-300">
                  Şeref Vural Travel
                </a>
              </div>
              
              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center space-x-8">
                <a 
                  href="/" 
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  Ana Sayfa
                </a>
                <a 
                  href="#tours" 
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  Turlar
                </a>
                <a 
                  href="#hotels" 
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  Oteller
                </a>
                <a 
                  href="#transfer" 
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  Transfer
                </a>
              </nav>
              
              {/* Language Selector */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" aria-label="Select Language">
                    <option value="en">🇺🇸 English</option>
                    <option value="tr">🇹🇷 Türkçe</option>
                    <option value="ar">🇸🇦 العربية</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8" style={{ paddingTop: '120px' }}>
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}