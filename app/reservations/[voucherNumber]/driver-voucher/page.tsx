import { getReservation } from '@/app/actions/reservations';
import { notFound } from 'next/navigation';

export default async function DriverVoucherPage({
    params: { voucherNumber },
}: {
    params: { voucherNumber: string };
}) {
    const reservation = await getReservation(voucherNumber);

    if (!reservation || !reservation.driver) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">Şoför Voucherı</h1>
                    <p className="text-center text-gray-600 mt-2">Voucher No: {voucherNumber}</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-blue-800 mb-3">Şoför Bilgileri</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Ad Soyad</p>
                                <p className="font-medium">{reservation.driver.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Telefon</p>
                                <p className="font-medium">{reservation.driver.phoneNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-green-800 mb-3">Hakediş Bilgisi</h2>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{reservation.driverFee} TL</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-yellow-800 mb-3">Ödeme Bilgileri</h2>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm text-gray-600">IBAN</p>
                                <p className="font-medium font-mono tracking-wider">TR68 0006 2000 3680 0006 6673 77</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Hesap Sahibi</p>
                                <p className="font-medium">HAKAN ÇİNELİ</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Banka</p>
                                <p className="font-medium">GARANTİ BANKASI</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Transfer Bilgileri</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Tarih</p>
                                <p className="font-medium">{new Date(reservation.date).toLocaleDateString('tr-TR')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Saat</p>
                                <p className="font-medium">{reservation.time}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Nereden</p>
                                <p className="font-medium">{reservation.from}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Nereye</p>
                                <p className="font-medium">{reservation.to}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Yolcu Bilgileri</h2>
                        <div className="space-y-2">
                            {reservation.passengerNames.map((name: string, index: number) => (
                                <p key={index} className="font-medium">{name}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 