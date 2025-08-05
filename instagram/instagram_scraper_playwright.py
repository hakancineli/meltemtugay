import time
import logging
from playwright.sync_api import sync_playwright
from config import Config
from database import DatabaseManager

class InstagramScraperPlaywright:
    def __init__(self):
        self.config = Config()
        self.db = DatabaseManager()
        self.browser = None
        self.page = None
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
    
    def setup_browser(self):
        """Playwright browser'ı yapılandırır"""
        try:
            self.playwright = sync_playwright().start()
            
            # Browser seçenekleri
            browser_options = {
                'headless': self.config.BROWSER_HEADLESS,
                'args': [
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-blink-features=AutomationControlled'
                ]
            }
            
            self.browser = self.playwright.chromium.launch(**browser_options)
            self.page = self.browser.new_page()
            
            # User agent ayarla
            self.page.set_extra_http_headers({
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            })
            
            # Timeout ayarla
            self.page.set_default_timeout(self.config.BROWSER_TIMEOUT * 1000)
            
            # Browser'ı kapatmayı önle
            self.page.on("close", lambda: None)
            
            logging.info("Playwright browser başarıyla başlatıldı")
            return True
            
        except Exception as e:
            logging.error(f"Browser başlatma hatası: {e}")
            return False
    
    def login_to_instagram(self):
        """Instagram'a giriş yapar"""
        try:
            logging.info("Instagram'a giriş yapılıyor...")
            
            self.page.goto(self.config.INSTAGRAM_LOGIN_URL)
            time.sleep(3)
            
            # Kullanıcı adı girişi
            self.page.fill('input[name="username"]', self.config.INSTAGRAM_USERNAME)
            
            # Şifre girişi
            self.page.fill('input[name="password"]', self.config.INSTAGRAM_PASSWORD)
            
            # Giriş butonu
            self.page.click('button[type="submit"]')
            
            # 2FA kontrolü (eğer varsa)
            time.sleep(5)
            if "checkpoint" in self.page.url:
                logging.warning("2FA doğrulaması gerekli! Manuel olarak tamamlayın.")
                input("2FA doğrulamasını tamamladıktan sonra Enter'a basın...")
            
            # Ana sayfaya yönlendirme kontrolü
            self.page.wait_for_selector('nav', timeout=10000)
            
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
            self.page.goto(profile_url)
            time.sleep(3)
            
            # Takipçi sayısına tıkla
            followers_link = self.page.locator('a[href*="/followers/"]').first
            followers_link.click()
            time.sleep(3)
            
            followers = []
            last_height = 0
            
            while True:
                # Takipçi elementlerini bul
                follower_elements = self.page.locator('div[role="dialog"] a[role="link"]').all()
                
                for element in follower_elements:
                    try:
                        href = element.get_attribute("href")
                        if href:
                            username = href.split("/")[-2]
                            if username and username not in [f[0] for f in followers]:
                                followers.append((username, None))  # full_name şimdilik None
                    except:
                        continue
                
                # Sayfayı aşağı kaydır
                self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                time.sleep(2)
                
                new_height = self.page.evaluate("document.body.scrollHeight")
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
            self.page.goto(profile_url)
            time.sleep(2)
            
            # "Bu kullanıcı mevcut değil" mesajını kontrol et
            try:
                error_element = self.page.locator('div:has-text("Bu kullanıcı mevcut değil"), div:has-text("Sorry, this page isn")').first
                if error_element.count() > 0:
                    return True  # Engellenmiş
            except:
                pass
            
            # Profil görünüyor, engellenmemiş
            return False
                
        except Exception as e:
            logging.error(f"Kullanıcı {username} engelleme durumu kontrol hatası: {e}")
            return None
    
    def scan_followers(self):
        """Tüm takipçileri tarar ve engelleme durumlarını kontrol eder"""
        try:
            logging.info("Takipçi taraması başlatılıyor...")
            
            if not self.setup_browser():
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
            if self.browser:
                self.browser.close()
            if hasattr(self, 'playwright'):
                self.playwright.stop()
    
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