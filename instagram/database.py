import sqlite3
import json
from datetime import datetime
from config import Config
import logging

class DatabaseManager:
    def __init__(self):
        self.db_path = Config.DATABASE_PATH
        self.init_database()
    
    def init_database(self):
        """Veritabanını ve tabloları oluşturur"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Takipçiler tablosu
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS followers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        full_name TEXT,
                        is_blocked BOOLEAN DEFAULT FALSE,
                        first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                # Engelleme geçmişi tablosu
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS block_history (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        action TEXT NOT NULL,  -- 'blocked' veya 'unblocked'
                        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (username) REFERENCES followers (username)
                    )
                ''')
                
                # Sistem logları tablosu
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS system_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        log_level TEXT NOT NULL,
                        message TEXT NOT NULL,
                        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                # Profil görüntüleyenler tablosu
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS profile_viewers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        full_name TEXT,
                        first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        view_count INTEGER DEFAULT 1
                    )
                ''')
                
                conn.commit()
                logging.info("Veritabanı başarıyla başlatıldı")
                
        except Exception as e:
            logging.error(f"Veritabanı başlatma hatası: {e}")
    
    def add_follower(self, username, full_name=None):
        """Yeni takipçi ekler"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT OR REPLACE INTO followers (username, full_name, last_updated)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                ''', (username, full_name))
                conn.commit()
                return True
        except Exception as e:
            logging.error(f"Takipçi ekleme hatası: {e}")
            return False
    
    def update_block_status(self, username, is_blocked):
        """Takipçinin engelleme durumunu günceller"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Mevcut durumu kontrol et
                cursor.execute('SELECT is_blocked FROM followers WHERE username = ?', (username,))
                result = cursor.fetchone()
                
                if result and result[0] != is_blocked:
                    # Durum değişmiş, log ekle
                    action = 'blocked' if is_blocked else 'unblocked'
                    cursor.execute('''
                        INSERT INTO block_history (username, action)
                        VALUES (?, ?)
                    ''', (username, action))
                
                # Takipçi durumunu güncelle
                cursor.execute('''
                    UPDATE followers 
                    SET is_blocked = ?, last_updated = CURRENT_TIMESTAMP
                    WHERE username = ?
                ''', (is_blocked, username))
                
                conn.commit()
                return True
        except Exception as e:
            logging.error(f"Engelleme durumu güncelleme hatası: {e}")
            return False
    
    def get_blocked_users(self):
        """Engelleyen kullanıcıları getirir"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT username, full_name, first_seen, last_updated
                    FROM followers 
                    WHERE is_blocked = TRUE
                ''')
                return cursor.fetchall()
        except Exception as e:
            logging.error(f"Engelleyen kullanıcıları getirme hatası: {e}")
            return []
    
    def get_recent_block_changes(self, hours=24):
        """Son belirtilen saatteki engelleme değişikliklerini getirir"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT username, action, timestamp
                    FROM block_history
                    WHERE timestamp >= datetime('now', '-{} hours')
                    ORDER BY timestamp DESC
                '''.format(hours))
                return cursor.fetchall()
        except Exception as e:
            logging.error(f"Son değişiklikleri getirme hatası: {e}")
            return []
    
    def add_system_log(self, level, message):
        """Sistem logu ekler"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO system_logs (log_level, message)
                    VALUES (?, ?)
                ''', (level, message))
                conn.commit()
        except Exception as e:
            logging.error(f"Sistem logu ekleme hatası: {e}")
    
    def clear_test_data(self):
        """Test verilerini temizler"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM followers WHERE username LIKE 'test_%'")
                cursor.execute("DELETE FROM block_history WHERE username LIKE 'test_%'")
                cursor.execute("DELETE FROM profile_viewers WHERE username LIKE 'test_%'")
                conn.commit()
                logging.info("Test verileri temizlendi")
        except Exception as e:
            logging.error(f"Test verileri temizleme hatası: {e}")
    
    def add_profile_viewer(self, username, full_name=None):
        """Profil görüntüleyen kullanıcıyı ekler"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT OR REPLACE INTO profile_viewers 
                    (username, full_name, last_seen, view_count)
                    VALUES (?, ?, CURRENT_TIMESTAMP, 
                        COALESCE((SELECT view_count FROM profile_viewers WHERE username = ?), 0) + 1)
                ''', (username, full_name, username))
                conn.commit()
                return True
        except Exception as e:
            logging.error(f"Profil görüntüleyen ekleme hatası: {e}")
            return False
    
    def get_profile_viewers(self):
        """Profil görüntüleyen kullanıcıları getirir"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT username, full_name, first_seen, last_seen, view_count
                    FROM profile_viewers 
                    ORDER BY last_seen DESC
                ''')
                return cursor.fetchall()
        except Exception as e:
            logging.error(f"Profil görüntüleyenleri getirme hatası: {e}")
            return []
    
    def get_recent_profile_viewers(self, hours=24):
        """Son belirtilen saatteki profil görüntüleyenleri getirir"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT username, full_name, last_seen, view_count
                    FROM profile_viewers
                    WHERE last_seen >= datetime('now', '-{} hours')
                    ORDER BY last_seen DESC
                '''.format(hours))
                return cursor.fetchall()
        except Exception as e:
            logging.error(f"Son profil görüntüleyenleri getirme hatası: {e}")
            return [] 