'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Login sayfası için authentication kontrolü yapma
  const isLoginPage = pathname === '/admin/login';

  // Authentication kontrolü - sadece login sayfası değilse
  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, isLoginPage]);

  const menuItems = [
    { icon: Car, label: 'Araçlar', href: '/admin/vehicles' },
    { icon: MapPin, label: 'Turlar', href: '/admin/tours' },
    { icon: Building, label: 'Oteller', href: '/admin/hotels' },
    { icon: Star, label: 'Yorumlar', href: '/admin/reviews' },
    { icon: Settings, label: 'Ayarlar', href: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  // Dashboard kaldırıldığı için araçlar sayfasına yönlendir
  useEffect(() => {
    if (isAuthenticated && pathname === '/admin') {
      router.push('/admin/vehicles');
    }
  }, [isAuthenticated, pathname, router]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Login sayfası için sadece children'ı render et
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-[60] w-64 bg-white shadow-lg transform transition-all duration-500 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className={`text-xl font-bold text-green-600 transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
            Şeref Vural Travel
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 hidden lg:block"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon size={20} className="mr-3 flex-shrink-0" />
                    <span className={`truncate transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut size={20} className="mr-3 flex-shrink-0" />
            <span className={`transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              Çıkış Yap
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`
        flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 z-40 transition-all duration-500 ease-in-out" style={{ left: sidebarCollapsed ? '64px' : '256px', right: '0' }}>
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {menuItems.find(item => pathname.startsWith(item.href))?.label || 'Admin Panel'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">Hoş geldiniz, Admin</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">🇺🇸 English</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pt-16 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}