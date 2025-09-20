import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

// GET /api/tours/[id] - Belirli bir turu getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: params.id }
    })
    
    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }
    
    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error fetching tour:', error)
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 })
  }
}

// PUT /api/tours/[id] - Turu güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const tour = await prisma.tour.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        currency: data.currency,
        rating: data.rating,
        images: data.images,
        isActive: data.isActive,
        capacity: data.capacity,
        departure: data.departure
      }
    })
    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error updating tour:', error)
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 })
  }
}

// DELETE /api/tours/[id] - Turu sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tour.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Tour deleted successfully' })
  } catch (error) {
    console.error('Error deleting tour:', error)
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 })
  }
}
