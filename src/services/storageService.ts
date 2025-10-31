import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

export class StorageService {
  // Generic methods
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }

  // User specific methods
  static async saveUser(user: any): Promise<void> {
    return this.setItem(STORAGE_KEYS.USER, user);
  }

  static async getUser(): Promise<any | null> {
    return this.getItem(STORAGE_KEYS.USER);
  }

  static async removeUser(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.USER);
  }

  // Auth token methods
  static async saveToken(token: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static async getToken(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static async removeToken(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Company info methods
  static async saveCompanyInfo(companyInfo: any): Promise<void> {
    return this.setItem(STORAGE_KEYS.COMPANY_INFO, companyInfo);
  }

  static async getCompanyInfo(): Promise<any | null> {
    return this.getItem(STORAGE_KEYS.COMPANY_INFO);
  }

  // UETDS credentials methods
  static async saveUetdsCredentials(credentials: any): Promise<void> {
    return this.setItem(STORAGE_KEYS.UETDS_CREDENTIALS, credentials);
  }

  static async getUetdsCredentials(): Promise<any | null> {
    return this.getItem(STORAGE_KEYS.UETDS_CREDENTIALS);
  }

  // Settings methods
  static async saveSettings(settings: any): Promise<void> {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  static async getSettings(): Promise<any | null> {
    return this.getItem(STORAGE_KEYS.SETTINGS);
  }

  // Offline data methods
  static async saveOfflineSeferler(seferler: any[]): Promise<void> {
    return this.setItem(STORAGE_KEYS.OFFLINE_SEFERLER, seferler);
  }

  static async getOfflineSeferler(): Promise<any[] | null> {
    return this.getItem(STORAGE_KEYS.OFFLINE_SEFERLER);
  }

  static async saveOfflineYolcular(yolcular: any[]): Promise<void> {
    return this.setItem(STORAGE_KEYS.OFFLINE_YOLCULAR, yolcular);
  }

  static async getOfflineYolcular(): Promise<any[] | null> {
    return this.getItem(STORAGE_KEYS.OFFLINE_YOLCULAR);
  }

  static async saveOfflinePersoneller(personeller: any[]): Promise<void> {
    return this.setItem(STORAGE_KEYS.OFFLINE_PERSONELLER, personeller);
  }

  static async getOfflinePersoneller(): Promise<any[] | null> {
    return this.getItem(STORAGE_KEYS.OFFLINE_PERSONELLER);
  }

  static async saveOfflineAraclar(araclar: any[]): Promise<void> {
    return this.setItem(STORAGE_KEYS.OFFLINE_ARACLAR, araclar);
  }

  static async getOfflineAraclar(): Promise<any[] | null> {
    return this.getItem(STORAGE_KEYS.OFFLINE_ARACLAR);
  }

  static async saveOfflineGruplar(gruplar: any[]): Promise<void> {
    return this.setItem(STORAGE_KEYS.OFFLINE_GRUPLAR, gruplar);
  }

  static async getOfflineGruplar(): Promise<any[] | null> {
    return this.getItem(STORAGE_KEYS.OFFLINE_GRUPLAR);
  }

  // Sync status methods
  static async saveSyncStatus(status: any): Promise<void> {
    return this.setItem(STORAGE_KEYS.SYNC_STATUS, status);
  }

  static async getSyncStatus(): Promise<any | null> {
    return this.getItem(STORAGE_KEYS.SYNC_STATUS);
  }

  // Last sync time
  static async saveLastSyncTime(time: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.LAST_SYNC_TIME, time);
  }

  static async getLastSyncTime(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
  }

  // App version
  static async saveAppVersion(version: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.APP_VERSION, version);
  }

  static async getAppVersion(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.APP_VERSION);
  }

  // First launch check
  static async isFirstLaunch(): Promise<boolean> {
    const isFirst = await this.getItem(STORAGE_KEYS.IS_FIRST_LAUNCH);
    return isFirst === null;
  }

  static async setFirstLaunchComplete(): Promise<void> {
    return this.setItem(STORAGE_KEYS.IS_FIRST_LAUNCH, false);
  }
}

export default StorageService;