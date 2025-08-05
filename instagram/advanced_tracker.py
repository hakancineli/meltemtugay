#!/usr/bin/env python3
"""
Gelişmiş Instagram Takip Sistemi
"""

import time
import logging
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from config import Config
from database import DatabaseManager
from notification import NotificationManager

class AdvancedTracker:
    def __init__(self):
        self.config = Config()
        self.db = DatabaseManager()
        self.notifier = NotificationManager()
        self.driver = None
        self.wait = None
        self.setup_logging()
    
    def setup_logging(self):
        """Logging ayarlarını yapılandırır"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('advanced_tracker.log'),
                logging.StreamHandler()
            ]
        )
    
    def setup_driver(self):
        """Selenium WebDriver'ı yapılandırır"""
        try:
            chrome_options = Options()
            
            if self.config.BROWSER_HEADLESS:
                chrome_options.add_argument('--headless')
            
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # User agent ayarla
            chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            self.wait = WebDriverWait(self.driver, self.config.BROWSER_TIMEOUT)
            self.driver.set_page_load_timeout(self.config.PAGE_LOAD_TIMEOUT)
            
            logging.info("Gelişmiş takip için WebDriver başlatıldı")
            return True
            
        except Exception as e:
            logging.error(f"WebDriver başlatma hatası: {e}")
            return False
    
    def login_to_instagram(self):
        """Instagram'a giriş yapar"""
        try:
            logging.info("Instagram'a giriş yapılıyor...")
            
            self.driver.get(self.config.INSTAGRAM_LOGIN_URL)
            time.sleep(3)
            
            # Kullanıcı adı girişi
            username_field = self.wait.until(
                EC.presence_of_element_located((By.NAME, "username"))
            )
            username_field.clear()
            username_field.send_keys(self.config.INSTAGRAM_USERNAME)
            
            # Şifre girişi
            password_field = self.driver.find_element(By.NAME, "password")
            password_field.clear()
            password_field.send_keys(self.config.INSTAGRAM_PASSWORD)
            
            # Giriş butonu
            login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            login_button.click()
            
            # 2FA kontrolü (eğer varsa)
            time.sleep(5)
            if "checkpoint" in self.driver.current_url:
                logging.warning("2FA doğrulaması gerekli! Manuel olarak tamamlayın.")
                input("2FA doğrulamasını tamamladıktan sonra Enter'a basın...")
            
            # Ana sayfaya yönlendirme kontrolü
            self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//nav"))
            )
            
            logging.info("Instagram'a başarıyla giriş yapıldı")
            return True
            
        except Exception as e:
            logging.error(f"Instagram giriş hatası: {e}")
            return False
    
    def check_story_views(self):
        """Story görüntüleyenleri kontrol eder"""
        try:
            print("📸 Story görüntüleyenler kontrol ediliyor...")
            
            # Profil sayfasına git
            profile_url = f"{self.config.INSTAGRAM_BASE_URL}{self.config.INSTAGRAM_USERNAME}/"
            self.driver.get(profile_url)
            time.sleep(3)
            
            # Story butonunu bul ve tıkla
            try:
                story_button = self.driver.find_element(
                    By.XPATH, "//div[contains(@class, 'story') or contains(@class, 'Story')]//button"
                )
                story_button.click()
                time.sleep(2)
                print("✅ Story açıldı")
                
                # Story görüntüleyenleri bul
                viewer_elements = self.driver.find_elements(
                    By.XPATH, "//div[@role='dialog']//a[@role='link']"
                )
                
                new_viewers = []
                for element in viewer_elements:
                    try:
                        href = element.get_attribute("href")
                        if href and '/p/' not in href and href != profile_url:
                            username = href.split("/")[-2]
                            if username and username != self.config.INSTAGRAM_USERNAME:
                                # Kullanıcı adını al
                                try:
                                    username_element = element.find_element(By.XPATH, ".//span[contains(@class, '_aacl')]")
                                    full_name = username_element.text if username_element else ""
                                except:
                                    full_name = ""
                                
                                new_viewers.append((username, full_name))
                                print(f"👁️ Story görüntüleyen: {username}")
                    except:
                        continue
                
                # Yeni görüntüleyenleri veritabanına ekle
                for username, full_name in new_viewers:
                    self.db.add_profile_viewer(username, full_name)
                    logging.info(f"🔴 YENİ STORY GÖRÜNTÜLEYEN: {username}")
                    
                    # Bildirim gönder
                    message = f"📸 Story görüntüleyen: {username}"
                    if full_name:
                        message += f" ({full_name})"
                    self.notifier.send_notification(message)
                
                return len(new_viewers)
                
            except Exception as e:
                print(f"⚠️ Story kontrolü hatası: {e}")
                return 0
            
        except Exception as e:
            logging.error(f"Story görüntüleme kontrolü hatası: {e}")
            return 0
    
    def check_direct_messages(self):
        """Direct mesajları kontrol eder"""
        try:
            print("💬 Direct mesajlar kontrol ediliyor...")
            
            # Direct mesajlar sayfasına git
            self.driver.get(f"{self.config.INSTAGRAM_BASE_URL}direct/inbox/")
            time.sleep(3)
            
            # Mesaj elementlerini bul
            message_elements = self.driver.find_elements(
                By.XPATH, "//div[contains(@class, 'message') or contains(@class, 'conversation')]//a"
            )
            
            new_activities = []
            for element in message_elements:
                try:
                    href = element.get_attribute("href")
                    if href and '/p/' not in href:
                        username = href.split("/")[-2]
                        if username and username != self.config.INSTAGRAM_USERNAME:
                            # Kullanıcı adını al
                            try:
                                username_element = element.find_element(By.XPATH, ".//span[contains(@class, '_aacl')]")
                                full_name = username_element.text if username_element else ""
                            except:
                                full_name = ""
                            
                            new_activities.append((username, full_name))
                            print(f"💬 Mesaj aktivitesi: {username}")
                except:
                    continue
            
            # Yeni aktiviteleri veritabanına ekle
            for username, full_name in new_activities:
                self.db.add_profile_viewer(username, full_name)
                logging.info(f"🔴 YENİ MESAJ AKTİVİTESİ: {username}")
                
                # Bildirim gönder
                message = f"💬 Mesaj aktivitesi: {username}"
                if full_name:
                    message += f" ({full_name})"
                self.notifier.send_notification(message)
            
            return len(new_activities)
            
        except Exception as e:
            logging.error(f"Direct mesaj kontrolü hatası: {e}")
            return 0
    
    def check_followers_changes(self):
        """Takipçi değişikliklerini kontrol eder"""
        try:
            print("👥 Takipçi değişiklikleri kontrol ediliyor...")
            
            # Profil sayfasına git
            profile_url = f"{self.config.INSTAGRAM_BASE_URL}{self.config.INSTAGRAM_USERNAME}/"
            self.driver.get(profile_url)
            time.sleep(3)
            
            # Takipçi sayısını al
            try:
                followers_element = self.driver.find_element(
                    By.XPATH, "//a[contains(@href, '/followers/')]//span"
                )
                current_followers = followers_element.text
                print(f"📊 Mevcut takipçi sayısı: {current_followers}")
            except:
                print("⚠️ Takipçi sayısı alınamadı")
                return 0
            
            # Takipçi listesini kontrol et
            try:
                followers_link = self.driver.find_element(By.XPATH, "//a[contains(@href, '/followers/')]")
                self.driver.execute_script("arguments[0].click();", followers_link)
                time.sleep(2)
                
                follower_elements = self.driver.find_elements(
                    By.XPATH, "//div[@role='dialog']//a[@role='link']"
                )
                
                new_followers = []
                for element in follower_elements:
                    try:
                        href = element.get_attribute("href")
                        if href and '/p/' not in href and href != profile_url:
                            username = href.split("/")[-2]
                            if username and username != self.config.INSTAGRAM_USERNAME:
                                # Kullanıcı adını al
                                try:
                                    username_element = element.find_element(By.XPATH, ".//span[contains(@class, '_aacl')]")
                                    full_name = username_element.text if username_element else ""
                                except:
                                    full_name = ""
                                
                                new_followers.append((username, full_name))
                                print(f"👥 Yeni takipçi: {username}")
                    except:
                        continue
                
                # Yeni takipçileri veritabanına ekle
                for username, full_name in new_followers:
                    self.db.add_follower(username, full_name)
                    logging.info(f"🔴 YENİ TAKİPÇİ: {username}")
                    
                    # Bildirim gönder
                    message = f"👥 Yeni takipçi: {username}"
                    if full_name:
                        message += f" ({full_name})"
                    self.notifier.send_notification(message)
                
                return len(new_followers)
                
            except Exception as e:
                print(f"⚠️ Takipçi listesi kontrolü hatası: {e}")
                return 0
            
        except Exception as e:
            logging.error(f"Takipçi değişiklik kontrolü hatası: {e}")
            return 0
    
    def check_blocked_users(self):
        """Engellenen kullanıcıları kontrol eder"""
        try:
            print("🚫 Engellenen kullanıcılar kontrol ediliyor...")
            
            # Takipçi listesini al
            followers = self.get_followers_list()
            
            blocked_count = 0
            for username, _ in followers:
                is_blocked = self.check_user_blocked_me(username)
                if is_blocked:
                    # Durumu güncelle
                    self.db.update_block_status(username, True)
                    blocked_count += 1
                    print(f"🚫 Engellenen kullanıcı: {username}")
                    logging.info(f"🔴 YENİ ENGELLEYEN: {username}")
                    
                    # Bildirim gönder
                    message = f"🚫 Sizi engelleyen kullanıcı: {username}"
                    self.notifier.send_notification(message)
                
                time.sleep(0.5)  # Rate limiting
            
            return blocked_count
            
        except Exception as e:
            logging.error(f"Engellenen kullanıcı kontrolü hatası: {e}")
            return 0
    
    def get_followers_list(self):
        """Takipçi listesini alır"""
        try:
            # Profil sayfasına git
            profile_url = f"{self.config.INSTAGRAM_BASE_URL}{self.config.INSTAGRAM_USERNAME}/"
            self.driver.get(profile_url)
            time.sleep(2)
            
            # Takipçi sayısına tıkla
            try:
                followers_link = self.driver.find_element(By.XPATH, "//a[contains(@href, '/followers/')]")
                self.driver.execute_script("arguments[0].click();", followers_link)
                time.sleep(2)
                
                followers = []
                follower_elements = self.driver.find_elements(
                    By.XPATH, "//div[@role='dialog']//a[@role='link']"
                )
                
                for element in follower_elements:
                    try:
                        href = element.get_attribute("href")
                        if href and '/p/' not in href and href != profile_url:
                            username = href.split("/")[-2]
                            if username:
                                followers.append((username, ""))
                    except:
                        continue
                
                return followers
                
            except Exception as e:
                logging.warning(f"Takipçi listesi alma hatası: {e}")
                return []
            
        except Exception as e:
            logging.error(f"Takipçi listesi hatası: {e}")
            return []
    
    def check_user_blocked_me(self, username):
        """Kullanıcının beni engelleyip engellemediğini kontrol eder"""
        try:
            user_profile_url = f"{self.config.INSTAGRAM_BASE_URL}{username}/"
            self.driver.get(user_profile_url)
            time.sleep(1)
            
            page_source = self.driver.page_source.lower()
            
            blocked_indicators = [
                "this page is not available",
                "user not found",
                "page not found",
                "kullanıcı bulunamadı",
                "sayfa bulunamadı",
                "sorry, this page isn't available",
                "üzgünüz, bu sayfa mevcut değil"
            ]
            
            for indicator in blocked_indicators:
                if indicator in page_source:
                    return True
            
            return False
            
        except Exception as e:
            logging.error(f"Engelleme kontrolü hatası ({username}): {e}")
            return False
    
    def run_advanced_scan(self):
        """Gelişmiş tarama çalıştırır"""
        try:
            logging.info("🚀 Gelişmiş tarama başlatılıyor...")
            
            if not self.setup_driver():
                return False
            
            if not self.login_to_instagram():
                return False
            
            print("✅ Gelişmiş tarama başlatıldı!")
            print("🔍 Farklı yöntemlerle aktiviteler tespit ediliyor...")
            
            total_detections = 0
            
            # 1. Story görüntüleyenleri kontrol et
            story_viewers = self.check_story_views()
            if story_viewers > 0:
                print(f"📸 {story_viewers} story görüntüleyen tespit edildi!")
                total_detections += story_viewers
            
            # 2. Direct mesajları kontrol et
            message_activities = self.check_direct_messages()
            if message_activities > 0:
                print(f"💬 {message_activities} mesaj aktivitesi tespit edildi!")
                total_detections += message_activities
            
            # 3. Takipçi değişikliklerini kontrol et
            follower_changes = self.check_followers_changes()
            if follower_changes > 0:
                print(f"👥 {follower_changes} takipçi değişikliği tespit edildi!")
                total_detections += follower_changes
            
            # 4. Engellenen kullanıcıları kontrol et
            blocked_users = self.check_blocked_users()
            if blocked_users > 0:
                print(f"🚫 {blocked_users} engellenen kullanıcı tespit edildi!")
                total_detections += blocked_users
            
            print(f"\n🎯 Toplam {total_detections} aktivite tespit edildi!")
            
            return True
            
        except Exception as e:
            logging.error(f"Gelişmiş tarama hatası: {e}")
            return False
        
        finally:
            if self.driver:
                self.driver.quit()

def main():
    """Ana fonksiyon"""
    tracker = AdvancedTracker()
    
    print("🔴 GELİŞMİŞ INSTAGRAM TAKİP SİSTEMİ")
    print("=" * 40)
    print("Bu sistem:")
    print("• Story görüntüleyenleri tespit eder")
    print("• Direct mesaj aktivitelerini tespit eder")
    print("• Takipçi değişikliklerini tespit eder")
    print("• Engellenen kullanıcıları tespit eder")
    print("=" * 40)
    
    try:
        tracker.run_advanced_scan()
    except KeyboardInterrupt:
        print("\n👋 Tarama sonlandırıldı.")
    except Exception as e:
        print(f"❌ Hata: {e}")

if __name__ == "__main__":
    main() 