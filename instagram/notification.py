import logging
import requests
from config import Config

class NotificationManager:
    def __init__(self):
        self.config = Config()
    
    def send_telegram_notification(self, message):
        """Telegram bot ile bildirim gönderir"""
        try:
            if not self.config.TELEGRAM_BOT_TOKEN or not self.config.TELEGRAM_CHAT_ID:
                logging.warning("Telegram bot token veya chat ID bulunamadı")
                return False
            
            url = f"https://api.telegram.org/bot{self.config.TELEGRAM_BOT_TOKEN}/sendMessage"
            
            data = {
                'chat_id': self.config.TELEGRAM_CHAT_ID,
                'text': message,
                'parse_mode': 'HTML'
            }
            
            response = requests.post(url, data=data, timeout=10)
            
            if response.status_code == 200:
                logging.info("Telegram bildirimi başarıyla gönderildi")
                return True
            else:
                logging.error(f"Telegram bildirimi gönderilemedi: {response.status_code}")
                return False
                
        except Exception as e:
            logging.error(f"Telegram bildirimi hatası: {e}")
            return False
    
    def send_whatsapp_notification(self, message):
        """WhatsApp API ile bildirim gönderir"""
        try:
            if not self.config.WHATSAPP_API_KEY or not self.config.WHATSAPP_PHONE_NUMBER:
                logging.warning("WhatsApp API key veya telefon numarası bulunamadı")
                return False
            
            # WhatsApp Business API endpoint (örnek)
            url = "https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages"
            
            headers = {
                'Authorization': f'Bearer {self.config.WHATSAPP_API_KEY}',
                'Content-Type': 'application/json'
            }
            
            data = {
                "messaging_product": "whatsapp",
                "to": self.config.WHATSAPP_PHONE_NUMBER,
                "type": "text",
                "text": {"body": message}
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=10)
            
            if response.status_code == 200:
                logging.info("WhatsApp bildirimi başarıyla gönderildi")
                return True
            else:
                logging.error(f"WhatsApp bildirimi gönderilemedi: {response.status_code}")
                return False
                
        except Exception as e:
            logging.error(f"WhatsApp bildirimi hatası: {e}")
            return False
    
    def send_email_notification(self, subject, message):
        """E-posta bildirimi gönderir (basit SMTP)"""
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart
            
            # E-posta ayarları (config'e eklenebilir)
            sender_email = "your-email@gmail.com"
            sender_password = "your-app-password"
            receiver_email = "receiver@example.com"
            
            # E-posta oluştur
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = receiver_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(message, 'plain'))
            
            # SMTP sunucusuna bağlan ve gönder
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender_email, sender_password)
            
            text = msg.as_string()
            server.sendmail(sender_email, receiver_email, text)
            server.quit()
            
            logging.info("E-posta bildirimi başarıyla gönderildi")
            return True
            
        except Exception as e:
            logging.error(f"E-posta bildirimi hatası: {e}")
            return False
    
    def send_notification(self, message, notification_type="telegram"):
        """Genel bildirim gönderme fonksiyonu"""
        try:
            if notification_type == "telegram":
                return self.send_telegram_notification(message)
            elif notification_type == "whatsapp":
                return self.send_whatsapp_notification(message)
            elif notification_type == "email":
                return self.send_email_notification("Instagram Engelleme Bildirimi", message)
            else:
                logging.warning(f"Bilinmeyen bildirim türü: {notification_type}")
                return False
                
        except Exception as e:
            logging.error(f"Bildirim gönderme hatası: {e}")
            return False
    
    def send_block_changes_notification(self, changes_report, notification_type="telegram"):
        """Engelleme değişikliklerini bildirir"""
        try:
            if "bulunamadı" in changes_report:
                # Değişiklik yoksa bildirim gönderme
                return True
            
            message = f"🔔 <b>Instagram Engelleme Değişiklikleri</b>\n\n{changes_report}"
            
            return self.send_notification(message, notification_type)
            
        except Exception as e:
            logging.error(f"Engelleme değişikliği bildirimi hatası: {e}")
            return False 