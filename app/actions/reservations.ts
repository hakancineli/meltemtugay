import { prisma } from '@/lib/prisma';

export async function getReservation(voucherNumber: string) {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: { voucherNumber },
            include: { driver: true }
        });

        if (reservation) {
            try {
                const parsedNames = JSON.parse(reservation.passengerNames);
                return {
                    ...reservation,
                    passengerNames: parsedNames
                };
            } catch (e) {
                console.error('Yolcu isimleri parse edilemedi:', e);
                return reservation;
            }
        }
        return null;
    } catch (error) {
        console.error('Rezervasyon getirme hatası:', error);
        return null;
    }
} 