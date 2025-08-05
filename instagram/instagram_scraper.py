import time
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from config import Config
from database import DatabaseManager

class InstagramScraper:
    def __init__(self):
        self.config = Config()
        self.db = DatabaseManager()
        self.driver = None
        self.wait = None
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
            
            # ChromeDriver'ı doğrudan sistem yolunu kullanarak başlat
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            self.wait = WebDriverWait(self.driver, self.config.BROWSER_TIMEOUT)
            self.driver.set_page_load_timeout(self.config.PAGE_LOAD_TIMEOUT)
            
            logging.info("WebDriver başarıyla başlatıldı")
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
    
    def get_followers_list(self):
        """Takipçi listesini alır"""
        try:
            logging.info("Takipçi listesi alınıyor...")
            
            # Profil sayfasına git
            profile_url = f"{self.config.INSTAGRAM_BASE_URL}{self.config.INSTAGRAM_USERNAME}/"
            self.driver.get(profile_url)
            time.sleep(3)
            
            # Takipçi sayısına tıkla
            followers_link = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//a[contains(@href, '/followers/')]"))
            )
            followers_link.click()
            time.sleep(3)
            
            followers = []
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            
            while True:
                # Takipçi elementlerini bul
                follower_elements = self.driver.find_elements(
                    By.XPATH, "//div[@role='dialog']//a[@role='link']"
                )
                
                for element in follower_elements:
                    try:
                        username = element.get_attribute("href").split("/")[-2]
                        if username and username not in [f[0] for f in followers]:
                            followers.append((username, None))  # full_name şimdilik None
                    except:
                        continue
                
                # Sayfayı aşağı kaydır
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height
            
            logging.info(f"Toplam {len(followers)} takipçi bulundu")
            return followers
            
        except Exception as e:
            logging.error(f"Takipçi listesi alma hatası: {e}")
            return []
    
    def check_user_block_status(self, username):
        """Kullanıcının engelleme durumunu kontrol eder"""
        try:
            profile_url = f"{self.config.INSTAGRAM_BASE_URL}{username}/"
            self.driver.get(profile_url)
            time.sleep(2)
            
            # "Bu kullanıcı mevcut değil" mesajını kontrol et
            try:
                error_element = self.driver.find_element(
                    By.XPATH, "//div[contains(text(), 'Bu kullanıcı mevcut değil') or contains(text(), 'Sorry, this page isn')]"
                )
                return True  # Engellenmiş
            except NoSuchElementException:
                # Profil görünüyor, engellenmemiş
                return False
                
        except Exception as e:
            logging.error(f"Kullanıcı {username} engelleme durumu kontrol hatası: {e}")
            return None
    
    def scan_followers(self):
        """Tüm takipçileri tarar ve engelleme durumlarını kontrol eder"""
        try:
            logging.info("Takipçi taraması başlatılıyor...")
            
            if not self.setup_driver():
                return False
            
            if not self.login_to_instagram():
                return False
            
            # Takipçi listesini al
            followers = self.get_followers_list()
            
            # Her takipçiyi veritabanına ekle
            for username, full_name in followers:
                self.db.add_follower(username, full_name)
            
            # Engelleme durumlarını kontrol et
            blocked_count = 0
            for username, _ in followers:
                is_blocked = self.check_user_block_status(username)
                if is_blocked is not None:
                    self.db.update_block_status(username, is_blocked)
                    if is_blocked:
                        blocked_count += 1
                        logging.info(f"Engellenen kullanıcı tespit edildi: {username}")
                
                # Instagram'ın rate limiting'ini önlemek için bekle
                time.sleep(1)
            
            logging.info(f"Tarama tamamlandı. {blocked_count} engellenen kullanıcı bulundu.")
            return True
            
        except Exception as e:
            logging.error(f"Takipçi tarama hatası: {e}")
            return False
        
        finally:
            if self.driver:
                self.driver.quit()
    
    def get_block_changes_report(self, hours=24):
        """Son değişikliklerin raporunu alır"""
        try:
            changes = self.db.get_recent_block_changes(hours)
            
            if not changes:
                return "Son 24 saatte engelleme değişikliği bulunamadı."
            
            report = f"Son {hours} saatteki engelleme değişiklikleri:\n\n"
            
            for username, action, timestamp in changes:
                action_text = "engelledi" if action == "blocked" else "engelini kaldırdı"
                report += f"• {username} - {action_text} ({timestamp})\n"
            
            return report
            
        except Exception as e:
            logging.error(f"Rapor alma hatası: {e}")
            return "Rapor oluşturulurken hata oluştu." 