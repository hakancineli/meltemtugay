import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/hotels - Tüm otelleri getir
export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(hotels)
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 })
  }
}

// POST /api/hotels - Yeni otel oluştur
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        price: data.price,
        currency: data.currency || 'TRY',
        rating: data.rating,
        images: data.images || [],
        isActive: data.isActive ?? true,
        features: data.features || []
      }
    })
    return NextResponse.json(hotel)
  } catch (error) {
    console.error('Error creating hotel:', error)
    return NextResponse.json({ error: 'Failed to create hotel' }, { status: 500 })
  }
}
