import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUetds } from '../../contexts/UetdsContext';
import { StorageService } from '../../services/storageService';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: string;
  onPress?: () => void;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
  rightComponent?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  toggle,
  onToggle,
  rightComponent,
}) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline
        }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color={theme.colors.primary} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.colors.placeholder }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {toggle !== undefined && (
          <Switch
            value={toggle}
            onValueChange={onToggle}
            trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        )}
        {rightComponent}
        {onPress && !rightComponent && (
          <Icon name="chevron-right" size={24} color={theme.colors.placeholder} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const AyarlarScreen: React.FC = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { testConnection, syncWithServer } = useUetds();
  
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  
  const theme = useTheme();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await StorageService.getSettings();
      const version = await StorageService.getAppVersion();
      
      if (settings) {
        setNotifications(settings.notifications ?? true);
        setAutoSync(settings.autoSync ?? true);
        setDarkMode(settings.darkMode ?? false);
      }
      
      setAppVersion(version || '1.0.0');
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      await StorageService.saveSettings(newSettings);
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
    }
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotifications(value);
    saveSettings({ notifications: value, autoSync, darkMode });
  };

  const handleAutoSyncToggle = (value: boolean) => {
    setAutoSync(value);
    saveSettings({ notifications, autoSync: value, darkMode });
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    saveSettings({ notifications, autoSync, darkMode: value });
  };

  const handleTestConnection = async () => {
    Alert.alert(
      'Bağlantı Testi',
      'UETDS sunucusu ile bağlantı test ediliyor...',
      [{ text: 'Tamam' }]
    );
    
    const isConnected = await testConnection();
    
    Alert.alert(
      'Bağlantı Testi Sonucu',
      isConnected 
        ? 'UETDS sunucusuna başarıyla bağlanıldı.' 
        : 'UETDS sunucusuna bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
      [{ text: 'Tamam' }]
    );
  };

  const handleSyncNow = async () => {
    Alert.alert(
      'Senkronizasyon',
      'Veriler senkronize ediliyor...',
      [{ text: 'Tamam' }]
    );
    
    await syncWithServer();
    
    Alert.alert(
      'Senkronizasyon',
      'Veriler başarıyla senkronize edildi.',
      [{ text: 'Tamam' }]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Önbelleği Temizle',
      'Tüm yerel veriler silinecek. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clear();
              Alert.alert('Başarılı', 'Önbellek temizlendi. Uygulama yeniden başlatılacak.');
              // Uygulamayı yeniden başlatma kodu buraya eklenebilir
            } catch (error) {
              Alert.alert('Hata', 'Önbellek temizlenirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Uygulamadan çıkmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Genel Ayarlar
        </Text>
        
        <SettingItem
          title="Bildirimler"
          subtitle="Push bildirimlerini etkinleştir"
          icon="notifications"
          toggle={notifications}
          onToggle={handleNotificationToggle}
        />
        
        <SettingItem
          title="Otomatik Senkronizasyon"
          subtitle="Verileri otomatik olarak senkronize et"
          icon="sync"
          toggle={autoSync}
          onToggle={handleAutoSyncToggle}
        />
        
        <SettingItem
          title="Karanlık Mod"
          subtitle="Uygulama görünümünü değiştir"
          icon="dark-mode"
          toggle={darkMode}
          onToggle={handleDarkModeToggle}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          UETDS Ayarları
        </Text>
        
        <SettingItem
          title="Bağlantı Testi"
          subtitle="UETDS sunucusu bağlantısını test et"
          icon="wifi"
          onPress={handleTestConnection}
        />
        
        <SettingItem
          title="Şimdi Senkronize Et"
          subtitle="Tüm verileri sunucu ile senkronize et"
          icon="cloud-sync"
          onPress={handleSyncNow}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Uygulama Bilgileri
        </Text>
        
        <SettingItem
          title="Sürüm"
          subtitle={`v${appVersion}`}
          icon="info"
        />
        
        <SettingItem
          title="Destek"
          subtitle="Teknik destek için iletişim"
          icon="support-agent"
          onPress={() => navigation.navigate('Destek')}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Depolama
        </Text>
        
        <SettingItem
          title="Önbelleği Temizle"
          subtitle="Tüm yerel verileri sil"
          icon="delete"
          onPress={handleClearCache}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Hesap
        </Text>
        
        <SettingItem
          title="Profil"
          subtitle={`Hoş geldiniz, ${user?.name}`}
          icon="person"
          onPress={() => navigation.navigate('Profil')}
        />
        
        <SettingItem
          title="Çıkış Yap"
          subtitle="Uygulamadan çıkış yap"
          icon="logout"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AyarlarScreen;