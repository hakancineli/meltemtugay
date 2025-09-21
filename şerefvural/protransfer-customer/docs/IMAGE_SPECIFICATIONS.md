# Fotoğraf Boyutları ve Optimizasyonu

## VehicleSlider için Önerilen Boyutlar

### Ana Araç Görselleri
- **Boyut**: 1200x800 piksel (3:2 oran)
- **Format**: WebP (birincil), JPEG (yedek)
- **Kalite**: 85-90%
- **Dosya Boyutu**: Maksimum 200KB per görsel
- **Renk Profili**: sRGB

### Responsive Boyutlar
- **Desktop**: 1200x800px
- **Tablet**: 800x533px  
- **Mobile**: 600x400px

### Gradient Overlay
Mevcut gradient overlay (`bg-gradient-to-t from-black/20 to-transparent`) için:
- **Opacity**: 20% (black/20)
- **Direction**: Top'tan bottom'a
- **Blend Mode**: Normal

## Optimizasyon Önerileri

### 1. Next.js Image Optimizasyonu
```tsx
import Image from 'next/image';

<Image
  src="/images/mercedes-vito-1.jpg"
  alt="Mercedes Vito Transfer Vehicle"
  width={1200}
  height={800}
  priority={index === 0}
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 2. WebP Desteği
```tsx
<picture>
  <source srcSet="/images/mercedes-vito-1.webp" type="image/webp" />
  <source srcSet="/images/mercedes-vito-1.jpg" type="image/jpeg" />
  <img src="/images/mercedes-vito-1.jpg" alt="Mercedes Vito" />
</picture>
```

### 3. Lazy Loading
```tsx
<Image
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
/>
```

## Dosya Yapısı

```
public/images/
├── vehicles/
│   ├── mercedes-vito-1.webp
│   ├── mercedes-vito-1.jpg
│   ├── mercedes-vito-2.webp
│   ├── mercedes-vito-2.jpg
│   └── ...
├── thumbnails/
│   ├── mercedes-vito-1-thumb.webp
│   ├── mercedes-vito-1-thumb.jpg
│   └── ...
└── placeholders/
    ├── vehicle-placeholder.webp
    └── vehicle-placeholder.jpg
```

## Performans Metrikleri

### Core Web Vitals Hedefleri
- **LCP**: < 2.5s (Largest Contentful Paint)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **FID**: < 100ms (First Input Delay)

### Görsel Optimizasyonu
- **Compression**: 85-90% kalite
- **Progressive JPEG**: Evet
- **WebP Support**: Evet
- **AVIF Support**: Gelecekte eklenebilir

## Araç Görselleri İçin Öneriler

### Mercedes Vito Görselleri
1. **Açı**: 3/4 açıdan çekilmiş
2. **Arka Plan**: Temiz, profesyonel
3. **Işık**: Doğal ışık tercih edilir
4. **Renk**: Tutarlı renk paleti
5. **Kalite**: Yüksek çözünürlük

### Alternatif Görsel Boyutları
- **Hero Section**: 1920x1080px (16:9)
- **Gallery Thumbnail**: 300x200px (3:2)
- **Mobile Optimized**: 600x400px (3:2)

## Gradient Overlay Detayları

Mevcut gradient overlay için CSS:
```css
.gradient-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    transparent 100%
  );
}
```

### Gradient Özellikleri
- **Başlangıç**: `rgba(0, 0, 0, 0.2)` (20% siyah)
- **Bitiş**: `transparent` (şeffaf)
- **Yön**: Top'tan bottom'a
- **Blend Mode**: Normal
- **Position**: Absolute, inset-0

Bu gradient, görsellerin üzerine metin okunabilirliğini artırmak için kullanılır.


