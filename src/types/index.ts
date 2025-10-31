// UETDS Types
export interface UetdsUser {
  kullaniciAdi: string;
  sifre: string;
}

export interface UetdsSeferBilgileri {
  aracPlaka: string;
  hareketTarihi: Date;
  hareketSaati: string;
  seferAciklama?: string;
  aracTelefonu?: string;
  firmaSeferNo?: string;
  seferBitisTarihi: Date;
  seferBitisSaati: string;
}

export interface UetdsYolcuBilgileri {
  grupId?: number;
  uyrukUlke: string;
  cinsiyet: 'E' | 'K';
  tcKimlikPasaportNo: string;
  adi: string;
  soyadi: string;
  koltukNo?: string;
  telefonNo?: string;
  hesKodu?: string;
}

export interface UetdsPersonelBilgileri {
  turKodu: number;
  uyrukUlke: string;
  tcKimlikPasaportno: string;
  cinsiyet: 'E' | 'K';
  adi: string;
  soyadi: string;
  telefon?: string;
  adres?: string;
  hesKodu?: string;
}

export interface UetdsGrupBilgileri {
  grupAdi: string;
  grupAciklama: string;
  baslangicUlke: string;
  baslangicIl?: number;
  baslangicIlce?: number;
  baslangicYer?: string;
  bitisUlke: string;
  bitisIl?: number;
  bitisIlce?: number;
  bitisYer?: string;
  grupUcret: string;
}

export interface UetdsResponse {
  sonucKodu: number;
  sonucMesaji: string;
  uetdsSeferReferansNo?: number;
  uetdsYolcuRefNo?: string;
  uetdsGrupRefNo?: string;
}

// App Types
export interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  displayName: string;
  domain?: string;
  isActive: boolean;
  settings?: TenantSettings;
}

export interface TenantSettings {
  uetdsKullaniciAdi?: string;
  uetdsSifre?: string;
  uetdsTestMode?: boolean;
  maxSeferSayisi?: number;
  maxYolcuSayisi?: number;
}

export interface Sefer {
  id: string;
  uetdsSeferReferansNo?: string;
  aracPlaka: string;
  hareketTarihi: Date;
  hareketSaati: string;
  seferAciklama?: string;
  aracTelefonu?: string;
  firmaSeferNo?: string;
  seferBitisTarihi: Date;
  seferBitisSaati: string;
  durum: SeferDurum;
  tenantId: string;
  yolcular?: Yolcu[];
  personeller?: Personel[];
  gruplar?: Grup[];
}

export interface Yolcu {
  id: string;
  uetdsYolcuRefNo?: string;
  uetdsBiletRefNo?: string;
  grupId?: string;
  uyrukUlke: string;
  cinsiyet: Cinsiyet;
  tcKimlikPasaportNo: string;
  adi: string;
  soyadi: string;
  koltukNo?: string;
  telefonNo?: string;
  hesKodu?: string;
  binisYerAciklama?: string;
  inisYerAciklama?: string;
  durum: YolcuDurum;
  seferId: string;
  tenantId: string;
}

export interface Personel {
  id: string;
  uetdsPersonelId?: string;
  turKodu: PersonelTur;
  uyrukUlke: string;
  tcKimlikPasaportno: string;
  cinsiyet: Cinsiyet;
  adi: string;
  soyadi: string;
  telefon?: string;
  adres?: string;
  hesKodu?: string;
  durum: PersonelDurum;
  seferId: string;
  tenantId: string;
}

export interface Grup {
  id: string;
  uetdsGrupRefNo?: string;
  grupAdi: string;
  grupAciklama: string;
  baslangicUlke: string;
  baslangicIl?: string;
  baslangicIlce?: string;
  baslangicYer?: string;
  bitisUlke: string;
  bitisIl?: string;
  bitisIlce?: string;
  bitisYer?: string;
  grupUcret?: string;
  durum: GrupDurum;
  seferId: string;
  tenantId: string;
}

export interface Arac {
  id: string;
  plaka: string;
  marka?: string;
  model?: string;
  yil?: number;
  kapasite?: number;
  isActive: boolean;
  tenantId: string;
}

// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER'
}

export enum SeferDurum {
  AKTIF = 'AKTIF',
  IPTAL = 'IPTAL',
  TAMAMLANDI = 'TAMAMLANDI'
}

export enum PersonelTur {
  SOFOR = 0,
  SOFOR_YARDIMCISI = 1,
  HOST = 2,
  HOSTES = 3,
  DIGER = 4,
  REHBER = 5
}

export enum PersonelDurum {
  AKTIF = 'AKTIF',
  IPTAL = 'IPTAL'
}

export enum YolcuDurum {
  AKTIF = 'AKTIF',
  IPTAL = 'IPTAL',
  GELMEDI = 'GELMEDI'
}

export enum GrupDurum {
  AKTIF = 'AKTIF',
  IPTAL = 'IPTAL'
}

export enum Cinsiyet {
  ERKEK = 'E',
  KADIN = 'K'
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  phone?: string;
  tenantName: string;
  tenantDisplayName: string;
  role: UserRole;
}

export interface SeferFormData extends UetdsSeferBilgileri {
  id?: string;
  durum?: SeferDurum;
}

export interface YolcuFormData extends UetdsYolcuBilgileri {
  id?: string;
  durum?: YolcuDurum;
  binisYerAciklama?: string;
  inisYerAciklama?: string;
}

export interface PersonelFormData extends UetdsPersonelBilgileri {
  id?: string;
  durum?: PersonelDurum;
}

export interface GrupFormData extends UetdsGrupBilgileri {
  id?: string;
  durum?: GrupDurum;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  Seferler: undefined;
  SeferDetay: { seferId: string };
  Yolcular: undefined;
  YolcuDetay: { yolcuId: string };
  Personeller: undefined;
  PersonelDetay: { personelId: string };
  Gruplar: undefined;
  GrupDetay: { grupId: string };
  Araclar: undefined;
  Ayarlar: undefined;
  Profil: undefined;
};