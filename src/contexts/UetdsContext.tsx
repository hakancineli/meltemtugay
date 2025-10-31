import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Sefer, 
  Yolcu, 
  Personel, 
  Grup, 
  Arac,
  UetdsSeferBilgileri,
  UetdsYolcuBilgileri,
  UetdsPersonelBilgileri,
  UetdsGrupBilgileri,
  UetdsResponse
} from '../types';
import { uetdsService } from '../services/uetdsService';
import { StorageService } from '../services/storageService';

interface UetdsContextType {
  // Data
  seferler: Sefer[];
  yolcular: Yolcu[];
  personeller: Personel[];
  gruplar: Grup[];
  araclar: Arac[];
  
  // Loading states
  isLoading: boolean;
  isSyncing: boolean;
  
  // Actions
  loadSeferler: () => Promise<void>;
  loadYolcular: () => Promise<void>;
  loadPersoneller: () => Promise<void>;
  loadGruplar: () => Promise<void>;
  loadAraclar: () => Promise<void>;
  
  // UETDS operations
  seferEkle: (seferBilgileri: UetdsSeferBilgileri) => Promise<UetdsResponse>;
  seferGuncelle: (uetdsSeferReferansNo: number, seferBilgileri: UetdsSeferBilgileri) => Promise<UetdsResponse>;
  seferIptal: (uetdsSeferReferansNo: number, iptalAciklama: string) => Promise<UetdsResponse>;
  
  yolcuEkle: (uetdsSeferReferansNo: number, yolcuBilgileri: UetdsYolcuBilgileri) => Promise<UetdsResponse>;
  yolcuEkleCoklu: (uetdsSeferReferansNo: number, yolcuBilgileriListesi: UetdsYolcuBilgileri[]) => Promise<UetdsResponse>;
  
  personelEkle: (uetdsSeferReferansNo: number, personelBilgileri: UetdsPersonelBilgileri) => Promise<UetdsResponse>;
  
  grupEkle: (uetdsSeferReferansNo: number, grupBilgileri: UetdsGrupBilgileri) => Promise<UetdsResponse>;
  
  // Sync operations
  syncWithServer: () => Promise<void>;
  testConnection: () => Promise<boolean>;
}

const UetdsContext = createContext<UetdsContextType | undefined>(undefined);

interface UetdsProviderProps {
  children: ReactNode;
}

export const UetdsProvider: React.FC<UetdsProviderProps> = ({ children }) => {
  const [seferler, setSeferler] = useState<Sefer[]>([]);
  const [yolcular, setYolcular] = useState<Yolcu[]>([]);
  const [personeller, setPersoneller] = useState<Personel[]>([]);
  const [gruplar, setGruplar] = useState<Grup[]>([]);
  const [araclar, setAraclar] = useState<Arac[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load data from storage on mount
  useEffect(() => {
    const loadOfflineData = async () => {
      try {
        const [offlineSeferler, offlineYolcular, offlinePersoneller, offlineAraclar] = await Promise.all([
          StorageService.getOfflineSeferler(),
          StorageService.getOfflineYolcular(),
          StorageService.getOfflinePersoneller(),
          StorageService.getOfflineAraclar()
        ]);

        setSeferler(offlineSeferler || []);
        setYolcular(offlineYolcular || []);
        setPersoneller(offlinePersoneller || []);
        setAraclar(offlineAraclar || []);
      } catch (error) {
        console.error('Error loading offline data:', error);
      }
    };

    loadOfflineData();
  }, []);

  // Data loading functions
  const loadSeferler = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // In a real app, this would fetch from API
      const offlineSeferler = await StorageService.getOfflineSeferler();
      setSeferler(offlineSeferler || []);
    } catch (error) {
      console.error('Error loading seferler:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadYolcular = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const offlineYolcular = await StorageService.getOfflineYolcular();
      setYolcular(offlineYolcular || []);
    } catch (error) {
      console.error('Error loading yolcular:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPersoneller = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const offlinePersoneller = await StorageService.getOfflinePersoneller();
      setPersoneller(offlinePersoneller || []);
    } catch (error) {
      console.error('Error loading personeller:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGruplar = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const offlineGruplar = await StorageService.getOfflineGruplar();
      setGruplar(offlineGruplar || []);
    } catch (error) {
      console.error('Error loading gruplar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAraclar = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const offlineAraclar = await StorageService.getOfflineAraclar();
      setAraclar(offlineAraclar || []);
    } catch (error) {
      console.error('Error loading araclar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // UETDS operations
  const seferEkle = async (seferBilgileri: UetdsSeferBilgileri): Promise<UetdsResponse> => {
    try {
      const credentials = await StorageService.getUetdsCredentials();
      if (!credentials) {
        return {
          sonucKodu: -1,
          sonucMesaji: 'UETDS kimlik bilgileri bulunamadı'
        };
      }

      const response = await uetdsService.seferEkle(
        credentials.kullaniciAdi,
        credentials.sifre,
        seferBilgileri
      );

      if (response.sonucKodu === 0 && response.uetdsSeferReferansNo) {
        // Add to local storage
        const newSefer: Sefer = {
          id: response.uetdsSeferReferansNo.toString(),
          uetdsSeferReferansNo: response.uetdsSeferReferansNo,
          ...seferBilgileri,
          durum: 'aktif',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedSeferler = [...seferler, newSefer];
        setSeferler(updatedSeferler);
        await StorageService.saveOfflineSeferler(updatedSeferler);
      }

      return response;
    } catch (error) {
      console.error('Sefer ekleme hatası:', error);
      return {
        sonucKodu: -1,
        sonucMesaji: 'Sefer ekleme hatası'
      };
    }
  };

  const seferGuncelle = async (
    uetdsSeferReferansNo: number, 
    seferBilgileri: UetdsSeferBilgileri
  ): Promise<UetdsResponse> => {
    try {
      const credentials = await StorageService.getUetdsCredentials();
      if (!credentials) {
        return {
          sonucKodu: -1,
          sonucMesaji: 'UETDS kimlik bilgileri bulunamadı'
        };
      }

      const response = await uetdsService.seferGuncelle(
        credentials.kullaniciAdi,
        credentials.sifre,
        uetdsSeferReferansNo,
        seferBilgileri
      );

      if (response.sonucKodu === 0) {
        // Update local storage
        const updatedSeferler = seferler.map(sefer => 
          sefer.uetdsSeferReferansNo === uetdsSeferReferansNo
            ? { ...sefer, ...seferBilgileri, updatedAt: new Date().toISOString() }
            : sefer
        );
        setSeferler(updatedSeferler);
        await StorageService.saveOfflineSeferler(updatedSeferler);
      }

      return response;
    } catch (error) {
      console.error('Sefer güncelleme hatası:', error);
      return {
        sonucKodu: -1,
        sonucMesaji: 'Sefer güncelleme hatası'
      };
    }
  };

  const seferIptal = async (
    uetdsSeferReferansNo: number, 
    iptalAciklama: string
  ): Promise<UetdsResponse> => {
    try {
      const credentials = await StorageService.getUetdsCredentials();
      if (!credentials) {
        return {
          sonucKodu: -1,
          sonucMesaji: 'UETDS kimlik bilgileri bulunamadı'
        };
      }

      const response = await uetdsService.seferIptal(
        credentials.kullaniciAdi,
        credentials.sifre,
        uetdsSeferReferansNo,
        iptalAciklama
      );

      if (response.sonucKodu === 0) {
        // Update local storage
        const updatedSeferler = seferler.map(sefer => 
          sefer.uetdsSeferReferansNo === uetdsSeferReferansNo
            ? { ...sefer, durum: 'iptal', iptalAciklama, updatedAt: new Date().toISOString() }
            : sefer
        );
        setSeferler(updatedSeferler);
        await StorageService.saveOfflineSeferler(updatedSeferler);
      }

      return response;
    } catch (error) {
      console.error('Sefer iptal hatası:', error);
      return {
        sonucKodu: -1,
        sonucMesaji: 'Sefer iptal hatası'
      };
    }
  };

  const yolcuEkle = async (
    uetdsSeferReferansNo: number, 
    yolcuBilgileri: UetdsYolcuBilgileri
  ): Promise<UetdsResponse> => {
    try {
      const credentials = await StorageService.getUetdsCredentials();
      if (!credentials) {
        return {
          sonucKodu: -1,
          sonucMesaji: 'UETDS kimlik bilgileri bulunamadı'
        };
      }

      const response = await uetdsService.yolcuEkle(
        credentials.kullaniciAdi,
        credentials.sifre,
        uetdsSeferReferansNo,
        yolcuBilgileri
      );

      if (response.sonucKodu === 0 && response.uetdsYolcuRefNo) {
        // Add to local storage
        const newYolcu: Yolcu = {
          id: response.uetdsYolcuRefNo.toString(),
          uetdsYolcuRefNo: response.uetdsYolcuRefNo,
          uetdsSeferReferansNo,
          ...yolcuBilgileri,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedYolcular = [...yolcular, newYolcu];
        setYolcular(updatedYolcular);
        await StorageService.saveOfflineYolcular(updatedYolcular);
      }

      return response;
    } catch (error) {
      console.error('Yolcu ekleme hatası:', error);
      return {
        sonucKodu: -1,
        sonucMesaji: 'Yolcu ekleme hatası'
      };
    }
  };

  const yolcuEkleCoklu = async (
    uetdsSeferReferansNo: number, 
    yolcuBilgileriListesi: UetdsYolcuBilgileri[]
  ): Promise<UetdsResponse> => {
    try {
      const credentials = await StorageService.getUetdsCredentials();
      if (!credentials) {
        return {
          sonucKodu: -1,
          sonucMesaji: 'UETDS kimlik bilgileri bulunamadı'
        };
      }

      const response = await uetdsService.yolcuEkleCoklu(
        credentials.kullaniciAdi,
        credentials.sifre,
        uetdsSeferReferansNo,
        yolcuBilgileriListesi
      );

      if (response.sonucKodu === 0) {
        // Add to local storage (mock implementation for multiple passengers)
        const newYolcular = yolcuBilgileriListesi.map((yolcu, index) => ({
          id: `${uetdsSeferReferansNo}_${Date.now()}_${index}`,
          uetdsSeferReferansNo,
          ...yolcu,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

        const updatedYolcular = [...yolcular, ...newYolcular];
        setYolcular(updatedYolcular);
        await StorageService.saveOfflineYolcular(updatedYolcular);
      }

      return response;
    } catch (error) {
      console.error('Çoklu yolcu ekleme hatası:', error);
      return {
        sonucKodu: -1,
        sonucMesaji: 'Çoklu yolcu ekleme hatası'
      };
    }
  };

  const personelEkle = async (
    uetdsSeferReferansNo: number, 
    personelBilgileri: UetdsPersonelBilgileri
  ): Promise<UetdsResponse> => {
    try {
      const credentials = await StorageService.getUetdsCredentials();
      if (!credentials) {
        return {
          sonucKodu: -1,
          sonucMesaji: 'UETDS kimlik bilgileri bulunamadı'
        };
      }

      const response = await uetdsService.personelEkle(
        credentials.kullaniciAdi,
        credentials.sifre,
        uetdsSeferReferansNo,
        personelBilgileri
      );

      if (response.sonucKodu === 0) {
        // Add to local storage
        const newPersonel: Personel = {
          id: `${uetdsSeferReferansNo}_${Date.now()}`,
          uetdsSeferReferansNo,
          ...personelBilgileri,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedPersoneller = [...personeller, newPersonel];
        setPersoneller(updatedPersoneller);
        await StorageService.saveOfflinePersoneller(updatedPersoneller);
      }

      return response;
    } catch (error) {
      console.error('Personel ekleme hatası:', error);
      return {
        sonucKodu: -1,
        sonucMesaji: 'Personel ekleme hatası'
      };
    }
  };

  const grupEkle = async (
    uetdsSeferReferansNo: number, 
    grupBilgileri: UetdsGrupBilgileri
  ): Promise<UetdsResponse> => {
    try {
      const credentials = await StorageService.getUetdsCredentials();
      if (!credentials) {
        return {
          sonucKodu: -1,
          sonucMesaji: 'UETDS kimlik bilgileri bulunamadı'
        };
      }

      const response = await uetdsService.seferGrupEkle(
        credentials.kullaniciAdi,
        credentials.sifre,
        uetdsSeferReferansNo,
        grupBilgileri
      );

      if (response.sonucKodu === 0 && response.uetdsGrupRefNo) {
        // Add to local storage
        const newGrup: Grup = {
          id: response.uetdsGrupRefNo.toString(),
          uetdsGrupRefNo: response.uetdsGrupRefNo,
          uetdsSeferReferansNo,
          ...grupBilgileri,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedGruplar = [...gruplar, newGrup];
        setGruplar(updatedGruplar);
        await StorageService.saveOfflineGruplar(updatedGruplar);
      }

      return response;
    } catch (error) {
      console.error('Grup ekleme hatası:', error);
      return {
        sonucKodu: -1,
        sonucMesaji: 'Grup ekleme hatası'
      };
    }
  };

  // Sync operations
  const syncWithServer = async (): Promise<void> => {
    try {
      setIsSyncing(true);
      
      // In a real app, this would sync all local changes with the server
      // For now, we'll just update the last sync time
      await StorageService.saveLastSyncTime(new Date().toISOString());
      await StorageService.saveSyncStatus({ lastSync: new Date().toISOString(), status: 'success' });
      
    } catch (error) {
      console.error('Sync error:', error);
      await StorageService.saveSyncStatus({ lastSync: new Date().toISOString(), status: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const testConnection = async (): Promise<boolean> => {
    try {
      const response = await uetdsService.servisTest('Connection Test');
      return response.sonucKodu === 0;
    } catch (error) {
      console.error('Connection test error:', error);
      return false;
    }
  };

  const value: UetdsContextType = {
    // Data
    seferler,
    yolcular,
    personeller,
    gruplar,
    araclar,
    
    // Loading states
    isLoading,
    isSyncing,
    
    // Actions
    loadSeferler,
    loadYolcular,
    loadPersoneller,
    loadGruplar,
    loadAraclar,
    
    // UETDS operations
    seferEkle,
    seferGuncelle,
    seferIptal,
    yolcuEkle,
    yolcuEkleCoklu,
    personelEkle,
    grupEkle,
    
    // Sync operations
    syncWithServer,
    testConnection,
  };

  return <UetdsContext.Provider value={value}>{children}</UetdsContext.Provider>;
};

export const useUetds = (): UetdsContextType => {
  const context = useContext(UetdsContext);
  if (context === undefined) {
    throw new Error('useUetds must be used within an UetdsProvider');
  }
  return context;
};