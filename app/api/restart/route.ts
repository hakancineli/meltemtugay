import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Node.js işlemlerini sonlandır ve sunucuyu yeniden başlat
        exec('pkill -f "node" && npm run dev', (error, stdout, stderr) => {
            if (error) {
                console.error(`Hata: ${error}`);
                return;
            }
            console.log(`Çıktı: ${stdout}`);
        });

        return NextResponse.json({ message: 'Sunucu yeniden başlatılıyor' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Sunucu yeniden başlatılamadı' },
            { status: 500 }
        );
    }
} 