# UETDS Mobil Uygulaması

Ulaştırma Elektronik Takip Denetim Sistemi (UETDS) için geliştirilen mobil uygulama.

## Özellikler

- ✅ Çoklu kiracı (multi-tenant) desteği
- ✅ Sefer yönetimi
- ✅ Yolcu yönetimi
- ✅ Personel yönetimi
- ✅ Araç yönetimi
- ✅ Grup yönetimi
- ✅ UETDS API entegrasyonu
- ✅ Çevrimdışı (offline) çalışma desteği
- ✅ Gerçek zamanlı senkronizasyon
- ✅ Modern ve kullanıcı dostu arayüz

## Teknolojiler

- **React Native** - Çapraz platform mobil geliştirme
- **TypeScript** - Tip güvenliği
- **Expo** - Geliştirme ve dağıtım platformu
- **React Navigation** - Navigasyon yönetimi
- **React Native Paper** - UI bileşen kütüphanesi
- **AsyncStorage** - Yerel veri depolama
- **Axios** - HTTP istekleri için

## Proje Yapısı

```
src/
├── components/          # Ortak bileşenler
├── contexts/           # React Context'ler
│   ├── AuthContext.tsx
│   └── UetdsContext.tsx
├── constants/          # Sabit değerler
├── navigation/         # Navigasyon yapılandırması
├── screens/            # Ekranlar
│   ├── auth/
│   ├── dashboard/
│   ├── seferler/
│   ├── yolcular/
│   ├── personeller/
│   ├── araclar/
│   ├── gruplar/
│   ├── ayarlar/
│   └── profil/
├── services/           # Servis katmanı
│   ├── uetdsService.ts
│   └── storageService.ts
├── styles/            # Stil dosyaları
│   └── theme.ts
└── types/             # TypeScript tip tanımları
    └── index.ts
```

## Kurulum

### Gereksinimler

- Node.js 16+
- npm veya yarn
- Expo CLI

### Adımlar

1. Depoyu klonlayın:
```bash
git clone <repository-url>
cd uetds-mobil-app
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Uygulamayı başlatın:
```bash
npm start
# veya
yarn start
```

## Kullanım

### Geliştirme

1. Uygulamayı başlatın:
```bash
npm start
```

2. QR kodu okuyarak Expo Go uygulamasında çalıştırın veya:
```bash
# iOS için
npm run ios

# Android için
npm run android
```

### Üretim

1. Build oluştur:
```bash
# iOS için
expo build:ios

# Android için
expo build:android
```

## UETDS Entegrasyonu

Uygulama, Ulaştırma Bakanlığı'nın UETDS web servisleri ile entegre çalışır:

### Servisler

- `servisTest` - Bağlantı testi
- `seferEkle` - Yeni sefer ekleme
- `seferGuncelle` - Sefer güncelleme
- `seferIptal` - Sefer iptal etme
- `yolcuEkle` - Yolcu ekleme
- `yolcuEkleCoklu` - Çoklu yolcu ekleme
- `personelEkle` - Personel ekleme
- `seferGrupEkle` - Grup ekleme
- `bildirimOzeti` - Bildirim özeti

### Test Ortamı

Uygulama varsayılan olarak test ortamında çalışır:

- Test URL: `https://servis.turkiye.gov.tr/services/g2g/kdgm/test/uetdsarizi?wsdl`
- Test Kimlik Bilgileri:
  - UNET_NO: 999999
  - Şifre: 999999testtest
  - Test Plaka: 06TARIFESIZ123

## Ekranlar

### 1. Giriş Ekranı
- Kullanıcı girişi
- Test hesabı bilgileri

### 2. Ana Panel (Dashboard)
- İstatistikler
- Hızlı eylemler
- Bağlantı durumu

### 3. Sefer Yönetimi
- Sefer listesi
- Filtreleme ve arama
- Sefer ekleme/düzenleme
- Sefer iptal etme

### 4. Yolcu Yönetimi
- Yolcu listesi
- Yolcu ekleme
- TC Kimlik/Pasaport bilgileri
- HES kodu

### 5. Personel Yönetimi
- Personel listesi
- Sürücü/Rehber/Hostes yönetimi
- Belgeler ve geçerlilik

### 6. Araç Yönetimi
- Araç listesi
- Araç bilgileri
- Muayene ve belge takibi

### 7. Grup Yönetimi
- Grup listesi
- Grup oluşturma
- Sorumlu kişi atama

### 8. Ayarlar
- Bildirimler
- Senkronizasyon
- Tema ayarları
- UETDS ayarları

### 9. Profil
- Kullanıcı bilgileri
- Şirket bilgileri
- Yetkiler

## Veri Modeli

### Sefer
```typescript
interface Sefer {
  id: string;
  uetdsSeferReferansNo?: number;
  aracPlaka: string;
  hareketTarihi: Date;
  hareketSaati: string;
  nereden: string;
  nereye: string;
  surucuAdiSoyadi: string;
  surucuTcKimlikNo: string;
  seferAciklama?: string;
  durum: SeferDurum;
  createdAt: string;
  updatedAt: string;
  yolcular?: Yolcu[];
  personeller?: Personel[];
  gruplar?: Grup[];
}
```

### Yolcu
```typescript
interface Yolcu {
  id: string;
  uetdsYolcuRefNo?: number;
  uetdsSeferReferansNo: number;
  adi: string;
  soyadi: string;
  tcKimlikPasaportNo: string;
  cinsiyet: 'E' | 'K';
  uyrukUlke: string;
  koltukNo?: string;
  telefonNo?: string;
  hesKodu?: string;
  grupId?: number;
  durum: YolcuDurum;
  seferId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Çevrimdışı Çalışma

Uygulama internet bağlantısı olmadığında çevrimdışı çalışabilir:

- Yerel veri depolama (AsyncStorage)
- Çevrimdışı veri yönetimi
- Otomatik senkronizasyon (bağlantı geldiğinde)

## Güvenlik

- HTTPS ile iletişim
- Token tabanlı kimlik doğrulama
- Yerel veri şifreleme
- UETDS kimlik bilgileri güvenliği

## Hata Yönetimi

- Global hata yakalama
- Kullanıcı dostu hata mesajları
- Otomatik yeniden deneme mekanizması
- Hata raporlama

## Performans Optimizasyonu

- Lazy loading
- Image optimization
- Memory management
- Bundle size optimization

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun: `git checkout -b feature/yeni-ozellik`
3. Değişiklikleri commit edin: `git commit -am 'Yeni özellik eklendi'`
4. Push yapın: `git push origin feature/yeni-ozellik`
5. Pull request oluşturun

## Lisans

Bu proje MIT lisansı altında dağıtılmaktadır.

## Destek

Sorular veya destek için:
- E-posta: destek@uetds.com
- Telefon: +90 212 123 45 67

## Sürüm Geçmişi

### v1.0.0
- İlk sürüm
- Temel UETDS entegrasyonu
- Çoklu kiracı desteği
- Çevrimdışı çalışma