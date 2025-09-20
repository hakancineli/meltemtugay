import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

// GET /api/hotels/[id] - Belirli bir oteli getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: params.id }
    })
    
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }
    
    return NextResponse.json(hotel)
  } catch (error) {
    console.error('Error fetching hotel:', error)
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 })
  }
}

// PUT /api/hotels/[id] - Oteli güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const hotel = await prisma.hotel.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        price: data.price,
        currency: data.currency,
        rating: data.rating,
        images: data.images,
        isActive: data.isActive,
        features: data.features
      }
    })
    return NextResponse.json(hotel)
  } catch (error) {
    console.error('Error updating hotel:', error)
    return NextResponse.json({ error: 'Failed to update hotel' }, { status: 500 })
  }
}

// DELETE /api/hotels/[id] - Oteli sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.hotel.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Hotel deleted successfully' })
  } catch (error) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json({ error: 'Failed to delete hotel' }, { status: 500 })
  }
}
