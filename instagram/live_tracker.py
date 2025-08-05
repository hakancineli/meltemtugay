#!/usr/bin/env python3
"""
Canlı Instagram Profil Takip Sistemi
"""

import time
import logging
import threading
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from config import Config
from database import DatabaseManager
from notification import NotificationManager

class LiveTracker:
    def __init__(self):
        self.config = Config()
        self.db = DatabaseManager()
        self.notifier = NotificationManager()
        self.driver = None
        self.wait = None
        self.is_running = False
        self.tracked_viewers = set()
        self.setup_logging()
    
    def setup_logging(self):
        """Logging ayarlarını yapılandırır"""
        logging.basicConfig(
            level=getattr(logging, self.config.LOG_LEVEL),
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('live_tracker.log'),
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
            
            logging.info("Canlı takip için WebDriver başlatıldı")
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
    
    def check_profile_views(self):
        """Profil görüntülemelerini kontrol eder"""
        try:
            # Profil sayfasına git
            profile_url = f"{self.config.INSTAGRAM_BASE_URL}{self.config.INSTAGRAM_USERNAME}/"
            self.driver.get(profile_url)
            time.sleep(3)
            
            # Sayfanın tamamen yüklenmesini bekle
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            
            # Profil görüntüleyenler butonunu bul - daha kapsamlı arama
            try:
                # Farklı XPath'leri dene
                xpath_selectors = [
                    "//a[contains(text(), 'Profil görüntüleyenler')]",
                    "//a[contains(text(), 'profile views')]",
                    "//a[contains(text(), 'Profile views')]",
                    "//a[contains(@href, 'profile_views')]",
                    "//button[contains(text(), 'Profil görüntüleyenler')]",
                    "//button[contains(text(), 'profile views')]",
                    "//div[contains(text(), 'Profil görüntüleyenler')]//a",
                    "//div[contains(text(), 'profile views')]//a",
                    "//span[contains(text(), 'Profil görüntüleyenler')]//parent::a",
                    "//span[contains(text(), 'profile views')]//parent::a",
                    "//div[contains(@class, 'profile-views')]//a",
                    "//div[contains(@class, 'profile_views')]//a"
                ]
                
                viewers_button = None
                for xpath in xpath_selectors:
                    try:
                        viewers_button = self.driver.find_element(By.XPATH, xpath)
                        if viewers_button and viewers_button.is_displayed():
                            print(f"✅ Profil görüntüleyenler butonu bulundu: {xpath}")
                            break
                    except:
                        continue
                
                if viewers_button:
                    # JavaScript ile tıkla
                    self.driver.execute_script("arguments[0].click();", viewers_button)
                    time.sleep(3)
                else:
                    print("⚠️ Profil görüntüleyenler butonu bulunamadı - alternatif yöntem kullanılıyor")
                    return self.check_recent_activity()
                
                # Görüntüleyen elementlerini bul
                viewer_elements = self.driver.find_elements(
                    By.XPATH, "//div[@role='dialog']//a[@role='link']"
                )
                
                new_viewers = []
                for element in viewer_elements:
                    try:
                        href = element.get_attribute("href")
                        if href and '/p/' not in href and href != profile_url:
                            username = href.split("/")[-2]
                            if username and username not in self.tracked_viewers:
                                # Kullanıcı adını al
                                try:
                                    username_element = element.find_element(By.XPATH, ".//span[contains(@class, '_aacl')]")
                                    full_name = username_element.text if username_element else ""
                                except:
                                    full_name = ""
                                
                                new_viewers.append((username, full_name))
                                self.tracked_viewers.add(username)
                    except:
                        continue
                
                # Yeni görüntüleyenleri veritabanına ekle
                for username, full_name in new_viewers:
                    self.db.add_profile_viewer(username, full_name)
                    logging.info(f"🔴 YENİ PROFİL GÖRÜNTÜLEYEN: {username}")
                    
                    # Bildirim gönder
                    message = f"👁️ Yeni profil görüntüleyen: {username}"
                    if full_name:
                        message += f" ({full_name})"
                    self.notifier.send_notification(message)
                
                return len(new_viewers)
                
            except Exception as e:
                logging.warning(f"Profil görüntüleyenler kontrolü: {e}")
                return 0
            
        except Exception as e:
            logging.error(f"Profil görüntüleme kontrolü hatası: {e}")
            return 0
    
    def check_recent_activity(self):
        """Son aktiviteleri kontrol eder (alternatif yöntem)"""
        try:
            print("🔍 Son aktiviteler kontrol ediliyor...")
            
            # Ana sayfaya git
            self.driver.get(self.config.INSTAGRAM_BASE_URL)
            time.sleep(3)
            
            # Bildirimler butonunu bul ve tıkla
            try:
                notifications_button = self.driver.find_element(
                    By.XPATH, "//a[contains(@href, '/accounts/activity/') or contains(@aria-label, 'Activity')]"
                )
                notifications_button.click()
                time.sleep(2)
                print("✅ Bildirimler sayfası açıldı")
            except:
                print("⚠️ Bildirimler butonu bulunamadı")
                return 0
            
            # Son aktiviteleri kontrol et
            activity_elements = self.driver.find_elements(
                By.XPATH, "//div[contains(@class, 'activity') or contains(@class, 'notification') or contains(@class, 'feed')]//a"
            )
            
            new_activities = []
            for element in activity_elements:
                try:
                    href = element.get_attribute("href")
                    if href and '/p/' not in href and href != f"{self.config.INSTAGRAM_BASE_URL}{self.config.INSTAGRAM_USERNAME}/":
                        username = href.split("/")[-2]
                        if username and username not in self.tracked_viewers and username != self.config.INSTAGRAM_USERNAME:
                            # Kullanıcı adını al
                            try:
                                username_element = element.find_element(By.XPATH, ".//span[contains(@class, '_aacl')]")
                                full_name = username_element.text if username_element else ""
                            except:
                                full_name = ""
                            
                            new_activities.append((username, full_name))
                            self.tracked_viewers.add(username)
                            print(f"🔍 Yeni aktivite tespit edildi: {username}")
                except:
                    continue
            
            # Yeni aktiviteleri veritabanına ekle
            for username, full_name in new_activities:
                self.db.add_profile_viewer(username, full_name)
                logging.info(f"🔴 YENİ AKTİVİTE: {username}")
                
                # Bildirim gönder
                message = f"👁️ Yeni profil aktivitesi: {username}"
                if full_name:
                    message += f" ({full_name})"
                self.notifier.send_notification(message)
            
            return len(new_activities)
            
        except Exception as e:
            logging.error(f"Aktivite kontrolü hatası: {e}")
            return 0
    
    def check_blocked_users(self):
        """Engellenen kullanıcıları kontrol eder"""
        try:
            # Takipçi listesini kontrol et
            followers = self.get_followers_list()
            
            blocked_count = 0
            for username, _ in followers:
                is_blocked = self.check_user_blocked_me(username)
                if is_blocked:
                    # Durumu güncelle
                    self.db.update_block_status(username, True)
                    blocked_count += 1
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
    
    def start_live_tracking(self):
        """Canlı takibi başlatır"""
        try:
            logging.info("🚀 Canlı takip başlatılıyor...")
            
            if not self.setup_driver():
                return False
            
            if not self.login_to_instagram():
                return False
            
            self.is_running = True
            print("✅ Canlı takip başlatıldı! Profil görüntüleyenler ve engellenen kullanıcılar anında tespit edilecek.")
            print("⏹️  Durdurmak için Ctrl+C tuşlayın.")
            
            while self.is_running:
                try:
                    # Profil görüntülemelerini kontrol et
                    new_viewers = self.check_profile_views()
                    if new_viewers > 0:
                        print(f"👁️ {new_viewers} yeni profil görüntüleyen tespit edildi!")
                    
                    # Alternatif aktivite kontrolü
                    if new_viewers == 0:
                        new_activities = self.check_recent_activity()
                        if new_activities > 0:
                            print(f"👁️ {new_activities} yeni aktivite tespit edildi!")
                    
                    # Engellenen kullanıcıları kontrol et
                    new_blocked = self.check_blocked_users()
                    if new_blocked > 0:
                        print(f"🚫 {new_blocked} yeni engelleyen kullanıcı tespit edildi!")
                    
                    # 30 saniye bekle
                    time.sleep(30)
                    
                except KeyboardInterrupt:
                    print("\n⏹️  Canlı takip durduruluyor...")
                    self.is_running = False
                    break
                except Exception as e:
                    logging.error(f"Canlı takip döngüsü hatası: {e}")
                    time.sleep(60)  # Hata durumunda 1 dakika bekle
            
            return True
            
        except Exception as e:
            logging.error(f"Canlı takip başlatma hatası: {e}")
            return False
        
        finally:
            if self.driver:
                self.driver.quit()
    
    def stop_live_tracking(self):
        """Canlı takibi durdurur"""
        self.is_running = False
        logging.info("Canlı takip durduruldu")

def main():
    """Ana fonksiyon"""
    tracker = LiveTracker()
    
    print("🔴 CANLI INSTAGRAM TAKİP SİSTEMİ")
    print("=" * 40)
    print("Bu sistem:")
    print("• Profilinizi görüntüleyen kullanıcıları anında tespit eder")
    print("• Sizi engelleyen kullanıcıları anında tespit eder")
    print("• Yeni aktiviteleri bildirim olarak gönderir")
    print("=" * 40)
    
    try:
        tracker.start_live_tracking()
    except KeyboardInterrupt:
        print("\n👋 Canlı takip sonlandırıldı.")
    except Exception as e:
        print(f"❌ Hata: {e}")

if __name__ == "__main__":
    main() 