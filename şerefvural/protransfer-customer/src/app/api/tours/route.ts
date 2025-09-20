import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// GET /api/tours - Tüm turları getir
export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(tours)
  } catch (error) {
    console.error('Error fetching tours:', error)
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 })
  }
}

// POST /api/tours - Yeni tur oluştur
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const tour = await prisma.tour.create({
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        currency: data.currency || 'TRY',
        rating: data.rating,
        images: data.images || [],
        isActive: data.isActive ?? true,
        capacity: data.capacity,
        departure: data.departure
      }
    })
    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error creating tour:', error)
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 })
  }
}
