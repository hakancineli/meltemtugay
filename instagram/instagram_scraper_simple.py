import time
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from config import Config
from database import DatabaseManager

class InstagramScraperSimple:
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
            
            # Takipçi sayısına tıkla - daha güvenilir yöntem
            try:
                # Önce sayfanın tamamen yüklenmesini bekle
                time.sleep(5)
                
                # JavaScript ile tıkla
                followers_link = self.driver.find_element(By.XPATH, "//a[contains(@href, '/followers/')]")
                self.driver.execute_script("arguments[0].click();", followers_link)
                time.sleep(3)
            except Exception as e:
                logging.error(f"Takipçi linkine tıklama hatası: {e}")
                # Alternatif yöntem
                try:
                    followers_link = self.wait.until(
                        EC.element_to_be_clickable((By.XPATH, "//a[contains(@href, '/followers/')]"))
                    )
                    followers_link.click()
                    time.sleep(3)
                except:
                    logging.error("Takipçi listesine erişilemedi")
                    return []
            
            followers = []
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            
            while True:
                # Takipçi elementlerini bul
                follower_elements = self.driver.find_elements(
                    By.XPATH, "//div[@role='dialog']//a[@role='link']"
                )
                
                for element in follower_elements:
                    try:
                        href = element.get_attribute("href")
                        if href and '/p/' not in href and href != profile_url:
                            username = href.split("/")[-2]
                            if username and username not in [f[0] for f in followers]:
                                # Kullanıcı adını al
                                try:
                                    username_element = element.find_element(By.XPATH, ".//span[contains(@class, '_aacl')]")
                                    full_name = username_element.text if username_element else ""
                                except:
                                    full_name = ""
                                followers.append((username, full_name))
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
    
    def check_user_blocked_me(self, username):
        """Kullanıcının beni engelleyip engellemediğini kontrol eder"""
        try:
            # Kullanıcının profil sayfasına git
            user_profile_url = f"{self.config.INSTAGRAM_BASE_URL}{username}/"
            self.driver.get(user_profile_url)
            time.sleep(3)
            
            # Sayfanın yüklenmesini bekle
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            
            # Sayfa kaynağını kontrol et
            page_source = self.driver.page_source.lower()
            
            # Engelleme belirtileri
            blocked_indicators = [
                "this page is not available",
                "user not found",
                "page not found",
                "kullanıcı bulunamadı",
                "sayfa bulunamadı",
                "this account is private",
                "bu hesap gizli",
                "sorry, this page isn't available",
                "üzgünüz, bu sayfa mevcut değil"
            ]
            
            # Eğer bu belirtilerden biri varsa, kullanıcı sizi engellemiş olabilir
            for indicator in blocked_indicators:
                if indicator in page_source:
                    return True
            
            # Profil resmi ve gönderilerin görünüp görünmediğini kontrol et
            try:
                # Profil resmi var mı?
                profile_pic = self.driver.find_element(By.XPATH, "//img[@alt='profile picture']")
                if not profile_pic:
                    return True
            except:
                pass
            
            try:
                # Gönderiler görünüyor mu?
                posts = self.driver.find_elements(By.XPATH, "//article//img")
                if len(posts) == 0:
                    return True
            except:
                pass
            
            return False
            
        except Exception as e:
            logging.error(f"Kullanıcı engelleme kontrolü hatası ({username}): {e}")
            return False
    
    def get_profile_viewers(self):
        """Profilinizi görüntüleyen kullanıcıları tespit eder"""
        try:
            logging.info("Profil görüntüleyenler tespit ediliyor...")
            
            # Profil sayfasına git
            profile_url = f"{self.config.INSTAGRAM_BASE_URL}{self.config.INSTAGRAM_USERNAME}/"
            self.driver.get(profile_url)
            time.sleep(3)
            
            # Profil görüntüleyenler butonunu bul ve tıkla
            try:
                # "Profil görüntüleyenler" butonunu ara
                viewers_button = self.driver.find_element(
                    By.XPATH, "//a[contains(text(), 'Profil görüntüleyenler') or contains(text(), 'profile views')]"
                )
                viewers_button.click()
                time.sleep(3)
                
                viewers = []
                last_height = self.driver.execute_script("return document.body.scrollHeight")
                
                while True:
                    # Görüntüleyen elementlerini bul
                    viewer_elements = self.driver.find_elements(
                        By.XPATH, "//div[@role='dialog']//a[@role='link']"
                    )
                    
                    for element in viewer_elements:
                        try:
                            href = element.get_attribute("href")
                            if href and '/p/' not in href and href != profile_url:
                                username = href.split("/")[-2]
                                if username and username not in [v[0] for v in viewers]:
                                    # Kullanıcı adını al
                                    try:
                                        username_element = element.find_element(By.XPATH, ".//span[contains(@class, '_aacl')]")
                                        full_name = username_element.text if username_element else ""
                                    except:
                                        full_name = ""
                                    viewers.append((username, full_name))
                        except:
                            continue
                    
                    # Sayfayı aşağı kaydır
                    self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(2)
                    
                    new_height = self.driver.execute_script("return document.body.scrollHeight")
                    if new_height == last_height:
                        break
                    last_height = new_height
                
                logging.info(f"Toplam {len(viewers)} profil görüntüleyen bulundu")
                return viewers
                
            except Exception as e:
                logging.warning(f"Profil görüntüleyenler butonu bulunamadı: {e}")
                return []
            
        except Exception as e:
            logging.error(f"Profil görüntüleyenler alma hatası: {e}")
            return []
    
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
                is_blocked = self.check_user_blocked_me(username)
                if is_blocked:
                    self.db.update_block_status(username, True)
                    blocked_count += 1
                    logging.info(f"Sizi engelleyen kullanıcı tespit edildi: {username}")
                else:
                    self.db.update_block_status(username, False)
                
                # Instagram'ın rate limiting'ini önlemek için bekle
                time.sleep(1)
            
            # Profil görüntüleyenleri de tespit et
            profile_viewers = self.get_profile_viewers()
            for username, full_name in profile_viewers:
                self.db.add_profile_viewer(username, full_name)
                logging.info(f"Profil görüntüleyen tespit edildi: {username}")
            
            logging.info(f"Tarama tamamlandı. {blocked_count} kullanıcı sizi engellemiş, {len(profile_viewers)} profil görüntüleyen bulundu.")
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
                action_text = "sizi engelledi" if action == "blocked" else "engelini kaldırdı"
                report += f"• {username} - {action_text} ({timestamp})\n"
            
            return report
            
        except Exception as e:
            logging.error(f"Rapor alma hatası: {e}")
            return "Rapor oluşturulurken hata oluştu." 