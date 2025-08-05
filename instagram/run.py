#!/usr/bin/env python3
"""
Instagram Engelleme Takip Sistemi - Hızlı Başlatma Scripti
"""

import os
import sys

def check_requirements():
    """Gerekli dosyaların varlığını kontrol eder"""
    required_files = [
        'config.py',
        'database.py', 
        'instagram_scraper.py',
        'notification.py',
        'main.py'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Eksik dosyalar:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    return True

def check_env_file():
    """Environment dosyasının varlığını kontrol eder"""
    if not os.path.exists('.env'):
        print("⚠️  .env dosyası bulunamadı!")
        print("📝 env_example.txt dosyasını .env olarak kopyalayın ve bilgilerinizi girin.")
        print("   cp env_example.txt .env")
        return False
    return True

def main():
    """Ana fonksiyon"""
    print("🔍 Instagram Engelleme Takip Sistemi")
    print("=" * 50)
    
    # Gerekli dosyaları kontrol et
    if not check_requirements():
        print("\n❌ Sistem başlatılamadı. Eksik dosyaları kontrol edin.")
        sys.exit(1)
    
    # Environment dosyasını kontrol et
    if not check_env_file():
        print("\n⚠️  Konfigürasyon dosyası eksik. Lütfen .env dosyasını oluşturun.")
        sys.exit(1)
    
    print("✅ Tüm dosyalar mevcut!")
    print("🚀 Sistem başlatılıyor...\n")
    
    # Ana programı çalıştır
    try:
        from main import main as run_main
        run_main()
    except KeyboardInterrupt:
        print("\n👋 Program kullanıcı tarafından durduruldu.")
    except Exception as e:
        print(f"\n❌ Program hatası: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 