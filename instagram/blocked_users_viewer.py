#!/usr/bin/env python3
"""
Engellenen Kullanıcıları Görüntüleme Modülü
"""

from database import DatabaseManager
from datetime import datetime

class BlockedUsersViewer:
    def __init__(self):
        self.db = DatabaseManager()
    
    def show_blocked_users(self):
        """Engellenen kullanıcıları gösterir"""
        try:
            blocked_users = self.db.get_blocked_users()
            
            print("\n" + "=" * 60)
            print("🔴 SİZİ ENGELLEYEN KULLANICILAR LİSTESİ")
            print("=" * 60)
            print(f"📅 Rapor Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"📊 Toplam Engelleyen: {len(blocked_users)}")
            print("=" * 60)
            
            if not blocked_users:
                print("✅ Henüz sizi engelleyen kullanıcı bulunamadı.")
                return
            
            for i, (username, full_name, first_seen, last_updated) in enumerate(blocked_users, 1):
                print(f"\n{i}. 👤 {username}")
                if full_name:
                    print(f"   📝 İsim: {full_name}")
                print(f"   📅 İlk Görülme: {first_seen}")
                print(f"   🔄 Son Güncelleme: {last_updated}")
                print("   " + "-" * 40)
            
            print("\n" + "=" * 60)
            
        except Exception as e:
            print(f"❌ Hata: {e}")
    
    def show_profile_viewers(self):
        """Profil görüntüleyenleri gösterir"""
        try:
            profile_viewers = self.db.get_profile_viewers()
            
            print("\n" + "=" * 60)
            print("👁️ PROFİL GÖRÜNTÜLEYENLER LİSTESİ")
            print("=" * 60)
            print(f"📅 Rapor Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"📊 Toplam Görüntüleyen: {len(profile_viewers)}")
            print("=" * 60)
            
            if not profile_viewers:
                print("✅ Henüz profil görüntüleyen bulunamadı.")
                return
            
            for i, (username, full_name, first_seen, last_seen, view_count) in enumerate(profile_viewers, 1):
                print(f"\n{i}. 👤 {username}")
                if full_name:
                    print(f"   📝 İsim: {full_name}")
                print(f"   📅 İlk Görülme: {first_seen}")
                print(f"   🔄 Son Görülme: {last_seen}")
                print(f"   👁️ Görüntüleme Sayısı: {view_count}")
                print("   " + "-" * 40)
            
            print("\n" + "=" * 60)
            
        except Exception as e:
            print(f"❌ Hata: {e}")
    
    def show_recent_changes(self, hours=24):
        """Son değişiklikleri gösterir"""
        try:
            changes = self.db.get_recent_block_changes(hours)
            
            print("\n" + "=" * 60)
            print("📊 SON DEĞİŞİKLİKLER")
            print("=" * 60)
            print(f"⏰ Son {hours} saat")
            print(f"📈 Toplam Değişiklik: {len(changes)}")
            print("=" * 60)
            
            if not changes:
                print("✅ Son 24 saatte değişiklik bulunamadı.")
                return
            
            for i, (username, action, timestamp) in enumerate(changes, 1):
                action_icon = "🔴" if action == "blocked" else "🟢"
                action_text = "sizi engelledi" if action == "blocked" else "engelini kaldırdı"
                
                print(f"\n{i}. {action_icon} {username}")
                print(f"   📝 İşlem: {action_text}")
                print(f"   ⏰ Zaman: {timestamp}")
                print("   " + "-" * 40)
            
            print("\n" + "=" * 60)
            
        except Exception as e:
            print(f"❌ Hata: {e}")
    
    def export_to_file(self, filename="engellenen_kullanicilar.txt"):
        """Engellenen kullanıcıları dosyaya kaydeder"""
        try:
            blocked_users = self.db.get_blocked_users()
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write("ENGELLEYEN KULLANICILAR LİSTESİ\n")
                f.write("=" * 50 + "\n")
                f.write(f"Rapor Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"Toplam Engelleyen: {len(blocked_users)}\n")
                f.write("=" * 50 + "\n\n")
                
                for i, (username, full_name, first_seen, last_updated) in enumerate(blocked_users, 1):
                    f.write(f"{i}. {username}\n")
                    if full_name:
                        f.write(f"   İsim: {full_name}\n")
                    f.write(f"   İlk Görülme: {first_seen}\n")
                    f.write(f"   Son Güncelleme: {last_updated}\n")
                    f.write("   " + "-" * 30 + "\n\n")
            
            print(f"✅ Liste {filename} dosyasına kaydedildi!")
            
        except Exception as e:
            print(f"❌ Dosya kaydetme hatası: {e}")

def main():
    """Ana fonksiyon"""
    viewer = BlockedUsersViewer()
    
    while True:
        print("\n🔍 SİZİ ENGELLEYEN KULLANICILAR GÖRÜNTÜLEYİCİ")
        print("=" * 40)
        print("1. Sizi engelleyen kullanıcıları göster")
        print("2. Profil görüntüleyenleri göster")
        print("3. Son değişiklikleri göster")
        print("4. Listeyi dosyaya kaydet")
        print("5. Çıkış")
        
        choice = input("\nSeçiminizi yapın (1-5): ").strip()
        
        if choice == "1":
            viewer.show_blocked_users()
        elif choice == "2":
            viewer.show_profile_viewers()
        elif choice == "3":
            hours = input("Kaç saatlik değişiklik? (varsayılan: 24): ").strip()
            hours = int(hours) if hours.isdigit() else 24
            viewer.show_recent_changes(hours)
        elif choice == "4":
            filename = input("Dosya adı (varsayılan: engellenen_kullanicilar.txt): ").strip()
            filename = filename if filename else "engellenen_kullanicilar.txt"
            viewer.export_to_file(filename)
        elif choice == "5":
            print("👋 Çıkılıyor...")
            break
        else:
            print("❌ Geçersiz seçim!")

if __name__ == "__main__":
    main() 