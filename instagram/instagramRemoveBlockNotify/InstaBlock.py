from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from time import sleep
from datetime import datetime

# Instagram Bilgileriniz
yourInstagramUsername = "protransfer"
yourInstagramPassword = "Protransfer34."

# Kontrol edilecek kullanıcı adı (test için)
checkInstagramUsername = "test_user"

# Chrome ayarları (macOS için)
chrome_options = Options()
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# ChromeDriver'ı sistemden kullan
driver = webdriver.Chrome(options=chrome_options)

# Veri dosyası
f = open("data.txt", "a")

print("🚀 Instagram Block Detector Başlatılıyor...")
print(f"👤 Kullanıcı: {yourInstagramUsername}")
print(f"🔍 Kontrol edilecek: {checkInstagramUsername}")
print("=" * 50)

# Instagram'a git
driver.get("https://www.instagram.com")
sleep(3)

# Giriş yap
print("🔐 Instagram'a giriş yapılıyor...")
driver.find_element(By.XPATH, "/html/body/div[1]/section/main/article/div[2]/div[1]/div/form/div/div[1]/div/label/input").send_keys(yourInstagramUsername)
driver.find_element(By.XPATH, "/html/body/div[1]/section/main/article/div[2]/div[1]/div/form/div/div[2]/div/label/input").send_keys(yourInstagramPassword)
driver.find_element(By.XPATH, "/html/body/div[1]/section/main/article/div[2]/div[1]/div/form/div/div[3]").click()

sleep(6)

# Bildirimleri kapat
try:
    driver.find_element(By.CLASS_NAME, "sqdOP").click()
    sleep(4)
    driver.find_element(By.CLASS_NAME, "aOOlW.HoLwm").click()
    sleep(3)
    print("✅ Bildirimler kapatıldı")
except:
    print("⚠️ Bildirim kapatma butonu bulunamadı")

counter = 0
print("🔄 Sürekli kontrol başlatılıyor...")
print("=" * 50)

while True:
    try:
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        
        # Arama kutusunu temizle ve kullanıcı adını yaz
        search_box = driver.find_element(By.CLASS_NAME, "XTCLo.x3qfX")
        search_box.clear()
        sleep(2)
        search_box.send_keys(checkInstagramUsername)
        sleep(3)
        
        # Arama sonuçlarını kontrol et
        users = driver.find_elements(By.CLASS_NAME, "_7UhW9.xLCgt.MMzan.KV-D4.fDxYl")
        
        found_user = False
        for user in users:
            if user.text == checkInstagramUsername:
                found_user = True
                break
        
        if not found_user:
            # Kullanıcı bulunamadı - ENGELLEMİŞ
            if counter == 0:
                print(f"🔴 BLOCK - {current_time} - {checkInstagramUsername} sizi engelledi!")
                f.write(f"BLOCK {current_time} - {checkInstagramUsername}\n")
                f.flush()
                counter = 1
        else:
            # Kullanıcı bulundu - ENGELİNİ KALDIRMIŞ
            if counter == 1:
                print(f"🟢 UNBLOCK - {current_time} - {checkInstagramUsername} engelini kaldırdı!")
                f.write(f"UNBLOCK {current_time} - {checkInstagramUsername}\n")
                f.flush()
                counter = 0
        
        print(f"⏰ {current_time} - Durum kontrol edildi")
        sleep(25)
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        sleep(30)

driver.close() 