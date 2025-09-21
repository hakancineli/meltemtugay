'use client';

import { usePathname } from 'next/navigation';
import Header from './ui/Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Admin sayfalarında header'ı gizle
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Header />;
}

