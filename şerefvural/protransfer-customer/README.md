# ProTransfer Customer Website

Modern, responsive ve çok dilli transfer hizmeti web sitesi.

## Özellikler

- ✅ **Çok Dilli Destek**: Türkçe, İngilizce, Arapça
- ✅ **Responsive Tasarım**: Mobile-first yaklaşım
- ✅ **Modern UI**: Tailwind CSS ile şık tasarım
- ✅ **Veritabanı**: Neon PostgreSQL entegrasyonu
- ✅ **SEO Optimizasyonu**: Next.js App Router
- ✅ **Performance**: Core Web Vitals optimizasyonu

## Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Icons**: Lucide React
- **Deployment**: Vercel

## Kurulum

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd protransfer-customer
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Variables
`.env.local` dosyası oluşturun:
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="905319458931"
```

### 4. Veritabanını Kurun
```bash
npm run db:generate
npm run db:push
```

### 5. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

## Neon Veritabanı Kurulumu

### 1. Neon Hesabı Oluşturun
- [Neon Console](https://console.neon.tech/) adresine gidin
- Yeni proje oluşturun
- Connection string'i kopyalayın

### 2. Vercel Entegrasyonu
- Vercel dashboard'da proje ayarlarına gidin
- Environment variables ekleyin:
  - `DATABASE_URL`: Neon connection string
  - `NEXT_PUBLIC_APP_URL`: Production URL
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp numarası

## Deployment

### Vercel ile Deployment
```bash
# Vercel CLI kurulumu
npm i -g vercel

# Deployment
vercel

# Production deployment
vercel --prod
```

### Manuel Deployment
1. GitHub repository oluşturun
2. Vercel'e bağlayın
3. Environment variables ekleyin
4. Deploy edin

## Fotoğraf Boyutları

### VehicleSlider Görselleri
- **Boyut**: 1200x800px (3:2 oran)
- **Format**: WebP (birincil), JPEG (yedek)
- **Kalite**: 85-90%
- **Dosya Boyutu**: Maksimum 200KB

Detaylı bilgi için: [docs/IMAGE_SPECIFICATIONS.md](./docs/IMAGE_SPECIFICATIONS.md)

## Dil Desteği

### Desteklenen Diller
- 🇺🇸 **English** (varsayılan)
- 🇹🇷 **Türkçe**
- 🇸🇦 **العربية** (RTL destekli)

### Dil Dosyaları
- `src/locales/en.json` - İngilizce
- `src/locales/tr.json` - Türkçe
- `src/locales/ar.json` - Arapça

## Proje Yapısı

```
src/
├── app/                 # Next.js App Router
├── components/          # React bileşenleri
│   ├── landing/        # Ana sayfa bileşenleri
│   └── ui/            # UI bileşenleri
├── contexts/           # React Context'leri
├── lib/               # Utility fonksiyonları
└── locales/           # Dil dosyaları
```

## API Endpoints

### Rezervasyon
- `POST /api/reservations` - Yeni rezervasyon
- `GET /api/reservations` - Rezervasyon listesi

### İletişim
- `POST /api/contact` - İletişim formu
- `GET /api/contact` - İletişim mesajları

### Yorumlar
- `GET /api/reviews` - Müşteri yorumları
- `POST /api/reviews` - Yeni yorum

## Performans

### Core Web Vitals Hedefleri
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Optimizasyonlar
- Next.js Image optimizasyonu
- Lazy loading
- Code splitting
- WebP görsel desteği

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

- **WhatsApp**: +90 531 945 89 31
- **Email**: info@protransfer.com
- **Website**: https://protransfer.com