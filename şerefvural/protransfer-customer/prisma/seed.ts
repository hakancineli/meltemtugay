import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Turları oluştur
  const tours = await Promise.all([
    prisma.tour.create({
      data: {
        id: '1',
        name: 'İstanbul Tarihi Yarımada Turu',
        description: 'İstanbul\'un en önemli tarihi mekanlarını keşfedin. Ayasofya, Sultanahmet Camii, Topkapı Sarayı ve daha fazlası.',
        duration: '8 saat',
        price: '150',
        currency: 'TRY',
        rating: 4.8,
        images: [
          '/serefvip/istanbul/1-1.jpeg',
          '/serefvip/istanbul/2-2.jpeg',
          '/serefvip/istanbul/3-3.jpeg',
          '/serefvip/istanbul/4-4.jpeg',
          '/serefvip/istanbul/5-5.jpeg',
          '/serefvip/istanbul/6-6.jpeg',
          '/serefvip/istanbul/7-7.jpg',
          '/serefvip/istanbul/9-9.jpeg'
        ],
        isActive: true,
        capacity: 20,
        departure: 'Sultanahmet'
      }
    }),
    prisma.tour.create({
      data: {
        id: '2',
        name: 'Sapanca Doğa Turu',
        description: 'Sapanca Gölü çevresinde doğa yürüyüşü ve piknik. Temiz hava ve muhteşem manzara.',
        duration: '6 saat',
        price: '120',
        currency: 'TRY',
        rating: 4.6,
        images: [
          '/serefvip/sapanca/1-1.jpeg',
          '/serefvip/sapanca/2-2.jpeg',
          '/serefvip/sapanca/3-3.jpeg',
          '/serefvip/sapanca/4-4.jpeg',
          '/serefvip/sapanca/5-5.jpeg'
        ],
        isActive: true,
        capacity: 15,
        departure: 'Sapanca Merkez'
      }
    }),
    prisma.tour.create({
      data: {
        id: '3',
        name: 'Bursa Tarihi ve Kültürel Tur',
        description: 'Osmanlı İmparatorluğu\'nun ilk başkenti Bursa\'yı keşfedin. Ulu Camii, Yeşil Türbe ve daha fazlası.',
        duration: '10 saat',
        price: '180',
        currency: 'TRY',
        rating: 4.7,
        images: [
          '/serefvip/bursa/1-1.jpeg',
          '/serefvip/bursa/2-2.jpeg',
          '/serefvip/bursa/3-3.jpeg',
          '/serefvip/bursa/4-4.jpeg',
          '/serefvip/bursa/5-5.jpeg'
        ],
        isActive: true,
        capacity: 18,
        departure: 'Bursa Merkez'
      }
    }),
    prisma.tour.create({
      data: {
        id: '4',
        name: 'Abant Gölü Doğa Turu',
        description: 'Abant Gölü\'nde doğa yürüyüşü ve fotoğraf çekimi. Muhteşem doğa manzaraları.',
        duration: '7 saat',
        price: '140',
        currency: 'TRY',
        rating: 4.5,
        images: [
          '/serefvip/abant/1-1.jpeg',
          '/serefvip/abant/2-2.jpeg',
          '/serefvip/abant/3-3.jpeg',
          '/serefvip/abant/4-4.jpeg',
          '/serefvip/abant/5-5.jpeg'
        ],
        isActive: true,
        capacity: 12,
        departure: 'Abant Merkez'
      }
    })
  ])

  // Otelleri oluştur
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        id: '1',
        name: 'Grand Hotel İstanbul',
        description: 'Sultanahmet\'te lüks konaklama. Tarihi yarımadaya yürüme mesafesi.',
        location: 'Sultanahmet, İstanbul',
        price: '250',
        currency: 'TRY',
        rating: 4.9,
        images: [
          '/serefvip/istanbul/1-1.jpeg',
          '/serefvip/istanbul/2-2.jpeg',
          '/serefvip/istanbul/3-3.jpeg',
          '/serefvip/istanbul/4-4.jpeg'
        ],
        isActive: true,
        features: ['WiFi', 'Klima', 'Oda Servisi', 'Spa', 'Fitness']
      }
    }),
    prisma.hotel.create({
      data: {
        id: '2',
        name: 'Sapanca Resort Hotel',
        description: 'Sapanca Gölü manzaralı doğa oteli. Huzurlu ve sakin bir tatil.',
        location: 'Sapanca, Sakarya',
        price: '180',
        currency: 'TRY',
        rating: 4.6,
        images: [
          '/serefvip/sapanca/1-1.jpeg',
          '/serefvip/sapanca/2-2.jpeg',
          '/serefvip/sapanca/3-3.jpeg',
          '/serefvip/sapanca/4-4.jpeg'
        ],
        isActive: true,
        features: ['WiFi', 'Klima', 'Havuz', 'Restoran', 'Park Alanı']
      }
    }),
    prisma.hotel.create({
      data: {
        id: '3',
        name: 'Bursa Thermal Hotel',
        description: 'Bursa\'da termal sularla ünlü lüks otel. Sağlık ve dinlenme.',
        location: 'Çekirge, Bursa',
        price: '220',
        currency: 'TRY',
        rating: 4.7,
        images: [
          '/serefvip/bursa/1-1.jpeg',
          '/serefvip/bursa/2-2.jpeg',
          '/serefvip/bursa/3-3.jpeg',
          '/serefvip/bursa/4-4.jpeg'
        ],
        isActive: true,
        features: ['WiFi', 'Klima', 'Termal Havuz', 'Spa', 'Sauna']
      }
    }),
    prisma.hotel.create({
      data: {
        id: '4',
        name: 'Abant Nature Hotel',
        description: 'Abant Gölü kıyısında doğa oteli. Temiz hava ve huzur.',
        location: 'Abant, Bolu',
        price: '160',
        currency: 'TRY',
        rating: 4.4,
        images: [
          '/serefvip/abant/1-1.jpeg',
          '/serefvip/abant/2-2.jpeg',
          '/serefvip/abant/3-3.jpeg',
          '/serefvip/abant/4-4.jpeg'
        ],
        isActive: true,
        features: ['WiFi', 'Klima', 'Restoran', 'Park Alanı', 'Bisiklet Kiralama']
      }
    })
  ])

  console.log('✅ Turlar ve oteller veritabanına eklendi!')
  console.log(`📊 ${tours.length} tur eklendi`)
  console.log(`🏨 ${hotels.length} otel eklendi`)
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
