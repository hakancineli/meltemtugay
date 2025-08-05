#!/usr/bin/env python3
"""
Manuel Instagram Takip Sistemi
"""

import time
import logging
from datetime import datetime
from database import DatabaseManager
from notification import NotificationManager

class ManualTracker:
    def __init__(self):
        self.db = DatabaseManager()
        self.notifier = NotificationManager()
        self.setup_logging()
    
    def setup_logging(self):
        """Logging ayarlarını yapılandırır"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('manual_tracker.log'),
                logging.StreamHandler()
            ]
        )
    
    def add_test_viewer(self, username, full_name=None):
        """Test amaçlı profil görüntüleyen ekler"""
        try:
            self.db.add_profile_viewer(username, full_name)
            print(f"✅ Profil görüntüleyen eklendi: {username}")
            
            # Bildirim gönder
            message = f"👁️ Yeni profil görüntüleyen: {username}"
            if full_name:
                message += f" ({full_name})"
            self.notifier.send_notification(message)
            
            return True
        except Exception as e:
            print(f"❌ Hata: {e}")
            return False
    
    def add_test_blocker(self, username, full_name=None):
        """Test amaçlı engelleyen kullanıcı ekler"""
        try:
            # Önce takipçi olarak ekle
            self.db.add_follower(username, full_name)
            # Sonra engelledi olarak işaretle
            self.db.update_block_status(username, True)
            
            print(f"✅ Engelleyen kullanıcı eklendi: {username}")
            
            # Bildirim gönder
            message = f"🚫 Sizi engelleyen kullanıcı: {username}"
            if full_name:
                message += f" ({full_name})"
            self.notifier.send_notification(message)
            
            return True
        except Exception as e:
            print(f"❌ Hata: {e}")
            return False
    
    def show_current_status(self):
        """Mevcut durumu gösterir"""
        try:
            blocked_users = self.db.get_blocked_users()
            profile_viewers = self.db.get_profile_viewers()
            
            print("\n" + "=" * 60)
            print("📊 MEVCUT DURUM RAPORU")
            print("=" * 60)
            print(f"📅 Rapor Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"🚫 Sizi Engelleyen: {len(blocked_users)}")
            print(f"👁️ Profil Görüntüleyen: {len(profile_viewers)}")
            print("=" * 60)
            
            if blocked_users:
                print("\n🔴 SİZİ ENGELLEYEN KULLANICILAR:")
                for username, full_name, first_seen, last_updated in blocked_users:
                    print(f"• {username} ({full_name or 'İsim yok'})")
                    print(f"  İlk görülme: {first_seen}")
                    print(f"  Son güncelleme: {last_updated}")
                    print()
            
            if profile_viewers:
                print("\n👁️ PROFİL GÖRÜNTÜLEYENLER:")
                for username, full_name, first_seen, last_seen, view_count in profile_viewers:
                    print(f"• {username} ({full_name or 'İsim yok'})")
                    print(f"  İlk görülme: {first_seen}")
                    print(f"  Son görülme: {last_seen}")
                    print(f"  Görüntüleme sayısı: {view_count}")
                    print()
            
            print("=" * 60)
            
        except Exception as e:
            print(f"❌ Hata: {e}")
    
    def clear_all_data(self):
        """Tüm verileri temizler"""
        try:
            self.db.clear_test_data()
            print("✅ Tüm test verileri temizlendi!")
        except Exception as e:
            print(f"❌ Hata: {e}")

def main():
    """Ana fonksiyon"""
    tracker = ManualTracker()
    
    print("🔴 MANUEL INSTAGRAM TAKİP SİSTEMİ")
    print("=" * 40)
    print("Bu sistem test amaçlı kullanılır.")
    print("=" * 40)
    
    while True:
        print("\nSeçenekler:")
        print("1. Profil görüntüleyen ekle")
        print("2. Engelleyen kullanıcı ekle")
        print("3. Mevcut durumu göster")
        print("4. Tüm verileri temizle")
        print("5. Çıkış")
        
        choice = input("\nSeçiminizi yapın (1-5): ").strip()
        
        if choice == "1":
            username = input("Kullanıcı adı: ").strip()
            full_name = input("İsim (opsiyonel): ").strip()
            if username:
                tracker.add_test_viewer(username, full_name if full_name else None)
            else:
                print("❌ Kullanıcı adı gerekli!")
                
        elif choice == "2":
            username = input("Kullanıcı adı: ").strip()
            full_name = input("İsim (opsiyonel): ").strip()
            if username:
                tracker.add_test_blocker(username, full_name if full_name else None)
            else:
                print("❌ Kullanıcı adı gerekli!")
                
        elif choice == "3":
            tracker.show_current_status()
            
        elif choice == "4":
            confirm = input("Tüm verileri silmek istediğinizden emin misiniz? (y/N): ").strip().lower()
            if confirm == 'y':
                tracker.clear_all_data()
            else:
                print("❌ İşlem iptal edildi.")
                
        elif choice == "5":
            print("👋 Çıkılıyor...")
            break
            
        else:
            print("❌ Geçersiz seçim!")

if __name__ == "__main__":
    main() 