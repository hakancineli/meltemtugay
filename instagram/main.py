#!/usr/bin/env python3
"""
Instagram Engelleme Takip Sistemi
Ana program dosyası
"""

import time
import schedule
import logging
from datetime import datetime
from instagram_scraper_simple import InstagramScraperSimple as InstagramScraper
from notification import NotificationManager
from database import DatabaseManager
from config import Config

class InstagramMonitor:
    def __init__(self):
        self.config = Config()
        self.scraper = InstagramScraper()
        self.notifier = NotificationManager()
        self.db = DatabaseManager()
        self.setup_logging()
    
    def setup_logging(self):
        """Logging ayarlarını yapılandırır"""
        logging.basicConfig(
            level=getattr(logging, self.config.LOG_LEVEL),
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('instagram_monitor.log'),
                logging.StreamHandler()
            ]
        )
    
    def run_scan(self):
        """Tek seferlik tarama çalıştırır"""
        try:
            logging.info("=" * 50)
            logging.info("Instagram taraması başlatılıyor...")
            logging.info(f"Tarih: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            logging.info("=" * 50)
            
            # Tarama yap
            success = self.scraper.scan_followers()
            
            if success:
                # Son değişiklikleri al
                changes_report = self.scraper.get_block_changes_report()
                
                # Raporu logla
                logging.info("Tarama raporu:")
                logging.info(changes_report)
                
                # Bildirim gönderme - sadece log tutuyoruz
                pass
                
                logging.info("Tarama başarıyla tamamlandı!")
            else:
                logging.error("Tarama başarısız oldu!")
            
            return success
            
        except Exception as e:
            logging.error(f"Tarama çalıştırma hatası: {e}")
            return False
    
    def run_scheduled_scan(self):
        """Zamanlanmış tarama çalıştırır"""
        try:
            logging.info("Zamanlanmış tarama çalıştırılıyor...")
            self.run_scan()
        except Exception as e:
            logging.error(f"Zamanlanmış tarama hatası: {e}")
    
    def start_scheduler(self):
        """Zamanlayıcıyı başlatır"""
        try:
            interval_hours = self.config.SCAN_INTERVAL_HOURS
            
            # Günlük tarama zamanla
            schedule.every(interval_hours).hours.do(self.run_scheduled_scan)
            
            logging.info(f"Zamanlayıcı başlatıldı. Her {interval_hours} saatte bir tarama yapılacak.")
            
            # İlk taramayı hemen çalıştır
            self.run_scan()
            
            # Zamanlayıcıyı çalıştır
            while True:
                schedule.run_pending()
                time.sleep(60)  # Her dakika kontrol et
                
        except KeyboardInterrupt:
            logging.info("Program kullanıcı tarafından durduruldu.")
        except Exception as e:
            logging.error(f"Zamanlayıcı hatası: {e}")
    
    def show_current_status(self):
        """Mevcut durumu gösterir"""
        try:
            blocked_users = self.db.get_blocked_users()
            recent_changes = self.db.get_recent_block_changes(24)
            
            print("\n" + "=" * 50)
            print("INSTAGRAM ENGELLEME TAKİP SİSTEMİ - DURUM RAPORU")
            print("=" * 50)
            print(f"Rapor Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"Toplam Engelleyen Kullanıcı: {len(blocked_users)}")
            print(f"Son 24 Saatteki Değişiklik: {len(recent_changes)}")
            print("=" * 50)
            
            if blocked_users:
                print("\n🔴 ENGELLEYEN KULLANICILAR:")
                for username, full_name, first_seen, last_updated in blocked_users:
                    print(f"• {username} ({full_name or 'İsim yok'})")
                    print(f"  İlk görülme: {first_seen}")
                    print(f"  Son güncelleme: {last_updated}")
                    print()
            
            if recent_changes:
                print("\n📊 SON DEĞİŞİKLİKLER:")
                for username, action, timestamp in recent_changes:
                    action_text = "engelledi" if action == "blocked" else "engelini kaldırdı"
                    print(f"• {username} - {action_text} ({timestamp})")
            
            print("=" * 50)
            
        except Exception as e:
            logging.error(f"Durum gösterme hatası: {e}")

def main():
    """Ana fonksiyon"""
    print("Instagram Engelleme Takip Sistemi")
    print("=" * 40)
    
    monitor = InstagramMonitor()
    
    while True:
        print("\nSeçenekler:")
        print("1. Tek seferlik tarama yap")
        print("2. Canlı takip başlat")
        print("3. Zamanlanmış taramayı başlat")
        print("4. Mevcut durumu göster")
        print("5. Çıkış")
        
        choice = input("\nSeçiminizi yapın (1-5): ").strip()
        
        if choice == "1":
            print("\nTek seferlik tarama başlatılıyor...")
            monitor.run_scan()
            
        elif choice == "2":
            print("\nCanlı takip başlatılıyor...")
            from live_tracker import LiveTracker
            tracker = LiveTracker()
            tracker.start_live_tracking()
            
        elif choice == "3":
            print("\nZamanlanmış tarama başlatılıyor...")
            print("Programı durdurmak için Ctrl+C kullanın.")
            monitor.start_scheduler()
            
        elif choice == "4":
            monitor.show_current_status()
            
        elif choice == "5":
            print("Program sonlandırılıyor...")
            break
            
        else:
            print("Geçersiz seçim! Lütfen 1-5 arası bir sayı girin.")

if __name__ == "__main__":
    main() 