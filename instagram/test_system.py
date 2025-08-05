#!/usr/bin/env python3
"""
Instagram Engelleme Takip Sistemi - Test Scripti
"""

import os
import sys
import sqlite3
from datetime import datetime

def test_database():
    """Veritabanı işlevlerini test eder"""
    print("🗄️  Veritabanı testi...")
    
    try:
        from database import DatabaseManager
        db = DatabaseManager()
        
        # Test verisi ekle
        db.add_follower("test_user1", "Test User 1")
        db.add_follower("test_user2", "Test User 2")
        
        # Engelleme durumu güncelle
        db.update_block_status("test_user1", True)
        db.update_block_status("test_user2", False)
        
        # Verileri kontrol et
        blocked_users = db.get_blocked_users()
        recent_changes = db.get_recent_block_changes(24)
        
        print(f"✅ Veritabanı testi başarılı!")
        print(f"   - Engelleyen kullanıcı sayısı: {len(blocked_users)}")
        print(f"   - Son değişiklik sayısı: {len(recent_changes)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Veritabanı testi başarısız: {e}")
        return False

def test_config():
    """Konfigürasyon dosyasını test eder"""
    print("⚙️  Konfigürasyon testi...")
    
    try:
        from config import Config
        config = Config()
        
        print(f"✅ Konfigürasyon testi başarılı!")
        print(f"   - Tarama aralığı: {config.SCAN_INTERVAL_HOURS} saat")
        print(f"   - Log seviyesi: {config.LOG_LEVEL}")
        print(f"   - Headless mod: {config.BROWSER_HEADLESS}")
        
        return True
        
    except Exception as e:
        print(f"❌ Konfigürasyon testi başarısız: {e}")
        return False

def test_notification():
    """Bildirim sistemini test eder"""
    print("📱 Bildirim sistemi testi...")
    
    try:
        from notification import NotificationManager
        notifier = NotificationManager()
        
        # Test mesajı gönder (gerçek gönderim yapmaz)
        test_message = "🧪 Test bildirimi - " + datetime.now().strftime("%H:%M:%S")
        
        print(f"✅ Bildirim sistemi testi başarılı!")
        print(f"   - Test mesajı: {test_message}")
        
        return True
        
    except Exception as e:
        print(f"❌ Bildirim sistemi testi başarısız: {e}")
        return False

def test_requirements():
    """Gerekli paketlerin varlığını test eder"""
    print("📦 Paket testi...")
    
    required_packages = [
        'selenium',
        'requests', 
        'schedule',
        'dotenv'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Eksik paketler: {', '.join(missing_packages)}")
        print("   pip install -r requirements.txt komutunu çalıştırın.")
        return False
    
    print("✅ Tüm paketler mevcut!")
    return True

def test_files():
    """Gerekli dosyaların varlığını test eder"""
    print("📁 Dosya testi...")
    
    required_files = [
        'config.py',
        'database.py',
        'instagram_scraper.py', 
        'notification.py',
        'main.py',
        'requirements.txt',
        'README.md'
    ]
    
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Eksik dosyalar: {', '.join(missing_files)}")
        return False
    
    print("✅ Tüm dosyalar mevcut!")
    return True

def main():
    """Ana test fonksiyonu"""
    print("🧪 Instagram Engelleme Takip Sistemi - Test")
    print("=" * 50)
    
    tests = [
        ("Dosya Kontrolü", test_files),
        ("Paket Kontrolü", test_requirements),
        ("Konfigürasyon", test_config),
        ("Veritabanı", test_database),
        ("Bildirim Sistemi", test_notification)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 {test_name}...")
        if test_func():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Test Sonuçları: {passed}/{total} başarılı")
    
    if passed == total:
        print("🎉 Tüm testler başarılı! Sistem kullanıma hazır.")
        print("\n🚀 Sistemi başlatmak için:")
        print("   python main.py")
        print("   veya")
        print("   python run.py")
    else:
        print("⚠️  Bazı testler başarısız. Lütfen sorunları çözün.")
        sys.exit(1)

if __name__ == "__main__":
    main() 