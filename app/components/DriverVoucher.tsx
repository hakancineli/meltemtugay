'use client';

import { useState, useEffect } from 'react';
import { AIRPORTS } from '@/app/types';

interface DriverVoucherProps {
    reservation: {
        date: string;
        time: string;
        from: string;
        to: string;
        flightCode: string;
        passengerNames: string;
        luggageCount: number;
        driverFee: number | null;
        voucherNumber: string;
        driver: {
            name: string;
            phoneNumber: string | null;
        } | null;
    };
}

export default function DriverVoucher({ reservation }: DriverVoucherProps) {
    const [passengerList, setPassengerList] = useState<string[]>([]);

    useEffect(() => {
        try {
            const parsed = JSON.parse(reservation.passengerNames);
            if (Array.isArray(parsed)) {
                setPassengerList(parsed);
            }
        } catch (e) {
            console.error('Yolcu isimleri parse edilemedi:', e);
            setPassengerList([]);
        }
    }, [reservation.passengerNames]);

    const getLocationDisplay = (location: string) => {
        return AIRPORTS[location as keyof typeof AIRPORTS] || location;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
                <div className="border-b pb-4 mb-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Sürücü Bilgileri</h1>
                        <p className="text-gray-600">Voucher No: {reservation.voucherNumber}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {reservation.driver && (
                        <div>
                            <h3 className="font-semibold text-gray-700">Sürücü</h3>
                            <p className="mt-2">İsim: {reservation.driver.name}</p>
                            {reservation.driver.phoneNumber && (
                                <p>Telefon: {reservation.driver.phoneNumber}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold text-gray-700">Transfer Bilgileri</h3>
                        <p className="mt-2">Tarih: {reservation.date}</p>
                        <p>Saat: {reservation.time}</p>
                        <p>Nereden: {getLocationDisplay(reservation.from)}</p>
                        <p>Nereye: {getLocationDisplay(reservation.to)}</p>
                        <p>Uçuş Kodu: {reservation.flightCode}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700">Yolcu Bilgileri</h3>
                        <p className="mt-2">Yolcu Sayısı: {passengerList.length}</p>
                        <p>Bagaj Sayısı: {reservation.luggageCount}</p>
                    </div>

                    {reservation.driverFee && (
                        <div>
                            <h3 className="font-semibold text-gray-700">Hakediş Bilgisi</h3>
                            <p className="mt-2 text-xl">
                                {reservation.driverFee} TL
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => window.print()}
                            className="print:hidden px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Yazdır
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 