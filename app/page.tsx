import Image from "next/image";
import ReservationForm from './components/ReservationForm';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Yeni Rezervasyon</h1>
        <p className="mt-2 text-sm text-gray-600">
          Transfer rezervasyonu oluşturmak için aşağıdaki formu doldurun.
        </p>
      </div>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <ReservationForm />
      </div>
    </div>
  );
}
