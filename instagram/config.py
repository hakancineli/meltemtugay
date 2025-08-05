import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Instagram Bilgileri
    INSTAGRAM_USERNAME = os.getenv('INSTAGRAM_USERNAME')
    INSTAGRAM_PASSWORD = os.getenv('INSTAGRAM_PASSWORD')
    
    # Telegram Bot Bilgileri (Opsiyonel)
    TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
    TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')
    
    # WhatsApp API Bilgileri (Opsiyonel)
    WHATSAPP_API_KEY = os.getenv('WHATSAPP_API_KEY')
    WHATSAPP_PHONE_NUMBER = os.getenv('WHATSAPP_PHONE_NUMBER')
    
    # Sistem Ayarları
    SCAN_INTERVAL_HOURS = int(os.getenv('SCAN_INTERVAL_HOURS', 24))  # Varsayılan 24 saat
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    # Veritabanı
    DATABASE_PATH = 'instagram_monitor.db'
    
    # Instagram URL'leri
    INSTAGRAM_LOGIN_URL = 'https://www.instagram.com/accounts/login/'
    INSTAGRAM_BASE_URL = 'https://www.instagram.com/'
    
    # Tarayıcı Ayarları
    BROWSER_HEADLESS = os.getenv('BROWSER_HEADLESS', 'True').lower() == 'true'
    BROWSER_TIMEOUT = 30
    PAGE_LOAD_TIMEOUT = 60 