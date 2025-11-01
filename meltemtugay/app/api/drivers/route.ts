import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tüm sürücüleri getir
export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: {
        name: 'asc',
      }
    });
    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Sürücü listesi getirme hatası:', error);
    return NextResponse.json(
      { error: 'Sürücüler getirilemedi' },
      { status: 500 }
    );
  }
}

// Yeni sürücü ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phoneNumber } = body;

    if (!name || !phoneNumber) {
      return NextResponse.json(
        { error: 'Ad ve telefon numarası gereklidir' },
        { status: 400 }
      );
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        phoneNumber,
      },
    });

    return NextResponse.json(driver);
  } catch (error) {
    console.error('Şoför ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Şoför eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 