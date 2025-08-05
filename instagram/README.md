# Instagram Engelleme Takip Sistemi

Bu sistem, Instagram hesabınızı takip eden kişilerin sizi engelleyip engelini kaldırdığını otomatik olarak tespit eden bir Python uygulamasıdır.

## 🎯 Özellikler

- **Otomatik Takipçi Tarama**: Instagram takipçi listenizi düzenli olarak tarar
- **Engelleme Tespiti**: Sizi engelleyen kullanıcıları otomatik tespit eder
- **Engel Kaldırma Tespiti**: Engelini kaldıran kullanıcıları geçmiş kayıtlarla karşılaştırarak tespit eder
- **Bildirim Sistemi**: Telegram, WhatsApp veya e-posta ile anlık bildirimler
- **Veritabanı Kaydı**: Tüm değişiklikleri SQLite veritabanında saklar
- **Zamanlanmış Tarama**: Belirli aralıklarla otomatik tarama yapar

## 📋 Gereksinimler

- Python 3.8+
- Chrome tarayıcısı
- ChromeDriver (otomatik yüklenir)
- Instagram hesabı

## 🚀 Kurulum

### 1. Projeyi İndirin
```bash
git clone <repository-url>
cd instagram
```

### 2. Gerekli Paketleri Yükleyin
```bash
pip install -r requirements.txt
```

### 3. ChromeDriver'ı Yükleyin
```bash
# macOS için
brew install chromedriver

# Linux için
sudo apt-get install chromium-chromedriver

# Windows için
# ChromeDriver'ı manuel olarak indirin ve PATH'e ekleyin
```

### 4. Konfigürasyon
`env_example.txt` dosyasını `.env` olarak kopyalayın ve bilgilerinizi girin:

```bash
cp env_example.txt .env
```

`.env` dosyasını düzenleyin:
```env
# Instagram Bilgileri
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password

# Telegram Bot Bilgileri (Opsiyonel)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Sistem Ayarları
SCAN_INTERVAL_HOURS=24
LOG_LEVEL=INFO
BROWSER_HEADLESS=True
```

## 🔧 Kullanım

### Temel Kullanım
```bash
python main.py
```

### Program Menüsü
1. **Tek seferlik tarama yap**: Hemen bir tarama çalıştırır
2. **Zamanlanmış taramayı başlat**: Otomatik tarama başlatır
3. **Mevcut durumu göster**: Son durumu raporlar
4. **Çıkış**: Programı sonlandırır

### Komut Satırı Kullanımı
```bash
# Tek seferlik tarama
python -c "from main import InstagramMonitor; InstagramMonitor().run_scan()"

# Durum raporu
python -c "from main import InstagramMonitor; InstagramMonitor().show_current_status()"
```

## 📱 Bildirim Kurulumu

### Telegram Bot Kurulumu
1. @BotFather ile bot oluşturun
2. Bot token'ını alın
3. Bot ile konuşun ve chat ID'nizi alın
4. `.env` dosyasına ekleyin

### WhatsApp API Kurulumu
1. WhatsApp Business API hesabı oluşturun
2. API key alın
3. `.env` dosyasına ekleyin

## 🗄️ Veritabanı Yapısı

### Tablolar
- **followers**: Takipçi bilgileri
- **block_history**: Engelleme geçmişi
- **system_logs**: Sistem logları

### Veri Örnekleri
```sql
-- Engelleyen kullanıcılar
SELECT username, full_name, first_seen, last_updated 
FROM followers 
WHERE is_blocked = TRUE;

-- Son değişiklikler
SELECT username, action, timestamp 
FROM block_history 
WHERE timestamp >= datetime('now', '-24 hours');
```

## ⚙️ Konfigürasyon Seçenekleri

| Ayar | Açıklama | Varsayılan |
|------|----------|------------|
| `SCAN_INTERVAL_HOURS` | Tarama aralığı (saat) | 24 |
| `LOG_LEVEL` | Log seviyesi | INFO |
| `BROWSER_HEADLESS` | Tarayıcı görünmez mod | True |
| `BROWSER_TIMEOUT` | Tarayıcı zaman aşımı | 30 |
| `PAGE_LOAD_TIMEOUT` | Sayfa yükleme zaman aşımı | 60 |

## 🔒 Güvenlik

- **Şifreler**: `.env` dosyasında güvenli şekilde saklanır
- **Rate Limiting**: Instagram'ın kısıtlamalarını aşmamak için bekleme süreleri
- **User Agent**: Gerçek tarayıcı simülasyonu
- **2FA Desteği**: İki faktörlü doğrulama desteği

## 📊 Log Dosyaları

- `instagram_monitor.log`: Ana log dosyası
- `instagram_monitor.db`: SQLite veritabanı

## 🚨 Sorun Giderme

### Yaygın Sorunlar

1. **ChromeDriver Hatası**
   ```bash
   # ChromeDriver'ı güncelleyin
   pip install --upgrade webdriver-manager
   ```

2. **Instagram Giriş Hatası**
   - 2FA aktifse manuel doğrulama gerekir
   - Şifrenizi kontrol edin
   - Instagram hesabınızın kilitli olmadığından emin olun

3. **Rate Limiting**
   - Tarama aralığını artırın
   - Instagram'ın kısıtlamalarını bekleyin

### Debug Modu
```bash
# Debug logları için
LOG_LEVEL=DEBUG python main.py
```

## 📈 Performans

- **Tarama Süresi**: Takipçi sayısına bağlı (1000 takipçi ≈ 15-20 dakika)
- **Bellek Kullanımı**: ~100-200 MB
- **CPU Kullanımı**: Düşük (tarama sırasında artar)

## 🔄 Otomatik Çalıştırma

### Cron Job (Linux/macOS)
```bash
# Her gün saat 09:00'da çalıştır
0 9 * * * cd /path/to/instagram && python main.py
```

### Windows Task Scheduler
1. Görev Zamanlayıcısını açın
2. Yeni görev oluşturun
3. Program: `python`
4. Argümanlar: `main.py`
5. Zamanlamayı ayarlayın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## ⚠️ Uyarılar

- Instagram'ın kullanım şartlarına uygun kullanın
- Aşırı kullanımdan kaçının
- Hesabınızın güvenliğini koruyun
- Bu araç eğitim amaçlıdır

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Sorunlarınız için:
- GitHub Issues kullanın
- Detaylı log dosyalarını ekleyin
- Sistem bilgilerinizi paylaşın

---

**Not**: Bu sistem Instagram'ın resmi API'sini kullanmaz ve web scraping yöntemiyle çalışır. Instagram'ın kullanım şartlarına uygun kullanım kullanıcının sorumluluğundadır. 